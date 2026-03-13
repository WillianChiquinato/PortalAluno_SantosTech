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

                        <div class="grid gap-2 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
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

                        <template v-if="hasIslands">
                            <article v-for="(island, islandIndex) in islands" :key="island.id"
                                class="relative panel p-4 sm:p-5" :class="[
                                    islandIndex % 2 === 0 ? 'lg:mr-24' : 'lg:ml-24',
                                    islandCardClass(island.status),
                                ]">
                                <div v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'"
                                    class="pointer-events-none absolute inset-0 rounded-2xl border border-slate-200/80 bg-slate-100/45 backdrop-blur-[1px]">
                                </div>

                                <div v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'"
                                    class="absolute right-4 top-4 z-20">
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
                                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Ilha
                                            {{
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

                                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p class="text-xs"
                                        :class="island.status === 'Não Iniciado' ? 'text-ink-700 font-medium' : 'text-ink-500'">
                                        {{ islandContainerCount(island) }} container(es) • {{
                                            islandExerciseCount(island) }} exercício(s) nesta ilha
                                    </p>

                                    <button class="h-10 px-5 text-ink-900"
                                        :class="island.status === 'Não Iniciado' || island.status === 'Desconhecido'
                                            ? 'btn-outline cursor-not-allowed !border-slate-300 !bg-slate-100 !text-ink-500'
                                            : island.status === 'Concluído' ? 'btn-primary cursor-pointer' : 'btn-primary cursor-pointer'"
                                        :disabled="island.status === 'Não Iniciado' || island.status === 'Desconhecido'"
                                        @click="enterIsland(island)">
                                        {{ island.status === 'Não Iniciado' || island.status === 'Desconhecido' ? 'Ilha bloqueada' : island.status ===
                                        'Concluído' ? 'Revisar ilha' : 'Entrar na ilha' }}
                                    </button>
                                </div>

                                <p v-if="island.status === 'Não Iniciado' || island.status === 'Desconhecido'"
                                    class="mt-3 text-xs text-ink-700">
                                    Conclua a ilha anterior para desbloquear este conteúdo.
                                </p>
                            </article>
                        </template>
                        <article v-else class="panel border-slate-200 bg-slate-50/70 p-5 text-center">
                            <p class="text-base font-semibold text-ink-700">Nenhuma ilha disponível</p>
                            <p class="mt-1 text-sm text-ink-500">Assim que novas ilhas forem liberadas, elas aparecerão
                                aqui.</p>
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
                                @click="leaveIsland">Voltar para
                                ilhas</button>
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
                        class="relative mx-auto mt-2 max-w-xl rounded-2xl border border-red-100/80 bg-accent-300 p-4 sm:p-5 lg:max-w-5xl lg:px-10 lg:py-8">
                        <div
                            class="pointer-events-none absolute bottom-8 left-1/2 top-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-brand-600 via-brand-500/80 to-brand-300/60 lg:hidden">
                        </div>

                        <div class="space-y-6 sm:space-y-7 lg:space-y-0">
                            <div v-for="(blip, blipIndex) in activeIslandBlips" :key="blip.containerExercise.id"
                                class="relative"
                                :class="[blipRowClass(blipIndex), activeBlipId === blip.containerExercise.id ? 'z-40' : 'z-10']">
                                <div v-if="blipIndex < activeIslandBlips.length - 1"
                                    class="pointer-events-none absolute hidden lg:block border-t-[5px] border-dashed border-brand-500/75"
                                    :style="blipConnectorStyle(blipIndex)">
                                </div>

                                <div class="flex w-1/2" :class="blipNodeContainerClass(blipIndex)"
                                    :style="blipNodeStyle(blipIndex)">
                                    <div class="relative flex flex-col items-center gap-2"
                                        :class="activeBlipId === blip.containerExercise.id ? 'z-[60]' : 'z-[60]'">
                                        <button
                                            :class="['relative inline-flex items-center justify-center rounded-full border-2 text-lg font-semibold transition duration-200', containerHasPracticalExercise(blip) ? 'h-20 w-22 sm:h-26 sm:w-28' : 'h-16 w-18', blipClass(blip.stateContainer)]"
                                            :disabled="blip.stateContainer === 'Não iniciado'"
                                            @click="toggleBlip(blip.containerExercise.id)">
                                            <span
                                                :class="['relative z-100', containerHasPracticalExercise(blip) ? 'text-4xl' : 'text-xl']">
                                                {{ blipIcon(blip.stateContainer) }}
                                            </span>
                                        </button>

                                        <BlipPopover :show="activeBlipId === blip.containerExercise.id"
                                            :type-exercise="containerPrimaryExerciseType(blip)">
                                            <h4 class="font-bold mb-1">
                                                {{ blip.containerExercise.title }} • {{
                                                    blipStateLabel(blip.stateContainer) }}
                                            </h4>

                                            <p class="text-sm opacity-90 mb-4">
                                                {{ blip.containerExercise.exercises.length }} exercício(s) disponíveis
                                                neste container.
                                            </p>

                                            <div class="flex flex-col justify-center gap-2">
                                                <button v-for="exerciseFlow in sortedContainerExercises(blip)"
                                                    :key="exerciseFlow.exercise.id" :class="[
                                                        'w-full rounded-xl border px-3 py-3 text-left transition-all',
                                                        canStartExercise(exerciseFlow)
                                                            ? 'cursor-pointer border-red-100/80 bg-loading hover:bg-success-200/20 hover:text-loading hover:border-white hover:scale-[1.02]'
                                                            : 'cursor-not-allowed border-slate-200 bg-slate-100/90 opacity-80'
                                                    ]" :disabled="!canStartExercise(exerciseFlow)"
                                                    @click="enterExercise(blip, exerciseFlow)">
                                                    <div class="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p class="text-sm font-bold text-ink-900">
                                                                {{ exerciseFlow.exercise.title }}
                                                            </p>
                                                            <p class="mt-1 text-xs text-ink-500">
                                                                {{ exerciseActionLabel(exerciseFlow) }}
                                                            </p>
                                                        </div>
                                                        <span class="chip" :class="exerciseStatusClass(exerciseFlow)">
                                                            {{ exerciseStatusLabel(exerciseFlow) }}
                                                        </span>
                                                    </div>
                                                </button>

                                                <button
                                                    class="w-full text-sm sm:text-base rounded-xl bg-loading py-1 font-bold text-success-600 cursor-pointer border border-transparent hover:bg-success-200/20 hover:text-loading hover:border-white hover:scale-105 transition-all"
                                                    @click="toggleBlip(blip.containerExercise.id)">
                                                    Voltar para detalhes
                                                </button>
                                            </div>
                                        </BlipPopover>

                                        <div class="max-w-36 text-center">
                                            <p
                                                :class="['font-bold text-ink-700', containerHasPracticalExercise(blip) ? 'text-sm sm:text-dm' : 'text-sm']">
                                                {{ blip.containerExercise.title }}
                                            </p>
                                            <p class="mt-1 text-[11px] font-medium text-ink-500">
                                                {{ blip.containerExercise.exercises.length }} exercício(s)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-100 bg-white lg:hidden">
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

    <ExercisesCard :visible="showTaskQuizModal" :task="selectedTask" :daily-task="selectedDailyTask"
        :exercises="availableExercises" :loading="quizLoading" :questions="quizQuestions"
        :selected-answers="selectedAnswers" :selected-code-answers="selectedCodeAnswers"
        :current-question-index="currentQuestionIndex" :quiz-result="taskResult" @close="closeTaskQuiz"
        @start-quiz="startExerciseQuiz" @select-answer="selectAnswer($event.questionId, $event.optionIndex)"
        @update-code-answer="updateCodeAnswer($event.questionId, $event.answer)" @back-to-exercises="backToExercises"
        @back-to-exercises-and-refresh="backToExercisesAndRefresh" @finish-quiz="finishExercise" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExercisesCard from '~/components/ExercisesCard.vue';
import BlipPopover from '~/components/UI/BlipPopover.vue'
import type { BlipContainer, BlipStatus, BlipStatusExercise, ContainerExerciseFlow, IslandApi, IslandStatus } from '~/infra/interfaces/services/class'
import { buildTaskQuestions, buildTaskQuestionsFromOptions, type ExerciseQuestionSource, type QuizQuestion } from '~/utils/taskQuestionBank'
import type { ExerciseCardTask, IQuizQuestionOption, ISubmitExerciseAnswer } from '~/infra/interfaces/services/exercise'
import { formatDate } from '~/utils/Format'
import { getLoggedUser } from '~/composables/useAuth'
import { useUserStore } from '~/infra/store/userStore'

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore()

type DailyTaskSummary = {
    id: number | string
    title: string
    due: string
    points: string
    status: string
    description: string
}

const showTaskQuizModal = ref(false)
const selectedDailyTask = ref<DailyTaskSummary | null>(null)
const selectedTask = ref<ExerciseCardTask | null>(null)
const quizLoading = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const selectedAnswers = ref<Record<number, number | null>>({})
const selectedCodeAnswers = ref<Record<number, string>>({})
const currentQuestionIndex = ref(0)
const taskResult = ref<{ correct: number; total: number; accuracy: number; gainedPoints: number } | null>(null)

const activeBlipId = ref<number | null>(null)

function toggleBlip(id: number) {
    const blip = islands.value.flatMap(island => island.blips).find(blip => blip.containerExercise.id === id);
    if (!blip || blip.stateContainer === 'Não iniciado') return;

    activeBlipId.value =
        activeBlipId.value === id ? null : id
}

function closeBlipOverlay() {
    activeBlipId.value = null
}

function enterExercise(container: BlipContainer, exerciseFlow: ContainerExerciseFlow) {
    closeBlipOverlay()

    if (!selectedIsland.value || !canStartExercise(exerciseFlow)) {
        return
    }

    selectedDailyTask.value = buildContainerSummary(container)
    const mappedTask = mapExerciseToTaskCard(exerciseFlow)
    selectedTask.value = mappedTask
    showTaskQuizModal.value = true

    startExerciseQuiz(mappedTask)
}

const islands = ref<IslandApi[]>([]);
const selectedIslandId = ref<number | null>(null)

const selectedIsland = computed(() => {
    if (!selectedIslandId.value) return null
    return islands.value.find((island) => island.id === selectedIslandId.value) ?? null
})

const selectedContainer = computed(() => {
    if (!selectedIsland.value || !activeBlipId.value) return null
    return activeIslandBlips.value.find((blip) => blip.containerExercise.id === activeBlipId.value) ?? null
})

const hasIslands = computed(() => islands.value.length > 0)

const totalBlips = computed(() => islands.value.reduce((acc, island) => acc + island.blips.length, 0))

const completedBlips = computed(() => islands.value.reduce((acc, island) => {
    return acc + island.blips.filter((blip) => blip.stateContainer === 'Concluído').length
}, 0))

const failedBlips = computed(() => islands.value.reduce((acc, island) => {
    return acc + island.blips.reduce((containerAcc, blip) => {
        return containerAcc + blip.containerExercise.exercises.filter((exerciseFlow) => exerciseFlow.stateExercise === 'Errou').length
    }, 0)
}, 0))

const completedIslands = computed(() => islands.value.filter((island) => island.status === 'Concluído').length)

const completionRate = computed(() => {
    if (totalBlips.value === 0) return 0
    return Math.round((completedBlips.value / totalBlips.value) * 100)
})

const LOWER_EXTRA_RATIO = 0.3
const BLIP_CURVE_AMPLITUDE = 125
const BLIP_CURVE_PHASE_STEP = 0.9
const BLIP_MAX_SAFE_OFFSET = 105
const BLIP_DESKTOP_ROW_HEIGHT = 168
const BLIP_CONNECTOR_START_Y = 34

const activeIslandBlips = computed<BlipContainer[]>(() => {
    if (!selectedIsland.value) return []

    const baseBlips = selectedIsland.value.blips
    if (selectedIsland.value.lowerState <= 0) return baseBlips

    return [...baseBlips]
})

const availableExercises = computed<ExerciseCardTask[]>(() => {
    if (!selectedContainer.value) return []

    return sortedContainerExercises(selectedContainer.value)
        .map((exerciseFlow) => mapExerciseToTaskCard(exerciseFlow))
})

function sortedContainerExercises(container: BlipContainer) {
    return [...container.containerExercise.exercises].sort((firstExercise, secondExercise) => {
        return firstExercise.userContainerExerciseFlowId - secondExercise.userContainerExerciseFlowId
    })
}

function containerPrimaryExerciseType(container: BlipContainer) {
    if (container.containerExercise.exercises.some((exerciseFlow) => exerciseFlow.exercise.typeExercise === 3)) {
        return 3
    }

    return container.containerExercise.exercises[0]?.exercise.typeExercise ?? 1
}

function containerHasPracticalExercise(container: BlipContainer) {
    return container.containerExercise.exercises.some((exerciseFlow) => exerciseFlow.exercise.typeExercise === 3)
}

function islandExerciseCount(island: IslandApi) {
    return island.blips.reduce((accumulator, currentBlip) => {
        return accumulator + currentBlip.containerExercise.exercises.length
    }, 0)
}

function islandContainerCount(island: IslandApi) {
    return island.blips.length
}

function mapExerciseToTaskCard(exerciseFlow: ContainerExerciseFlow): ExerciseCardTask {
    const { exercise } = exerciseFlow
    const termAt = new Date(exercise.termAt).toISOString()

    return {
        id: exercise.id,
        title: exercise.title,
        due: formatDate(termAt, 'pt-BR', { dateStyle: 'short' }),
        points: String(exercise.pointsRedeem),
        status: exercise.isCompletedAnswer || exerciseFlow.stateExercise === 'Correto'
            ? 'Concluída'
            : exerciseFlow.stateExercise === 'Errou'
                ? 'Tentar denovo'
                : exerciseFlow.stateExercise === 'Atual'
                    ? 'Disponível'
                    : 'Bloqueada',
        description: exercise.description,
        termAt,
        source: {
            id: exercise.id,
            title: exercise.title,
            description: exercise.description,
            videoUrl: exercise.videoUrl,
            pointsRedeem: exercise.pointsRedeem,
            typeExercise: exercise.typeExercise,
            difficulty: exercise.difficulty,
        },
        isCompletedAnswer: exercise.isCompletedAnswer,
    }
}

function buildContainerSummary(container: BlipContainer): DailyTaskSummary {
    const sortedExercises = sortedContainerExercises(container)
    const nearestTermAt = sortedExercises.length
        ? sortedExercises.reduce((nearestDate, currentExercise) => {
            const currentDate = new Date(currentExercise.exercise.termAt).getTime()
            return currentDate < nearestDate ? currentDate : nearestDate
        }, new Date(sortedExercises[0].exercise.termAt).getTime())
        : Date.now()

    const totalPoints = container.containerExercise.exercises.reduce((accumulator, currentExercise) => {
        return accumulator + currentExercise.exercise.pointsRedeem
    }, 0)

    return {
        id: container.containerExercise.id,
        title: container.containerExercise.title,
        due: formatDate(new Date(nearestTermAt).toISOString(), 'pt-BR', { dateStyle: 'short' }),
        points: String(totalPoints),
        status: blipStateLabel(container.stateContainer),
        description: `${container.containerExercise.exercises.length} exercício(s) disponíveis neste container.`,
    }
}

function canStartExercise(exerciseFlow: ContainerExerciseFlow) {
    return exerciseFlow.stateExercise !== 'Não iniciado'
}

function exerciseStatusLabel(exerciseFlow: ContainerExerciseFlow) {
    if (exerciseFlow.exercise.isCompletedAnswer || exerciseFlow.stateExercise === 'Correto' || exerciseFlow.stateExercise === 'Errou') {
        return 'Tentar denovo'
    }

    if (exerciseFlow.stateExercise === 'Atual') {
        return exerciseFlow.exercise.typeExercise === 3 ? 'Prova prática' : 'Disponível'
    }

    if (exerciseFlow.stateExercise == 'Não iniciado') {
        return 'Bloqueada'
    }

    return 'Tentar denovo'
}

function exerciseStatusClass(exerciseFlow: ContainerExerciseFlow) {
    if (exerciseFlow.exercise.isCompletedAnswer || exerciseFlow.stateExercise === 'Correto') {
        return '!border-brand-200 !bg-red-50 !text-brand-600'
    }

    if (exerciseFlow.stateExercise === 'Errou') {
        return '!border-red-200 !bg-red-50 !text-brand-600'
    }

    if (exerciseFlow.stateExercise === 'Atual') {
        return '!border-ink-900 !text-ink-900'
    }

    return '!border-slate-200 !bg-slate-50 !text-ink-500'
}

function exerciseActionLabel(exerciseFlow: ContainerExerciseFlow) {
    if (exerciseFlow.exercise.isCompletedAnswer || exerciseFlow.stateExercise === 'Correto' || exerciseFlow.stateExercise === 'Errou') {
        return 'Refazer exercício'
    }

    if (exerciseFlow.stateExercise === 'Atual') {
        return 'Iniciar exercício'
    }

    return exerciseFlow.exercise.typeExercise === 3
        ? `Realizar prova prática • +${exerciseFlow.exercise.pointsRedeem} pts`
        : `Missão disponível • +${exerciseFlow.exercise.pointsRedeem} pts`
}

function resetQuizState() {
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}

    for (const question of quizQuestions.value) {
        selectedAnswers.value[question.id] = null

        if (question.typeExercise === 2) {
            selectedCodeAnswers.value[question.id] = ''
        }
    }

    taskResult.value = null
}

