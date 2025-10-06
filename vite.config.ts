import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/rastbanken/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Optimized for battery life - cache everything locally
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        // Skip waiting for faster updates
        skipWaiting: true,
        clientsClaim: true,
        // Force cache refresh for icon change
        cleanupOutdatedCaches: true
      },
      includeAssets: ['icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'Rastbanken - Skolrastgårdens Redskapsbank',
        short_name: 'Rastbanken',
        description: 'En app för att låna och återlämna rastgårdsredskap på skolan',
        theme_color: '#22c55e',
        background_color: '#f0f9ff',
        display: 'standalone',
        orientation: 'landscape-primary',
        start_url: process.env.NODE_ENV === 'production' ? '/rastbanken/' : '/',
        scope: process.env.NODE_ENV === 'production' ? '/rastbanken/' : '/',
        icons: [
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'maskable'
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
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/constants': path.resolve(__dirname, './src/constants')
    }
  },
  server: {
    port: 3000,
    host: true
  }
})