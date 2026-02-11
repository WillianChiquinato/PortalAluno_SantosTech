<script setup lang="ts">
defineProps<{
  title: string
  duration: string
  tags: string[]
}>()
</script>

<template>
  <article class="panel flex flex-col gap-4 p-5">
    <div class="h-28 rounded-xl bg-sand-100"></div>
    <div class="space-y-2">
      <p class="text-sm font-semibold">{{ title }}</p>
      <p class="text-xs text-ink-500">{{ duration }}</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <span v-for="tag in tags" :key="tag" class="chip">{{ tag }}</span>
    </div>
  </article>
</template>
