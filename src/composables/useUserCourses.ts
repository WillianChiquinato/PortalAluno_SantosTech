import { useNuxtApp, useState } from '#app'
import { computed } from 'vue'
import type { IUserCourse } from '~/infra/interfaces/services/course'

// Cache compartilhado (via useState) das turmas do aluno.
// Usado pela página /user-courses (resolver) e pelo SidebarNav (botão "Trocar turma").
export function useUserCourses() {
  const courses = useState<IUserCourse[]>('user-courses', () => [])
  const loaded = useState<boolean>('user-courses-loaded', () => false)
  const pending = useState<Promise<IUserCourse[]> | null>('user-courses-pending', () => null)

  async function fetchCourses(force = false): Promise<IUserCourse[]> {
    if (!force && loaded.value) return courses.value
    if (!force && pending.value) return await pending.value

    const promise = (async () => {
      try {
        const { $httpClient } = useNuxtApp()
        const response = await $httpClient.course.GetUserCourses()
        if (!response.success) throw new Error('Failed to fetch user courses')
        courses.value = (response.result as IUserCourse[]) ?? []
      } catch (error) {
        console.error('Error fetching user courses:', error)
        courses.value = []
      } finally {
        loaded.value = true
        pending.value = null
      }
      return courses.value
    })()

    pending.value = promise
    return await promise
  }

  function reset() {
    courses.value = []
    loaded.value = false
    pending.value = null
  }

  const count = computed(() => courses.value.length)

  return { courses, count, loaded, fetchCourses, reset }
}
