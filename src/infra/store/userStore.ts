import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
    userEmail: null as string | null,
    configurationsLoaded: false,
    darkModeEnabled: false,
    receiveEmailNotifications: false,
    reportFrequency: false,
    acessibilityMode: false,
    preferredLanguage: 'English',
  }),

  getters: {
    getUserId: (state) => state.userId,
    getUserEmail: (state) => state.userEmail,
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
    setUserEmail(email: string | null) {
      this.userEmail = email
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
