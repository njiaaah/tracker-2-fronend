import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

createPinia().use(piniaPluginPersistedState)

import App from './App.vue'
import router from './router'

import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'

const app = createApp(App)


app.use(createPinia().use(piniaPluginPersistedState))
app.use(router)
app.use(mdiVue, {
    icons: mdijs
})
app.mount('#app')
