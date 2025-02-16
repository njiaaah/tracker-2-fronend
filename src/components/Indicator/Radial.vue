<template>
    
    <div class="px-4 grid items-center overflow-clip" :key="radialkey">
        <Transition>
        <div ref="indicator" class="indicator rounded-full rotate-135 "></div>
    </Transition>
        <slot name="values"></slot>
    </div>

</template>

<script>
import { nextTick } from 'vue';

export default {
    name: 'Radial',
    data() {
        return {
            value: 0,
            radialkey: 0,
        }
    },
    props: {
        max: {
            type: Number,
            default: 0
        },
        current: {
            type: Number,
            default: 0
        }
    },
    methods: {
        update()    {
                let transDuration = 50
                this.$refs.indicator.style.transition = `opacity .3s`
                this.$refs.indicator.style.opacity = '0'

                setTimeout(()=>{
                    let diffColor = 160 - (this.current / this.max) * 120;
                    let diffAngle = 90 + (this.current / this.max) * 270;
                    
                    diffAngle = diffAngle > 360 ? 360 : diffAngle;
                    diffColor = diffColor < 0 ? 0 : diffColor; 

                    let notFilledArea = diffAngle !== 360 ? ', #eee ' + diffAngle + 'deg 360deg' : '';

                    let color = `hsl( ${diffColor}, 90%, 50%)`;

                    this.$refs.indicator.style.background = `conic-gradient( 
                    white 0deg 90deg, ${color} 90deg ${diffAngle}deg ${notFilledArea} )`;
                }, transDuration)

                
                setTimeout(()=>{
                    this.$refs.indicator.style.opacity = '1'
                },transDuration*2)
        }
    },
    computed: {
        
    },
    mounted() {
        this.update();
    },
    watch: {
        current(newVal, oldVal){
            // console.log('current changed from ' + oldVal + ' to ' + newVal)
            nextTick(()=>{
                this.update()
            })
        }
    }
}


</script>

<style scoped>

.indicator {
    background: #000;
    width: 100%;
    aspect-ratio: 1;
    position: relative;
    &::after {
        display: block;
        content: '';
        width: 80%;
        height: 80%;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
.hidden {
    opacity: .5;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>