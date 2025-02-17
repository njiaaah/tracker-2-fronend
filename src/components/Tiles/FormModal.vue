<template>
  <div v-show="modelValue" class="fixed top-0 left-0 h-screen w-screen">
    <div
      @click="closeModal"
      class="top-0 left-0 h-screen w-screen bg-black opacity-25"
    ></div>

    <div class="fixed bottom-0 h-fit w-full dark:bg-gray-700 bg-gray-100 
    dark:text-white text-gray-600 p-4 pb-16 transition-all">
      <form @submit.prevent="submitForm">
        <div class="flex flex-col gap-4 text-xl" action="">
          <div class="outline-none">{{ label ? label : 'Confirm action' }}</div>

          <slot name="form"> </slot>
          <button
            class="rounded-2xl bg-sky-500 p-4 text-white"
            @click.prevent="submitForm"
          >
            Submit
          </button>
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
  emit('submit');
}
</script>
