<template>
  <div>
    <slot name="header"></slot>
    <slot name="default">
      <Loading v-if="isLoaded" />
      <div v-else class="text-center text-[4rem] font-bold opacity-90">
        {{ selectedDaysWeight }}
      </div>
    </slot>
    <slot name="full"></slot>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, defineProps, onMounted, watch } from 'vue';
import jsCookie from 'js-cookie';
import Loading from '../Icons/Loading.vue';

const isLoaded = ref(false);

const props = defineProps([
  'weightSelected',
  'weightsWeek',
  'isLoaded',
  'selectedDay',
  'userId',
  'newWeight',
]);
const apiUrl = import.meta.env.VITE_API_URL;
const user_id = ref(jsCookie.get('user_id'));
const selectedDaysWeight = ref(0);
const isLoading = ref(true);

async function getSelectedWeight() {
  isLoading.value = true;
  console.log('getting weight for ', props.selectedDay);
  axios
    .get(apiUrl + '/user_weights', {
      params: {
        user_id: props.userId,
        start_date: props.selectedDay,
        end_date: props.selectedDay,
      },
    })
    .then(function (response) {
      isLoading.value = false;
      'weight for the day is ', response.data[0].weight;
      selectedDaysWeight.value = response.data[0].weight;
      selectedDaysWeight.value = selectedDaysWeight.value.slice(
        0,
        selectedDaysWeight.value.length - 1,
      );
    })
    .catch(function (error) {
      if ((error.response.statusText = 'Not Found')) {
        console.log('not founed, setting up 0');
        selectedDaysWeight.value = 0;
      } else {
        console.log(error);
      }
    });
  isLoading.value = true;
}

watch(
  () => props.newWeight,
  (val) => {
    val !== selectedDaysWeight.value
      ? (selectedDaysWeight.value = val.weight)
      : null;
  },
);

watch(
  () => props.selectedDay,
  (val) => {
    if (!val) return;
    getSelectedWeight();
  },
  { immediate: true },
);

onMounted(() => {
  getSelectedWeight();
});
</script>
