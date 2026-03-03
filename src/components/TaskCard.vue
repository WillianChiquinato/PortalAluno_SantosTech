<template>
  <article
    class="panel relative flex flex-col gap-3 overflow-hidden p-3 transition sm:flex-row sm:items-center sm:justify-between sm:p-4"
    :class="props.disabled ? 'cursor-not-allowed border-slate-300 bg-slate-100/90' : 'cursor-pointer hover:-translate-y-0.5'"
    role="button" :tabindex="props.disabled ? -1 : 0" :aria-disabled="props.disabled ? 'true' : 'false'"
    @click="handleSelect" @keydown.enter.prevent="handleSelect" @keydown.space.prevent="handleSelect">
    <div class="min-w-0 space-y-1" :class="props.disabled ? 'opacity-55' : ''">
      <p class="break-words text-sm font-semibold leading-tight">{{ title }}</p>
      <p class="text-xs text-ink-500">Prazo: {{ due }}</p>
    </div>
    <div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-start"
      :class="props.disabled ? 'opacity-55' : ''">
      <span class="chip shrink-0">{{ points }} pts</span>
      <span
        class="text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-600 sm:text-xs sm:tracking-[0.2em]">{{
          status }}</span>
    </div>

    <span v-if="props.disabled"
      class="pointer-events-none absolute inset-x-3 bottom-3 rounded-md border border-slate-300/80 bg-white/85 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-500 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:tracking-[0.2em]">
      Tarefa concluída
    </span>
  </article>
</template>

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