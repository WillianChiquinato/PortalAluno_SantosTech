<template>
    <div class="space-y-6">
        <div class="panel flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 class="text-2xl font-semibold">Trilha do aluno</h2>
                <p class="text-sm text-ink-500">Cada fase tem de 3 a 5 exercicios + desafio semanal.</p>
            </div>
            <div class="flex flex-wrap gap-3">
                <span class="chip">Proxima liberacao: sexta</span>
                <span class="chip">Tempo da fase: 6 dias</span>
            </div>
        </div>

        <section class="grid gap-5 lg:grid-cols-2">
            <PhaseCard v-for="phase in phases" :key="phase.title" v-bind="phase" />
        </section>

        <section class="panel flex flex-col gap-3 p-6">
            <h3 class="text-lg font-semibold">Desafio final do modulo</h3>
            <p class="text-sm text-ink-500">
                Forme equipes para resolver o desafio geral do modulo, praticando tudo que foi aprendido.
            </p>
            <button class="h-10 w-fit rounded-full bg-ink-900 px-4 text-sm font-semibold text-white">Ver regras</button>
        </section>
    </div>
</template>

<script setup lang="ts">
import PhaseCard from '@/components/PhaseCard.vue'

const phases = [
    {
        title: 'Fase 3 - Layouts avancados',
        period: 'Semana 3 · Modulo Front-end',
        variant: 'primary' as const,
        exercises: [
            { name: 'Video: Grid responsivo', status: 'Concluido' },
            { name: 'Quiz de alinhamento', status: 'Em andamento' },
            { name: 'Desafio semanal', status: 'Aberto' },
        ],
    },
    {
        title: 'Lower path - Reforco de base',
        period: 'Liberado se houver erros na fase',
        variant: 'lower' as const,
        exercises: [
            { name: 'Revisao de seletores', status: 'Aberto' },
            { name: 'Pratica de box model', status: 'Aberto' },
            { name: 'Mini projeto guiado', status: 'Aberto' },
            { name: 'Questionario extra', status: 'Aberto' },
        ],
    },
]
</script>