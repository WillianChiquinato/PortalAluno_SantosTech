import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
  }),

  getters: {
    getUserId: (state) => state.userId,
  },

  actions: {
    setUserId(id: number | null) {
      this.userId = id
    },
    clearUserId() {
      this.userId = null
    },
  },
})
