<script setup lang="ts">
defineProps<{
  title: string
  description: string
  enabled: boolean
}>()
</script>

<template>
  <div class="panel flex items-center justify-between gap-4 p-5">
    <div class="space-y-1">
      <p class="text-sm font-semibold">{{ title }}</p>
      <p class="text-xs text-ink-500">{{ description }}</p>
    </div>
    <div class="h-7 w-12 rounded-full border border-slate-200 bg-sand-100 p-1">
      <div class="h-5 w-5 rounded-full" :class="enabled ? 'translate-x-5 bg-brand-500' : 'bg-white'" />
    </div>
  </div>
</template>
