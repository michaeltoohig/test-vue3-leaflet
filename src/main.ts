import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/main.css'
import './assets/style.css'

const pinia = createPinia()

const app = createApp(App).use(router).use(pinia)

app.mount('#app')

const project_name = ref(import.meta.env.VITE_PROJECT_NAME)
console.log(`${project_name.value}`)
console.log(
  `An internal tool developed by Michael Toohig\nFind more of my work at https://michaeltoohig.com`
)
