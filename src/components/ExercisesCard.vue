<template>
    <Teleport to="body">
        <Transition name="task-quiz-fade" appear>
            <div v-if="props.visible" class="task-quiz-mask" @click.self="closeTaskQuiz">
                <div v-if="props.loading" class="panel border-brand-100/80 bg-white p-6">
                    <div class="flex items-center gap-3">
                        <i class="pi pi-spinner text-lg text-brand-500"></i>
                        <p class="text-sm text-ink-500">Carregando exercício...</p>
                    </div>
                </div>
                <div class="task-quiz-modal panel border-brand-100/80 bg-white" v-else>
                    <div class="flex items-center justify-between border-b border-brand-100/80 px-5 py-4 sm:px-6">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Exercicio de Task
                            </p>
                            <h3 class="text-md sm:text-lg font-semibold text-ink-900">{{ props.task?.title ??
                                props.dailyTask?.title }}</h3>
                        </div>

                        <button type="button" class="chip h-8 w-8 min-w-4 justify-center p-0 cursor-pointer"
                            @click="closeTaskQuiz" aria-label="Fechar modal de tarefa">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="hide-scrollbar grid flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-[2fr_1fr] sm:p-6">
                        <section class="panel border-brand-100/80 p-4 sm:p-5">
                            <template v-if="!props.task">
                                <h4 class="text-lg sm:text-xl font-semibold">Exercícios disponíveis</h4>
                                <p class="mt-2 text-sm text-ink-500">Escolha um exercício para iniciar o quiz.</p>

                                <div
                                    class="hide-scrollbar mt-4 max-h-[52vh] space-y-3 overflow-y-auto pr-1 sm:max-h-[58vh]">
                                    <button v-for="exercise in props.exercises" :key="exercise.id" type="button"
                                        class="relative w-full overflow-hidden rounded-xl border p-4 text-left transition"
                                        :class="exercise.isCompletedAnswer
                                            ? 'cursor-not-allowed border-slate-300 bg-slate-100/90 text-ink-500'
                                            : 'cursor-pointer border-brand-100/80 bg-white hover:border-brand-200 hover:bg-brand-50/40'"
                                        :disabled="exercise.isCompletedAnswer" @click="startExerciseQuiz(exercise)">
                                        <div class="flex items-center justify-between gap-2"
                                            :class="exercise.isCompletedAnswer ? 'opacity-55' : ''">
                                            <p class="text-sm font-semibold text-ink-900">{{ exercise.title }}</p>
                                            <span class="chip">{{ exercise.points }} pts</span>
                                        </div>
                                        <p class="mt-1 text-xs text-ink-500"
                                            :class="exercise.isCompletedAnswer ? 'opacity-55' : ''">Prazo: {{
                                                exercise.due }}</p>

                                        <span v-if="exercise.isCompletedAnswer"
                                            class="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-300/80 bg-white/90 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-500">
                                            Exercício concluído
                                        </span>
                                    </button>
                                </div>
                            </template>

                            <template v-else-if="!props.quizResult && currentQuestion">
                                <h4 class="mt-4 text-xl font-semibold leading-snug">{{ currentQuestion.statement }}</h4>

                                <div v-if="referenceVideoUrl"
                                    class="mt-4 rounded-xl border border-brand-100/80 bg-brand-50/30 p-3">
                                    <p class="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">Vídeo
                                        de referência</p>

                                    <div v-if="referenceVideoEmbedUrl"
                                        class="overflow-hidden rounded-lg border border-brand-100/80 bg-white">
                                        <iframe :src="referenceVideoEmbedUrl" class="referencesVideo"
                                            title="Vídeo de referência do exercício"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen></iframe>
                                    </div>

                                    <a v-else :href="referenceVideoUrl" target="_blank" rel="noopener noreferrer"
                                        class="text-sm font-medium text-brand-600 underline underline-offset-2">
                                        Abrir vídeo de referência
                                    </a>
                                </div>

                                <div v-if="props.loading" class="mt-4">
                                    <p class="text-sm text-ink-500">Carregando questões do exercício...</p>
                                </div>

                                <div v-else-if="currentQuestion.typeExercise === 2" class="mt-4 space-y-3">
                                    <p class="text-sm text-ink-500">Dica: Se quiser, faça o exercício em uma IDE, após o
                                        término, cole sua resposta no campo abaixo e envie para avaliação.</p>
                                    <CodeEditor :model-value="props.selectedCodeAnswers[currentQuestion.id] ?? ''"
                                        placeholder="Digite seu código aqui..."
                                        @update:model-value="updateCodeAnswer(currentQuestion.id, $event)" />
                                </div>

                                <div v-else class="mt-4 space-y-3">
                                    <button v-for="option in currentQuestion.options"
                                        :key="`${currentQuestion.id}-${option.id}`" type="button"
                                        class="w-full rounded-xl border px-4 py-3 text-left text-sm transition cursor-pointer"
                                        :class="props.selectedAnswers[currentQuestion.id] === option.id
                                            ? 'border-brand-500 bg-brand-50 text-brand-600'
                                            : 'border-brand-100/80 bg-white text-ink-700 hover:border-brand-200'"
                                        @click="selectAnswer(currentQuestion.id, option.id)">
                                        {{ option.label }}
                                    </button>
                                </div>

                                <div v-if="!props.loading"
                                    class="mt-6 flex flex-wrap items-center justify-between gap-2">
                                    <button type="button"
                                        class="bg-brand-50 text-ink-900 btn-outline h-9 px-4 text-xs cursor-pointer"
                                        @click="backToExercises">
                                        Voltar
                                    </button>

                                    <button type="button" class="apoio-btn cursor-pointer" @click="openApoio">
                                        🤝 Quer apoio?
                                    </button>

                                    <button type="button"
                                        class="text-ink-900 btn-primary h-9 px-4 text-xs cursor-pointer"
                                        @click="finishQuiz">
                                        Responder Exercicio
                                    </button>
                                </div>
                            </template>

                            <template v-else-if="props.quizResult">
                                <h4 class="text-xl font-semibold">Relatório do exercício</h4>

                                <div class="mt-4 rounded-2xl border px-4 py-4 sm:px-5" :class="isExerciseCorrect
                                    ? 'border-brand-200 bg-brand-50/50'
                                    : 'border-red-200 bg-red-50/30'">
                                    <div class="flex items-start gap-3">
                                        <div class="flex h-10 w-10 items-center justify-center rounded-xl border"
                                            :class="hasDissertativeQuestion
                                                ? 'border-blue-200 text-blue-600'
                                                : (isExerciseCorrect
                                                    ? 'border-brand-200 text-brand-600'
                                                    : 'border-red-200 text-red-600')">
                                            <i class="pi text-lg" :class="hasDissertativeQuestion
                                                ? 'pi-file-edit'
                                                : (isExerciseCorrect ? 'pi-check-circle' : 'pi-times-circle')"></i>
                                        </div>

                                        <div>
                                            <p class="text-base font-semibold" :class="hasDissertativeQuestion
                                                ? 'text-blue-700'
                                                : (isExerciseCorrect ? 'text-brand-700' : 'text-red-700')">
                                                {{ hasDissertativeQuestion
                                                    ? 'Resposta dissertativa enviada com sucesso.'
                                                    : (isExerciseCorrect ? 'Parabéns! Você acertou o exercício.' : 'Você errou o exercício.') }}
                                            </p>
                                            <p class="mt-1 text-sm text-ink-600">
                                                {{ hasDissertativeQuestion
                                                    ? 'Seu código foi registrado e será considerado na avaliação da atividade.'
                                                : (isExerciseCorrect
                                                    ? 'Resultado registrado com sucesso. Continue nesse ritmo!'
                                                    : 'Não desanime. Revise a resposta correta abaixo e tente novamente.')
                                                }}
                                            </p>
                                        </div>
                                    </div>

                                    <div v-if="!hasDissertativeQuestion" class="mt-4 flex flex-wrap gap-2">
                                        <span class="chip">Acertos: {{ props.quizResult.correct }}/{{
                                            props.quizResult.total }}</span>
                                        <span class="chip">Aproveitamento: {{ props.quizResult.accuracy }}%</span>
                                        <span class="chip">Pontos ganhos: {{ props.quizResult.gainedPoints }}</span>
                                    </div>
                                </div>

                                <div class="mt-4 space-y-2">
                                    <article v-for="item in questionReport" :key="item.id"
                                        class="rounded-xl border border-brand-100/80 bg-white px-4 py-3">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="text-sm text-ink-800">{{ item.statement }}</p>
                                            <span class="chip" :class="item.isDissertative
                                                ? 'text-blue-700'
                                                : (item.isCorrect ? 'text-success-600' : 'text-red-600')">
                                                {{ item.isDissertative ? 'Respondida' : (item.isCorrect ? 'Acertou' :
                                                    'Errou') }}
                                            </span>
                                        </div>
                                        <p class="mt-1 text-xs text-ink-500">
                                            Sua resposta: {{ item.selectedOptionLabel }}
                                        </p>
                                        <p v-if="!item.isDissertative && !item.isCorrect" class="text-xs text-ink-500">
                                            Resposta correta: {{ item.correctOptionLabel }}
                                        </p>
                                    </article>
                                </div>

                                <div class="mt-6 flex flex-wrap items-center justify-between gap-2">
                                    <button type="button"
                                        class="text-ink-900 btn-primary h-9 px-4 text-xs cursor-pointer"
                                        @click="backToExercisesAndRefresh">
                                        Voltar para exercícios
                                    </button>
                                </div>
                            </template>
                        </section>

                        <aside class="space-y-4">
                            <article class="panel p-4">
                                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Resumo</p>
                                <p class="mt-2 text-sm text-ink-700">{{ props.task?.description ??
                                    props.dailyTask?.description }}</p>
                                <div class="mt-3 flex flex-wrap gap-2">
                                    <span class="chip">{{ props.task?.points ?? props.dailyTask?.points }}
                                        pts</span>
                                    <span class="chip">Prazo: {{ props.task?.due ?? props.dailyTask?.due }}</span>
                                    <span class="chip">{{ props.task?.status ?? props.dailyTask?.status }}</span>
                                </div>
                            </article>
                        </aside>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <!-- Modal de Apoio -->
    <Teleport to="body">
        <Transition name="apoio-fade" appear>
            <div v-if="showApoioModal" class="apoio-mask" @click.self="showApoioModal = false">
                <div class="apoio-modal">
                    <div class="apoio-modal__header">
                        <div class="flex items-center gap-3">
                            <div class="apoio-modal__icon">
                                <span class="text-2xl">💡</span>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-400">Material de
                                    Apoio</p>
                                <h3 class="text-base font-semibold text-slate-900">Precisa de uma ajudinha? 🚀</h3>
                            </div>
                        </div>
                        <button type="button" class="apoio-modal__close" @click="showApoioModal = false"
                            aria-label="Fechar">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div v-if="materials == null" class="apoio-modal__body hide-scrollbar">
                        <slot name="apoio-content">
                            <div class="apoio-empty">
                                <span class="text-4xl">📚</span>
                                <p class="mt-3 text-sm font-medium text-slate-600">Nenhum material disponível ainda.</p>
                                <p class="mt-1 text-xs text-slate-400">O conteúdo de apoio aparecerá aqui.</p>
                            </div>
                        </slot>
                    </div>

                    <div v-else class="apoio-modal__body hide-scrollbar">
                        <slot name="apoio-content">
                            <ul>
                                <li v-for="material in materials" :key="material.id">
                                    <h4><strong>Material:</strong> {{ material.materialTitle }}</h4>
                                    <p>{{ material.materialDescription }}</p>
                                <li class="my-2 border-t border-slate-200"></li>
                                </li>
                            </ul>
                        </slot>
                    </div>

                    <div class="apoio-modal__footer">
                        <button type="button" class="apoio-close-btn" @click="showApoioModal = false">
                            Fechar 👋
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import CodeEditor from '~/components/UI/CodeEditor.vue'
import type { MaterialReference } from '~/infra/interfaces/services/exercise';
import { useUserStore } from '~/infra/store/userStore';

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore()

