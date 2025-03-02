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
              class="flex h-full flex-col"
            >
              <template v-slot:preview></template>

              <template v-slot:full></template>
            </component>
          </template>
        </DashboardTile>
      </div>

      <!-- <Footer
        v-if="store.isLoggedIn"
        :selected-day="selectedDay"
        @submit="handleSubmit"
        @open-settings="isSlidePanelOpen = true"
      /> -->
      <BottomMenu @open-slide-panel="handlePanelOpen" />
    </div>

    <SlidePanel
      :isOpen="isSlidePanelOpen"
      @close="isSlidePanelOpen = false; foodItemToDelete = null;"
      :label="slidePanelFormData?.label"
    >
      <template v-slot:default>
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
import { ref } from 'vue';
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
const { user_id, settings } = storeToRefs(store);
const apiUrl = import.meta.env.VITE_API_URL;
const selectedTile = ref(null);
const url = window.location.href;
const selectedDaysWeight = ref(null);
const isItemSelected = ref(false);
const newItem = ref('placeholder');
const caloriesToday = ref(0);
const newWeight = ref(0);
const formattedDate = ref('');
const isSlidePanelOpen = ref(false);
const isLoggedIn = ref(false);
const { t } = useI18n();
const tiles = ref([
  {
    icon: 'Weight',
    heading: 'Weight',
    color: 'text-lime-500',
    component: Weight,
  },
  {
    icon: 'flag-checkered',
    heading: 'Goal',
    color: 'text-purple-300',
    row: 'row-span-2',
    component: Goal,
  },
  {
    icon: 'flag-checkered',
    heading: 'Goal',
    color: 'text-sky-300',
  },
  {
    icon: 'food',
    heading: t('Food'),
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
      store.settings = data.settings;
      console.log(store.settings);
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
