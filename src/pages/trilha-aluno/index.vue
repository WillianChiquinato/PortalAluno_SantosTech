<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Progresso</p>
                        <h2 class="text-2xl font-semibold text-white">Trilha do aluno</h2>
                        <p class="mt-1 text-sm text-white/80">Mapa da jornada com ilhas por fase e blips de exercícios.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <span
                            class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            Ilhas concluídas: {{ completedIslands }}/{{ islands.length }}
                        </span>
                        <span
                            class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            Blips concluídos: {{ completedBlips }}/{{ totalBlips }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel relative overflow-hidden p-4 sm:p-6">
            <div
                class="pointer-events-none absolute inset-x-10 top-10 bottom-10 hidden border-l-2 border-dashed border-red-200 lg:block">
            </div>

            <div class="space-y-4">
                <article v-for="(island, islandIndex) in islands" :key="island.id" class="relative panel p-4" :class="[
                    islandIndex % 2 === 0 ? 'lg:mr-24' : 'lg:ml-24',
                    island.status === 'locked' ? 'opacity-75' : '',
                ]">
                    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Ilha {{
                                island.order }}</p>
                            <h3 class="text-lg font-semibold">{{ island.title }}</h3>
                            <p class="text-xs text-ink-500">{{ island.helper }}</p>
                        </div>

                        <span class="chip" :class="[
                            island.status === 'completed' ? '!border-brand-200 !bg-red-50 !text-brand-600' : '',
                            island.status === 'current' ? '!border-ink-900 !text-ink-900' : '',
                        ]">
                            {{ island.status === 'completed' ? 'Concluída' : island.status === 'current' ? 'Atual' :
                                'Bloqueada' }}
                        </span>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button v-for="blip in island.blips" :key="blip.id"
                            class="inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-red-100 bg-white text-ink-700 shadow-sm transition"
                            :class="[
                                blip.status === 'completed' ? 'border-brand-200 bg-red-50 text-brand-600' : '',
                                blip.status === 'current' ? 'border-ink-900 text-ink-900' : '',
                                blip.status === 'locked' ? 'border-slate-200 bg-slate-50 text-ink-500 cursor-not-allowed' : '',
                            ]" :disabled="blip.status === 'locked'"
                            :aria-label="`${blip.title} - ${blip.status === 'completed' ? 'Concluído' : blip.status === 'current' ? 'Disponível' : 'Bloqueado'}`">
                            <span class="text-lg leading-none">
                                {{ blip.status === 'completed' ? '✓' : blip.status === 'current' ? '▶' : '🔒' }}
                            </span>
                        </button>
                    </div>

                    <ul class="mt-4 space-y-2 text-sm">
                        <li v-for="blip in island.blips" :key="`${island.id}-${blip.id}-label`"
                            class="flex items-center justify-between gap-3 rounded-xl border border-red-100/80 bg-white p-2">
                            <span class="text-ink-700">{{ blip.title }}</span>
                            <span class="text-xs font-semibold" :class="[
                                blip.status === 'completed' ? 'text-brand-600' : 'text-ink-500',
                            ]">{{ blip.status === 'completed' ? 'Concluído' : blip.status === 'current' ? 'Disponível'
                                : 'Bloqueado' }}</span>
                        </li>
                    </ul>
                </article>
            </div>
        </section>

        <section class="panel flex flex-col gap-3 p-6">
            <h3 class="text-lg font-semibold">Desafio final do módulo</h3>
            <p class="text-sm text-ink-500">
                Após liberar todas as ilhas do módulo, sua equipe desbloqueia o desafio mestre da trilha.
            </p>
            <button class="btn-primary h-10 w-fit px-4">Ver desafio</button>
        </section>
    </div>
</template>

<script setup lang="ts">
type BlipStatus = 'completed' | 'current' | 'locked'
type IslandStatus = 'completed' | 'current' | 'locked'

const islands: {
    id: string
    order: number
    title: string
    helper: string
    status: IslandStatus
    blips: { id: string; title: string; status: BlipStatus }[]
}[] = [
        {
            id: 'island-1',
            order: 1,
            title: 'Ilha da Base HTML',
            helper: 'Fundamentos e estrutura de páginas',
            status: 'completed',
            blips: [
                { id: 'b-1-1', title: 'Estrutura semântica', status: 'completed' },
                { id: 'b-1-2', title: 'Formulários', status: 'completed' },
                { id: 'b-1-3', title: 'Mini desafio', status: 'completed' },
            ],
        },
        {
            id: 'island-2',
            order: 2,
            title: 'Ilha do CSS Essencial',
            helper: 'Seletores, box model e posicionamento',
            status: 'current',
            blips: [
                { id: 'b-2-1', title: 'Seletores avançados', status: 'completed' },
                { id: 'b-2-2', title: 'Flexbox na prática', status: 'current' },
                { id: 'b-2-3', title: 'Quiz de layout', status: 'locked' },
                { id: 'b-2-4', title: 'Desafio semanal', status: 'locked' },
            ],
        },
        {
            id: 'island-3',
            order: 3,
            title: 'Ilha da Responsividade',
            helper: 'Grid, breakpoints e adaptação mobile',
            status: 'locked',
            blips: [
                { id: 'b-3-1', title: 'Media queries', status: 'locked' },
                { id: 'b-3-2', title: 'Grid responsivo', status: 'locked' },
                { id: 'b-3-3', title: 'Projeto final da ilha', status: 'locked' },
            ],
        },
    ]

const totalBlips = computed(() => islands.reduce((acc, island) => acc + island.blips.length, 0))
const completedBlips = computed(() => islands.reduce((acc, island) => {
    return acc + island.blips.filter((blip) => blip.status === 'completed').length
}, 0))
const completedIslands = computed(() => islands.filter((island) => island.status === 'completed').length)
</script>
