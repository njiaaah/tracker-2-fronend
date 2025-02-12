<template>
    <div>
        <slot name="header">
            <div>
                <Loading />
            </div>
        </slot>
        <slot name="default"></slot>
        <slot name="full"></slot>
    </div>
</template>

<script setup>

import axios from 'axios';
import { ref, defineProps, onMounted } from 'vue';
import jsCookie from 'js-cookie';
import Loading from '../Icons/Loading.vue';


const isLoaded = ref(false);

const props = defineProps(['weightSelected', 'weightsWeek', 'isLoaded', 'selectedDay', "userId"]);
const apiUrl = import.meta.env.VITE_API_URL;
const user_id = ref(jsCookie.get('user_id'));
const selectedDaysWeight = ref(0);

async function getSelectedWeight(day) {
    console.log( { user_id: props.userId, start_date: props.selectedDay, end_date: props.selectedDay })
    axios.get(apiUrl + '/user_weights', { params: { user_id: props.userId, start_date: props.selectedDay, end_date: props.selectedDay } })
  .then(function (response) {
    selectedDaysWeight.value = response.data[0].weight;
  })
  .catch(function (error) {
    console.log(error);
  });
}

onMounted(() => {
  getSelectedWeight();
});

</script>