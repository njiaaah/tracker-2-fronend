<template>
  <main class="h-[100dvh] w-screen overflow-scroll">
    <div class="about mb-24 flex flex-col pt-4 *:px-4">
      <p class="font-medium capitalize opacity-50">{{ formattedDate }}</p>
      <h1 class="mb-4 text-3xl font-semibold opacity-75">Dashboard</h1>

      <Calendar @select-day="selectDay" class="mb-4 !px-0 pt-4" />

      <div class="mb-24 grid grid-cols-2 gap-4" ref="myWrapper" v-auto-animate>
        <DashboardTile
          v-for="(tile, index) in tiles"
          :key="'tile-' + index"
          :color="tile.color"
          :isOpened="selectedTile === tile"
          class="tile"
          :class="[
            tile.col ? tile.col : '',
            tile.row ? tile.row : '',
            !selectedTile || selectedTile === tile
              ? 'featured-tile'
              : 'hidden-tile',
          ]"
          :value="selectedDaysWeight"
          v-auto-animate
        >
          <template v-slot:header v-auto-animate>
            <div class="flex justify-start gap-2">
              <mdicon :name="tile.icon" />
              <p>{{ $t(tile.heading) }}</p>
            </div>
          </template>

          <template v-slot:default>
            <component
              v-auto-animate
              :is="tile.component"
              :isOpened="selectedTile === tile"
              :user-id="user_id"
              :selected-day="selectedDay"
              :a-week-before-day="aWeekBeforeDay"
              :new-item="newItem"
              @emit-todays-foods="emitTodaysFoods"
              :calories-today="caloriesToday"
              :new-weight="newWeight"
              :color="tile.color"
              :isLoggedIn="store.isLoggedIn"
              :update-component="updateComponent"
              @delete-item="deleteItem"
              :goal="goal"
              class="flex h-full flex-col"
            >
              <template v-slot:preview></template>

              <template v-slot:full></template>
            </component>
          </template>
        </DashboardTile>
      </div>
      <BottomMenu @open-slide-panel="handlePanelOpen" />
    </div>

    <SlidePanel
      :isOpen="isSlidePanelOpen"
      @close="isSlidePanelOpen = false; foodItemToDelete = null;"
      :label="slidePanelFormData?.label"
    >
      <template v-slot:default>
        <div class="flex gap-2 justify-between mb-4 " v-if="slidePanelFormData && slidePanelFormData.name === 'food'">
          <div v-for="(item, index) in popularFoods" :key="index"
            class="flex flex-col ring-1 ring-sky-600 rounded-lg text-xs p-2 max-w-1/5 overflow-clip 
            text-ellipsis bg-sky-600 active:scale-90 transition-transform"
            @click="populateInputsWithPopularItem(item)" 
            >

            <span>{{ item.name }}</span>
            <span class="text-lg leading-5">{{ item.calories }}</span>

          </div>
        </div>
        <form
          v-if="
            slidePanelFormData && slidePanelFormData.label !== 'Delete item'
          "
          @submit.prevent="handleSubmit"
          class="flex flex-col gap-4 *:w-full"
        >
          <div
            v-for="(input, index) in slidePanelFormData?.inputs"
            :key="index"
          >
            <Input
              v-model="slidePanelFormData.inputs[index].value"
              :required="input.required"
              :name="input.name"
              :placeholder="input.name"
              :value="input.value"
              :type="input.type"
              :subtype="input.subtype"
              :minmax="input.minmax"
              :step="input.step"
            />
          </div>
          <Button :type="'submit'" label="Save" />
        </form>
        <Settings v-if="slidePanelFormData?.label === 'Settings'" />
        <div v-if="foodItemToDelete" class="flex flex-col gap-2">
          <div class="flex justify-between font-semibold mb-2">
            <p>{{ foodItemToDelete.name }}</p>
            <p>{{ foodItemToDelete.calories }}</p>
          </div>
          <Button color="bg-red-500" class="w-full" label="Delete" @click="confirmDelete" />
        </div>
      </template>
    </SlidePanel>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import DashboardTile from '../components/DashboardTile.vue';
import Calendar from '../components/Calendar.vue';
import Foods from '../components/Tiles/Foods.vue';
import Weight from '../components/Tiles/Weight.vue';
import Goal from '../components/Tiles/Goal.vue';
import BottomMenu from '../components/BottomMenu/Component.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useNow, useDateFormat } from '@vueuse/core';
import SlidePanel from '../components/SlidePanel/Component.vue';
import { useI18n } from 'vue-i18n';
import Input from '@/components/Items/Input.vue';
import Button from '@/components/Items/Button.vue';
import Settings from '../components/SlidePanel/Settings.vue';

