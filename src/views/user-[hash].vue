<template>
  <div class="about">
    <h1>Hello World! {{ $route.params.hash }}</h1>

    <Calendar />

    <div class="grid grid-cols-2 gap-4 p-4" ref="myWrapper">
      <DashboardTile
      v-for="(tile, index) in tiles"
      :key="'tike-'+index"
      :icon="tile.icon"
      :heading="tile.heading"
      :color="tile.color"
      :span="tile.span"
      :is-selected="tile.isSelected"
      :is-hidden="tile.isHidden"
      @click="openTile(tile)"
      @close="closeTile"
    /> 
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import DashboardTile from '../components/DashboardTile.vue';
import Calendar from '../components/Calendar.vue';
import autoAnimate from '@formkit/auto-animate';

autoAnimate(document.body);



axios.defaults.headers.common['Authorization'] =
  'Bearer ' + Cookies.get('token');

const tiles = reactive([
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
const tilesWrapper = ref(null);

const myWrapper = ref(null);

onMounted(() => {
  console.log(myWrapper.value);
});

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
  console.log(visibleTile.isSelected)
  if(visibleTile.isSelected) {
    visibleTile.isSelected = false
    return
  }
  console.log('opening')
  tiles.forEach(tile => Object.assign(tile, { isHidden: true, isSelected: false }));
  Object.assign(visibleTile, { isHidden: false, isSelected: true });
}

function closeTile() {
  nextTick(() => {
    console.log('closing')
    tiles.forEach(tile => Object.assign(tile, { isHidden: false }));
  })
}

onMounted(() => {
  getUser();
});
</script>

<style></style>
