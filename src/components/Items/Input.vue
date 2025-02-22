<template>
  <input
    :type="type"
    :placeholder="placeholder"
    v-model="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
    class="p-4 rounded-xl border-none outline-none ring-1 ring-sky-500 focus:ring-3 text-xl placeholder:opacity-50"
  />
</template>

<script>
export default {
  name: 'c-input',
  data() {
    return {};
  },
  props: {
    label: {
      type: String,
      default: 'button',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
};
</script>
