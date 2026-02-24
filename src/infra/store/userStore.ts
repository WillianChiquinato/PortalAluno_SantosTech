import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
    configurationsLoaded: false,
    darkModeEnabled: false,
    receiveEmailNotifications: false,
    reportFrequency: false,
    acessibilityMode: false,
    preferredLanguage: 'English',
  }),

  getters: {
    getUserId: (state) => state.userId,
    getConfigurationsLoaded: (state) => state.configurationsLoaded,
    getDarkModeEnabled: (state) => state.darkModeEnabled,
    getReceiveEmailNotifications: (state) => state.receiveEmailNotifications,
    getReportFrequency: (state) => state.reportFrequency,
    getAcessibilityMode: (state) => state.acessibilityMode,
    getPreferredLanguage: (state) => state.preferredLanguage,
  },

  actions: {
    setUserId(id: number | null) {
      this.userId = id
    },
    setConfigurationsLoaded(loaded: boolean) {
      this.configurationsLoaded = loaded
    },
    setDarkModeEnabled(enabled: boolean) {
      this.darkModeEnabled = enabled
    },
    setReceiveEmailNotifications(receive: boolean) {
      this.receiveEmailNotifications = receive
    },
    setReportFrequency(frequency: boolean) {
      this.reportFrequency = frequency
    },
    setAcessibilityMode(enabled: boolean) {
      this.acessibilityMode = enabled
    },
    setPreferredLanguage(language: string) {
      this.preferredLanguage = language
    },
    clearUserId() {
      this.userId = null
      this.configurationsLoaded = false
    },
  },
})
