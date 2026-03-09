import { watch } from 'vue'
import { usePortalI18n } from '~/composables/usePortalI18n'
import { useUserStore } from '~/infra/store/userStore'

export default defineNuxtPlugin(() => {
  const userStore = useUserStore()
  const { setLocale } = usePortalI18n()

  setLocale(userStore.getPreferredLanguage)

  watch(
    () => userStore.getPreferredLanguage,
    (preferredLanguage) => {
      setLocale(preferredLanguage)
    },
    { immediate: true },
  )
})
