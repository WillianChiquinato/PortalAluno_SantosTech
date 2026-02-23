<script setup lang="ts">
const emit = defineEmits<{
  (event: 'select'): void
}>()

const props = defineProps<{
  title: string
  due: string
  points: string
  status: string
  disabled?: boolean
}>()

function handleSelect() {
  if (props.disabled) return
  emit('select')
}
</script>

<template>
  <article class="panel relative overflow-hidden flex items-center justify-between gap-4 p-4 transition"
    :class="props.disabled ? 'cursor-not-allowed border-slate-300 bg-slate-100/90' : 'cursor-pointer hover:-translate-y-0.5'"
    role="button" :tabindex="props.disabled ? -1 : 0" :aria-disabled="props.disabled ? 'true' : 'false'"
    @click="handleSelect" @keydown.enter.prevent="handleSelect" @keydown.space.prevent="handleSelect">
    <div class="space-y-1" :class="props.disabled ? 'opacity-55' : ''">
      <p class="text-sm font-semibold">{{ title }}</p>
      <p class="text-xs text-ink-500">Prazo: {{ due }}</p>
    </div>
    <div class="flex items-center gap-3" :class="props.disabled ? 'opacity-55' : ''">
      <span class="chip">{{ points }} pts</span>
      <span class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{{ status }}</span>
    </div>

    <span v-if="props.disabled"
      class="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-300/80 bg-white/90 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-500">
      Tarefa concluída
    </span>
  </article>
</template>

<!-- Exemplo de lottie -->
<!-- import { triggerXP } from '@/composables/useGamification'

function completeTask() {
  triggerXP(120)
} -->