const store = useUserStore();
const { user_id } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL;
const selectedTile = ref(null);
const selectedDaysWeight = ref(null);
const newItem = ref('placeholder');
const caloriesToday = ref(0);
const newWeight = ref(0);
const formattedDate = ref('');
const isSlidePanelOpen = ref(false);
const { t } = useI18n();
const tiles = ref([
  {
    icon: 'Weight',
    heading: t('weight'),
    color: 'text-lime-500',
    row: 'row-span-2',
    component: Weight,
  },
  {
    icon: 'flag-checkered',
    heading: t('goal'),
    color: 'text-purple-300',
    row: 'row-span-2',
    component: Goal,
  },
  {
    icon: 'food',
    heading: t('food'),
    color: 'text-yellow-400',
    col: 'col-span-2',
    component: Foods,
  },
]);
const now = useNow();
const selectedDay = ref(null);
const aWeekBeforeDay = ref(null);
const hash = ref(null);
const router = useRouter();
const slidePanelFormData = ref(null);
const updateComponent = ref(5);
const foodItemToDelete = ref(null);

console.log('store?', store);
const goal = ref(store.settings.goal);

formattedDate.value = useDateFormat(now, 'dddd DD.MM.YYYY', {
  locales: 'ru',
}).value;
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + Cookies.get('token');

console.log('is logged in? ', store.isLoggedIn);

hash.value = router.currentRoute.value.params.hash;

function selectDay(dayAndWeekBefore) {
  selectedDay.value = dayAndWeekBefore.formattedDate;
  aWeekBeforeDay.value = dayAndWeekBefore.weekBeforeDay;
}

function emitTodaysFoods(data) {
  caloriesToday.value = data.reduce((acc, item) => acc + item.calories, 0);
}

function handlePanelOpen(data) {
  slidePanelFormData.value = data;
  console.log(slidePanelFormData.value);
  isSlidePanelOpen.value = true;
}
function handleSubmit(event) {
  console.log('submitting form');
  event.preventDefault();

  const formData = new FormData(event.target);

  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  let data = {};
  if (slidePanelFormData.value.label === 'Settings') {
    data.settings = {
      goal: formDataObject.goal,
      theme: formDataObject.theme,
      lang: formDataObject.language,
    };
  } else {
    data = {
      user_id: user_id.value,
      date: selectedDay.value,
    };
    Object.assign(data, formDataObject);
  }
  console.log(data);
  axios
    .post(apiUrl + slidePanelFormData.value.url, data)
    .then(function () {
      newWeight.value = data.weight;
      slidePanelFormData.value = {};
      slidePanelFormData.value.label === 'Settings' ? store.settings = data.settings : null;
      slidePanelFormData.value.label === 'Settings' ? goal.value = data.settings.goal : null;
      isSlidePanelOpen.value = false;
      updateComponent.value++;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function deleteItem(data) {
  console.log(data);
  (slidePanelFormData.value = {
    label: 'Delete item',
  }),
    (foodItemToDelete.value = data);
  isSlidePanelOpen.value = true;
}

function confirmDelete() {
  console.log('deliting ', foodItemToDelete.value.id);
  axios.delete(apiUrl + '/food_logs/' + foodItemToDelete.value.id).then(() => {
    isSlidePanelOpen.value = false;
    updateComponent.value++;
    foodItemToDelete.value = null;
  }).catch(error => console.log(error));
}

// POPULAR FOODS

const popularFoods = ref([]);

function getPopularFoods() {
  const end_date = new Date().toISOString().split("T")[0]; // Today
  let start_date = new Date();
  start_date.setDate(start_date.getDate() - 30);
  start_date = start_date.toISOString().split("T")[0]; // 30 days ago

  axios.get(apiUrl + "/food_logs", {
    params: { user_id: user_id.value, start_date, end_date }
  })
  .then((response) => {
    console.log(response.data);
    popularFoods.value = getTopFiveFoods(response.data);
    console.log(popularFoods.value);
  })
  .catch((error) => console.log(error));
}

const getTopFiveFoods = (data) => {
  const foodCount = {};

  data.forEach(({ name, calories, weight }) => {
    const trimmedLowercasedName = name.trim().toLowerCase();
    if (!foodCount[trimmedLowercasedName]) {
      foodCount[trimmedLowercasedName] = { count: 1, calories, weight };
    } else {
      foodCount[trimmedLowercasedName].count += 1;
      // Keep the lowest calories and weight
      foodCount[trimmedLowercasedName].calories = Math.min(foodCount[trimmedLowercasedName].calories, calories);
      foodCount[trimmedLowercasedName].weight = Math.min(foodCount[trimmedLowercasedName].weight, weight);
    }
  });

  return Object.entries(foodCount)
    .sort((a, b) => b[1].count - a[1].count)  // Sort by the count (frequency of name)
    .slice(0, 5)  // Get top 5
    .map(([name, { calories, weight }]) => ({
      name,
      calories,
      weight,
    }));
};

function populateInputsWithPopularItem(item) {
  slidePanelFormData.value.inputs[0].value = item.name;
  slidePanelFormData.value.inputs[1].value = item.calories;
}




onMounted(() => {
  getPopularFoods()

})
</script>

<style scoped>
.tile {
  transition: opacity 0.5s ease;
}
.featured-tile {
  order: -1;
  grid-row: 0 /3;
  grid-column: 0 / 2;
}
.hidden-tile {
  opacity: 0;
  user-select: none;
}
</style>
