import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'https://darkvoicegit.github.io/gaugeChart/', // Updated to match the repository name for GitLab/GitHub Pages
})
