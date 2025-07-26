import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [vue()],
  build: {
    ssr: ssrBuild,
    //emptyOutDir: !ssrBuild, // Only clean dist/ when doing client build
    //manifest: !ssrBuild,    // Only needed for client build
    rollupOptions: {
      input: ssrBuild ? 'server/server.ts' : path.resolve(__dirname, 'index.html'),
      external: ['fs', 'path'] 
    },
    outDir: ssrBuild ? 'dist/server' : 'dist/client',
  }
}));