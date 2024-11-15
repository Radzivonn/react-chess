import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
