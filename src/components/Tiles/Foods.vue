<template>
  <slot v-if="isLoading" name="loading">
    <div class="grid min-h-24 items-center justify-center" v-auto-animate>
      <div class="h-fit w-fit scale-300 animate-spin">
        <mdicon name="loading" />
      </div>
    </div>
  </slot>

  <slot v-if="!isOpened && !isLoading" name="preview">
    <div class="my-4 flex min-w-1/2 flex-wrap gap-2" v-auto-animate>
      <table
        v-if="localData.length"
        class="table overflow-clip rounded-2xl ring-1 ring-gray-300"
      >
        <thead>
          <tr>
            <th>food</th>
            <!-- <th>weight</th> -->
            <th>calories</th>
          </tr>
        </thead>
        <transition-group name="list">
          <tr v-for="(item, index) in limitedData" @click="$emit('delete-item', item)">
            <td class="border-t-1 border-t-gray-200">
              {{ item.name }} 
              <span v-if="item.count > 1">({{ item.count }})</span>
            </td>
            <!-- <td class="border-t-1 border-t-gray-200">{{ item.weight }}</td> -->
            <td class="border-t-1 border-t-gray-200">{{ item.calories }}</td>
          </tr>
        </transition-group>
      </table>
      <div v-else class="max-w-24 leading-5 font-bold">
        no entries for today found
      </div>

      <div
        class="mt-2 w-full font-bold underline"
        v-show="localData.length > foodListLimit"
        @click="toggleVisibility"
      >
        {{ localData.length - foodListLimit }} more
      </div>
    </div>
  </slot>
  <slot v-if="isOpened && !isLoading" name="full">
    <div class="flex flex-col gap-2" v-auto-animate>
      <ul
        v-for="(item, index) in limitedData"
        :key="item.id"
        v-show="index < 8"
        v-auto-animate
      >
        <li
          class="flex justify-between bg-white p-4 text-gray-900"
          v-auto-animate
        >
          <div class="flex justify-between">
            {{ item.name }} 
            <span v-if="item.count > 1">({{ item.count }})</span>
            {{ item.calories }}
          </div>

          <q-icon
            name="delete"
            size="lg"
            color="red"
            class="opacity-25"
            @click="confirm = true"
          />
        </li>
      </ul>
    </div>
  </slot>

  <slide-panel v-if="isSlidePanelOpen" />
</template>


<script>
import axios from 'axios';
import jsCookie from 'js-cookie';
import Badge from '../Items/Badge.vue';
import { ref, watch, onMounted } from 'vue';
import SlidePanel from '../SlidePanel/Component.vue';

export default {
  name: 'Foods', 
  components: {
    Badge,
    SlidePanel
  },
  props: {
    isOpened: { type: Boolean, default: false },
    userId: { type: Number, default: null },
    isLoading: { type: Boolean, default: false },
    selectedDay: { type: String, default: null },
    isModalOpen: {
      type: Boolean,
      default: false,
    },
    data: { type: Array, default: () => [] },
    newItem: { type: Object, default: () => {} },
    updateComponent: { type: Number, default: 0 },

  },
  emits: ['emit-todays-foods'],
  data() {
    return {
      isLoaded: false,
      apiUrl: import.meta.env.VITE_API_URL,
      confirm: false,
      isLoadingLocal: true,
      localData: this.data,
      foodListLimit: 10,
      isSlidePanelOpen: false,
    };
  },
  watch: {
    updateComponent: {
      handler(val) {
        console.log('update component', val);
        this.getUserFood(this.selectedDay);
      },
    },
    selectedDay: {
      handler(newDay) {
        if (!newDay) return;
        this.getUserFood(newDay);
      },
      immediate: true,
    },
    newItem: {
      handler(val) {
        if (!val) return;
        if (val === 'placeholder') return;
        this.newItemLocal = val;
        this.localData.push(this.newItemLocal);
        this.$emit('emit-todays-foods', this.localData);
      },
      immediate: true,
    },
  },
  mounted() {
    if (this.selectedDay) {
      this.getUserFood(this.selectedDay);
    }
  },
  methods: {
    async getUserFood(day) {
      if (!day) return;
      axios
        .get(this.apiUrl + '/food_logs', {
          params: { user_id: this.userId, date: day },
        })
        .then((response) => {
          this.localData = response.data;
          this.isLoadingLocal = false;
          this.$emit('emit-todays-foods', this.localData);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toggleVisibility() {
      if (this.foodListLimit === 5) {
        this.foodListLimit = 99;
      } else this.foodListLimit = 5;
    },
  },
  computed: {
    limitedData() {
      const countItems = this.localData.reduce((acc, item) => {
        const existingItem = acc.find(i => i.name === item.name);
        if (existingItem) {
          existingItem.count++;
          existingItem.calories += item.calories;  // Combine calories
        } else {
          acc.push({ ...item, count: 1 });
        }
        return acc;
      }, []);

      return countItems.slice(0, this.foodListLimit);
    },
  },
};
</script>

<style>
.table {
  width: 100%;

  tr {
    &:first-child {
      outline: 1px solid rgb(211, 211, 211);
    }
    td,
    th {
      position: relative;
      padding: 8px;
      text-align: end;
      &:first-child {
        text-align: left;
        padding-left: 12px;
      }
    }
    td:first-child::before,
    td:last-child::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: white;
      @media (prefers-color-scheme: dark) {
        background: var(--color-gray-900);
      }
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(50%);
    }
    td:last-child::before {
      left: unset;
      right: 0;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: opacity 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

</style>
