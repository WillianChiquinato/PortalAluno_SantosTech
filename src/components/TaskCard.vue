<script setup lang="ts">
const emit = defineEmits<{
  (event: 'select'): void
}>()

defineProps<{
  title: string
  due: string
  points: string
  status: string
}>()
</script>

<template>
  <article class="panel flex items-center justify-between gap-4 p-4 cursor-pointer transition hover:-translate-y-0.5"
    role="button" tabindex="0" @click="emit('select')" @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')">
    <div class="space-y-1">
      <p class="text-sm font-semibold">{{ title }}</p>
      <p class="text-xs text-ink-500">Prazo: {{ due }}</p>
    </div>
    <div class="flex items-center gap-3">
      <span class="chip">{{ points }} pts</span>
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{{ status }}</span>
    </div>
  </article>
</template>

<!-- Exemplo de lottie -->
<!-- import { triggerXP } from '@/composables/useGamification'

function completeTask() {
  triggerXP(120)
} -->