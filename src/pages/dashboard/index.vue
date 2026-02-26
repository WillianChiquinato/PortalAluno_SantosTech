<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative h-42 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <img :src="profile?.coverPictureUrl ?? backgroundDefault" alt="Capa do perfil"
                    class="h-full w-full object-cover brightness-75" />
                <div class="absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/20 blur-2xl"></div>
                <div
                    class="absolute left-8 top-4 text-xs font-semibold uppercase tracking-[0.2em] text-loading/90 box-border border-2 border-white/30 px-3 py-1 z-10 bg-loading/10 backdrop-blur-sm">
                    Perfil do aluno
                </div>
            </div>

            <div class="space-y-4 p-5 pt-4 z-10 relative">
                <div class="-mt-10 flex flex-wrap items-end justify-between gap-4">
                    <div class="flex items-end gap-4 min-w-0">
                        <div class="relative h-20 w-20">
                            <span class="profile-frame"></span>
                            <img :src="profile?.profilePictureUrl ?? profileDefault"
                                class="relative h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md bg-white" />
                        </div>

                        <div class="space-y-1 min-w-0">
                            <h2 class="text-xl font-semibold">{{ profile?.name ?? 'Nome não disponível' }}</h2>
                            <p class="text-sm text-ink-500">{{ profile?.class?.name ?? 'Turma não disponível' }} • Nivel
                                {{
                                    profile?.levelUser ?? 'Nível não disponível' }}</p>
                        </div>
                    </div>

                    <div class="flex flex-row gap-2">
                        <button class="bg-red-50 btn-outline h-9 px-4 text-xs cursor-pointer text-brand-600"
                            @click="openUploadCoverAndPicture">Editar
                            Fotos</button>
                        <button class="bg-red-50 btn-outline h-9 px-4 text-xs cursor-pointer text-brand-600"
                            @click="openEditAttributes">Editar
                            Perfil</button>
                    </div>
                </div>

                <p class="text-sm text-ink-700">{{ profile?.bio ?? 'Bio não disponível' }}</p>

                <section class="grid gap-3 lg:grid-cols-3">
                    <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
                </section>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Medalhas</p>
                        <span class="chip">{{ unlockedMedals ?? 0 }} desbloqueadas</span>
                    </div>

                    <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        <div v-for="(badge, index) in badgeSlots" :key="badge.name"
                            class="rounded-xl border p-1 text-center text-xs cursor-pointer" :class="[
                                badge.unlocked ? 'border-brand-200 bg-red-50 text-brand-600 medal-idle' : 'border-slate-200 bg-slate-50 text-ink-500',
                            ]" :style="badge.unlocked ? { animationDelay: `${(index % 6) * 0.22}s` } : undefined">
                            <div class="w-full flex justify-center items-center h-9">
                                <BaseLottie v-if="badge.unlocked" :animation-data="BadgeUnlocked" :loop="true"
                                    :autoplay="true" class="w-9 h-9" />
                                <BaseLottie v-else :animation-data="Locked" :loop="true" :autoplay="true"
                                    class="w-9 h-9" />
                            </div>
                            <p class="mt-1 truncate">{{ badge.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div class="space-y-1">
                <div class="flex items-start justify-between">
                    <div class="flex items-center">
                        <h3 class="text-xl font-semibold leading-none">
                            Tarefas diarias
                        </h3>

                        <div class="w-20 h-20">
                            <BaseLottie :animation-data="TaskList" :loop="true" :autoplay="true" class="w-16 h-16" />
                        </div>
                    </div>

                    <span class="chip self-center">
                        {{ dailyTasksCards.length }} pendentes
                    </span>
                </div>
                <div v-if="dailyTaskGroups.length" class="space-y-3">
                    <TaskCard v-for="task in dailyTasksCards" :key="task.id" :title="task.title" :due="task.due"
                        :points="task.points" :status="task.status" :disabled="task.disabled"
                        @select="openDailyTask(task)" />
                </div>
                <div v-else class="panel p-5">
                    <p class="text-sm font-semibold">Nenhuma tarefa diária disponível.</p>
                    <p class="text-xs text-ink-500 mt-1">Quando novas atividades forem liberadas, elas aparecerão aqui.
                    </p>
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
                    <button class="btn-primary mt-2 h-9 px-4 text-xs text-ink-900">Ver briefing</button>
                </div>
            </div>
        </section>
    </div>

    <NewUploadCover @back="closeUploadCoverAndPicture" @save="saveCoverAndProfile"
        v-model:visible="showUploadCoverAndPicture" :name="'Editar fotos do perfil'" accept="image/*" />

    <CreatedEditModal :name="'Editar atributos do perfil'" @back="closeEditAttributes" @save="UpdateUserProfile"
        v-model:visible="showEditAttributes">
        <p class="text-sm text-ink-500">Atualize as informações básicas do seu perfil.</p>

        <div class="space-y-3">
            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Nome</label>
                <input v-model="profile!.name" type="text" class="input w-full" placeholder="Digite seu nome" />

            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Email</label>
                <input v-model="profile!.email" type="email" class="input w-full"
                    :class="isEmailValid(profile!.email) ? 'border-green-500' : 'border-red-500'"
                    placeholder="Digite seu email" />
                <p v-if="!isEmailValid(profile!.email)" class="text-xs text-red-500">Email inválido</p>
            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Senha</label>
                <input v-model="editPassword" :type="showPassword ? 'text' : 'password'" class="input w-full"
                    placeholder="Digite uma nova senha (opcional)" />

                <button type="button"
                    class="absolute right-4 top-8 text-ink-500 text-xl hover:text-ink-700 hover:scale-110"
                    @click="handleEyePassword">
                    <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Bio</label>
                <textarea v-model="profile!.bio" class="input w-full" placeholder="Fale um pouco sobre você"
                    rows="4"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="bg-red-50 text-ink-900 btn-outline h-9 px-4 text-xs cursor-pointer"
                    @click="closeEditAttributes">
                    Voltar
                </button>
                <button type="button" class="text-ink-900 btn-primary h-9 px-4 text-xs cursor-pointer"
                    @click="UpdateUserProfile" :disabled="!isEmailValid(profile!.email)">
                    Salvar alterações
                </button>
            </div>
        </div>
    </CreatedEditModal>

    <ExercisesCard :visible="showTaskQuizModal" :task="selectedTask" :daily-task="selectedDailyTask"
        :exercises="availableExercises" :loading="quizLoading" :questions="quizQuestions"
        :selected-answers="selectedAnswers" :selected-code-answers="selectedCodeAnswers"
        :current-question-index="currentQuestionIndex" :quiz-result="taskResult" @close="closeTaskQuiz"
        @start-quiz="startExerciseQuiz" @select-answer="selectAnswer($event.questionId, $event.optionIndex)"
        @update-code-answer="updateCodeAnswer($event.questionId, $event.answer)" @back-to-exercises="backToExercises"
        @finish-quiz="finishExercise" />
</template>

<script setup lang="ts">
import BaseLottie from '@/components/BaseLottie.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import warningStatus from '@/assets/lottie/Warning Status.json'
import TaskList from '~/assets/lottie/TaskList.json'
import BadgeUnlocked from '~/assets/lottie/Badges.json'
import Locked from '~/assets/lottie/lockBadge.json'

import profileDefault from '@/assets/Images-Default/profile-default.png'
import backgroundDefault from '@/assets/Images-Default/background-default.png'
import { getLoggedUser } from '~/composables/useAuth'
import { UserRole, type IUserProfileData } from '~/infra/interfaces/services/user'
import { useUserStore } from '~/infra/store/userStore'
import type { IBadge } from '~/infra/interfaces/services/badge'
import type { ICurrentPhaseUser } from '~/infra/interfaces/services/phase'
import NewUploadCover from '~/components/Modals/newUploadCover.vue'
import CreatedEditModal from '~/components/Modals/CreatedEditModal.vue'
import ExercisesCard from '~/components/ExercisesCard.vue'

import { isEmailValid } from '#imports'
import type { IDailyExercise, IDailyTaskGroup, IQuizQuestionOption, ISubmitExerciseAnswer } from '~/infra/interfaces/services/exercise'
import { formatDate } from '~/utils/Format'
import { buildTaskQuestions, buildTaskQuestionsFromOptions, type ExerciseQuestionSource, type QuizQuestion } from '~/utils/taskQuestionBank'

const showUploadCoverAndPicture = ref(false)

//Password.
const showPassword = ref(false)

function handleEyePassword() {
    showPassword.value = !showPassword.value;
}

//Edit user.
const showEditAttributes = ref(false)
const editPassword = ref('')

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore()

const profile = ref<IUserProfileData | undefined>();
const userBadges = ref<IBadge[] | undefined>();
const badgeSlots = ref<(IBadge & { unlocked: boolean })[]>([]);

const currentPhase = ref<ICurrentPhaseUser | null>(null);
const ranking = ref<{ position: number; points: number; pointsToNext: number } | null>(null);
const rankingMessage = computed(() => {
    if (!ranking.value) return 'Ranking indisponível';

    if (ranking.value.position === 1) {
        return 'Você está no Top 1. Continue dominando!';
    }

    return `Você está Top ${ranking.value.position}. Ganhe +${ranking.value.pointsToNext} pontos para chegar ao Top ${ranking.value.position - 1}.`;
});

const stats = computed<Array<{
    label: string
    value: string
    helper: string
    status: 'success' | 'progress' | 'warning'
}>>(() => {
    const allExercises = tasks.value.flatMap(group => group.exercises);
    return [
        { label: 'Pontuacao Total', value: String(profile.value?.pointsQuantity ?? 0), helper: rankingMessage.value, status: 'success' },
        { label: 'Fase atual', value: currentPhase.value?.name ?? 'Indisponível', helper: currentPhase.value?.module?.name ?? 'Modulo Indisponível', status: 'progress' },
        { label: 'Tarefas Diárias', value: `${tasks.value.length > 0 ? 'Liberado' : 'Sem tarefas disponíveis'}`, helper: `${tasks.value.length > 0 ? `Entregar até ${formatDate(getLatestTermAt(allExercises), 'pt-BR', { dateStyle: 'short' })}` : 'Aguardando tarefas disponíveis'}`, status: 'warning' },
    ]
})

const tasks = ref<IDailyTaskGroup[]>([]);

type TaskCardView = {
    id: number
    title: string
    due: string
    points: string
    status: string
    description: string
    termAt: string
    isCompletedAnswer: boolean
    source: ExerciseQuestionSource
}

type DailyTaskGroupView = {
    id: string
    name: string
    title: string
    due: string
    points: string
    status: string
    description: string
    termAt: string
    disabled: boolean
    exercises: TaskCardView[]
}

const showTaskQuizModal = ref(false)
const selectedDailyTask = ref<DailyTaskGroupView | null>(null)
const selectedTask = ref<TaskCardView | null>(null)
const quizLoading = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const selectedAnswers = ref<Record<number, number | null>>({})
const selectedCodeAnswers = ref<Record<number, string>>({})
const currentQuestionIndex = ref(0)
const taskResult = ref<{ correct: number; total: number; accuracy: number; gainedPoints: number } | null>(null)

const isCorrectAnswer = computed(() => {
    if (!currentQuestion.value) return false
    const selectedOptionIndex = selectedAnswers.value[currentQuestion.value.id]
    return selectedOptionIndex === currentQuestion.value.correctOptionIndex
})

const dailyTaskGroups = computed<DailyTaskGroupView[]>(() => {
    return tasks.value.map((group) => ({
        id: `${group.phaseId}-${group.id}`,
        name: group.name,
        exercises: [...group.exercises]
            .sort((a, b) => a.indexOrder - b.indexOrder)
            .map((exercise) => mapExerciseToTaskCard(exercise)),
        title: group.name,
        due: formatDate(getNearestTermAt(group.exercises), 'pt-BR', { dateStyle: 'short' }),
        points: String(sumGroupPoints(group.exercises)),
        status: getGroupStatus(group.exercises),
        description: `${group.exercises.length} exercício(s) diário(s) disponíveis.`,
        termAt: getNearestTermAt(group.exercises),
        disabled: group.exercises.length > 0 && group.exercises.every((exercise) => exercise.isCompletedAnswer),
    }))
})

const dailyTasksCards = computed(() => dailyTaskGroups.value)

const availableExercises = computed(() => selectedDailyTask.value?.exercises ?? [])

const currentQuestion = computed(() => quizQuestions.value[currentQuestionIndex.value] ?? null)
const answeredCount = computed(() => {
    return quizQuestions.value.filter((question) => {
        if (question.typeExercise === 2) {
            return Boolean((selectedCodeAnswers.value[question.id] ?? '').trim())
        }

        const answer = selectedAnswers.value[question.id]
        return answer !== null && answer !== undefined
    }).length
})
const allQuestionsAnswered = computed(() => quizQuestions.value.length > 0 && answeredCount.value === quizQuestions.value.length)
const hasAnswerForCurrentQuestion = computed(() => {
    if (!currentQuestion.value) return false
    const answer = selectedAnswers.value[currentQuestion.value.id]
    return answer !== null && answer !== undefined
})

const highlights = [
    { label: 'Ranking diario', value: '#4', helper: 'Subiu 2 posicoes hoje' },
    { label: 'Medalhas novas', value: '2', helper: 'CSS Sprint + UI Forge' },
]

const unlockedMedals = computed(() => badgeSlots.value.filter((badge) => badge.unlocked).length);

function getTaskStatus(termAt: string): string {
    const dueDate = new Date(termAt)
    const now = new Date()

    const dueStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (dueStart.getTime() < nowStart.getTime()) return 'Atrasada'
    if (dueStart.getTime() === nowStart.getTime()) return 'Vence hoje'

    return 'Em aberto'
}

function sumGroupPoints(exercises: IDailyExercise[]): number {
    return exercises.reduce((acc, exercise) => acc + exercise.pointsRedeem, 0)
}

function getNearestTermAt(exercises: IDailyExercise[]): string {
    if (!exercises.length) return new Date().toISOString()

    return exercises.reduce((nearest, exercise) => {
        return new Date(exercise.termAt).getTime() < new Date(nearest).getTime() ? exercise.termAt : nearest
    }, exercises[0].termAt)
}

function getLatestTermAt(exercises: IDailyExercise[]): string {
    if (!exercises.length) return new Date().toISOString()

    return exercises.reduce((latest, exercise) => {
        return new Date(exercise.termAt).getTime() > new Date(latest).getTime() ? exercise.termAt : latest
    }, exercises[0].termAt)
}

function getGroupStatus(exercises: IDailyExercise[]): string {
    if (!exercises.length) return 'Em aberto'

    if (exercises.every((exercise) => exercise.isCompletedAnswer)) return 'Concluída'

    const statuses = exercises.map((exercise) => getTaskStatus(exercise.termAt))

    if (statuses.includes('Atrasada')) return 'Atrasada'
    if (statuses.includes('Vence hoje')) return 'Vence hoje'
    return 'Em aberto'
}

function mapExerciseToTaskCard(exercise: IDailyExercise): TaskCardView {
    return {
        id: exercise.id,
        title: exercise.title,
        due: formatDate(exercise.termAt, 'pt-BR', { dateStyle: 'short' }),
        points: String(exercise.pointsRedeem),
        status: getTaskStatus(exercise.termAt),
        description: exercise.description,
        termAt: exercise.termAt,
        isCompletedAnswer: exercise.isCompletedAnswer,
        source: {
            id: exercise.id,
            title: exercise.title,
            description: exercise.description,
            videoUrl: exercise.videoUrl,
            pointsRedeem: exercise.pointsRedeem,
            typeExercise: exercise.typeExercise,
            difficulty: exercise.difficulty,
        },
    }
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

function openDailyTask(task: DailyTaskGroupView) {
    if (task.disabled) return

    selectedDailyTask.value = task
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    taskResult.value = null
    currentQuestionIndex.value = 0
    showTaskQuizModal.value = true
}

async function startExerciseQuiz(task: TaskCardView) {
    if (task.isCompletedAnswer) return

    selectedTask.value = task
    quizLoading.value = true

    try {
        const response = await $httpClient.exercise.GetQuizQuestionsForExercise(task.id)
        const options = (response.result ?? []) as IQuizQuestionOption[]

        if (response.success && options.length) {
            quizQuestions.value = buildTaskQuestionsFromOptions(task.source, options)
        } else {
            quizQuestions.value = buildTaskQuestions(task.source)
        }

        resetQuizState()
    } catch (error) {
        console.error('Erro ao carregar questões do exercício:', error)
        toast.error('Erro', 'Não foi possível carregar as questões. Tente novamente mais tarde.', 3500)
        quizQuestions.value = buildTaskQuestions(task.source)
        resetQuizState()
    } finally {
        quizLoading.value = false
    }
}

function backToExercises() {
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null
}

function closeTaskQuiz() {
    showTaskQuizModal.value = false
    selectedDailyTask.value = null
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null
}

function selectAnswer(questionId: number, optionIndex: number) {
    selectedAnswers.value[questionId] = optionIndex
}

function updateCodeAnswer(questionId: number, answer: string) {
    selectedCodeAnswers.value[questionId] = answer
}

function markExerciseCompletedLocally(exerciseId: number) {
    for (const group of tasks.value) {
        const targetExercise = group.exercises.find((exercise) => exercise.id === exerciseId)

        if (targetExercise) {
            targetExercise.isCompletedAnswer = true
            break
        }
    }

    if (!selectedDailyTask.value) return

    const selectedExercise = selectedDailyTask.value.exercises.find((exercise) => exercise.id === exerciseId)
    if (selectedExercise) {
        selectedExercise.isCompletedAnswer = true
    }

    const allExercisesCompleted = selectedDailyTask.value.exercises.length > 0
        && selectedDailyTask.value.exercises.every((exercise) => exercise.isCompletedAnswer)

    if (allExercisesCompleted) {
        selectedDailyTask.value.disabled = true
        selectedDailyTask.value.status = 'Concluída'
    }

    if (selectedTask.value?.id === exerciseId) {
        selectedTask.value.isCompletedAnswer = true
    }
}

async function finishExercise() {
    if (!selectedTask.value) return

    if (!allQuestionsAnswered.value) {
        toast.warn('Responda todas as questões', 'Preencha todas as respostas antes de finalizar o exercício.', 3000)
        return
    }

    const userId = getUserIdFromSession();

    const objectiveQuestions = quizQuestions.value.filter((question) => question.typeExercise !== 2)
    const correct = objectiveQuestions.reduce((acc, question) => {
        return acc + (selectedAnswers.value[question.id] === question.correctOptionIndex ? 1 : 0)
    }, 0)

    const total = objectiveQuestions.length
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    const gainedPoints = Math.round((selectedTask.value!.source.pointsRedeem * accuracy) / 100)
    const finishedExerciseId = selectedTask.value.id

    taskResult.value = {
        correct,
        total,
        accuracy,
        gainedPoints,
    }

    var payloadSubmitExercise: ISubmitExerciseAnswer[] = quizQuestions.value.map((question) => ({
        exerciseId: selectedTask.value!.source.id,
        userId: userId ?? 0,
        questionId: question.id,
        submissionData: {
            selectedOption: question.typeExercise === 2 ? -1 : (selectedAnswers.value[question.id] ?? -1),
            answerText: question.typeExercise === 2 ? (selectedCodeAnswers.value[question.id] ?? '').trim() : undefined,
            isCorrect: question.typeExercise === 2 ? false : selectedAnswers.value[question.id] === question.correctOptionIndex,
            pointsEarned: question.typeExercise === 2
                ? 0
                : (selectedAnswers.value[question.id] === question.correctOptionIndex
                    ? Math.round((selectedTask.value!.source.pointsRedeem * accuracy) / 100)
                    : 0),
            submittedAt: new Date(),
        },
    }))

    try {
        var responseAnswer = await $httpClient.exercise.SubmitExerciseAnswers(payloadSubmitExercise);

        if (responseAnswer.success) {
            toast.info('Exercicio Enviado com Sucesso')

            if (payloadSubmitExercise[0]?.submissionData.selectedOption !== -1) {
                var payloadUserPoints = {
                    userId: userId ?? 0,
                    pointsToAdd: gainedPoints,
                    exerciseDate: selectedTask.value.termAt,
                }

                var pointsResponse = await $httpClient.point.AddPointsForUser(payloadUserPoints)
                if (pointsResponse.success) {
                    toast.success('Parabens!', `Você ganhou ${gainedPoints} pontos com este exercício.`, 3500)
                    profile.value?.pointsQuantity ? profile.value.pointsQuantity += gainedPoints : null
                    ranking.value ? ranking.value.points += gainedPoints : null
                }
            }
        }
    } catch (error) {
        console.error('Erro ao resgatar pontos do exercício:', error)
        toast.error('Erro', 'Não foi possível resgatar os pontos do exercício. Tente novamente mais tarde.', 3500)
    } finally {
        markExerciseCompletedLocally(finishedExerciseId)
    }
}

type UploadProfileImagesPayload = {
    coverFile: File | null
    profileFile: File | null
}

function getUserIdFromSession(): number | null {
    if (userData.userId && userData.userId > 0) {
        return userData.userId;
    }

    const loggedUser = getLoggedUser();
    const recoveredId = Number(loggedUser?.id);

    if (!Number.isFinite(recoveredId) || recoveredId <= 0) {
        return null;
    }

    userData.setUserId(recoveredId);
    return recoveredId;
}

function openUploadCoverAndPicture() {
    showUploadCoverAndPicture.value = true;
}

function closeUploadCoverAndPicture() {
    showUploadCoverAndPicture.value = false;
}

function openEditAttributes() {
    editPassword.value = ''
    showEditAttributes.value = true;
}

function closeEditAttributes() {
    editPassword.value = ''
    showEditAttributes.value = false;
}

async function UpdateUserProfile() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para atualizar seu perfil.', 4000)
            loadingPop();
            return;
        }

        var RoleUpdateUser = UserRole.Student ? 1 : UserRole.Teacher ? 2 : 3;

        var payloadUpdateUser = {
            id: userId,
            name: profile.value?.name ?? '',
            bio: profile.value?.bio ?? '',
            email: profile.value?.email ?? '',
            password: editPassword.value.trim(),
            role: RoleUpdateUser,
            profilePictureUrl: profile.value?.profilePictureUrl ?? '',
            coverPictureUrl: profile.value?.coverPictureUrl ?? '',
            updatedAt: new Date(),
        }

        var response = await $httpClient.user.UpdateProfile(payloadUpdateUser);

        if (response.result == null) {
            toast.error('Erro', 'Não foi possível atualizar os dados do perfil. Tente novamente mais tarde.', 4000)
            return;
        }

        closeEditAttributes();
        editPassword.value = ''
        toast.success('Perfil atualizado', 'Seus dados do perfil foram atualizados com sucesso.', 3000);
    } catch (error) {
        console.error('Erro ao atualizar perfil do usuário:', error)
        toast.error('Erro', 'Não foi possível atualizar os dados do perfil. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(String(reader.result ?? ''))
        }

        reader.onerror = () => {
            reject(new Error('Falha ao converter arquivo para base64.'))
        }

        reader.readAsDataURL(file)
    })
}

