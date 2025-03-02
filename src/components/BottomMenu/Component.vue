<template>
  <div
    class="fixed bottom-0 left-0 grid min-h-[100px] w-screen grid-cols-4 items-center justify-between rounded-t-3xl p-4 ring-1"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      class="flex h-full flex-col items-center justify-center gap-2 p-2 text-xs text-nowrap text-gray-300"
      :class="item.class"
      @click="$emit(item.emit, item.emitData)"
      :ref="item.ref"
    >
      <mdicon :size="item.size" :name="item.icon" />
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/user';

export default {
  name: 'BottomMenu',
  data() {
    return {
      store: useUserStore(),
      items: [
        {
          name: 'Add weight',
          icon: 'weight',
          emit: 'openSlidePanel',
          label: 'Add weight for selected day',
          ref: 'weight',
          emitData: {
            url: '/user_weights',
            label: 'Add weight for selected day',
            inputs: [
                {
                    name: 'weight',
                    type: 'number',
                    placeholder: 'Weight',
                    required: true
                }
            ]
          },
        },
        {
          name: 'Add food',
          icon: 'food',
          emit: 'openSlidePanel',
          emitData: {
            url: '/food_logs',
            label: 'Add food for selected day',
            name: 'food',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'Food',
                    required: true,
                    value: ''
                },
                // {
                //     name: 'weight',
                //     type: 'number',
                //     placeholder: 'Weight',
                //     required: true,
                //     value : ''
                // },
                {
                    name: 'calories',
                    type: 'number',
                    placeholder: 'Calories',
                    required: true,
                    value: '',
                }
            ]
          },
        },
        // {
        //     name: '',
        //     icon: 'home-outline',
        //     size: '32',
        //     class: 'bg-sky-400 text-white rounded-3xl mx-3',
        //     emit: 'closeAllPanels'
        // },
        {
          name: 'Statistics',
          icon: 'chart-line',
          emit: 'openStatistics',
        },
        {
          name: 'Settings',
          icon: 'cog',
          emit: 'openSlidePanel',
          emitData: {
            url: '/update-settings',
            label: 'Settings',
            inputs: [
                {
                    name: 'goal',
                    type: 'text',
                    placeholder: 'goal',
                    required: true,
                }
            ]
          }
        },
      ],
    };
  },
  methods: {},
  computed: {},
  mounted() {
    console.log(this.store.settings)
  },
};
</script>
