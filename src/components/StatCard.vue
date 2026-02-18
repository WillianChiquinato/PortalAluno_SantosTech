<script setup lang="ts">
type StatStatus = 'success' | 'progress' | 'warning'

const props = withDefaults(defineProps<{
  label: string
  value: string
  helper: string
  status?: StatStatus
}>(), {
  status: 'progress',
})

const statusMap: Record<StatStatus, { label: string; classes: string }> = {
  success: {
    label: 'Otimo',
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  progress: {
    label: 'Evoluindo',
    classes: 'border-brand-200 bg-red-50 text-brand-600',
  },
  warning: {
    label: 'Atencao',
    classes: 'border-amber-200 bg-amber-50 text-amber-700',
  },
}
</script>

<template>
  <article class="panel flex flex-col gap-2 p-4">
    <div class="flex items-start justify-between gap-3">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">{{ props.label }}</p>
      <span class="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
        :class="statusMap[props.status].classes">
        {{ statusMap[props.status].label }}
      </span>
    </div>

    <h3 class="stat-value text-lg font-semibold leading-tight text-ink-900">{{ props.value }}</h3>
    <p class="text-sm text-ink-500">{{ props.helper }}</p>
  </article>
</template>

<style scoped>
.stat-value {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
