<template>
  <div class="about flex h-screen w-screen flex-col p-4">

    <p class="font-medium opacity-50 capitalize">{{ formattedDate }}</p>
    <h1 class="font-semibold text-3xl opacity-75 mb-4">Dashboard</h1>

    <Calendar @select-day="selectDay" class="mb-4" />

    <div
      class="gap-4 outline-1"
      :class="[isItemSelected ? 'flex' : 'grid grid-cols-2']"
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
          <component
            v-auto-animate
            :is="tile.component"
            :isOpened="selectedTile === tile"
            :user-id="user_id"
            :selected-day="selectedDay"
            :new-item="newItem"
            :goal="settings.goal"
            @emit-todays-foods="emitTodaysFoods"
            :calories-today="caloriesToday"
            :new-weight="newWeight"
            class="flex h-full flex-col"
          >
            <template v-slot:preview></template>

            <template v-slot:full></template>
          </component>
        </template>
      </DashboardTile>
    </div>

    <Footer v-auto-animate :selected-day="selectedDay" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, nextTick } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import DashboardTile from '../components/DashboardTile.vue';
import Calendar from '../components/Calendar.vue';
import Foods from '../components/Tiles/Foods.vue';
import Footer from '../components/Footer/Index.vue';
import Weight from '../components/Tiles/Weight.vue';
import Goal from '../components/Tiles/Goal.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useNow, useDateFormat } from '@vueuse/core'

const store = useUserStore();
const { user_id, settings } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL;
const token = Cookies.get('token');
const foodLogs = ref(null);
const selectedTile = ref(null);
const selectedDay = ref(new Date().toISOString().split('T')[0]); // Alternative fix
const url = window.location.href;
const selectedDaysWeight = ref(null);
const isItemSelected = ref(false);
const newItem = ref('placeholder');
const caloriesToday = ref(0);
const newWeight = ref(0);
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
    component: Goal,
  },
  {
    icon: 'flag-checkered',
    heading: 'Goal',
    color: 'bg-sky-300',
  },
  {
    icon: 'food',
    heading: 'Food',
    color: 'bg-yellow-500',
    col: 'col-span-2',
    component: Foods,
  },
]);
const now = useNow();
const formattedDate = useDateFormat(now, 'dddd, DD.MM', {locales: 'ru'});

axios.defaults.headers.common['Authorization'] =
  'Bearer ' + Cookies.get('token');

function selectItem(tile) {
  selectedTile.value = selectedTile.value === tile ? tile : tile;
  isItemSelected.value = true;
}

function handleSubmit(data, type) {
  if (type === 'weight') {
    newWeight.value = data;
  }
  if (type === 'food') {
    newItem.value = data;
  }
}

function closeTile() {
  nextTick(() => {
    selectedTile.value = null;
    isItemSelected.value = false;
  });
}

function selectDay(day) {
  selectedDay.value = day;
}

function emitTodaysFoods(data) {
  caloriesToday.value = data.reduce((acc, item) => acc + item.calories, 0);
}

onMounted(async () => {
  console.log('getting weight for: ', selectedDay.value);
  axios
    .get(apiUrl + '/user_weights', {
      params: {
        user_id: user_id.value,
        start_date: selectedDay.value,
        end_date: selectedDay.value,
      },
    })
    .then(function (response) {
      selectedDaysWeight.value = response.data[0].weight;
    })
    .catch(function (error) {
      console.log(error);
    });
});
</script>

<style></style>