async function saveCoverAndProfile(payload: UploadProfileImagesPayload) {
    try {
        if (!profile.value) {
            await fetchUserProfile()
        }

        if (!profile.value) {
            toast.error('Erro', 'Não foi possível carregar os dados do perfil para salvar as imagens.', 4000)
            return
        }

        if (payload.coverFile) {
            profile.value.coverPictureUrl = await fileToDataUrl(payload.coverFile)
        }

        if (payload.profileFile) {
            profile.value.profilePictureUrl = await fileToDataUrl(payload.profileFile)
        }

        await UpdateUserProfile()
        closeUploadCoverAndPicture()
    } catch (error) {
        console.error('Erro ao salvar imagens do perfil:', error)
        toast.error('Erro', 'Não foi possível salvar as imagens de capa e perfil.', 4000)
    }
}

async function fetchRankingUser() {
    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar seu ranking.', 4000)
            await navigateTo('/')
            return null;
        }

        const response = await $httpClient.point.GetRanking();

        if (response.result != null) {
            const rankingList = response.result;
            const positionIndex = rankingList.findIndex(r => r.userId === userId);

            if (positionIndex !== -1) {
                const userPosition = positionIndex + 1;
                const userPoints = rankingList[positionIndex].totalPoints;

                let pointsToNext = 0;

                // Se não for o primeiro colocado
                if (positionIndex > 0) {
                    const nextUserPoints = rankingList[positionIndex - 1].totalPoints;
                    pointsToNext = nextUserPoints - userPoints + 1;
                }

                return {
                    position: userPosition,
                    points: userPoints,
                    pointsToNext
                };
            } else {
                console.warn('Usuário não encontrado no ranking');
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao carregar ranking do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados do ranking. Tente novamente mais tarde.', 4000)
        return null;
    }
}

