<template>
  <div>
    <slot name="header"> </slot>
    <slot name="default">
      <Loading v-if="!isLoaded" />
      <div
        v-else
        class="flex h-full flex-col justify-between font-bold"
      >
        <div class="h-full mt-6">
          <Radial :max="settings.goal" :current="caloriesToday">
            <template v-slot:values>
                <div class="flex justify-between leading-5">
                  <div>
                    <div class="opacity-50">cal</div>
                    <div>{{caloriesToday}}</div>
                  </div>
                  <div class="text-end">
                    <div class="opacity-50">goal</div>
                    <div>{{goal}}</div>
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

<script setup>
import { ref, onMounted, watch } from 'vue';
import Loading from '../Icons/Loading.vue';
import Radial from '../Indicator/Radial.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const { user_id, settings } = storeToRefs(store);
const props = defineProps(['goal', 'caloriesToday']);
const isLoaded = ref(true);

watch(
  () => props.caloriesToday,
  () => {
    isLoaded.value = true;
  },
);
onMounted(() => {
  console.log('goal local ' , settings.goal)
})
</script>
