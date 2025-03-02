<template>
  <input
    :type="type"
    :placeholder="placeholder"
    v-model="modelValue"
    :name="name"
    @input="$emit('update:modelValue', $event.target.value)"
    class="p-4 rounded-xl border-none outline-none ring-1 ring-sky-500 focus:ring-3 text-xl placeholder:opacity-50 w-full"
  />
</template>

<script>
export default {
  name: 'c-input',
  data() {
    return {
      modelValue: this.value,
    };
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
    name: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
  },
  watch: {
    value(newValue) {
      this.modelValue = newValue;
    },
    modelValue(newValue) {
      this.$emit('update:modelValue', newValue);
    },
  },
};
</script>
