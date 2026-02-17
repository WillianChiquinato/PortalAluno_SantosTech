import type { NuxtConfig } from 'nuxt/config'

declare global {
  const defineNuxtConfig: (config: NuxtConfig) => NuxtConfig
}

declare module '*.vue *.png' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

export {}