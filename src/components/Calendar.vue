<template>
  <div class="flex justify-between">
    <!-- <div @click="selectPreviousWeek">prev</div> -->
    <div
      v-for="day in dayOfWeek"
      @click="selectDay(day)"
      class="uppercase"
      :class="{ 'bg-red-500': day === selectedDay }"
    >
      <div>{{ getDate(day) }}</div>
      <div>{{ day }}</div>
    </div>
    <!-- <div>next</div> -->
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';

const $emit = defineEmits(['select-day']);
const dayOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const selectedDay = ref(todaysDayOfTheWeek());

function todaysDayOfTheWeek() {
  const date = new Date();
  const day = date.getDay();
  return dayOfWeek[day - 1];
}

function selectDay(day) {
  selectedDay.value = day;
  const formattedDate = getDate(day);
  $emit('select-day', formattedDate);
}

function getDate(day) {
  const date = new Date();
  const todayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Adjust Sunday (0) to be the last
  const dayIndex = dayOfWeek.indexOf(day);
  const diff = dayIndex - todayIndex;
  
  date.setDate(date.getDate() + diff);
  return date.toISOString().split('T')[0];
}

onMounted(() => {
  const formattedDate = getDate(todaysDayOfTheWeek());
  console.log(formattedDate);
  $emit('select-day', formattedDate);
});

</script>
