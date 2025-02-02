import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/react-chess/',
  build: {
    outDir: 'dist',
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  resolve: {
    alias: {
      API: '/src/API',
      assets: '/src/assets',
      components: '/src/components',
      hocs: '/src/hocs',
      hooks: '/src/hooks',
      modules: '/src/modules',
      models: '/src/models',
      pages: '/src/pages',
      router: '/src/router',
      store: '/src/store',
      helpers: '/src/helpers',
      styles: '/src/styles',
      types: '/src/types',
      validations: '/src/validations',
      mocks: '/src/mocks',
      tests: '/src/tests',
    },
  },
});
