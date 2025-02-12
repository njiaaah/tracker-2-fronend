import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import autoAnimate from '@formkit/auto-animate';

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

createPinia().use(piniaPluginPersistedState)

import App from './App.vue'
import router from './router'

import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'

const app = createApp(App)

app.directive('auto-animate', {
    mounted(el) {
      el && autoAnimate(el);
    }
  });
  
  app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })

app.use(createPinia().use(piniaPluginPersistedState))
app.use(router)
app.use(mdiVue, {
    icons: mdijs
})
app.mount('#app')
