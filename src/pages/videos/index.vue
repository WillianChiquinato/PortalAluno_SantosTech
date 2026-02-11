<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-semibold">Videos de conhecimento</h2>
            <p class="text-sm text-ink-500">Conteudos extras produzidos pela Santos Games.</p>
        </div>

        <section class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <VideoCard v-for="video in videos" :key="video.title" v-bind="video" />
        </section>
    </div>
</template>

<script setup lang="ts">
import VideoCard from '@/components/VideoCard.vue'

const videos = [
    { title: 'Introducao ao CSS moderno', duration: '12 min', tags: ['CSS', 'Base'] },
    { title: 'Grid na pratica', duration: '18 min', tags: ['Grid', 'Layout'] },
    { title: 'Design systems leves', duration: '14 min', tags: ['UI', 'Componentes'] },
    { title: 'Boas praticas no HTML', duration: '9 min', tags: ['HTML', 'Semantica'] },
    { title: 'Fluxo de estudo semanal', duration: '6 min', tags: ['Planejamento'] },
    { title: 'Checklist antes do deploy', duration: '11 min', tags: ['Qualidade'] },
]
</script>