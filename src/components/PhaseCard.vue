<script setup lang="ts">
defineProps<{
  title: string
  period: string
  exercises: { name: string; status: string }[]
  variant: 'primary' | 'lower'
}>()
</script>

<template>
  <article class="panel flex flex-col gap-4 p-5" :class="variant === 'lower' ? 'border-accent-200/80' : ''">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold">{{ title }}</p>
        <p class="text-xs text-ink-500">{{ period }}</p>
      </div>
      <span class="chip" :class="variant === 'lower' ? 'border-accent-200 text-ink-900' : ''">
        {{ variant === 'lower' ? 'Lower path' : 'Fluxo principal' }}
      </span>
    </div>

    <ul class="space-y-2 text-sm text-ink-700">
      <li v-for="exercise in exercises" :key="exercise.name" class="flex items-center justify-between">
        <span>{{ exercise.name }}</span>
        <span class="text-xs font-semibold" :class="exercise.status === 'Concluido' ? 'text-brand-600' : 'text-ink-500'">
          {{ exercise.status }}
        </span>
      </li>
    </ul>
  </article>
</template>
