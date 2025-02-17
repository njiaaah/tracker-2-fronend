<template>
  <div>
    <div class="bg-sky-500 text-white rounded-lg p-2 px-4 w-full ">
      {{ label ? label : 'button' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-btn',
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: 'button',
    }
  },
};
</script>
