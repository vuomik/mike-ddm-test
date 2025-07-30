import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@server': path.resolve(__dirname, 'server'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Allowing this */
    ssr: ssrBuild,
    rollupOptions: {
      /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- Allowing this */
      input: ssrBuild
        ? 'server/server.ts'
        : path.resolve(__dirname, 'index.html'),
      external: ['fs', 'path'],
    },
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- Allowing this */
    outDir: ssrBuild ? 'dist/server' : 'dist/client',
  },
}))
