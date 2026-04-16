import { defineStore } from 'pinia'
import { normalizePreferredLanguage } from '~/composables/usePortalI18n'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null as number | null,
    userEmail: null as string | null,
    enrollmentId: null as number | null,
    configurationsLoaded: false,
    darkModeEnabled: false,
    receiveEmailNotifications: false,
    reportFrequency: false,
    acessibilityMode: false,
    preferredLanguage: 'en-US',
  }),

  getters: {
    getUserId: (state) => state.userId,
    getUserEmail: (state) => state.userEmail,
    getEnrollmentId: (state) => state.enrollmentId,
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
    setEnrollmentId(id: number | null) {
      this.enrollmentId = id
      if (id !== null) localStorage.setItem('enrollmentId', String(id))
      else localStorage.removeItem('enrollmentId')
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
      this.preferredLanguage = normalizePreferredLanguage(language)
    },
    clearUserId() {
      this.userId = null
      this.userEmail = null
      this.enrollmentId = null
      localStorage.removeItem('enrollmentId')
      this.configurationsLoaded = false
    },
  },
})
