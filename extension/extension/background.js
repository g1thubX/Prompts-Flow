// PromptFlow Service Worker
// The nervous system in the background.

const DB_NAME = 'PromptArchitectDB';
const DB_VERSION = 1;
const STORE_NAME = 'prompts';

// --- Native IndexedDB Helper for Service Worker ---
// Replicating the logic from services/db.ts to ensure the background process
// can function as a standalone organism without React dependencies.

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
};

const saveToDB = async (text) => {
  try {
    const db = await openDB();
    const title = text.length > 30 ? text.substring(0, 30) + "..." : text;
    
    const newPrompt = {
      id: crypto.randomUUID(),
      title: `Clipped: ${title}`,
      content: text,
      tags: ['clipped'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usageCount: 0,
      isFavorite: false,
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(newPrompt);
      request.onsuccess = () => resolve(newPrompt);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('PromptFlow Background Error:', err);
    throw err;
  }
};

// --- Event Listeners ---

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pf-save-selection",
    title: "Save to PromptFlow",
    contexts: ["selection"]
  });
  console.log('PromptFlow Organism Awakened.');
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "pf-save-selection" && info.selectionText) {
    try {
      await saveToDB(info.selectionText);
      
      // Optional: Send a notification if permission exists, 
      // or just log it. "Quiet" design philosophy prefers not to spam notifications
      // unless strictly necessary.
      console.log('Saved to memory:', info.selectionText);
      
    } catch (e) {
      console.error('Failed to save memory:', e);
    }
  }
});