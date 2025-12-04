import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname, join } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Robust recursive copy helper that handles directories correctly
const copyRecursiveSync = (src: string, dest: string) => {
  if (!fs.existsSync(src)) return;

  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    // Ensure destination parent directory exists
    const destDir = dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
};

// Custom plugin to treat the 'extension' folder as the blueprint
// and copy its soul (manifest, background) to the body (dist).
const copyExtensionFiles = () => {
  return {
    name: 'copy-extension-files',
    closeBundle: async () => {
      const dist = resolve(__dirname, 'dist');
      const ext = resolve(__dirname, 'extension');
      const rootIcons = resolve(__dirname, 'icons');
      
      if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist);
      }

      // 1. Copy Manifest and Background from extension folder
      if (fs.existsSync(ext)) {
        console.log('📦 Grafting extension assets...');
        fs.readdirSync(ext).forEach(file => {
            // Skip icons folder in extension if it exists to avoid double copy issues,
            // or handle it recursively. Our helper handles it, but let's be safe.
            copyRecursiveSync(resolve(ext, file), resolve(dist, file));
        });
      }

      // 2. Explicitly copy Icons from root 'icons' folder to 'dist/icons'
      // This fixes the missing icons issue and ensures strict copying.
      if (fs.existsSync(rootIcons)) {
          const distIcons = resolve(dist, 'icons');
          copyRecursiveSync(rootIcons, distIcons);
          console.log('✅ Icons transferred.');
      }

      console.log('\n\x1b[32m%s\x1b[0m', '---------------------------------------------------');
      console.log('\x1b[32m%s\x1b[0m', '⚡ BUILD COMPLETE. ORGANISM READY.');
      console.log('\x1b[36m%s\x1b[0m', '👉 Load the "dist" folder in chrome://extensions');
      console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------\n');
    }
  }
};

export default defineConfig({
  plugins: [react(), copyExtensionFiles()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});