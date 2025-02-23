<script setup>
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import Button from '../components/Items/Button.vue';
import Input from '../components/Items/Input.vue';

const router = useRouter();
const store = useUserStore();
const email = ref('');
const password = ref('');
const apiUrl = import.meta.env.VITE_API_URL;
const hash = ref('');

function login() {
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

<template>
  <main class="flex h-[100dvh] flex-col justify-end pb-4">
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
      <Button type="submit" label="Вход"></Button>
    </form>
  </main>
</template>
