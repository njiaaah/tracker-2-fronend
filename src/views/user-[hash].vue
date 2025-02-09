<template>
  <div class="about">
    <h1>Hello World! {{ $route.params.hash }}</h1>

    <Calendar />

    <div class="grid grid-cols-2 gap-4 p-4">
      <DashboardTile icon="Weight" heading="Weight" :color="'bg-green-500'" />
      <DashboardTile icon="flag-checkered" heading="Goal" :color="'bg-violet-300'" />
      <DashboardTile icon="food" heading="Food" :span="2" :color="'bg-yellow-500'" />
    </div>

    
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import DashboardTile from '../components/DashboardTile.vue';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('token');

const store = useUserStore();
const { user_id } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL
const token = Cookies.get('token');

console.log('id', user_id.value);

function getUser() {
  axios.get(apiUrl + '/food_logs/', {
    params: {
      user_id: user_id.value
    }
  })
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}

onMounted(() => {
  getUser();
});

</script>

<style>

</style>
