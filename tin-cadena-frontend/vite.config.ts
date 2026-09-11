import {
  fileURLToPath,
  URL,
} from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
    ],
    base: env.VITE_BASE_PATH || '/',
  resolve: {
    alias: {
      '@': fileURLToPath(
        new URL('./src', import.meta.url),
      ),

      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),

      '@pages': fileURLToPath(
        new URL('./src/pages', import.meta.url),
      ),

      '@services': fileURLToPath(
        new URL('./src/services', import.meta.url),
      ),

      '@store': fileURLToPath(
        new URL('./src/store', import.meta.url),
      ),

      '@hooks': fileURLToPath(
        new URL('./src/hooks', import.meta.url),
      ),

      '@types': fileURLToPath(
        new URL('./src/types', import.meta.url),
      ),

      '@utils': fileURLToPath(
        new URL('./src/utils', import.meta.url),
      ),
    },
  },

  define: {
    global: 'globalThis',
  },
  
  server: {
    port: 5173,
  },
}
})