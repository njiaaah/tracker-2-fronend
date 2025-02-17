<template>

    <div v-show="isOpened" class="absolute">
        <slot name="header"></slot>
        <slot name="default"></slot>
        <slot name="footer"></slot>
    </div>

</template>

<script>
    export default {
        name: 'SlidePanel',
        data() {
            return {
                isOpened: false,
            }
        },
        props: {
            isOpened: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>