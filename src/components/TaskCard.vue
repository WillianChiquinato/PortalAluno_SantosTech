<template>
  <article
    class="panel relative flex flex-col gap-3 overflow-hidden p-3 transition sm:flex-row sm:items-center sm:justify-between sm:p-4"
    :class="cardClass" role="button" :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled ? 'true' : 'false'" @click="handleSelect" @keydown.enter.prevent="handleSelect"
    @keydown.space.prevent="handleSelect">
    <span v-if="props.featured"
      class="pointer-events-none absolute right-2 top-2 rounded-full border border-yellow-200 bg-yellow-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
      {{ props.highlightLabel || 'Destaque do dia' }}
    </span>

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
  featured?: boolean
  highlightLabel?: string
}>()

const cardClass = computed(() => {
  if (props.disabled) {
    return 'cursor-not-allowed border-slate-300 bg-slate-100/90'
  }

  if (props.featured) {
    return 'cursor-pointer border-amber-300 bg-gradient-to-r from-amber-50 via-white to-red-50 shadow-[0_8px_24px_rgba(217,119,6,0.18)] hover:-translate-y-0.5'
  }

  return 'cursor-pointer hover:-translate-y-0.5'
})

function handleSelect() {
  if (props.disabled) return
  emit('select')
}
</script>