<template>
  <div class="flex overflow-x-auto gap-2 px-0">
    <div
      v-for="(day, index) in daysOfWeek"
      :key="index"
      @click="selectDay(index)"
      class="select-none min-w-[13%] flex flex-col justify-center items-center p-1 rounded-xl transition-all cursor-pointer hover:bg-lime-200"
    >
      <div>{{ day }}</div>
      <div class="font-semibold">{{ daysOfWeek[index % 7] }}</div>
    </div>
  </div>
</template>

<script>
import { useNow, useDateFormat } from '@vueuse/core';

export default {
  data() {
    return {
      daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      daysRendered: [],
    };
  },
  mounted() {
    console.log(new Date)
    const initialDay = {
      formattedDate: useDateFormat(new Date(), 'YYYY-MM-DD').value, // Access the value of the ref
      weekBeforeDay: useDateFormat(new Date(new Date().setDate(new Date().getDate() - 7)), 'YYYY-MM-DD').value,
    };
    console.log('init day emited', initialDay)
    this.$emit('select-day', initialDay); // YYYY-MM-DD
  },
};
</script>

<style scoped>
/* Allow scrolling */
.flex {
  display: flex;
  overflow-x: auto;
}

/* Optional: style for scroll buttons if you want them */
.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
</style>
