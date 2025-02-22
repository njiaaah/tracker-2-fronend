<template>
  <div class="relative">
    <c-btn v-if="isTodayOutOfview" class="w-fit absolute -top-14 right-4" @click="scrollTodayIntoView" :label="'go to today'"></c-btn>
    <div class="flex gap-2 min-h-fit overflow-x-auto px-0 pt-2 pb-2 overflow-y-clip" ref="calendar" @scroll="handleScroll">
      <div
        v-for="(day, index) in daysRendered"
        :key="index"
        @click="selectDay(index)"
        class="flex min-w-[13%] cursor-pointer flex-col items-center 
        justify-center rounded-xl gap-1 min-h-fit p-1 transition-all select-none hover:bg-lime-200"
        :class="selectedDay === index ? 'bg-sky-500 text-white' : '',
        day.day.slice(8, 10) == daysRendered[calendarScope - 1].day.slice(8, 10) ? 
        'outline-2 outline-sky-500' : ''"
        :ref="selectedDay === index ? 'todayRef' : null"
      >
        <div>{{ day.day.slice(8, 10) }}</div>
        <div class="font-semibold">{{ day.dayOfWeek }}</div>
      </div>
    </div>
</div>
</template>

<script>
import { useNow, useDateFormat } from '@vueuse/core';
import { nextTick } from 'vue';
import cBtn from '../components/Items/Button.vue';

export default {
  data() {
    return {
      daysOfWeek: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      daysRendered: [],
      // days before and after init day
      calendarScope: 18,
      todayIndex: 0,
      selectedDay: 0,
      isTodayOutOfview: false,
    };
  },
  components: { cBtn },
  methods: {
    renderCarendar(amount) {
      const today = new Date();
      this.todayIndex = this.calendarScope - 1 
      this.selectedDay = this.todayIndex;
      this.daysRendered.push(this.getCalendarObject(today));
      for (let i = 1; i < amount; i++) {
        for (let z = -1; z < 2; z += 2) {
          let newDay = new Date(today);
          newDay.setDate(newDay.getDate() - i * z);
          let newItem = this.getCalendarObject(newDay);
          z < 0
            ? this.daysRendered.push(newItem)
            : this.daysRendered.unshift(newItem);
        }
      }
      nextTick(() => {
        this.scrollTodayIntoView();
      })
    },
    scrollTodayIntoView() {
          let today = this.$refs.todayRef[0];
        today.scrollIntoView({
          behaviour: 'smooth',
          block: 'center',
          inline: 'center',
        });
    },
    getCalendarObject(dayProvided) {
      let dayCopy = new Date(dayProvided); // Create a copy
      let weekBefore = new Date(dayCopy.setDate(dayCopy.getDate() - 7)); // Modify the copy

      let newObject = {
        day: dayProvided.toISOString().slice(0, 10),
        dayOfWeek:
          dayProvided.getDay() === 0
            ? this.daysOfWeek[6]
            : this.daysOfWeek[dayProvided.getDay() - 1],
        aWeekBeforeDay: weekBefore.toISOString().slice(0, 10),
      };

      return newObject;
    },
    handleScroll(event) {
      let calendarW = event.target.clientWidth
      this.isTodayOutOfview = event.target.scrollLeft + calendarW < this.$refs.todayRef[0].offsetLeft 
          || event.target.scrollLeft > this.$refs.todayRef[0].offsetLeft
    },
    selectDay(index) {
      this.selectedDay = index
      const initialDay = {
        formattedDate: this.daysRendered[index].day,
        weekBeforeDay: this.daysRendered[index].aWeekBeforeDay,
      }
      this.$emit('select-day', initialDay);
    },
  },
  computed: {
    windowWidth() {
      return window.innerWidth
    }
  },
  mounted() {
    const initialDay = {
      formattedDate: useDateFormat(new Date(), 'YYYY-MM-DD').value,
      weekBeforeDay: useDateFormat(
        new Date(new Date().setDate(new Date().getDate() - 7)),
        'YYYY-MM-DD',
      ).value,
    };
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
