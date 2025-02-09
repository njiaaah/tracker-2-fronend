import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('user', () => {
  const user_id = ref(0)
  const hash = ref(0)
  const getUserId = () => {
    return user_id.value
  }
  const getHash = () => {
    return hash.value
  }

  return { user_id, hash, getUserId, getHash }
})
