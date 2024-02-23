import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createThemeManager } from './plugins/themeManager'
import './assets/main.css'
import './assets/style.css'

const pinia = createPinia()

const app = createApp(App)
  .use(router)
  .use(pinia)
  .use(createThemeManager({ light: 'breeze', dark: 'storm', watchSystemTheme: true }))

app.mount('#app')
