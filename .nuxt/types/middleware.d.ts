import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "auth-folders-global-client"
declare module 'nuxt/app' {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}