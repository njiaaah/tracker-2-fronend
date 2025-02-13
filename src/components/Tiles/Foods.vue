<template>
  <slot v-if="isLoading" name="loading">
    <div class="grid min-h-24 items-center justify-center" v-auto-animate>
      <div class="h-fit w-fit scale-300 animate-spin">
        <mdicon name="loading" />
      </div>
    </div>
  </slot>

  <slot v-if="!isOpened && !isLoading" name="preview">
    <div class="flex min-w-1/2 flex-col gap-2" v-auto-animate>
      <div
        v-for="(item, index) in localData"
        :key="item.id"
        v-show="index < 5"
        class="flex justify-between rounded-xl bg-white p-2 text-xl text-gray-900"
        v-auto-animate
      >
        <div v-auto-animate>{{ item.name }}</div>
        <div v-auto-animate>{{ item.calories }}</div>
      </div>
    </div>
  </slot>
  <slot v-if="isOpened && !isLoading" name="full">
    <div class="flex flex-col gap-2" v-auto-animate>
      <ul
        v-for="(item, index) in localData"
        :key="item.id"
        v-show="index < 8"
        v-auto-animate
      >
        <li
          class="flex justify-between bg-white p-4 text-gray-900"
          v-auto-animate
        >
          <div class="flex justify-between">
            {{ item.name }}
            {{ item.calories }}
          </div>

          <q-icon
            name="delete"
            size="lg"
            color="red"
            class="opacity-25"
            @click="confirm = true"
          />
        </li>
      </ul>
    </div>
  </slot>
</template>

<script setup>
import moment from 'moment';
import axios from 'axios';
import { ref, defineProps, onMounted, nextTick, watch, defineEmits } from 'vue';
import jsCookie from 'js-cookie';

const isLoaded = ref(false);
const apiUrl = import.meta.env.VITE_API_URL;
const props = defineProps({
  isOpened: { type: Boolean, default: false },
  userId: { type: Number, default: null },
  isLoading: { type: Boolean, default: false },
  selectedDay: { type: String, default: null },
  isModalOpen: {
    type: Boolean,
    default: false,
  },
  data: { type: Array, default: () => [] },
  newItem: { type: Object, default: () => {} },
});
const confirm = ref(false);
const isLoading = ref(true);
const localData = ref(props.data);
const newItem = ref({});
const emit = defineEmits(['emit-todays-foods']);

watch(
  () => props.selectedDay,
  (newDay) => {
    if (!newDay) return;
    getUserFood(newDay);
  },
  { immediate: true },
);
watch(
  () => props.newItem,
  (val) => {
    if (!val) return;
    if (val === 'placeholder') return;
    newItem.value = val;
    localData.value.push(newItem.value);
    console.log('emiting foods for today');
    emit('emit-todays-foods', localData.value);
  },
  { immediate: true },
);

onMounted(() => {
  if (props.selectedDay) {
    getUserFood(props.selectedDay);
  }
});

async function getUserFood(day) {
  if (!day) return;
  axios
    .get(apiUrl + '/food_logs', {
      params: { user_id: props.userId, date: day },
    })
    .then((response) => {
      localData.value = response.data;
      isLoading.value = false;
      console.log('emiting foods for today');
      emit('emit-todays-foods', localData.value);
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
