import { Prompt, PromptFormData } from '../types';

const DB_NAME = 'PromptArchitectDB';
const DB_VERSION = 1;
const STORE_NAME = 'prompts';

// Low-level Promise wrapper for IndexedDB to avoid external dependencies
// adhering to the "Simplicity as Law" principle.

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
  });
};

export const promptService = {
  async getAll(): Promise<Prompt[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      // We use updatedAt index to show most recent first
      const request = store.index('updatedAt').getAll();

      request.onsuccess = () => {
        // Reverse to show newest first
        resolve((request.result as Prompt[]).reverse());
      };
      request.onerror = () => reject(request.error);
    });
  },

  async add(data: PromptFormData): Promise<Prompt> {
    const db = await openDB();
    const newPrompt: Prompt = {
      ...data,
      id: crypto.randomUUID(),
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
  },

  async update(prompt: Prompt): Promise<Prompt> {
    const db = await openDB();
    const updatedPrompt = { ...prompt, updatedAt: Date.now() };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updatedPrompt);

      request.onsuccess = () => resolve(updatedPrompt);
      request.onerror = () => reject(request.error);
    });
  },

  async delete(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  async incrementUsage(prompt: Prompt): Promise<Prompt> {
      const db = await openDB();
      const updatedPrompt = { ...prompt, usageCount: (prompt.usageCount || 0) + 1 };
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(updatedPrompt);
  
        request.onsuccess = () => resolve(updatedPrompt);
        request.onerror = () => reject(request.error);
      });
  }
};
