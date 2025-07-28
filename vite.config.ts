import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@server': path.resolve(__dirname, 'server'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    ssr: ssrBuild,
    rollupOptions: {
      input: ssrBuild ? 'server/server.ts' : path.resolve(__dirname, 'index.html'),
      external: ['fs', 'path'] 
    },
    outDir: ssrBuild ? 'dist/server' : 'dist/client',
  }
}));