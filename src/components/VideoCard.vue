<script setup lang="ts">
const props = withDefaults(defineProps<{
  id: number
  title: string
  description: string
  thumbnailUrl: string
  durationSeconds: number
  visibility: number
  createdAt: string
  progress?: number
  startAtSeconds?: number
  ctaLabel?: string
}>(), {
  progress: 0,
  startAtSeconds: 0,
  ctaLabel: 'Assistir',
})

const visibilityLabel = computed(() => {
  switch (props.visibility) {
    case 1:
      return 'Professores'
    case 2:
      return 'Alunos'
    default:
      return 'Restrito'
  }
})

const formattedDuration = computed(() => {
  const totalSeconds = Math.max(0, Number(props.durationSeconds) || 0)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const publishedAt = computed(() => {
  const date = new Date(props.createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Data indisponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
})

const progressValue = computed(() => {
  return Math.min(100, Math.max(0, Number(props.progress) || 0))
})
</script>

<template>
  <article class="panel group flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-md">
    <div class="relative aspect-video overflow-hidden border-b border-red-100/80 bg-sand-100">
      <img :src="thumbnailUrl" :alt="`Thumbnail do vídeo ${title}`"
        class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />

      <div class="absolute inset-x-0 top-0 flex items-center justify-between p-3">
        <span class="rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          {{ visibilityLabel }}
        </span>

        <span class="rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
          {{ formattedDuration }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="space-y-2">
        <h3 class="line-clamp-2 text-base font-semibold leading-snug text-ink-900">{{ title }}</h3>
        <p class="line-clamp-2 text-sm text-ink-500">{{ description }}</p>
      </div>

      <div v-if="progressValue > 0" class="space-y-1">
        <div class="flex items-center justify-between text-xs text-ink-500">
          <span>Progresso</span>
          <span class="font-semibold text-ink-700">{{ progressValue }}%</span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-sand-100">
          <div class="h-full rounded-full bg-brand-500 transition-all" :style="{ width: `${progressValue}%` }"></div>
        </div>
      </div>

      <div class="mt-auto flex items-center justify-between gap-3">
        <span class="chip !px-2.5 !py-1 !text-[11px]">{{ publishedAt }}</span>
        <NuxtLink :to="{
          path: `/videos/${id}`,
          query: startAtSeconds > 0 ? { t: String(startAtSeconds) } : {},
        }" class="btn-outline h-9 px-4 text-xs">
          {{ ctaLabel }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
