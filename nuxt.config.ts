export default defineNuxtConfig({
  srcDir: 'src/',
  modules: ['@pinia/nuxt'],
  css: ['@/assets/styles.css'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.VITE_API_BASE_URL ?? '',
      presenceWsUrl: process.env.VITE_PRESENCE_WS_URL ?? '',
      wsUrl: process.env.VITE_WS_URL ?? '',
    },
  },
  vite: {
    assetsInclude: ['**/*.lottie'],
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  app: {
    head: {
      title: 'Portal Santos Tech',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/LogoColorida.png' }],
    },
  },
})
