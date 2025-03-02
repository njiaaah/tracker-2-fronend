<template>
    
    <template v-if="!isLoading">
        
        <slot name="default">

        </slot>
    </template>

    <template v-else>
        <slot name="loading">
            <mdicon name="loading" :size="128" class="aspect-square block m-auto animate-spin" />
        </slot>
    </template>


</template>

<script>

export default {
    data() {
        return {
            
        };
    },
    props: {
        label: {
            type: String,
            default: 'Loading...',
        },
        isLoading: {
            type: Boolean,
            default: false
        }
    },
}

</script>