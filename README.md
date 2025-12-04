# PromptFlow

<div align="center">

**[ English ]** | [ 中文 ](README_CN.md)

</div>

> "The best tool is an invisible tool. It should feel less like software and more like an extension of your thought process."

**PromptFlow** is a living, local-first **Digital Organism** designed to inhabit your browser. It serves as a neural extension for your AI workflow, allowing you to store, organize, and dynamically inject variables into your prompts with zero latency.

It rejects the clutter of modern SaaS dashboards. It embraces the silence of functionalism. It lives entirely on your machine, respecting your privacy and your keystrokes.

---

## 🧬 Genetic Code (Design Philosophy)

This organism was bred with specific traits to ensure survival in a high-velocity workflow:

### 1. Obsidian Aesthetics (黑曜石美学)
I possess a semi-transparent, glassmorphic skin (`backdrop-blur-2xl`). I float above your content, dark and elegant, blending into your workspace while maintaining perfect contrast.

### 2. Speed is Survival (唯快不破)
Mouse movements are slow; thoughts are fast. I am designed to be operated entirely via keyboard.
- `↑` `↓` to navigate my memory.
- `Enter` to inject thoughts.
- `Tab` to fill variables.

### 3. Hiding the Difficulty (举重若轻)
Complex prompts often require variable inputs (e.g., *Write a {{tone}} email to {{name}}*). I do not burden you with ugly forms. I transform seamlessly into a "Combination Lock" interface, allowing you to click variables into place with satisfying precision.

### 4. Local Symbiosis (本地共生)
I do not phone home. I rely on **IndexedDB**—your browser's native, high-performance memory. Your prompts are your neurons; they never leave your device.

### 5. Universal Tongue (双语共鸣)
I speak your language. With a single click (or keypress), I toggle instantly between **English** and **Chinese**, adapting my interface to your cognitive mode.

---

## 🫀 Anatomy (Tech Stack)

My body is built from robust, timeless materials:

- **Core:** React 18 (The nervous system)
- **Skin:** Tailwind CSS (Obsidian/Carbon palette with Glassmorphism)
- **Memory:** IndexedDB (Persistent storage, zero dependencies)
- **Typography:** Outfit (UI) & JetBrains Mono (Code)

---

## 🌿 How to Cultivate (Usage)

1. **Summoning**: Open the app or extension.
2. **Tabula Rasa**: If I am empty, type `New` and hit `Enter` (or click the `+ New` button) to create a new prompt memory.
3. **Variable Injection**: Use `{{variable_name}}` syntax in your prompts. When you select them later, I will ask you to fill the blanks.
4. **Search**: Just type. I filter thoughts instantly.
5. **Language**: Toggle EN/CN in the footer to switch interface languages.

---

## 🏗️ Development Architecture

This repository houses two lifeforms: the Web Application and the Chrome Extension.

### 1. Web Application (Simulator)
Located in the root. This is for development and testing the UI in a standard browser environment.

```bash
# Install dependencies
npm install

# Run the organism in a petri dish (localhost)
npm run dev
```

### 2. Chrome Extension (Symbiote)
Located in the `extension/` directory. This is the actual plugin that lives in your browser.

```bash
# Enter the extension chamber
cd extension

# Install dependencies
npm install

# Build the organism for deployment
npm run build
```

**To Load in Chrome:**
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/dist` folder (generated after `npm run build`).

---

## 🌱 Provide Nutrients (Contributing)

I am a young organism. I need nutrients to evolve.

I am looking for **Gardeners (Contributors)** who understand that **less is more**.
- Do not add features for the sake of features.
- Do not break the symmetry.
- Do not violate the privacy.

**Evolutionary Roadmap:**
- [x] **Glassmorphism**: Enhanced visual depth.
- [x] **Bilingual Core**: Native English/Chinese support.
- [ ] **Smart Context**: Detect if I am on LinkedIn/Twitter and suggest relevant prompts.
- [ ] **Sync Glands**: Optional, encrypted export/import for cross-device pollination.

---

## 📜 License

Distributed under the MIT License. I am free to live in anyone's machine.


## 🌟 Growth History

Every star is a photon of energy that helps me grow.

[![Star History Chart](https://api.star-history.com/svg?repos=YourUsername/PromptFlow&type=Date)](https://star-history.com/#YourUsername/PromptFlow&Date)
