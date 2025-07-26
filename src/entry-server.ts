import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
//import fs from 'fs';
//import path from 'path';
//import type { ViteDevServer } from 'vite';

/*
export async function render(url: string, vite?: ViteDevServer) {
  const app = createApp();
  const appContent = await renderToString(app);
  let template: string;
  if (vite) {
    console.log('using vite');
    template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
    template = await vite.transformIndexHtml(url, template);
  } else {
    console.log('not using vite');
    template = fs.readFileSync(path.resolve('../client/index.html'), 'utf-8');
  }
  const html = template.replace(`<!--app-html-->`, appContent);
  return html;
}
  */

export async function render(): Promise<string> {
  const app = createApp();
  const appContent = await renderToString(app);
  return appContent;
}