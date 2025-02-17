<template>
  <div class="flex gap-2 overflow-x-auto px-0" ref="calendar">
    <div
      v-for="(day, index) in daysRendered"
      :key="index"
      @click="selectDay(index)"
      class="flex min-w-[13%] cursor-pointer flex-col items-center justify-center rounded-xl p-1 transition-all select-none hover:bg-lime-200"
      :class="todaysIndex === index ? 'bg-sky-500 text-white' : ''"
      :ref="todaysIndex === index ? 'todayRef' : null"
    >
      <div>{{ day.day.slice(8, 10) }}</div>
      <div class="font-semibold">{{ daysOfWeek[index % 7] }}</div>
    </div>
  </div>
</template>

<script>
import { useNow, useDateFormat } from '@vueuse/core';
import { nextTick } from 'vue';

export default {
  data() {
    return {
      daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      daysRendered: [],
      // days before and after init day
      calendarScope: 8,
      todaysIndex: 0,
    };
  },
  methods: {
    renderCarendar(amount) {
      const today = new Date();
      this.todaysIndex = this.calendarScope + 1;
      this.daysRendered.push(this.getCalendarObject(today));
      for (let i = 1; i < amount; i++) {
        for (let z = -1; z < 2; z += 2) {
          let newDay = new Date(today);
          newDay.setDate(newDay.getDate() + i * z);
          let newItem = this.getCalendarObject(newDay);
          z < 0
            ? this.daysRendered.unshift(newItem)
            : this.daysRendered.push(newItem);
        }
      }

      console.table(this.daysRendered);
      nextTick(() => {
        let today = this.$refs.todayRef[0];
        today.scrollIntoView({
          behaviour: 'smooth',
          block: 'center',
          inline: 'center',
        });
      });
    },
    getCalendarObject(dayProvided) {
      let newObject = {
        day: dayProvided.toISOString().slice(0, 10),
        dayOfWeek:
          dayProvided.getDay() === 0
            ? this.daysOfWeek[6]
            : this.daysOfWeek[dayProvided.getDay() - 1],
      };
      return newObject;
    },
  },
  mounted() {
    console.log(new Date());
    const initialDay = {
      formattedDate: useDateFormat(new Date(), 'YYYY-MM-DD').value,
      weekBeforeDay: useDateFormat(
        new Date(new Date().setDate(new Date().getDate() - 7)),
        'YYYY-MM-DD',
      ).value,
    };
    console.log('init day emited', initialDay);
    this.$emit('select-day', initialDay);

    this.renderCarendar(this.calendarScope);
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
