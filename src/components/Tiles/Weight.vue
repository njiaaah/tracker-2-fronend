<template>
  <div class="text-gray-600 dark:text-gray-100">
    <slot name="header"></slot>
    <slot name="default">
      <Loading v-if="isLoaded" />
      <div
        v-else
        class="mt-2 flex min-h-full flex-col justify-between text-start text-[3.5rem] font-bold opacity-90"
      >
        <div v-if="selectedDaysWeight">
          <div>
            {{ selectedDaysWeight }}
          </div>
          <div>
            <div
              :class="{
                'text-green-500': !ifDifferencePositive,
                'text-red-500': ifDifferencePositive,
              }"
              class="flex text-[16px]"
            >
              <div
                :class="{
                  'rotate-180': ifDifferencePositive,
                }"
                class="h-fit w-fit"
                v-auto-animate
              >
                <mdicon name="chevron-down" />
              </div>
              <div class="mr-2 font-black">
                {{ weekDifference.toString().replace('-', ' ') }}
              </div>
              <div
                class="mt-1 leading-none text-gray-600 dark:font-normal dark:text-gray-300"
              >
                from week before
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex min-h-full flex-col items-start">
          <div class="opacity-25">???</div>
          <div class="flex items-end" v-if="isLoggedIn">
            <div class="text-base leading-5 text-balance">
              {{ $t('noWeightEntry') }}
            </div>
            <div
              class="grid min-h-10 min-w-10 items-center justify-center rounded-2xl bg-lime-400"
            >
              <mdicon @click="$emit('open-add-weight-modal', 'user_weights', 'Add weight for selected day')" name="plus" class="scale-100 text-white" />
            </div>
          </div>
        </div>
      </div>
    </slot>
    <slot name="full"></slot>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';
import jsCookie from 'js-cookie';
import Loading from '../Icons/Loading.vue';
import { useNow, useDateFormat } from '@vueuse/core';
import Button from '../Items/Button.vue';

const isLoaded = ref(false);
const emits = defineEmits(['open-add-weight-modal']);

const props = defineProps([
  'weightSelected',
  'weightsWeek',
  'isLoaded',
  'selectedDay',
  'userId',
  'newWeight',
  'aWeekBeforeDay',
  'color',
  'isLoggedIn',
  'weightFromSubmit',
]);
const apiUrl = import.meta.env.VITE_API_URL;
const user_id = ref(jsCookie.get('user_id'));
const selectedDaysWeight = ref(0);
const isLoading = ref(true);
const weightOneWeekBefore = ref(0);
const weekDifference = ref(0);
const ifDifferencePositive = ref(false);
const isSlidePanelOpen = true;

async function getSelectedWeight() {
  isLoading.value = true;
  axios
    .get(apiUrl + '/user_weights', {
      params: {
        user_id: props.userId,
        start_date: props.aWeekBeforeDay,
        end_date: props.selectedDay,
      },
    })
    .then(function (response) {
      isLoading.value = false;
      let dataSorted = response.data;
      dataSorted = dataSorted.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );

      // backend is shit, need to add 1 day
      let dateStr = dataSorted[dataSorted.length - 1].date;
      let dateObj = new Date(dateStr);
      dateObj.setDate(dateObj.getDate() + 1);
      let newDateStr = dateObj.toISOString().slice(0, 10);

      if (newDateStr === props.selectedDay) {
        selectedDaysWeight.value = dataSorted[dataSorted.length - 1].weight;

        // holy im smart
        selectedDaysWeight.value = parseFloat(
          selectedDaysWeight.value,
        ).toString();
        weightOneWeekBefore.value = parseFloat(dataSorted[0].weight);
        weekDifference.value = (
          selectedDaysWeight.value - weightOneWeekBefore.value
        ).toFixed(1);
        selectedDaysWeight.value > weightOneWeekBefore.value
          ? (ifDifferencePositive.value = true)
          : (ifDifferencePositive.value = false);
      } else {
        selectedDaysWeight.value = 0;
      }
    })
    .catch(function (error) {
      if ((error.response.statusText = 'Not Found')) {
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
    console.log('prop weight', val);
    // =-)
    getSelectedWeight()
    val !== selectedDaysWeight.value
      ? (selectedDaysWeight.value = val)
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
</script>
