import { useUserStore } from '~/infra/store/userStore'

function applyThemeFromConfig(enabled: boolean) {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle('dark', enabled)
  localStorage.setItem('portal-theme', enabled ? 'dark' : 'light')
}

export function getUserIdFromSession() {
  const userData = useUserStore()

  if (userData.userId && userData.userId > 0) {
    return userData.userId
  }

  const loggedUser = getLoggedUser()
  const recoveredId = Number(loggedUser?.id)

  if (!Number.isFinite(recoveredId) || recoveredId <= 0) {
    return null
  }

  userData.setUserId(recoveredId)
  return recoveredId
}

export function useLoadingConfigurations() {
  const { $httpClient } = useNuxtApp()
  const { loadingPush, loadingPop } = useLoading()
  const userData = useUserStore()

  async function loadConfigurations() {
    loadingPush()
    userData.setConfigurationsLoaded(false)

    try {
      const userId = getUserIdFromSession()
      const responseConfig = await $httpClient.auth.GetConfigsByUserId(userId ?? 0)

      if (!responseConfig.success) {
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
