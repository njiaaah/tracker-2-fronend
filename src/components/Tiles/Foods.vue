<template>
  <slot v-if="isLoading" name="loading">
    <div class="min-h-24 grid items-center justify-center" v-auto-animate>
      <div class="animate-spin w-fit h-fit scale-300">
        <mdicon name="loading" />
      </div>
    </div>
  </slot>

  <slot v-if="!isOpened && !isLoading" name="preview">
    <div class="flex flex-col gap-2 min-w-1/2" v-auto-animate>
      <div
        v-for="item in data"
        :key="item.id"
        class="flex justify-between bg-white text-gray-900 p-2 text-xl rounded-xl"
        v-auto-animate
      >
        <div v-auto-animate>{{ item.name }}</div>
        <div v-auto-animate>{{ item.calories }}</div>
      </div>
    </div>
  </slot>
  <slot v-if="isOpened && !isLoading" name="full">
    <div class="flex flex-col gap-2" v-auto-animate>
      <ul v-for="item in data" :key="item.id" v-auto-animate>
        <li class="bg-white text-gray-900 p-4" v-auto-animate>
          <div class="flex justify-between">
            {{ item.name }}
            {{ item.calories }}
          </div>

          <q-icon name="delete" size="lg" color="red" class="opacity-25" @click="confirm = true" />

        </li>
      </ul>
    </div>
  </slot>

  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>

      <q-card-actions class="flex justify-between">
        <q-btn flat style="background: goldenrod; color: white" label="Delete" v-close-popup />
        <q-btn outline style="color: goldenrod;" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>


</template>

<script setup>
import moment from 'moment';
import axios from 'axios';
import { ref, defineProps, onMounted, nextTick, watch,  } from 'vue';
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
    default: false
  }
});
const confirm = ref(false)
const isLoading = ref(true);
const data = ref([]);



watch(() => props.selectedDay, (newDay) => {
  if (!newDay) return;
  getUserFood(newDay);
}, { immediate: true });

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
        data.value = response.data;
        console.log()
        isLoading.value = false;
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>
