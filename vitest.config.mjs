import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // 'istanbul'
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage'
    }
  },
  css: {
    modules: {
      classNameStrategy: 'non-scoped'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.MODE': JSON.stringify('development'),
  },
})