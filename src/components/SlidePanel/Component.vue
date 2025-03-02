<template>
  <div v-show="isOpened" class="absolute bottom-0 left-0 h-[100dvh] w-screen">
    <!-- backdrop -->
    <div
      ref="backdrop"
      class="backdrop absolute top-0 left-0 h-full w-full bg-black opacity-50 starting:opacity-0  transition-all duration-200"
      @click="$emit('close')"
    ></div>
    <div
      ref="panel"
      class="panel absolute bottom-0 left-0 w-full 
      rounded-t-4xl bg-white px-4 py-8 starting:translate-y-full transition-all duration-200"
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
  watch: {
    isOpen(val) {
      if(val) {
        this.isOpened = val;
      } else {
        this.$refs.panel.style.transform = 'translateY(100%)';
        this.$refs.backdrop.style.opacity = '0';
        setTimeout(() => {
          this.isOpened = false;
          this.$refs.panel.style.transform = 'translateY(0)';
          this.$refs.backdrop.style.opacity = '.5';
        }, 200);
      }
    },
  },
};
</script>
