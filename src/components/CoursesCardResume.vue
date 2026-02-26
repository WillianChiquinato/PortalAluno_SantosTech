<template>
    <article class="rounded-2xl border border-red-100 bg-tag-100/95 p-4">
        <div class="flex items-start justify-between gap-2">
            <p class="text-xs uppercase tracking-wide text-black/50">Turmas premium</p>
            <span class="chip text-black bg-[#f1f5f9]/80">{{ formattedPrice }}</span>
        </div>

        <p class="mt-1 text-base font-semibold leading-tight text-black">{{ course.name }}</p>
        <p class="mt-2 text-xs text-black line-clamp-2">{{ course.description }}</p>

        <div class="mt-3 grid gap-1 text-xs text-black/80">
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