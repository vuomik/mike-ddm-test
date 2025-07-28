import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export async function render(): Promise<string> {
  const app = createApp()
  const appContent = await renderToString(app)
  return appContent
}
