import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  // relative paths, so the site works on GitHub Pages in any folder
  base: './',
})