function getUserIdFromSession(): number | null {
    if (userData.userId && userData.userId > 0) {
        return userData.userId
    }

    const loggedUser = getLoggedUser()
    const recoveredUserId = Number(loggedUser?.id)

    if (!Number.isFinite(recoveredUserId) || recoveredUserId <= 0) {
        return null
    }

    userData.setUserId(recoveredUserId)
    return recoveredUserId
}

async function startExerciseQuiz(task: ExerciseCardTask) {
    if (task.isCompletedAnswer) {
        return
    }

    selectedTask.value = task
    quizLoading.value = true

    try {
        const response = await $httpClient.exercise.GetQuizQuestionsForExercise(Number(task.id))
        const options = (response.result ?? []) as IQuizQuestionOption[]

        if (response.success && options.length) {
            quizQuestions.value = buildTaskQuestionsFromOptions(task.source, options)
        } else {
            quizQuestions.value = buildTaskQuestions(task.source)
        }

        resetQuizState()
    } catch (error) {
        console.error('Erro ao carregar questões do exercício da ilha:', error)
        toast.error('Erro', 'Não foi possível carregar as questões deste exercício.', 3500)
        quizQuestions.value = buildTaskQuestions(task.source)
        resetQuizState()
    } finally {
        quizLoading.value = false
    }
}

