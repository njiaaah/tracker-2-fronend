<template>
  <div>{{subtype}}</div>
  <div class="relative">
    <div v-if="subtype === 'amount'" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-sky-500">
      <mdicon name="plus" :size="38" @click="increment"></mdicon>
    </div>
    <div v-if="subtype === 'amount'" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-md bg-sky-500">
      <mdicon name="minus" :size="38" @click="decrement"></mdicon>
    </div>
  <input
    :type="type"
    :placeholder="placeholder"
    v-model="modelValue"
    :name="name"
    @input="$emit('update:modelValue', $event.target.value)"
    class="p-4 rounded-xl border-none outline-none ring-1 ring-sky-500 focus:ring-3 text-xl placeholder:opacity-50 w-full"
    :class="subtype === 'amount' ? 'pl-18' : ''"
  />
  </div>
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
    subtype: {
      type: String,
      default: '',
    },
    minmax: {
      type: Array,
      default: [],
    }
  },
  methods: {
    increment() {
      if (this.modelValue < this.minmax[1]) {
        this.modelValue++;
      }
    },
    decrement() {
      if (this.modelValue > this.minmax[0]) {
        this.modelValue--;
      }
    }
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
