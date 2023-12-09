import {createApp} from 'vue'
import TDesign from 'tdesign-vue-next';
import './style.css'
import App from './App.vue'
import {createPinia} from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import {router} from "@/router/index";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(TDesign)
app.mount('#app')
