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
      if (!import.meta.client) return
      // Persistência por sessão (sessionStorage): a turma escolhida sobrevive a
      // reloads/navegação na mesma sessão, mas é esquecida ao iniciar uma nova
      // sessão/login — forçando o seletor de turma a aparecer novamente.
      if (id !== null) sessionStorage.setItem('enrollmentId', String(id))
      else sessionStorage.removeItem('enrollmentId')
      localStorage.removeItem('enrollmentId') // limpa chave legada
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
      if (import.meta.client) {
        sessionStorage.removeItem('enrollmentId')
        localStorage.removeItem('enrollmentId')
      }
      this.configurationsLoaded = false
    },
  },
})
