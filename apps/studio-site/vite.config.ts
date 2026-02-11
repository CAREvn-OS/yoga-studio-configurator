import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/yoga-studio-configurator/',
  resolve: {
    alias: {
      '@care/configurator': path.resolve(__dirname, '../../packages/configurator/src'),
      '@care/theme-engine': path.resolve(__dirname, '../../packages/theme-engine/src'),
      '@care/copy-content': path.resolve(__dirname, '../../packages/copy-content/src'),
      '@care/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    }
  },
  build: {
    outDir: 'dist',
  }
})
