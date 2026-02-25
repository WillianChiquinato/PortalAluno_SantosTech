import { useToast } from 'primevue/usetoast'

export function useToastService() {
  const toast = useToast()

  function success(summary: string, detail?: string, life = 3000) {
    toast.add({
      severity: 'success',
      summary,
      detail,
      life: life
    })
  }

  function error(summary: string, detail?: string, life = 4000) {
    toast.add({
      severity: 'error',
      summary,
      detail,
      life: life
    })
  }

  function info(summary: string, detail?: string, life = 3000) {
    toast.add({
      severity: 'info',
      summary,
      detail,
      life: life
    })
  }

  function warn(summary: string, detail?: string, life = 3000) {
    toast.add({
      severity: 'warn',
      summary,
      detail,
      life: life
    })
  }

  return { success, error, info, warn }
}