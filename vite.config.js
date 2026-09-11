import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import { resolve } from 'node:path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    electron({
      entry: ['electron/main.js', 'electron/preload.js'],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        pet: resolve(__dirname, 'src/pet.html'),
        home: resolve(__dirname, 'src/home.html'),
      },
    },
  },
})
