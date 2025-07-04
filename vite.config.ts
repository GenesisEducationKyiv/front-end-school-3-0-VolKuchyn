import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    port: 3000,
  },
  test: {
    exclude: ['tests/playwright/**', 'node_modules/**'],
  },
  build: {
    rollupOptions: {
      treeshake: true,
    },
    minify: 'esbuild',
    sourcemap: true,
  },
});