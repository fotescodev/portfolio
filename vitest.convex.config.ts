import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'edge-runtime', // convex-test needs edge-runtime environment
        include: ['convex/**/*.{test,spec}.ts'],
        server: { deps: { inline: ['convex-test'] } },
    },
});
