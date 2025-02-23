<template>
  <div
    class="w-fit absolute right-0 bottom-4 flex justify-end gap-4 px-4 transition-all"
  >
    <AddItem
      :color="'bg-sky-500'"
      icon="scale-balance"
      @click="toggleModal('user_weights', 'Add weight for selected day')"
    />
    <AddItem
      :color="'bg-green-500'"
      icon="food"
      @click="toggleModal('food_logs', 'Add food for selected day')"
    />
    <AddItem
      :color="'bg-gray-500'"
      icon="cog"
      :isPlus="false"
      :iconColor="'text-white'"
      @click="openSettings"
    />
  </div>

  <FormModal
    v-model="isModalVisible"
    :formType="formType"
    :label="label"
    @submit="submit"
  >
    <template v-slot:form>
      <div class="*:flex *:flex-col *:gap-4 *:*:rounded-2xl *:*:p-4 *:*:ring-1">
        <div v-if="formType === 'user_weights'">
          <input
            type="number"
            v-model="user_weight"
            placeholder="weight"
            required
          />
        </div>

        <div v-if="formType === 'food_logs'">
          <input type="text" v-model="food" placeholder="food" required />
          <input
            type="number"
            v-model="calories"
            placeholder="calories"
            required
          />
          <input
            type="number"
            v-model="food_weight"
            placeholder="food weight"
          />
        </div>
      </div>
    </template>
  </FormModal>
</template>

<script>
import AddItem from './AddItem.vue';
import { ref, watch } from 'vue';
import FormModal from '../Tiles/FormModal.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../../stores/user';
import axios from 'axios';

export default {
  components: {
    AddItem,
    FormModal,
  },
  props: ['selectedDay', 'isModalVisible'],
  data() {
    return {
      store: useUserStore(),
      isModalVisible: false,
      formType: 'user_weights',
      label: 'Add weight for selected day',
      selectedDay: this.selectedDay,
      user_weight: '',
      food: '',
      calories: '',
      food_weight: '',
      apiUrl: import.meta.env.VITE_API_URL,
      submitType: '',
    };
  },
  computed: {
    user_id() {
      return this.store.user_id;
    },
  },
  watch: {
    selectedDay(val) {
      if (val) {
        this.selectedDay = val;
      }
    },
  },
  methods: {
    toggleModal(formType, label) {
      this.isModalVisible = !this.isModalVisible;
      this.formType = formType;
      this.label = label;
    },
    openSettings() {
      this.$emit('open-settings');
    },
    submit() {
      let data = {};
      if (this.formType === 'user_weights' && this.user_weight) {
        this.submitType = 'weight';
        data = {
          user_id: this.user_id,
          date: this.selectedDay,
          weight: this.user_weight,
        };
        this.actualSubmit(data);
      }
      if (this.formType === 'food_logs' && this.food && this.calories) {
        this.submitType = 'food';
        data = {
          user_id: this.user_id,
          date: this.selectedDay,
          name: this.food,
          calories: this.calories,
          weight: this.food_weight,
        };
        this.actualSubmit(data);
      }
    },
    async actualSubmit(data) {
      try {
        await axios.post(this.apiUrl + '/' + this.formType, data);
        this.$emit('submit', data, this.submitType);
        this.isModalVisible = false;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
