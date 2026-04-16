import { useUserStore } from '~/infra/store/userStore'

type UserSessionData = {
  userId: number
  enrollmentId: number | null
}

function applyThemeFromConfig(enabled: boolean) {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('dark', enabled)
  localStorage.setItem('portal-theme', enabled ? 'dark' : 'light')
}

export function getUserIdFromSession(): UserSessionData | null {
  const userData = useUserStore()

  const storedEnrollmentId = import.meta.client
    ? Number(localStorage.getItem('enrollmentId') ?? '0') || null
    : null

  if (userData.userId && userData.userId > 0) {
    const enrollmentId = userData.enrollmentId ?? storedEnrollmentId
    if (enrollmentId && userData.enrollmentId !== enrollmentId) {
      userData.setEnrollmentId(enrollmentId)
    }
    return {
      userId: userData.userId,
      enrollmentId,
    }
  }

  const loggedUser = getLoggedUser()
  if (!loggedUser) {
    return null
  }

  const enrollmentId = loggedUser.enrollmentsId ?? storedEnrollmentId ?? null

  userData.setUserId(loggedUser.id)
  userData.setEnrollmentId(enrollmentId)

  return {
    userId: loggedUser.id,
    enrollmentId,
  }
}

export function useLoadingConfigurations() {
  const { $httpClient } = useNuxtApp()
  const { loadingPush, loadingPop } = useLoading()
  const userData = useUserStore()

  async function loadConfigurations() {
    loadingPush()
    userData.setConfigurationsLoaded(false)

    try {
      const responseConfig = await $httpClient.auth.GetConfigsByUserId()

      if (!responseConfig.success) {
        await $httpClient.auth.CreateNewConfig()
        return
      }

      const configData = responseConfig.result
      userData.setDarkModeEnabled(configData.darkModeEnabled)
      userData.setReceiveEmailNotifications(configData.receiveEmailNotifications)
      userData.setReportFrequency(configData.reportFrequency)
      userData.setAcessibilityMode(configData.acessibilityMode)
      userData.setPreferredLanguage(configData.preferredLanguage)
      userData.setConfigurationsLoaded(true)
      applyThemeFromConfig(configData.darkModeEnabled)
    } catch (error) {
      console.error('Erro ao carregar as configurações iniciais:', error)
    } finally {
      loadingPop()
    }
  }

  return {
    loadConfigurations,
  }
}