function closeTaskQuiz() {
    showTaskQuizModal.value = false
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null
}

function backToExercises() {
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null

    showTaskQuizModal.value = false
}

async function backToExercisesAndRefresh() {
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null

    showTaskQuizModal.value = false
    await fetchIslandByUserAndCurrentModule()
}

function selectAnswer(questionId: number, optionIndex: number) {
    selectedAnswers.value[questionId] = optionIndex
}

function updateCodeAnswer(questionId: number, answer: string) {
    selectedCodeAnswers.value[questionId] = answer
}

function resolveContainerState(container: BlipContainer): BlipStatus {
    const states = container.containerExercise.exercises.map((exerciseFlow) => exerciseFlow.stateExercise)

    if (!states.length) {
        return 'Não iniciado'
    }

    if (states.every((state) => state === 'Correto')) {
        return 'Concluído'
    }

    if (states.some((state) => state === 'Atual')) {
        return 'Atual'
    }

    if (states.every((state) => state === 'Não iniciado')) {
        return 'Não iniciado'
    }

    return 'Atual'
}

function updateIslandProgressLocally(island: IslandApi) {
    if (!island.blips.length) {
        island.progress = 0
        island.status = 'Não Iniciado'
        return
    }

    island.blips.forEach((blip) => {
        blip.stateContainer = resolveContainerState(blip)
    })

    const completedCount = island.blips.filter((blip) => blip.stateContainer === 'Concluído').length
    island.progress = Math.round((completedCount / island.blips.length) * 100)

    if (completedCount === island.blips.length) {
        island.status = 'Concluído'
    } else if (island.blips.some((blip) => blip.stateContainer !== 'Não iniciado')) {
        island.status = 'Em Progresso'
    } else {
        island.status = 'Não Iniciado'
    }
}

