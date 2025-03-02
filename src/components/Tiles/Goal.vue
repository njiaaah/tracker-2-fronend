<template>
  <div>
    <slot name="header"></slot>
    <slot name="default">
      <Loading v-if="!isLoaded" />
      <div v-else class="flex h-full flex-col justify-between font-bold">
        <div class="h-full mt-6">
          <Radial :max="settings.goal" :key="radialKey" :current="caloriesToday">
            <template v-slot:values>
              <div class="flex justify-between leading-5">
                <div>
                  <div class="opacity-50">cal</div>
                  <div>{{ caloriesToday }}</div>
                </div>
                <div class="text-end">
                  <div class="opacity-50">goal</div>
                  <div>{{ localGoal }}</div>
                </div>
              </div>
            </template>
          </Radial>
        </div>
      </div>
    </slot>
    <slot name="full"></slot>
  </div>
</template>

<script>
import Loading from '../Icons/Loading.vue';
import Radial from '../Indicator/Radial.vue';
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';

export default {
  components: {
    Loading,
    Radial,
  },
  props: {
    goal: Number,
    caloriesToday: Number,
  },
  data() {
    return {
      isLoaded: true,
      localGoal: this.goal,
      radialKey: 0,
    };
  },
  computed: {
    ...mapState(useUserStore, ['settings']),
  },
  watch: {
    caloriesToday() {
      this.isLoaded = true;
    },
    goal() {
      this.isLoaded = true;
      this.localGoal = this.goal;
      this.radialKey++;
    },
  },
  mounted() {
    // console.log('goal local ', this.settings.goal);
  },
};
</script>
