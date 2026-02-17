// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9069', // <-- CHANGE to your backend base URL
        changeOrigin: true,
        secure: false,
        // Do NOT rewrite /api because your backend paths already include it
      },
    },
  },
})
