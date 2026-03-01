import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 引入Mock数据（开发环境）
async function initApp() {
  if (import.meta.env.DEV) {
    await import('./mocks')
  }
  
  const app = createApp(App)
  
  app.use(createPinia())
  app.use(router)
  app.use(ElementPlus)
  
  app.mount('#app')
}

initApp()
