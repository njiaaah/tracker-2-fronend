import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  persist: true, // enable persistence
  state: () => ({
    user_id: ref(0),
    hash: ref(0),
    settings: ref(null),
    persist: true,
  }),
  getters: {
    getUserId: (state) => state.user_id.value,
    getHash: (state) => state.hash.value,
  },
});
