<template>
  <div v-show="modelValue" class="fixed w-screen h-screen top-0 left-0">
    <div
      @click="closeModal"
      class="w-screen h-screen top-0 left-0 bg-black opacity-25"
    ></div>

    <div class="fixed w-full h-fit bg-white bottom-0 p-4 transition-all">
      <form
        @submit.prevent="submitForm"
      >
        <div class="flex flex-col gap-4  text-xl" action="">
          <div class="outline-none">{{ label ? label : 'Confirm action' }}</div>

          <slot name="form"> </slot>
          <button class="p-4 bg-sky-500 rounded-2xl text-white" @click.prevent="submitForm">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps(['label', 'modelValue']);
const emit = defineEmits(['update:modelValue']);

function closeModal() {
  emit('update:modelValue', false);
}

function submitForm() {
    console.log('emititng...')
  emit('submit');
}


</script>
