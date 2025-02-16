<script setup>
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

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
      Cookies.set('token', response.data.token, { secure: true, path: '/' });
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
    <form @submit.prevent="login" class="flex flex-col gap-4 p-4">
      <input
        placeholder="Почтовый адрес"
        type="text"
        class="mb-6 rounded-xl border-none p-4 text-2xl placeholder-gray-200 ring-2 ring-sky-500 outline-none"
        v-model="email"
        name="email"
        required
      />

      <input
        placeholder="Пароль"
        type="password"
        class="mb-6 rounded-xl border-none p-4 text-2xl placeholder-gray-200 ring-2 ring-sky-500 outline-none"
        v-model="password"
        name="password"
        required
      />

      <button
        type="submit"
        class="rounded-2xl bg-sky-500 p-4 text-2xl text-white"
      >
        Вход
      </button>
    </form>
  </main>
</template>