function markExerciseResultLocally(exerciseId: number, nextState: BlipStatusExercise) {
    for (const island of islands.value) {
        for (const container of island.blips) {
            const foundExercise = container.containerExercise.exercises.find((exerciseFlow) => exerciseFlow.exercise.id === exerciseId)

            if (!foundExercise) {
                continue
            }

            foundExercise.exercise.isCompletedAnswer = true
            foundExercise.stateExercise = nextState
            updateIslandProgressLocally(island)
            return
        }
    }

    if (selectedTask.value && Number(selectedTask.value.id) === exerciseId) {
        selectedTask.value.isCompletedAnswer = true
        selectedTask.value.status = nextState === 'Correto' ? 'Concluída' : 'Tentar denovo'
    }
}

function findExerciseFlowMetadata(exerciseId: number): {
    phaseId: number
    userExerciseFlowId: number
    userContainerExerciseFlowId?: number
} | null {
    for (const island of islands.value) {
        for (const container of island.blips) {
            const foundExercise = container.containerExercise.exercises.find((exerciseFlow) => exerciseFlow.exercise.id === exerciseId)

            if (!foundExercise) {
                continue
            }

            return {
                phaseId: container.phaseId,
                userExerciseFlowId: foundExercise.userContainerExerciseFlowId,
                userContainerExerciseFlowId: foundExercise.userContainerExerciseFlowId,
            }
        }
    }

    return null
}

