<template>
    <div>
    </div>
</template>

<script setup>

import axios from 'axios';
import { ref, defineProps } from 'vue';
import jsCookie from 'js-cookie';


const isLoaded = ref(false);

const props = defineProps(['weightSelected', 'weightsWeek']);

</script>