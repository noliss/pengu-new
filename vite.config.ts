import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert() // Включает HTTPS и SSL сертификаты
  ],
  server: {
    port: 5173,
    host: true // Позволяет доступ с других устройств в сети
  },
  base: './', // Важно для Mini Apps
  build: {
    outDir: 'dist',
    sourcemap: true // Полезно для отладки
  }
})