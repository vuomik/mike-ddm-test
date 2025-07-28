import { createSSRApp } from 'vue'
import App from './App.vue'
import type { App as VueApp } from 'vue'
import createRouter from './router'

export function createApp(): VueApp<Element> {
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return app
}
