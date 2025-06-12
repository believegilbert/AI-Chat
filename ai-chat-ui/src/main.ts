import { createApp } from 'vue'
import { router } from './router'
import {createPinia} from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia() 
// Use pinia plugin for persisted state
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.use(router)
app.mount('#app')