async function finishExercise() {
    if (!selectedTask.value) {
        return
    }

    const userId = getUserIdFromSession()

    if (!userId) {
        toast.error('Sessão inválida', 'Faça login novamente para enviar o exercício.', 3500)
        return
    }

    const objectiveQuestions = quizQuestions.value.filter((question) => question.typeExercise !== 2)
    const hasDissertativeQuestion = quizQuestions.value.some((question) => question.typeExercise === 2)

    const correctAnswers = objectiveQuestions.reduce((accumulator, question) => {
        return accumulator + (selectedAnswers.value[question.id] === question.correctOptionIndex ? 1 : 0)
    }, 0)

    const totalObjectiveQuestions = objectiveQuestions.length
    const accuracy = totalObjectiveQuestions > 0 ? Math.round((correctAnswers / totalObjectiveQuestions) * 100) : 100
    const gainedPoints = Math.round((selectedTask.value.source.pointsRedeem * accuracy) / 100)

    taskResult.value = {
        correct: correctAnswers,
        total: totalObjectiveQuestions,
        accuracy,
        gainedPoints,
    }

    const selectedExerciseId = Number(selectedTask.value.id)
    const exerciseFlow = findExerciseFlowMetadata(selectedExerciseId)

    const payloadSubmitExercise: ISubmitExerciseAnswer[] = quizQuestions.value.map((question) => ({
        exerciseId: selectedTask.value!.source.id,
        userId,
        questionId: question.id,
        phaseId: exerciseFlow?.phaseId ?? 0,
        userExerciseFlowId: exerciseFlow?.userExerciseFlowId ?? exerciseFlow?.userContainerExerciseFlowId ?? 0,
        submissionData: {
            selectedOption: question.typeExercise === 2 ? -1 : (selectedAnswers.value[question.id] ?? -1),
            answerText: question.typeExercise === 2 ? (selectedCodeAnswers.value[question.id] ?? '').trim() : undefined,
            isCorrect: question.typeExercise === 2
                ? false
                : selectedAnswers.value[question.id] === question.correctOptionIndex,
            pointsEarned: question.typeExercise === 2
                ? 0
                : (selectedAnswers.value[question.id] === question.correctOptionIndex ? gainedPoints : 0),
            submittedAt: new Date(),
        },
    }))

    try {
        var verifyAnswersExisting = await $httpClient.exercise.VerifyExistingAnswers(selectedTask.value.id, userId ?? 0);

        const submitResponse = await $httpClient.exercise.SubmitExerciseAnswers(payloadSubmitExercise)

        if (submitResponse.success) {
            toast.success('Exercício enviado', 'Sua resposta foi registrada com sucesso.', 3000)
        }

        if (!verifyAnswersExisting.result.existingAnswers) {
            if (payloadSubmitExercise[0]?.submissionData.selectedOption !== -1) {
                var payloadUserPoints = {
                    userId: userId ?? 0,
                    pointsToAdd: gainedPoints,
                    exerciseDate: selectedTask.value.termAt,
                }

                var pointsResponse = await $httpClient.point.AddPointsForUser(payloadUserPoints)
                if (pointsResponse.success) {
                    toast.success('Parabens!', `Você ganhou ${gainedPoints} pontos com este exercício.`, 3500);
                }
            }
        }
    } catch (error) {
        console.error('Erro ao enviar respostas do exercício da ilha:', error)
        toast.error('Erro', 'Não foi possível enviar as respostas do exercício.', 3500)
    } finally {
        const nextState: BlipStatusExercise = hasDissertativeQuestion || accuracy === 100 ? 'Correto' : 'Errou'
        markExerciseResultLocally(Number(selectedTask.value.id), nextState)
    }
}

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
    if (status === 'Concluído') return 'Concluído'
    if (status === 'Atual') return 'Disponível'
    return 'Bloqueado'
}

