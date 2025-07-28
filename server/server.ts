import 'reflect-metadata';
import './di';

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

process.on('uncaughtException', (err, origin) => {
  console.error('Unhandled Exception:', err);
  console.error('Exception Origin:', origin);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function createServer() {
  const app = express();

  let render: () => Promise<string>;
  let template: string;
  let manifest: Record<string, any>;

  app.use(express.json())

  app.use('/api', routes);

  app.use(errorHandler);

  if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const root = path.resolve(__dirname, '..');

    template = fs.readFileSync(path.resolve(root, 'client/index.html'), 'utf-8');
    manifest = JSON.parse(fs.readFileSync(path.resolve(root, 'client/.vite/ssr-manifest.json'), 'utf-8'));
    render = (await import(path.resolve(root, 'ssr/entry-server.js'))).render;

    app.get('*', async (req, res) => {
      try {
        const html = await render();
        const finalHtml = template.replace(`<!--app-html-->`, html);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        console.error(e);
        res.status(500).end('Internal Server Error');
      }
    });

  } else {
    const { createServer: createViteServer } = await import('vite'); 
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res) => {
      try {
        const url = req.originalUrl;
        const template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        const transformedTemplate = await vite.transformIndexHtml(url, template);
        const { render } = await vite.ssrLoadModule('/src/entry-server.ts');
        const html = await render();
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedTemplate.replace(`<!--app-html-->`, html));
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        console.error(e);
        res.status(500).end('Internal Server Error');
      }
    });
  }

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Vue app running at http://localhost:${port}`);
  });
}

createServer();