import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import './styles.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Load auth from localStorage
const authStore = useAuthStore(pinia)
authStore.loadFromStorage()

app.mount('#app')
