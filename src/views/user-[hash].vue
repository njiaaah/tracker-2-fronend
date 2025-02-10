<template>
  <div class="about">
    <h1>Hello World! {{ $route.params.hash }}</h1>

    <Calendar />

    <div class="grid grid-cols-2 gap-4 p-4">
      <DashboardTile
      v-for="(tile, index) in tiles"
      :key="tile.isHidden + tile.isSelected + index"
      :icon="tile.icon"
      :heading="tile.heading"
      :color="tile.color"
      :span="tile.span"
      :is-selected="tile.isSelected"
      @click="openTile(tile)"
      @close="closeTile"
    />
z    
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import DashboardTile from '../components/DashboardTile.vue';
import Calendar from '../components/Calendar.vue';

axios.defaults.headers.common['Authorization'] =
  'Bearer ' + Cookies.get('token');

const tiles = ref([
  {
    icon: 'Weight',
    heading: 'Weight',
    color: 'bg-green-500',
    isHidden: false,
    isSelected: false,
  },
  {
    icon: 'flag-checkered',
    heading: 'Goal',
    color: 'bg-violet-300',
    isHidden: false,
    isSelected: false,
  },
  {
    icon: 'food',
    heading: 'Food',
    color: 'bg-yellow-500',
    span: 2,
    isHidden: false,
    isSelected: false,
  },
]);

const store = useUserStore();
const { user_id } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL;
const token = Cookies.get('token');

console.log('id', user_id.value);

function getUser() {
  axios
    .get(apiUrl + '/food_logs/', {
      params: {
        user_id: user_id.value,
      },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function openTile(visibleTile) {
  // Just hide all tiles first
  tiles.value.forEach(tile => tile.isHidden = true);
  visibleTile.isHidden = false; // Only show the selected tile
  visibleTile.isSelected = true;
  console.log("Tiles after openTile", tiles.value);
}

function closeTile() {
  // Reset the visibility and selection for all tiles
  tiles.value.forEach(tile => {
    tile.isHidden = false;
    tile.isSelected = false;
  });
  console.log("Tiles after closeTile", tiles.value);
}


onMounted(() => {
  getUser();
});
</script>

<style></style>
