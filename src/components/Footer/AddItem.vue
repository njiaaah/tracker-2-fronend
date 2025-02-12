<template>
    <div>
        <div class="w-18 h-18 rounded-2xl grid items-center justify-center relative" :class="color">
            <mdicon name="plus" class="absolute  top-1.5 right-1.5 text-white" />
            <mdicon :name=" icon ? icon : 'plus'" class="scale-125 text-white" />
        </div>
    </div>
</template>

<script setup>

import { defineProps } from 'vue';

const props = defineProps(['icon', 'color']);

</script>