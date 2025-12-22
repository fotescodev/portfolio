import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['scripts/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'scripts/**/*.test.ts']
    },
    testTimeout: 30000,  // CLI tests may take longer
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
