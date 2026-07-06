// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // project root directory
  publicDir: 'public', // directory for static assets
  build: {
    outDir: 'dist', // output directory for build
    assetsDir: 'assets', // directory for assets in build
  },
  server: {
    port: 3000, // development server port
    open: true, // automatically open browser
  },
});