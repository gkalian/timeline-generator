import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './tests/setup/test-setup.js'
    ],
    coverage: {
      provider: 'v8', // 'istanbul'
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'tests/**',
        '**/*.test.js',
        '**/*.spec.js',
        
        '**/*.config.js',
        '**/*.config.mjs',
        '**/*.config.ts',
        'vitest.config.mjs',
        'vite.config.mjs',
        'eslint.config.mjs',
        
        '**/*.d.ts',
        'components.d.ts',
        
        'dist/**',
        'timeline-generator/dist/**',
        '**/assets/**',
        
        'node_modules/**',
        
        'public/**',
        '.github/**',
        '*.md'
      ]
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
      '@tests': resolve(__dirname, './tests')
    },
  },
  define: {
    'import.meta.env.MODE': JSON.stringify('development'),
  },
})
