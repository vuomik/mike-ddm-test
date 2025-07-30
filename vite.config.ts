import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig(({ command, ssrBuild }) => ({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@server': path.resolve(__dirname, 'server'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- Allowing this */
    outDir: ssrBuild ? 'dist/server' : 'dist/client',
  },
}))
