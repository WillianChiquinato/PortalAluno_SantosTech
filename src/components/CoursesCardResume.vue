<template>
    <article class="rounded-2xl border border-red-100 bg-white/95 p-4">
        <div class="flex items-start justify-between gap-2">
            <p class="text-xs uppercase tracking-wide text-ink-500">Turmas premium</p>
            <span class="chip">{{ formattedPrice }}</span>
        </div>

        <p class="mt-1 text-base font-semibold leading-tight">{{ course.name }}</p>
        <p class="mt-2 text-xs text-ink-500 line-clamp-2">{{ course.description }}</p>

        <div class="mt-3 grid gap-1 text-xs text-ink-700">
            <p><span class="font-semibold">Nível:</span> {{ course.levelDifficulty }}</p>
            <p><span class="font-semibold">Carga:</span> {{ course.duration }} Horas</p>
        </div>
    </article>
</template>

<script setup lang="ts">
import type { ICourseAvailable } from '~/infra/interfaces/services/course'

const props = defineProps<{
    course: ICourseAvailable
}>()

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(props.course.price)
})
</script>