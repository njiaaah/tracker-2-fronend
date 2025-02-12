<template>
  <div class="about p-4 flex flex-col gap-4 h-screen w-screen">

    <Calendar @select-day="selectDay" />

    <h1></h1>

    <div
      class="grid grid-cols-2 gap-4  outline-1"
      :class="[isItemSelected ? 'h-screen' : '']"
      ref="myWrapper"
      v-auto-animate
    >
      <DashboardTile
        v-for="(tile, index) in tiles"
        v-show="!selectedTile || selectedTile === tile"
        :key="'tile-' + index"
        :color="tile.color"
        :isOpened="selectedTile === tile"
        @click="selectItem(tile)"
        :class="[tile.col ? tile.col : '', tile.row ? tile.row : '']"
        :value="selectedDaysWeight"
        v-auto-animate
        
      >
        <template v-slot:header v-auto-animate>
          <div class="flex justify-between">
            <mdicon
              class="order-1"
              :name="selectedTile === tile ? 'close' : tile.icon"
              @click.stop="closeTile"
            />
            <p>{{ tile.heading }}</p>
          </div>
        </template>
        

         <template v-slot:default>
          
          <component v-auto-animate :is="tile.component" :isOpened="selectedTile === tile" :user-id="user_id" :selected-day="selectedDay">

            <template v-slot:loading></template>

            <template v-slot:preview></template>

            <template v-slot:full></template>

          </component>

         </template>


      </DashboardTile>
    </div>

    <Footer v-auto-animate :selected-day="selectedDay" />
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
import Foods from '../components/Tiles/Foods.vue';
import Footer from '../components/Footer/Index.vue';
import Weight from '../components/Tiles/Weight.vue';
import router from '@/router';

axios.defaults.headers.common['Authorization'] =
  'Bearer ' + Cookies.get('token');

const tiles = ref([
  {
    icon: 'Weight',
    heading: 'Weight',
    color: 'bg-green-500',
    component: Weight,
  },
  {
    icon: 'flag-checkered',
    heading: 'Goal',
    color: 'bg-violet-300',
    row: 'row-span-2',
  },
  {
    icon: 'Weight',
    heading: 'Weight',
    color: 'bg-green-500',
  },
  {
    icon: 'food',
    heading: 'Food',
    color: 'bg-yellow-500',
    col: 'col-span-2',
    component: Foods,
  },
]);

const store = useUserStore();
const { user_id } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL;
const token = Cookies.get('token');
const foodLogs = ref(null);
const selectedTile = ref(null);
const selectedDay = ref(new Date().toISOString().split('T')[0]); // Alternative fix
const url = window.location.href;
const selectedDaysWeight = ref(null);

function selectItem(tile) {
  selectedTile.value = selectedTile.value === tile ? tile : tile;
}

function closeTile() {
  nextTick(() => {
    selectedTile.value = null;
  });
}

function selectDay(day) {
  selectedDay.value = day;
}

onMounted(async () => {
  console.log('today is ', selectedDay.value)
  axios.get(apiUrl + '/user_weights', { params: { user_id: user_id.value, start_date: selectedDay.value, end_date: selectedDay.value } })
  .then(function (response) {
    selectedDaysWeight.value = response.data[0].weight;
  })
  .catch(function (error) {
    console.log(error);
  });
});

</script>

<style></style>