const materials = ref<MaterialReference[]>([])

type ExerciseCardTask = {
    id: number | string
    title: string
    due: string
    points: string
    status: string
    description: string
    termAt?: string
    source?: {
        videoUrl?: string | null
    }
    isCompletedAnswer?: boolean
}

type DailyTaskSummary = {
    id: number | string
    title: string
    due: string
    points: string
    status: string
    description: string
}

type TaskQuestion = {
    id: number
    statement: string
    options: Array<{
        id: number
        label: string
    }>
    correctOptionId: number
    typeExercise: number
}

type TaskResult = {
    correct: number
    total: number
    accuracy: number
    gainedPoints: number
}

const props = defineProps<{
    visible: boolean
    task: ExerciseCardTask | null
    dailyTask: DailyTaskSummary | null
    exercises: ExerciseCardTask[]
    loading: boolean
    questions: TaskQuestion[]
    selectedAnswers: Record<number, number | null>
    selectedCodeAnswers: Record<number, string>
    currentQuestionIndex: number
    quizResult: TaskResult | null
}>()

const emit = defineEmits<{
    (event: 'close'): void
    (event: 'start-quiz', task: any): void
    (event: 'select-answer', payload: { questionId: number; optionId: number }): void
    (event: 'update-code-answer', payload: { questionId: number; answer: string }): void
    (event: 'back-to-exercises'): void
    (event: 'back-to-exercises-and-refresh'): void
    (event: 'finish-quiz'): void
}>()

