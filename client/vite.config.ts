import path from 'path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      include: [/shared/, /node_modules/],
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-emoji': ['emoji-picker-react'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