function blipIcon(status: BlipStatus) {
    if (status === 'Concluído') return '✓'
    if (status === 'Atual') return '▶'
    return '🔒'
}

function blipClass(status: BlipStatus) {
    if (status === 'Concluído') {
        return 'cursor-pointer border-brand-500 bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_10px_0_0_rgba(185,28,28,0.85)] hover:-translate-y-0.5 hover:shadow-[0_12px_0_0_rgba(185,28,28,0.8)]'
    }

    if (status === 'Atual') {
        return 'cursor-pointer border-brand-200 bg-gradient-to-b from-accent-500 to-brand-500 text-ink-900 shadow-[0_10px_0_0_rgba(239,68,68,0.65)] hover:-translate-y-1 hover:shadow-[0_13px_0_0_rgba(239,68,68,0.55)]'
    }

    return 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500 shadow-[0_8px_0_0_rgba(203,213,225,0.85)]'
}

function blipLabelClass(status: BlipStatus) {
    if (status === 'Concluído') return 'text-brand-600'
    if (status === 'Atual') return 'text-ink-900'
    return 'text-ink-500'
}

function blipRowClass(index: number) {
    return `${index % 2 === 0 ? 'flex justify-start' : 'flex justify-end'} lg:flex lg:justify-center lg:items-start lg:min-h-[168px]`
}

