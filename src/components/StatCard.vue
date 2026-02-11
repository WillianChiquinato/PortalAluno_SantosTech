<script setup lang="ts">
defineProps<{
  label: string
  value: string
  helper: string
}>()
</script>

<template>
  <article class="panel flex flex-col gap-3 p-5">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{{ label }}</p>
    <h3 class="text-2xl font-semibold">{{ value }}</h3>
    <p class="text-sm text-ink-500">{{ helper }}</p>
  </article>
</template>
