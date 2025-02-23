<template>
  <div v-show="isOpen" class="absolute bottom-0 left-0 h-[100dvh] w-screen">
    <!-- backdrop -->
    <div
      class="backdrop absolute top-0 left-0 h-full w-full bg-black opacity-25"
      @click="$emit('close')"
    ></div>
    <div
      class="panel absolute bottom-0 left-0 w-full 
      rounded-t-4xl bg-white px-4 py-8"
    >
      <slot name="header">
        <div class="flex items-center justify-between gap-4 mb-12">
          <div class="w-12 h-12 flex items-center justify-center">
            <mdicon name="chevron-left" @click="$emit('close')" />
          </div>
          <div class="">{{ label }}</div>
          <div class="w-12 h-12"></div>
        </div>
      </slot>

      <slot name="default">
        <component :is="component" />
      </slot>

      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import Settings from './Settings.vue';
export default {
  name: 'SlidePanel',
  components: { Settings },
  data() {
    return {
      isOpened: false,
    };
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Pass a title prop bro',
    },
    component: {
      type: String,
      default: 'settings',
    }
  },
};
</script>
