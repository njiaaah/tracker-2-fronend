<template>
  <div class="grid grid-cols-7 gap-2 px-0">
    <div
      v-for="(day,index) in daysOfWeek"
      @click="selectDay(index)"
      class="select-none max-w-12 flex flex-col justify-center items-center p-1 rounded-xl transition-all cursor-pointer hover:bg-lime-200"
      :class=" selectedDayTheWeekIndex === index ? 'bg-lime-400 hover:bg-lime-400 text-white' : ''"
    >
    <div class="">{{ day }}</div>
      <div class="font-semibold" :class=" selectedDayTheWeekIndex === index ? 'text-2xl' : 'opacity-75 text-xl'">{{ daysOfMonth[index] }}</div>

    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import { useNow, useDateFormat } from '@vueuse/core'
const counter = ref(0);
const $emit = defineEmits(['select-day']);
const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const daysOfMonth = ref([]);
const selectedDayTheWeekIndex = ref(new Date().getDay()); 
const selectedDay = ref(new Date().toISOString().split('T')[0]);



// console.log(daysOfWeek[selectedDayTheWeekIndex.value])

function fillDaysOfMonth() {
  const monday = new Date();
  monday.setDate(monday.getDate() - monday.getDay());
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    daysOfMonth.value.push(day.toISOString().split('T')[0].slice(8, 10).replace(/-/g, '.'));
  }
}

function selectDay(index) {
  selectedDayTheWeekIndex.value = index;

  const today = new Date();
  const currentDay = today.getDay();

  const adjustedIndex = (currentDay === 0 ? 6 : currentDay); 
  const diff = index - adjustedIndex;

  const selectedDate = new Date();
  selectedDate.setDate(today.getDate() + diff);

  const formattedDate = useDateFormat(selectedDate, 'YYYY-MM-DD').value;

  selectedDay.value = formattedDate;
  $emit('select-day', selectedDay.value);
}

// init
fillDaysOfMonth()

onMounted(() => {
  $emit('select-day', selectedDay.value); // YYYY-MM-DD
});
</script>
