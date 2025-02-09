<script setup>
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useUserStore();
const email = ref('');
const password = ref('');
const apiUrl = import.meta.env.VITE_API_URL

function login() {
  axios.post(apiUrl + '/login', {
    email: email.value,
    password: password.value
  })
  .then(function (response) {
    store.user_id = response.data.user_id;
    Cookies.set('token', response.data.token, { secure: true, path: '/' });
    router.push({ name: 'user', params: { hash: response.data.hash } })
  })
  .catch(function (error) {
    console.log(error);
  });
}


console.log(store)
</script>

<template>
  <main class="flex flex-col justify-between h-screen">

    <h1 class="text-3xl w-screen text-center mt-12">Tracker</h1>

    <form @submit.prevent="login" class="outline flex flex-col p-4">
      <input placeholder="Почтовый адрес" type="text" class="placeholder-gray-200 mb-6 ring-2 ring-sky-500 border-none outline-none p-4 text-2xl rounded-xl" v-model="email" name="email" required>

      <input placeholder="Пароль" type="password" class="placeholder-gray-200 mb-6 ring-2 ring-sky-500 border-none outline-none p-4 text-2xl rounded-xl" v-model="password" name="password" required>

      <button class="border-none outline-none p-4 text-2xl rounded-xl bg-sky-500 text-white mb-12">Вход</button>
    </form>
  </main>
</template>