function blipNodeContainerClass(index: number) {
    return `${index % 2 === 0 ? 'justify-end pr-3 sm:pr-5' : 'justify-start pl-3 sm:pl-5'} lg:w-full lg:justify-center lg:pr-0 lg:pl-0 lg:translate-x-[var(--blip-offset)]`
}

function blipOffset(index: number) {
    const rawOffset = Math.sin(index * BLIP_CURVE_PHASE_STEP) * BLIP_CURVE_AMPLITUDE
    return Math.max(-BLIP_MAX_SAFE_OFFSET, Math.min(BLIP_MAX_SAFE_OFFSET, rawOffset))
}

function blipNodeStyle(index: number) {
    const offset = blipOffset(index)

    return {
        '--blip-offset': `${offset.toFixed(0)}px`
    }
}

function blipConnectorStyle(index: number) {
    const currentOffset = blipOffset(index)
    const nextOffset = blipOffset(index + 1)
    const deltaX = nextOffset - currentOffset
    const deltaY = BLIP_DESKTOP_ROW_HEIGHT
    const length = Math.sqrt((deltaX ** 2) + (deltaY ** 2))
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

    return {
        left: `calc(50% + ${currentOffset.toFixed(0)}px)`,
        top: `${BLIP_CONNECTOR_START_Y}px`,
        width: `${length.toFixed(1)}px`,
        transform: `rotate(${angle.toFixed(2)}deg)`,
        transformOrigin: 'left center',
    }
}

function lowerExtraCount(island: IslandApi) {
    return Math.max(1, Math.ceil(islandExerciseCount(island) * LOWER_EXTRA_RATIO))
}

function enterIsland(island: IslandApi) {
    if (island.status === 'Não Iniciado' || island.status === 'Desconhecido') return
    activeBlipId.value = null
    selectedIslandId.value = island.id
}

function leaveIsland() {
    activeBlipId.value = null
    selectedIslandId.value = null
}

async function fetchIslandByUserAndCurrentModule() {
    loadingPush();

    try {
        const userId = getUserIdFromSession()

        if (!userId) {
            return
        }

        const responsePhase = await $httpClient.phase.GetCurrentModulePhaseUser(userId);

        if (responsePhase.result != null) {
            await fetchCurrentModuleIslands(userId, responsePhase.result.id);
        }
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

        if (response.success) {
            islands.value = (response.result ?? []) as IslandApi[];
            activeBlipId.value = null
            toast.success('Progresso carregado', 'As ilhas do módulo atual foram carregadas com sucesso.', 3000)
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
