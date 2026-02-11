<template>
    <div class="space-y-8">
        <section class="grid gap-4 lg:grid-cols-3">
            <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
        </section>

        <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Tarefas diarias</h3>
                    <span class="chip">3 pendentes</span>
                </div>
                <div class="space-y-3">
                    <TaskCard v-for="task in tasks" :key="task.title" v-bind="task" />
                </div>
            </div>

            <div class="panel flex flex-col gap-4 p-5">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">

                        <!-- Warning Status Lottie -->
                        <div class="w-10 h-10">
                            <BaseLottie :animation-data="warningStatus" :loop="true" :autoplay="true"
                                class="w-12 h-12" />
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">Resumo rapido</h3>
                            <p class="text-xs text-ink-500">
                                Seu ritmo esta subindo hoje.
                            </p>
                        </div>

                    </div>
                </div>

                <div class="space-y-4">
                    <div v-for="item in highlights" :key="item.label" class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-semibold">{{ item.label }}</p>
                            <p class="text-xs text-ink-500">{{ item.helper }}</p>
                        </div>
                        <span class="text-lg font-semibold">{{ item.value }}</span>
                    </div>
                </div>
                <div class="panel mt-2 flex flex-col gap-2 bg-red-50 p-4">
                    <p class="text-sm font-semibold">Desafio semanal</p>
                    <p class="text-xs text-ink-500">Estilizar carrossel central usando classes e IDs.</p>
                    <button class="btn-primary mt-2 h-9 px-4 text-xs">Ver briefing</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import BaseLottie from '@/components/BaseLottie.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import warningStatus from '@/assets/lottie/Warning Status.json'

const stats = [
    { label: 'Pontuacao semanal', value: '1.240', helper: 'Top 8% da turma' },
    { label: 'Fase atual', value: 'Semana 3/6', helper: 'Modulo Front-end' },
    { label: 'Desafio semanal', value: 'Liberado', helper: 'Entrega ate sexta' },
]

const tasks = [
    { title: 'Revisar classes CSS', due: 'Hoje, 18:00', points: '120', status: 'Em aberto' },
    { title: 'Quiz de grid layout', due: 'Amanha, 10:00', points: '80', status: 'Em aberto' },
    { title: 'Video: Flexbox aplicado', due: 'Quarta, 20:00', points: '60', status: 'Em andamento' },
]

const highlights = [
    { label: 'Ranking diario', value: '#4', helper: 'Subiu 2 posicoes hoje' },
    { label: 'Medalhas novas', value: '2', helper: 'CSS Sprint + UI Forge' },
]
</script>