async function fetchUserProfile() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar seu perfil.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.user.GetProfileData(userId);

        if (response.result != null) {
            profile.value = response.result;
            userBadges.value = response.result.studentBadges;
            await fetchBadgeData();
        }
    } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados do perfil. Tente novamente mais tarde.', 4000)
        loadingPop();
    }
}

async function fetchBadgeData() {
    try {
        const response = await $httpClient.badge.GetBadges();

        if (response.result != null) {
            const allBadges: IBadge[] = response.result;
            const userBadgeIds = new Set(userBadges.value?.map((badge) => badge.id));
            badgeSlots.value = allBadges.map((badge) => ({
                ...badge,
                unlocked: userBadgeIds.has(badge.id),
            })).sort((a, b) => {
                if (a.unlocked !== b.unlocked) {
                    return a.unlocked ? -1 : 1;
                }

                return a.name.localeCompare(b.name, 'pt-BR');
            });

            await currentStatsUser();
        }
    } catch (error) {
        console.error('Erro ao carregar badges do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados das badges. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

async function currentStatsUser() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar os dados da fase atual.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.phase.GetCurrentPhaseUser(userId);

        if (response.result != null) {
            currentPhase.value = response.result;
            console.log('Fase atual do usuário:', response.result);

            toast.success('Perfil carregado', 'Dados do perfil atualizados com sucesso.', 3000);
        }
        loadingPop();
    } catch (error) {
        console.error('Erro ao carregar fase atual do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados da fase atual. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

async function randomDailyTasks() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar as tarefas diárias.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.exercise.GetDailyTasksForPhase(currentPhase.value?.id ?? 0, userId);

        if (response.result != null) {
            tasks.value = response.result;
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas diárias:', error)
        toast.error('Erro', 'Não foi possível carregar as tarefas diárias. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

onMounted(async () => {
    await fetchUserProfile();
    await randomDailyTasks();
    ranking.value = await fetchRankingUser();
})
</script>

<style scoped lang="scss">
.profile-frame {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 1rem;
    padding: 3px;
    background: conic-gradient(from 0deg, #facc15, #d5428c, #7e55dc, #facc15 100%);
    background-size: 200% 200%;
    animation: gradient-move 4s linear infinite;
    display: block;
    pointer-events: none;
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    box-sizing: border-box;
}

@keyframes gradient-move {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 120% 80%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.medal-idle {
    animation: medalFloat 1.6s ease-in-out infinite;
    will-change: transform;
}

@keyframes medalFloat {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-3px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .medal-idle {
        animation: none;
    }
}
</style>