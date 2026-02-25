<template>
    <Teleport to="body">
        <Transition name="task-quiz-fade" appear>
            <div v-if="props.visible" class="task-quiz-mask" @click.self="closeTaskQuiz">
                <div class="task-quiz-modal panel border-red-100/80 bg-white">
                    <div class="flex items-center justify-between border-b border-red-100/80 px-5 py-4 sm:px-6">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Task diária</p>
                            <h3 class="text-lg font-semibold text-ink-900">{{ props.task?.title ??
                                props.dailyTask?.title }}</h3>
                        </div>

                        <button type="button" class="chip h-8 w-8 justify-center p-0 cursor-pointer"
                            @click="closeTaskQuiz" aria-label="Fechar modal de tarefa">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="grid flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-[2fr_1fr] sm:p-6">
                        <section class="panel border-red-100/80 p-4 sm:p-5">
                            <template v-if="!props.task">
                                <h4 class="text-xl font-semibold">Exercícios disponíveis</h4>
                                <p class="mt-2 text-sm text-ink-500">Escolha um exercício para iniciar o quiz.</p>

                                <div v-if="props.loading" class="mt-4">
                                    <p class="text-sm text-ink-500">Carregando questões do exercício...</p>
                                </div>

                                <div v-else class="mt-4 space-y-3">
                                    <button v-for="exercise in props.exercises" :key="exercise.id" type="button"
                                        class="relative w-full overflow-hidden rounded-xl border p-4 text-left transition"
                                        :class="exercise.isCompletedAnswer
                                            ? 'cursor-not-allowed border-slate-300 bg-slate-100/90 text-ink-500'
                                            : 'cursor-pointer border-red-100/80 bg-white hover:border-brand-200 hover:bg-red-50/40'"
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
                                    class="mt-4 rounded-xl border border-red-100/80 bg-red-50/30 p-3">
                                    <p class="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-500">Vídeo
                                        de referência</p>

                                    <div v-if="referenceVideoEmbedUrl"
                                        class="overflow-hidden rounded-lg border border-red-100/80 bg-white">
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
                                    <p class="text-sm text-ink-500">Dica: Se quiser, faça o exercício em uma IDE, após o término, cole sua resposta no campo abaixo e envie para avaliação.</p>
                                    <CodeEditor :model-value="props.selectedCodeAnswers[currentQuestion.id] ?? ''"
                                        placeholder="Digite seu código aqui..."
                                        @update:model-value="updateCodeAnswer(currentQuestion.id, $event)" />
                                </div>

                                <div v-else class="mt-4 space-y-3">
                                    <button v-for="(option, optionIndex) in currentQuestion.options"
                                        :key="`${currentQuestion.id}-${optionIndex}`" type="button"
                                        class="w-full rounded-xl border px-4 py-3 text-left text-sm transition cursor-pointer"
                                        :class="props.selectedAnswers[currentQuestion.id] === optionIndex
                                            ? 'border-brand-500 bg-red-50 text-brand-600'
                                            : 'border-red-100/80 bg-white text-ink-700 hover:border-brand-200'"
                                        @click="selectAnswer(currentQuestion.id, optionIndex)">
                                        {{ option }}
                                    </button>
                                </div>

                                <div v-if="!props.loading"
                                    class="mt-6 flex flex-wrap items-center justify-between gap-2">
                                    <button type="button"
                                        class="bg-red-50 text-ink-900 btn-outline h-9 px-4 text-xs cursor-pointer"
                                        @click="backToExercises">
                                        Voltar
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
                                    ? 'border-brand-200 bg-red-50/50'
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
                                        class="rounded-xl border border-red-100/80 bg-white px-4 py-3">
                                        <div class="flex items-start justify-between gap-2">
                                            <p class="text-sm text-ink-800">{{ item.statement }}</p>
                                            <span class="chip" :class="item.isDissertative
                                                ? 'text-blue-700'
                                                : (item.isCorrect ? 'text-emerald-700' : 'text-red-600')">
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
                                        @click="backToExercises">
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
</template>

<script setup lang="ts">
import CodeEditor from '~/components/UI/CodeEditor.vue'
import { useUserStore } from '~/infra/store/userStore';

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore()

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
    options: string[]
    correctOptionIndex: number
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
    (event: 'select-answer', payload: { questionId: number; optionIndex: number }): void
    (event: 'update-code-answer', payload: { questionId: number; answer: string }): void
    (event: 'back-to-exercises'): void
    (event: 'finish-quiz'): void
}>()

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
        const selectedOptionIndex = props.selectedAnswers[question.id]
        const normalizedSelectedIndex = selectedOptionIndex ?? -1
        const isCorrect = isDissertative ? Boolean(codeAnswer) : normalizedSelectedIndex === question.correctOptionIndex

        return {
            id: question.id,
            statement: question.statement,
            isDissertative,
            isCorrect,
            selectedOptionLabel: isDissertative ? (codeAnswer || 'Não respondida') : (question.options[normalizedSelectedIndex] ?? 'Não respondida'),
            correctOptionLabel: question.options[question.correctOptionIndex] ?? '-',
        }
    })
})
const isExerciseCorrect = computed(() => {
    if (!props.quizResult) return false
    return props.quizResult.correct === props.quizResult.total && props.quizResult.total > 0
})

function closeTaskQuiz() {
    emit('close')
}

function startExerciseQuiz(task: ExerciseCardTask) {
    emit('start-quiz', task)
}

function selectAnswer(questionId: number, optionIndex: number) {
    emit('select-answer', { questionId, optionIndex })
}

function updateCodeAnswer(questionId: number, answer: string) {
    emit('update-code-answer', { questionId, answer })
}

function backToExercises() {
    emit('back-to-exercises')
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
    box-shadow: 0 28px 70px rgba(2, 6, 23, 0.28), 0 10px 24px rgba(220, 38, 38, 0.1);
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
</style>