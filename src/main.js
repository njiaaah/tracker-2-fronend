import './styles.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import autoAnimate from '@formkit/auto-animate';



createPinia().use(piniaPluginPersistedState);

import App from './App.vue';
import router from './router';

import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';

const app = createApp(App);

app.directive('auto-animate', {
  mounted(el) {
    el && autoAnimate(el);
  },
});

app.use(createPinia().use(piniaPluginPersistedState));
app.use(router);
app.use(mdiVue, {
  icons: mdijs,
});
app.mount('#app');
