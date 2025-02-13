<template>
  <div
    class="absolute right-0 bottom-4 flex w-full justify-end gap-4 px-4 transition-all"
  >
    <AddItem
      :color="'bg-sky-500'"
      icon="scale-balance"
      @click="
        isModalVisible = !isModalVisible;
        formType = 'user_weights';
        label = 'Add weight for selected day';
      "
    />
    <AddItem
      :color="'bg-green-500'"
      icon="food"
      @click="
        isModalVisible = true;
        formType = 'food_logs';
        label = 'Add food for selected day';
      "
    />
  </div>

  <FormModal
    v-model="isModalVisible"
    :formType="formType"
    :label="label"
    @submit="submit"
  >
    <template v-slot:form>
      <div class="*:flex *:flex-col *:gap-4 *:*:rounded-2xl *:*:p-4 *:*:ring-1">
        <div v-if="formType === 'user_weights'">
          <input
            type="number"
            v-model="user_weight"
            placeholder="weight"
            required
          />
        </div>

        <div v-if="formType === 'food_logs'">
          <input type="text" v-model="food" placeholder="food" required />
          <input
            type="number"
            v-model="calories"
            placeholder="calories"
            required
          />
          <input
            type="number"
            v-model="food_weight"
            placeholder="food weight"
          />
        </div>
      </div>
    </template>
  </FormModal>
</template>

<script setup>
import AddItem from './AddItem.vue';
import { ref, defineEmits, watch } from 'vue';
import FormModal from '../Tiles/FormModal.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user';
import axios from 'axios';

const store = useUserStore();
const { user_id } = storeToRefs(store);
const isModalVisible = ref(false);
const formType = ref('user_weights');
const label = ref('Add weight for selected day');
const url = ref('weight');
const props = defineProps(['selectedDay']);
const selectedDay = ref(props.selectedDay);
const user_weight = ref('');
const food = ref('');
const calories = ref('');
const food_weight = ref('');
const apiUrl = import.meta.env.VITE_API_URL;
let data = {};
const emit = defineEmits(['submit']);
let submitType = ref('');

watch(
  () => props.selectedDay,
  (val) => {
    if (!val) return;
    selectedDay.value = val;
  },
  { immediate: true },
);

function submit() {
  console.log('submiting ' + user_weight.value + ' for ' + selectedDay.value);
  if (formType.value === 'user_weights' && user_weight.value) {
    submitType.value = 'weight';
    data = {
      user_id: user_id.value,
      date: selectedDay.value,
      weight: user_weight.value,
    };
    actualSubmit();
  }
  if (formType.value === 'food_logs' && food.value && calories.value) {
    submitType.value = 'food';
    data = {
      user_id: user_id.value,
      date: selectedDay.value,
      name: food.value,
      calories: calories.value,
      weight: food_weight.value,
    };
    actualSubmit();
  }
}

async function actualSubmit() {
  axios
    .post(apiUrl + '/' + formType.value, data)
    .then(function (response) {
      emit('submit', data, submitType.value);
      isModalVisible.value = false;
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>
