import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Optimized for battery life - cache everything locally
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Skip waiting for faster updates
        skipWaiting: true,
        clientsClaim: true
      },
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Rastbanken - Skolrastgårdens Redskapsbank',
        short_name: 'Rastbanken',
        description: 'En app för att låna och återlämna rastgårdsredskap på skolan',
        theme_color: '#0066CC',
        background_color: '#f0f9ff',
        display: 'standalone',
        orientation: 'landscape-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        // Battery optimization settings
        prefer_related_applications: false,
        categories: ['education', 'utilities']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    host: true
  }
})