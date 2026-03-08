import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    benchmark: {
      include: ['__test__/**/*.bench.ts'],
    },
  },
});
