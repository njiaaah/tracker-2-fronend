<template>
  <div class="flex flex-col h-full">
    <!-- <div v-for="(key, index) in Object.keys(localSettings)">
      <div>{{ key }}</div>
      <Input v-model="localSettings[key]" />
    </div> -->

    <div class="mt-12 text-center text-xl underline text-red-500 mb-4" @click="logout">{{ $t('logout') }}</div>
  </div>
</template>

<script>
import jsCookie from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user';
import Input from '../Items/Input.vue';
import { useRouter } from 'vue-router';
import router from '../../router';

export default {
  name: 'Settings',
  components: { Input },
  data: () => ({
    store: useUserStore(),
    localSettings: [],
  }),
  methods: {
    logout() {
      this.store.user_id = null;
      this.store.settings = null;
      this.store.isLoggedIn = false;
      jsCookie.remove('token');
      router.push({ name: 'login' });
    },
  },
  mounted() {
    console.log('settings mounted');
    console.log(this.store.settings);
    this.localSettings = this.store.settings;
  },
};
</script>
