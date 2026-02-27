<template>
    <div class="space-y-6">
        <Transition enter-active-class="duration-500 ease-out transition-all"
            enter-from-class="opacity-0 -translate-y-4 blur-[2px]" enter-to-class="opacity-100 translate-y-0 blur-0"
            leave-active-class="duration-450 ease-in transition-all" leave-from-class="opacity-100 translate-y-0 blur-0"
            leave-to-class="opacity-0 -translate-y-6 blur-[3px]">
            <section v-if="!selectedIsland" class="panel overflow-hidden p-0">
                <div
                    class="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-5 py-6 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                    <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                    <div class="absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>

                    <div class="relative z-10 lg:items-center">
                        <div class="space-y-2">
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">Mapa da jornada
                            </p>
                            <h2 class="text-2xl font-semibold text-tag-100">Trilha do aluno • Arquipélago de fases</h2>
                            <p class="max-w-2xl text-sm text-tag-100/85">
                                Cada fase é uma ilha. O aluno avança por blips na trilha, ganha ritmo ao acertar e, se
                                errar, desce para o <span class="font-semibold">lowerState</span> da rota.
                            </p>
                        </div>

                        <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4">
                            <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                                <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Ilhas concluídas</p>
                                <p class="mt-1 text-xl font-semibold">{{ completedIslands }}/{{ islands.length }}</p>
                            </div>
                            <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                                <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Blips concluídos</p>
                                <p class="mt-1 text-xl font-semibold">{{ completedBlips }}/{{ totalBlips }}</p>
                            </div>
                            <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                                <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Erros recentes</p>
                                <p class="mt-1 text-xl font-semibold">{{ failedBlips }}</p>
                            </div>
                            <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                                <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Taxa de progresso</p>
                                <p class="mt-1 text-xl font-semibold">{{ completionRate }}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Transition>

        <section class="panel p-4 sm:p-6">
            <Transition mode="out-in" enter-active-class="duration-600 ease-out transition-all"
                enter-from-class="opacity-0 translate-y-10 scale-95 blur-[4px]"
                enter-to-class="opacity-100 translate-y-0 scale-100 blur-0"
                leave-active-class="duration-450 ease-in transition-all"
                leave-from-class="opacity-100 translate-y-0 scale-100 blur-0"
                leave-to-class="opacity-0 -translate-y-4 scale-[0.98] blur-[3px]">
                <div v-if="!selectedIsland" key="islands-map" class="space-y-5">
                    <div class="mb-1 flex flex-wrap items-center justify-between gap-2">
                        <h3 class="text-lg font-semibold">Mapa tático das ilhas</h3>
                        <div class="flex flex-wrap gap-2 text-xs">
                            <span class="chip !border-brand-200 !bg-red-50 !text-brand-600">Concluída</span>
                            <span class="chip !border-ink-900 !text-ink-900">Atual</span>
                            <span class="chip !border-slate-200 !bg-slate-50 !text-ink-500">Bloqueada</span>
                        </div>
                    </div>

                    <div class="relative space-y-5">
                        <div
                            class="pointer-events-none absolute inset-y-4 left-1/2 hidden -translate-x-1/2 border-l-2 border-dashed border-red-200 lg:block">
                        </div>

                        <article v-for="(island, islandIndex) in islands" :key="island.id"
                            class="relative panel p-4 sm:p-5" :class="[
                                islandIndex % 2 === 0 ? 'lg:mr-24' : 'lg:ml-24',
                                islandCardClass(island.status),
                            ]">
                            <div v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'"
                                class="pointer-events-none absolute inset-0 rounded-2xl border border-slate-200/80 bg-slate-100/45 backdrop-blur-[1px]">
                            </div>

                            <div v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'" class="absolute right-4 top-4 z-20">
                                <span
                                    class="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/90 px-3 py-1 text-[11px] font-semibold text-ink-700">
                                    <span class="leading-none">🔒</span>
                                    <span>Aguardando liberação</span>
                                </span>
                            </div>

                            <div v-if="island.status === 'Concluído'" class="absolute right-4 top-4 z-20">
                                <span
                                    class="inline-flex items-center gap-1 rounded-full border border-brand-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-brand-600">
                                    <span class="leading-none">✓</span>
                                    <span>Ilha concluída</span>
                                </span>
                            </div>

                            <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Ilha {{
                                        island.order }}</p>
                                    <h4 class="text-lg font-semibold">Ilha {{ island.title }}</h4>
                                    <p class="text-xs text-ink-500">{{ island.helper }}</p>
                                </div>

                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="chip" :class="[
                                        island.status === 'Concluído' ? '!border-brand-200 !bg-red-50 !text-brand-600' : '',
                                        island.status === 'Em Progresso' ? '!border-ink-900 !text-ink-900' : '',
                                        island.status === 'Não Iniciado' ? '!border-slate-200 !bg-slate-50 !text-ink-500' : '',
                                        island.status === 'Desconhecido' ? '!border-slate-200 !bg-slate-50 !text-ink-500' : '',
                                    ]">
                                        {{ statusLabel(island.status) }}
                                    </span>
                                    <span v-if="island.lowerState > 0"
                                        class="chip !border-red-200 !bg-red-50 !text-brand-600">
                                        lowerState {{ island.lowerState }}
                                    </span>
                                </div>
                            </div>

                            <div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-red-50">
                                <div class="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-500"
                                    :style="{ width: `${island.progress}%` }"></div>
                            </div>

                            <div class="flex items-center justify-between gap-3">
                                <p class="text-xs"
                                    :class="island.status === 'Não Iniciado' ? 'text-ink-700 font-medium' : 'text-ink-500'">
                                    {{ island.blips.length }} exercícios nesta ilha
                                </p>

                                <button class="h-10 px-4 text-ink-900"
                                    :class="island.status === 'Não Iniciado' || island.status === 'Desconhecido'
                                        ? 'btn-outline cursor-not-allowed !border-slate-300 !bg-slate-100 !text-ink-500'
                                        : island.status === 'Concluído' ? 'btn-primary cursor-pointer' : 'btn-primary cursor-pointer'"
                                    :disabled="island.status === 'Não Iniciado' || island.status === 'Desconhecido'" @click="enterIsland(island)">
                                    {{ island.status === 'Não Iniciado' || island.status === 'Desconhecido' ? 'Ilha bloqueada' : island.status ===
                                        'Concluído' ? 'Revisar ilha' : 'Entrar na ilha' }}
                                </button>
                            </div>

                            <p v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'" class="mt-3 text-xs text-ink-700">
                                Conclua a ilha anterior para desbloquear este conteúdo.
                            </p>
                        </article>
                    </div>
                </div>

                <div v-else key="selected-island" class="space-y-5">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Ilha {{
                                selectedIsland.order }}</p>
                            <h3 class="text-lg font-semibold">{{ selectedIsland.title }}</h3>
                            <p class="text-xs text-ink-500">{{ selectedIsland.helper }}</p>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="chip" :class="[
                                selectedIsland.status === 'Concluído' ? '!border-brand-200 !bg-red-50 !text-brand-600' : '',
                                selectedIsland.status === 'Em Progresso' ? '!border-ink-900 !text-ink-900' : '',
                                selectedIsland.status === 'Não Iniciado' ? '!border-slate-200 !bg-slate-50 !text-ink-500' : '',
                                selectedIsland.status === 'Desconhecido' ? '!border-slate-200 !bg-slate-50 !text-ink-500' : '',
                            ]">
                                {{ statusLabel(selectedIsland.status) }}
                            </span>
                            <span v-if="selectedIsland.lowerState > 0"
                                class="chip !border-brand-200 !bg-red-50 !text-brand-600">
                                Lower fixa • +30%
                            </span>
                            <button class="bg-red-50 text-ink-900 btn-outline h-10 px-4 cursor-pointer"
                                @click="leaveIsland">Voltar para ilhas</button>
                        </div>
                    </div>

                    <div v-if="selectedIsland.lowerState > 0" class="panel border-brand-200 bg-red-50/70 p-4">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Rota lower
                                    ativa</p>
                                <p class="mt-1 text-sm font-semibold text-ink-900">
                                    Você caiu na lowerState {{ selectedIsland.lowerState }} e permanece nela até
                                    concluir a fase.
                                </p>
                                <p class="mt-1 text-xs text-ink-700">
                                    A trilha principal fica bloqueada temporariamente e a fase recebe +30% de
                                    exercícios.
                                </p>
                            </div>

                            <div class="chip !border-brand-200 !bg-white !text-brand-600">
                                {{ lowerExtraCount(selectedIsland) }} extras
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative mx-auto mt-2 max-w-xl rounded-2xl border border-red-100/80 bg-accent-300 p-4 sm:p-5">
                        <div
                            class="pointer-events-none absolute bottom-8 left-1/2 top-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-500/80 via-brand-200/70 to-slate-300">
                        </div>

                        <div class="space-y-6 sm:space-y-7">
                            <div v-for="(blip, blipIndex) in activeIslandBlips" :key="blip.exercise.id" class="relative"
                                :class="blipRowClass(blipIndex)">
                                <div class="flex w-1/2"
                                    :class="blipIndex % 2 === 0 ? 'justify-end pr-3 sm:pr-5' : 'justify-start pl-3 sm:pl-5'">
                                    <div class="relative flex flex-col items-center gap-2">
                                        <button
                                            class="relative inline-flex h-16 w-18 items-center justify-center rounded-full border-2 text-lg font-semibold transition duration-200"
                                            :class="blipClass(blip.state)" :disabled="blip.state === 'Não iniciado'"
                                            @click="toggleBlip(blip.exercise.id)">
                                            <span class="relative z-10">
                                                {{ blipIcon(blip.state) }}
                                            </span>
                                        </button>

                                        <BlipPopover v-if="blip.state === 'Errou' || blip.state === 'Correto'"
                                            :show="activeBlipId === blip.exercise.id">
                                            <h4 class="font-bold mb-1">
                                                {{ blip.exercise.title }} • {{ blipStateLabel(blip.state) }}
                                            </h4>

                                            <button
                                                class="w-full text-sm sm:text-base rounded-xl bg-loading py-2 font-bold text-emerald-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102 transition-transform"
                                                @click="toggleBlip(blip.exercise.id)">
                                                Voltar para detalhes
                                            </button>
                                        </BlipPopover>

                                        <BlipPopover v-else :show="activeBlipId === blip.exercise.id">
                                            <h4 class="font-bold mb-1">
                                                {{ blip.exercise.title }}
                                            </h4>

                                            <p class="text-sm opacity-90 mb-4">
                                                {{ blip.exercise.description }}
                                            </p>

                                            <div class="flex flex-col gap-2">
                                                <button
                                                    class="w-full text-sm sm:text-base rounded-xl bg-loading py-2 font-bold text-emerald-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102 transition-transform"
                                                    @click="enterExercise(blip)">
                                                    Missão +{{ blip.exercise.pointsRedeem }} Pts
                                                </button>
                                                <button
                                                    class="w-full text-sm sm:text-base rounded-xl bg-loading py-1 font-bold text-emerald-600 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:scale-102 transition-transform"
                                                    @click="toggleBlip(blip.exercise.id)">
                                                    Voltar para detalhes
                                                </button>
                                            </div>
                                        </BlipPopover>

                                        <div class="max-w-28 text-center">
                                            <p class="text-xs font-semibold text-ink-700">
                                                {{ blip.exercise.title }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100 bg-white">
                                </div>
                            </div>
                        </div>
                    </div>

                    <p v-if="selectedIsland.lowerState > 0" class="text-xs font-semibold text-brand-600">
                        Alerta de rota: ao errar exercício-chave, o aluno volta para lowerState {{
                            selectedIsland.lowerState
                        }}.
                    </p>
                </div>
            </Transition>
        </section>

        <section class="panel relative overflow-hidden p-6">
            <div class="absolute inset-0 bg-slate-100/70 backdrop-blur-sm"></div>
            <div class="absolute -top-10 right-10 h-28 w-28 rounded-full bg-white/60 blur-2xl"></div>
            <div class="absolute -bottom-12 left-6 h-28 w-28 rounded-full bg-red-100/60 blur-2xl"></div>

            <div class="relative z-10 flex flex-col items-center gap-3 text-center">
                <h3 class="text-lg font-semibold">Desafio final do módulo</h3>

                <div
                    class="grid h-24 w-24 place-items-center rounded-full border-2 border-slate-300 bg-white/80 shadow-sm">
                    <span class="text-5xl leading-none">🔒</span>
                </div>

                <span class="chip !border-slate-300 !bg-white/80 !text-ink-700">Em breve</span>
            </div>

            <p class="max-w-lg text-sm text-ink-500">
                O desafio mestre está sendo preparado e será liberado em uma próxima atualização.
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import BlipPopover from '~/components/UI/BlipPopover.vue'
import type { Blip, BlipStatus, Island, IslandStatus } from '~/infra/interfaces/services/class'

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();

const showBlipOverlay = ref(false)
const selectedBlip = ref<Blip | null>(null)
const activeBlipId = ref<number | null>(null)

function toggleBlip(id: number) {
    const blip = islands.value.flatMap(island => island.blips).find(blip => blip.exercise.id === id);
    if (!blip || blip.state === 'Não iniciado') return;
    
    activeBlipId.value =
        activeBlipId.value === id ? null : id
}

function closeBlipOverlay() {
    showBlipOverlay.value = false
    selectedBlip.value = null
}

function enterExercise(blip: Blip) {
    closeBlipOverlay()
}

const islands = ref<Island[]>([]);
const selectedIslandId = ref<string | null>(null)

const selectedIsland = computed(() => {
    if (!selectedIslandId.value) return null
    return islands.value.find((island) => island.id === selectedIslandId.value) ?? null
})

const totalBlips = computed(() => islands.value.reduce((acc, island) => acc + island.blips.length, 0))

const completedBlips = computed(() => islands.value.reduce((acc, island) => {
    return acc + island.blips.filter((blip) => blip.state === 'Correto').length
}, 0))

const failedBlips = computed(() => islands.value.reduce((acc, island) => {
    return acc + island.blips.filter((blip) => blip.state === 'Errou').length
}, 0))

const completedIslands = computed(() => islands.value.filter((island) => island.status === 'Concluído').length)

const completionRate = computed(() => {
    if (totalBlips.value === 0) return 0
    return Math.round((completedBlips.value / totalBlips.value) * 100)
})

const LOWER_EXTRA_RATIO = 0.3

const activeIslandBlips = computed<Blip[]>(() => {
    if (!selectedIsland.value) return []

    const baseBlips = selectedIsland.value.blips
    if (selectedIsland.value.lowerState <= 0) return baseBlips

    return [...baseBlips]
})

function statusLabel(status: IslandStatus) {
    if (status === 'Concluído') return 'Concluída'
    if (status === 'Em Progresso') return 'Atual'
    return 'Bloqueada'
}

function islandCardClass(status: IslandStatus) {
    if (status === 'Não Iniciado') {
        return 'border-slate-200 bg-slate-50/80'
    }

    return ''
}

function blipStateLabel(status: BlipStatus) {
    if (status === 'Correto') return 'Concluído'
    if (status === 'Atual') return 'Disponível'
    if (status === 'Errou') return 'Erro • caiu lowerState'
    return 'Bloqueado'
}

function blipIcon(status: BlipStatus) {
    if (status === 'Correto') return '✓'
    if (status === 'Atual') return '▶'
    if (status === 'Errou') return '↓'
    return '🔒'
}

function blipClass(status: BlipStatus) {
    if (status === 'Correto') {
        return 'cursor-pointer border-brand-500 bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_10px_0_0_rgba(185,28,28,0.85)] hover:-translate-y-0.5 hover:shadow-[0_12px_0_0_rgba(185,28,28,0.8)]'
    }

    if (status === 'Atual') {
        return 'cursor-pointer border-brand-200 bg-gradient-to-b from-accent-500 to-brand-500 text-white shadow-[0_10px_0_0_rgba(239,68,68,0.55)] hover:-translate-y-1 hover:shadow-[0_13px_0_0_rgba(239,68,68,0.45)]'
    }

    if (status === 'Errou') {
        return 'cursor-pointer border-brand-200 bg-red-50 text-brand-600 shadow-[0_8px_0_0_rgba(254,202,202,0.95)]'
    }

    return 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500 shadow-[0_8px_0_0_rgba(203,213,225,0.85)]'
}

function blipLabelClass(status: BlipStatus) {
    if (status === 'Correto') return 'text-brand-600'
    if (status === 'Atual') return 'text-ink-900'
    if (status === 'Errou') return 'text-brand-600'
    return 'text-ink-500'
}

function blipRowClass(index: number) {
    return index % 2 === 0 ? 'flex justify-start' : 'flex justify-end'
}

function lowerExtraCount(island: Island) {
    return Math.max(1, Math.ceil(island.blips.length * LOWER_EXTRA_RATIO))
}

function enterIsland(island: Island) {
    if (island.status === 'Não Iniciado') return
    selectedIslandId.value = island.id
}

function leaveIsland() {
    selectedIslandId.value = null
}

async function fetchIslandByUserAndCurrentModule() {
    loadingPush();

    try {
        const userId = getUserIdFromSession()

        if (!userId) {
            return
        }

        const responsePhase = await $httpClient.phase.GetCurrentPhaseUser(userId);

        if (responsePhase.result != null)
        {
            await fetchCurrentModuleIslands(userId, responsePhase.result.id);
        }

        toast.success('Progresso das ilhas carregado com sucesso!');
    } catch (error) {
        console.error('Erro ao buscar progresso do aluno nas ilhas:', error);
        toast.error('Não foi possível carregar o progresso das ilhas. Tente novamente mais tarde.');
    } finally {
        loadingPop();
    }
}

async function fetchCurrentModuleIslands(userId: number, phaseId: number) {
    try {
        const response = await $httpClient.class.GetIslandsByUserIdAndCurrentModule(userId, phaseId);

        if (response.result) {
            islands.value = response.result;
        } else {
            toast.error('Não foi possível carregar as ilhas para o módulo atual.');
        }
    } catch (error) {
        console.error('Erro ao buscar ilhas do módulo atual:', error);
        toast.error('Ocorreu um erro ao carregar as ilhas. Tente novamente mais tarde.');
    }
}

onMounted(async () => {
    await fetchIslandByUserAndCurrentModule();
})
</script>
