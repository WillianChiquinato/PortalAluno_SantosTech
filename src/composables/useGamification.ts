import { ref } from 'vue'

export const showXPAnimation = ref(false)
export const xpGained = ref(0)

export function triggerXP(points: number) {
  xpGained.value = points
  showXPAnimation.value = true

  setTimeout(() => {
    showXPAnimation.value = false
  }, 1800)
}