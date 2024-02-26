import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import './assets/style.css'

const pinia = createPinia()

const app = createApp(App).use(router).use(pinia)

app.mount('#app')
