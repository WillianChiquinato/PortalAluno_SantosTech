<template>
  <LoadingScreen />
</template>

<script setup lang="ts">
// Login is now handled by auth.santos-tech.com.
// The auth.global middleware redirects here only if session is valid (→ /dashboard).
// Unauthenticated users are sent directly to auth.santos-tech.com by the middleware.
onMounted(() => {
  window.location.replace('https://auth.santos-tech.com')
})
</script>
