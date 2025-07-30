import { createSSRApp } from 'vue'
import App from './App.vue'
import type { App as VueApp } from 'vue'

export function createApp(): VueApp<Element> {
  const app = createSSRApp(App)
  return app
}
