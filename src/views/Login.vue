
<template>
  <main class="flex h-[100dvh] flex-col justify-end pb-4">
    <transition>
    <LoaderWrapper :isLoading="isLoading" :label="$t('loading')">
    <div class="h-full grid items-center align-center justify-center">
      <img src="/logo.png" alt="logo" class="w-32 block self-center" />
    </div>
    <h1 class="text-2xl text-center mb-8">{{$t('signUp')}}</h1>

    <form @submit.prevent="login" class="flex flex-col gap-4 px-8 mb-12">
      <Input
        :placeholder="$t('email')"
        v-model="email"
        @update:modelValue="email = $event"
      />
      <Input
        :placeholder="$t('password')"
        type="password"
        v-model="password"
        @update:modelValue="password = $event"
        @keydown.enter="login"
      />
      <button type="submit">
      <Button class="w-full" label="Вход"></Button>
    </button>
    </form>

    <span class="text-center opacity-25">0.2.0</span>
  </LoaderWrapper>
</transition>
  </main>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import Button from '../components/Items/Button.vue';
import Input from '../components/Items/Input.vue';
import LoaderWrapper from '@/components/Items/LoaderWrapper.vue';

const router = useRouter();
const store = useUserStore();
const email = ref('');
const password = ref('');
const apiUrl = import.meta.env.VITE_API_URL;
const hash = ref('');
const isLoading = ref(false);

function login() {
  isLoading.value = true;
  const token = Cookies.get('token');
  if (token) {
    router.push({ name: 'user', params: { hash: store.settings.hash } });
    return;
  }

  axios
    .post(apiUrl + '/login', {
      email: email.value,
      password: password.value,
    })
    .then(function (response) {
      store.user_id = response.data.user_id;
      store.settings = response.data.settings;
      store.isLoggedIn = true;
      Cookies.set('token', response.data.token, { secure: false, path: '/', expires: 7 }); // expires in 7 days
      router.push({ name: 'user', params: { hash: response.data.hash } });
    })
    .catch(function (error) {
      console.log(error);
      isLoading.value = false;
    });
}

onMounted(() => {
  const token = Cookies.get('token');
  if (token) {
    getHash();
  }
});

async function getHash() {
  const token = Cookies.get('token');
  if (token) {
    axios
      .get(apiUrl + '/get-hash', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then(function (response) {
        hash.value = response.data.hash;
        let params = { hash: hash.value };
        store.settings = response.data.settings;
        router.push({ name: 'user', params: params });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>
