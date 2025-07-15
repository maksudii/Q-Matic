import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa' // <-- 1. PWA EKLENTİSİNİ İÇERİ AKTAR

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({ // <-- 2. PWA EKLENTİSİNİ BURAYA EKLE VE YAPILANDIR
      registerType: 'autoUpdate', // Yeni sürüm çıktığında otomatik günceller
      manifest: {
        name: 'Q-Matic: Akıllı Sıramatik',
        short_name: 'Q-Matic',
        description: 'Modern, QR kod tabanlı sıramatik uygulaması.',
        theme_color: '#ffffff', // Uygulama çerçevesinin rengi (mobil)
        background_color: '#f0f2f5', // Uygulama açılırken görünen arkaplan rengi
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // "Maskable" ikonlar Android'de daha iyi görünür
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})