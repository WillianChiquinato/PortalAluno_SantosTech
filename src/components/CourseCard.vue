<script setup lang="ts">
defineProps<{
  title: string
  area: string
  level: string
  isPaid: boolean
}>()
</script>

<template>
  <article class="panel flex flex-col gap-4 p-5">
    <div class="flex items-center justify-between">
      <span class="chip">{{ area }}</span>
      <span class="text-xs font-semibold" :class="isPaid ? 'text-ink-500' : 'text-brand-600'">
        {{ isPaid ? 'Pago' : 'Gratuito' }}
      </span>
    </div>
    <div class="space-y-2">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-sm text-ink-500">Nivel {{ level }}. Liberacao baseada em desempenho.</p>
    </div>
    <button class="h-10 rounded-full border border-ink-900 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5">
      Ver detalhes
    </button>
  </article>
</template>