const showApoioModal = ref(false)

async function openApoio() {
    showApoioModal.value = true

    try {
        const exerciseId = props.task?.id
        const response = await $httpClient.exercise.GetMaterialsReferenceForExercise(parseInt(exerciseId as string));

        if (response) {
            materials.value = response.result

            if (materials.value.length === 0) {
                toast.info('Nenhum material de apoio disponível para este exercício no momento.', '', 3000)
                return
            }

        }
    } catch (error) {
        console.error('Erro ao buscar materiais de apoio:', error)
        toast.error('Não foi possível carregar os materiais de apoio. Tente novamente mais tarde.')
    }
}

const currentQuestion = computed(() => props.questions[props.currentQuestionIndex] ?? null)
const referenceVideoUrl = computed(() => {
    const url = props.task?.source?.videoUrl

    if (!url || typeof url !== 'string') {
        return ''
    }

    return url.trim()
})

function toYoutubeEmbedUrl(url: string) {
    try {
        const parsedUrl = new URL(url)
        const host = parsedUrl.hostname.toLowerCase()

        if (host.includes('youtu.be')) {
            const videoId = parsedUrl.pathname.replace('/', '').trim()
            return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
        }

        if (host.includes('youtube.com')) {
            const videoId = parsedUrl.searchParams.get('v')

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`
            }

            if (parsedUrl.pathname.startsWith('/embed/')) {
                return url
            }
        }

        return ''
    } catch {
        return ''
    }
}

const referenceVideoEmbedUrl = computed(() => {
    if (!referenceVideoUrl.value) {
        return ''
    }

    return toYoutubeEmbedUrl(referenceVideoUrl.value)
})
const answeredCount = computed(() => {
    return props.questions.filter((question) => {
        if (question.typeExercise === 2) {
            return Boolean((props.selectedCodeAnswers[question.id] ?? '').trim())
        }

        const answer = props.selectedAnswers[question.id]
        return answer !== null && answer !== undefined
    }).length
})

const allQuestionsAnswered = computed(() => props.questions.length > 0 && answeredCount.value === props.questions.length)
const hasDissertativeQuestion = computed(() => props.questions.some((question) => question.typeExercise === 2))

const questionReport = computed(() => {
    return props.questions.map((question) => {
        const isDissertative = question.typeExercise === 2
        const codeAnswer = (props.selectedCodeAnswers[question.id] ?? '').trim()
        const selectedOptionId = props.selectedAnswers[question.id]
        const normalizedSelectedOptionId = selectedOptionId ?? -1
        const isCorrect = isDissertative ? Boolean(codeAnswer) : normalizedSelectedOptionId === question.correctOptionId
        const selectedOption = question.options.find((option) => option.id === normalizedSelectedOptionId)
        const correctOption = question.options.find((option) => option.id === question.correctOptionId)

        return {
            id: question.id,
            statement: question.statement,
            isDissertative,
            isCorrect,
            selectedOptionLabel: isDissertative ? (codeAnswer || 'Não respondida') : (selectedOption?.label ?? 'Não respondida'),
            correctOptionLabel: correctOption?.label ?? '-',
        }
    })
})
const isExerciseCorrect = computed(() => {
    if (!props.quizResult) return false
    return props.quizResult.correct === props.quizResult.total && props.quizResult.total > 0
})

function closeTaskQuiz() {
    if (props.quizResult) {
        return
    }

    emit('close')
}

function startExerciseQuiz(task: ExerciseCardTask) {
    emit('start-quiz', task)
}

function selectAnswer(questionId: number, optionId: number) {
    emit('select-answer', { questionId, optionId })
}

function updateCodeAnswer(questionId: number, answer: string) {
    emit('update-code-answer', { questionId, answer })
}

function backToExercises() {
    emit('back-to-exercises')
}

function backToExercisesAndRefresh() {
    emit('back-to-exercises-and-refresh')
}

function finishQuiz() {
    if (!allQuestionsAnswered.value) {
        toast.warn('Responda a questão', 'Preencha a resposta antes de finalizar o exercício.', 3000)
        return
    }

    emit('finish-quiz')
}
</script>

<style scoped lang="scss">
.task-quiz-mask {
    position: fixed;
    inset: 0;
    z-index: 3300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    background: rgba(15, 23, 42, 0.62);
    backdrop-filter: blur(6px);
}

.task-quiz-modal {
    width: min(96vw, 1200px);
    height: min(94vh, 920px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 28px 70px rgba(2, 6, 23, 0.28), 0 10px 24px rgba(24, 122, 191, 0.1);
}

.task-quiz-fade-enter-active,
.task-quiz-fade-leave-active {
    transition: opacity 0.2s ease;
}

.task-quiz-fade-enter-from,
.task-quiz-fade-leave-to {
    opacity: 0;
}

.referencesVideo {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: none;
    border-radius: 0.75rem;
}

.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
}

/* ── Apoio button ────────────────────────────── */
.apoio-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    height: 2.25rem;
    padding: 0 1rem;
    border-radius: 0.75rem;
    border: 1.5px solid #49A8EB;
    background: linear-gradient(135deg, #BDD9F2 0%, #8DC4E8 100%);
    color: #04325A;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(24, 122, 191, 0.15);
    transition: all 0.18s ease;

    &:hover {
        background: linear-gradient(135deg, #8DC4E8 0%, #187ABF 100%);
        border-color: #187ABF;
        box-shadow: 0 4px 14px rgba(24, 122, 191, 0.25);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
}

/* ── Apoio modal ─────────────────────────────── */
.apoio-mask {
    position: fixed;
    inset: 0;
    z-index: 3400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(15, 10, 40, 0.55);
    backdrop-filter: blur(8px);
}

.apoio-modal {
    width: min(94vw, 580px);
    max-height: min(88vh, 700px);
    display: flex;
    flex-direction: column;
    border-radius: 1.25rem;
    border: 1.5px solid #8DC4E8;
    background: #fff;
    box-shadow:
        0 32px 80px rgba(24, 122, 191, 0.18),
        0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

.apoio-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.4rem;
    background: linear-gradient(135deg, #BDD9F2 0%, #EBF5FF 100%);
    border-bottom: 1.5px solid #8DC4E8;
}

.apoio-modal__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.875rem;
    border: 1.5px solid #8DC4E8;
    background: linear-gradient(135deg, #BDD9F2, #EBF5FF);
    box-shadow: 0 2px 8px rgba(24, 122, 191, 0.2);
}

.apoio-modal__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.625rem;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        border-color: #49A8EB;
        background: #BDD9F2;
        color: #04325A;
    }
}

.apoio-modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.4rem;
}

.apoio-modal__footer {
    padding: 0.9rem 1.4rem;
    border-top: 1.5px solid #8DC4E8;
    background: #EBF5FF;
    display: flex;
    justify-content: flex-end;
}

.apoio-close-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    height: 2.1rem;
    padding: 0 1.1rem;
    border-radius: 0.625rem;
    border: 1.5px solid #49A8EB;
    background: linear-gradient(135deg, #BDD9F2, #8DC4E8);
    color: #04325A;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: linear-gradient(135deg, #49A8EB, #187ABF);
        box-shadow: 0 2px 10px rgba(24, 122, 191, 0.2);
    }
}

.apoio-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    text-align: center;
}

.apoio-fade-enter-active,
.apoio-fade-leave-active {
    transition: opacity 0.2s ease;

    .apoio-modal {
        transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
}

.apoio-fade-enter-from,
.apoio-fade-leave-to {
    opacity: 0;

    .apoio-modal {
        opacity: 0;
        transform: scale(0.92) translateY(12px);
    }
}
</style>