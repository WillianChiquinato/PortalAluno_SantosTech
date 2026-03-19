<template>
    <div class="space-y-6 overflow-x-hidden">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative h-51 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <img :src="profile?.coverPictureUrl !== null && profile?.coverPictureUrl !== '' ? profile?.coverPictureUrl : backgroundDefault"
                    alt="Capa do perfil" class="h-full w-full object-cover brightness-75" />
                <button type="button" class="preview-btn preview-btn-cover" @click="openImagePreview('cover')">
                    <i class="pi pi-images"></i>
                    <span>Ver capa</span>
                </button>
                <div class="absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/20 blur-2xl"></div>
                <div
                    class="absolute left-4 top-3 z-10 box-border border-2 border-white/30 bg-loading/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-loading/90 backdrop-blur-sm sm:left-8 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.2em]">
                    Perfil do aluno
                </div>
            </div>

            <div class="relative z-10 space-y-4 p-3 pt-4 sm:p-5">
                <div class="-mt-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div class="flex min-w-0 items-end gap-3 sm:gap-4">
                        <div class="relative h-20 w-20 sm:h-25 sm:w-25">
                            <span class="profile-frame"></span>
                            <img :src="profile?.profilePictureUrl !== null && profile?.profilePictureUrl !== '' ? profile?.profilePictureUrl : profileDefault"
                                class="relative h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md sm:h-25 sm:w-25" />
                            <button type="button" class="preview-btn preview-btn-profile"
                                @click="openImagePreview('profile')" aria-label="Abrir foto de perfil">
                                <i class="pi pi-search"></i>
                            </button>
                        </div>

                        <div class="min-w-0 space-y-1">
                            <h2 class="max-w-[150px] truncate text-base font-semibold sm:max-w-none sm:text-xl">{{
                                profile?.name ?? 'Nome não disponível' }}</h2>
                            <p class="max-w-[150px] truncate text-xs text-ink-500 sm:max-w-none sm:text-sm">{{
                                profile?.class?.name ?? 'Turma não disponível' }} • Nível {{ profile?.levelUser ??
                                    'Nível não disponível' }}</p>
                        </div>
                    </div>

                    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-nowrap">
                        <button
                            class="btn-outline h-9 w-full cursor-pointer bg-red-50 px-2 xl:px-5 text-xs text-brand-600 sm:w-auto"
                            @click="openUploadCoverAndPicture">Editar
                            Fotos</button>
                        <button
                            class="btn-outline h-9 w-full cursor-pointer bg-red-50 px-2 xl:px-5 text-xs text-brand-600 sm:w-auto"
                            @click="openEditAttributes">Editar
                            Perfil</button>
                    </div>
                </div>

                <p class="text-xs text-ink-700 sm:text-sm">{{ profile?.bio ?? 'Bio não disponível' }}</p>

                <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
                </section>

                <div class="space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Medalhas</p>
                        <span class="chip shrink-0">{{ unlockedMedals ?? 0 }} desbloqueadas</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
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

        <section class="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
            <div class="space-y-1">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-center">
                        <h3 class="text-lg font-semibold leading-none sm:text-xl">
                            Tarefas diarias
                        </h3>

                        <div class="h-14 w-14 sm:h-20 sm:w-20">
                            <BaseLottie :animation-data="TaskList" :loop="true" :autoplay="true"
                                class="h-12 w-12 sm:h-16 sm:w-16" />
                        </div>
                    </div>

                    <span class="chip self-start sm:self-center">
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

            <div class="panel flex flex-col gap-4 p-4 sm:p-5">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">

                        <div class="w-10 h-10">
                            <BaseLottie :animation-data="warningStatus" :loop="true" :autoplay="true"
                                class="w-12 h-12" />
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">Resumo rapido</h3>
                            <p class="text-xs text-ink-500">
                                Seu ritmo sempre avançando...
                            </p>
                        </div>
                    </div>
                </div>

                <div class="max-w-xl space-y-3 text-sm leading-relaxed text-ink-500 text-justify">
                    <p>{{ messageMotivacional }}</p>
                </div>
                <div class="panel mt-2 flex flex-col gap-2 bg-red-50 p-4">
                    <p class="text-sm font-semibold">Ranking Global</p>
                    <p class="text-xs text-ink-500">Clique abaixo para ver o ranking completo.</p>
                    <button class="btn-primary mt-2 h-9 w-full px-4 text-xs text-ink-900 sm:w-auto cursor-pointer"
                        @click="openGlobalRanking">Ver
                        Ranking</button>
                </div>
            </div>
        </section>

        <section class="space-y-3">
            <div class="panel p-4 sm:p-5">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Area do aluno</p>
                        <h3 class="text-lg font-semibold">Respostas do usuario</h3>
                        <p class="mt-1 text-xs text-ink-500">Painel rapido para acompanhar respostas sem sair do
                            dashboard.</p>
                    </div>

                    <button type="button" class="relative btn-primary h-10 px-4 text-xs text-ink-900 cursor-pointer"
                        @click="toggleAnswersPanel">
                        {{ showAnswersPanel ? 'Fechar respostas' : 'Abrir respostas' }}
                        <span v-if="newAnswersCount > 0"
                            class="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white bg-brand-600 px-1 text-[10px] font-semibold text-white">
                            {{ newAnswersCount }}
                        </span>
                    </button>
                </div>

                <p v-if="newAnswersCount > 0" class="mt-3 text-xs font-semibold text-brand-600">
                    Voce possui {{ newAnswersCount }} resposta(s) nova(s).
                </p>
            </div>

            <Transition enter-active-class="duration-300 ease-out transition-all"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="duration-200 ease-in transition-all" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
                <UserAnswersPanel v-if="showAnswersPanel" title="Respostas do usuario"
                    :answers="userAnswersPanelItems" />
            </Transition>
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
        @start-quiz="startExerciseQuiz" @select-answer="selectAnswer($event.questionId, $event.optionId)"
        @update-code-answer="updateCodeAnswer($event.questionId, $event.answer)" @back-to-exercises="backToExercises"
        @finish-quiz="finishExercise" />

    <Transition name="image-viewer-fade">
        <div v-if="showImageViewer" class="image-viewer-overlay" @click.self="closeImagePreview">
            <div class="image-viewer-content">
                <div class="image-viewer-header">
                    <p class="image-viewer-title">{{ imageViewerTitle }}</p>
                    <button type="button" class="image-viewer-close" @click="closeImagePreview"
                        aria-label="Fechar visualizador de imagem">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <img :src="imageViewerSrc" :alt="imageViewerTitle" class="image-viewer-image" />
            </div>
        </div>
    </Transition>

    <Transition name="image-viewer-fade">
        <div v-if="showGlobalRanking" class="image-viewer-overlay" @click.self="closeGlobalRanking">
            <div class="global-ranking-content">
                <div class="global-ranking-header">
                    <div>
                        <p class="global-ranking-title">Ranking Global de Alunos</p>
                        <p class="global-ranking-subtitle">Pontuação geral da plataforma.</p>
                    </div>

                    <button type="button" class="image-viewer-close" @click="closeGlobalRanking"
                        aria-label="Fechar ranking global">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <div class="global-ranking-body">
                    <p v-if="isGlobalRankingLoading" class="text-sm text-ink-500">Carregando ranking...</p>

                    <p v-else-if="globalRanking.length === 0" class="text-sm text-ink-500">
                        Nenhum aluno encontrado no ranking.
                    </p>

                    <div v-else class="space-y-2">
                        <div v-for="entry in globalRanking" :key="entry.userId" class="global-ranking-row"
                            :class="{ 'global-ranking-row-highlight': entry.isCurrentUser }">
                            <div class="global-ranking-position">#{{ entry.position }}</div>

                            <img :src="entry.avatarUrl" :alt="`Avatar de ${entry.name}`"
                                class="global-ranking-avatar" />

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-semibold text-ink-900">{{ entry.name }}</p>
                                <p class="text-xs text-ink-500">Aluno</p>
                            </div>

                            <div class="text-right">
                                <p class="text-sm font-semibold text-brand-600">{{ entry.totalPoints }} pts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import BaseLottie from '@/components/BaseLottie.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import warningStatus from '@/assets/lottie/Warning Status.json'
import TaskList from '~/assets/lottie/TaskList.json'
import BadgeUnlocked from '~/assets/lottie/Badges.json'
import Locked from '~/assets/lottie/lockBadge.json'

import { getUserIdFromSession } from '~/composables/useLoadingConfigurations';
import profileDefault from '@/assets/Images-Default/profile-default.png'
import backgroundDefault from '@/assets/Images-Default/background-default.png'
import { getLoggedUser } from '~/composables/useAuth'
import { UserRole, type IUserProfileData } from '~/infra/interfaces/services/user'
import { useUserStore } from '~/infra/store/userStore'
import type { IBadge } from '~/infra/interfaces/services/badge'
import type { ICurrentModuleUser } from '~/infra/interfaces/services/phase'
import NewUploadCover from '~/components/Modals/newUploadCover.vue'
import CreatedEditModal from '~/components/Modals/CreatedEditModal.vue'
import ExercisesCard from '~/components/ExercisesCard.vue'
import UserAnswersPanel, { type UserAnswerItem } from '~/components/UserAnswersPanel.vue'

import { isEmailValid } from '#imports'
import type { DailyTaskGroupView, IDailyExercise, IDailyTaskGroup, IQuizQuestionOption, ISubmitExerciseAnswer, ExerciseCardTask } from '~/infra/interfaces/services/exercise'
import { formatDate } from '~/utils/Format'
import { buildTaskQuestions, buildTaskQuestionsFromOptions, type ExerciseQuestionSource, type QuizQuestion } from '~/utils/taskQuestionBank'
import type { IAnswersByUserIdResponse, IAnswerByUser } from '~/infra/interfaces/services/answers'

const messageMotivacional = ref('')

const showUploadCoverAndPicture = ref(false)
const showImageViewer = ref(false)
const imageViewerSrc = ref('')
const imageViewerTitle = ref('Visualizar imagem')

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

const currentModule = ref<ICurrentModuleUser | null>(null);
const ranking = ref<{ position: number; points: number; pointsToNext: number } | null>(null);
const showGlobalRanking = ref(false)
const isGlobalRankingLoading = ref(false)
const globalRanking = ref<Array<{
    position: number
    userId: number
    name: string
    totalPoints: number
    avatarUrl: string
    isCurrentUser: boolean
}>>([])
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
        { label: 'Pontuação Total', value: String(profile.value?.pointsQuantity ?? 0), helper: rankingMessage.value, status: 'success' },
        { label: `Módulo atual - (${currentModule.value?.totalPhases ?? 0} fases)`, value: currentModule.value?.name ?? 'Indisponível', helper: currentModule.value?.description ?? 'Módulo Indisponível', status: 'progress' },
        { label: 'Tarefas Diárias', value: `${tasks.value.length > 0 ? 'Liberado' : 'Sem tarefas disponíveis'}`, helper: `${tasks.value.length > 0 ? `Entregar até ${formatDate(getLatestTermAt(allExercises), 'pt-BR', { dateStyle: 'short' })}` : 'Aguardando tarefas disponíveis'}`, status: 'warning' },
    ]
})

const tasks = ref<IDailyTaskGroup[]>([]);

const showTaskQuizModal = ref(false)
const selectedDailyTask = ref<DailyTaskGroupView | null>(null)
const selectedTask = ref<ExerciseCardTask | null>(null)
const quizLoading = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const selectedAnswers = ref<Record<number, number | null>>({})
const selectedCodeAnswers = ref<Record<number, string>>({})
const currentQuestionIndex = ref(0)
const taskResult = ref<{ correct: number; total: number; accuracy: number; gainedPoints: number } | null>(null)

const isCorrectAnswer = computed(() => {
    if (!currentQuestion.value) return false
    const selectedOptionId = selectedAnswers.value[currentQuestion.value.id]
    return selectedOptionId === currentQuestion.value.correctOptionId
})

const dailyTaskGroups = computed<DailyTaskGroupView[]>(() => {
    return tasks.value.map((group) => ({
        id: `${group.phaseId}-${group.id}`,
        name: group.name,
        exercises: [...group.exercises]
            .sort((a, b) => a.indexOrder - b.indexOrder)
            .map((exercise) => mapExerciseToTaskCard(exercise, group.phaseId)),
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

const showAnswersPanel = ref(false)
const newAnswersCount = ref(0)
const userAnswersPreview = ref<IAnswersByUserIdResponse | null>(null)
const userAnswersPanelItems = computed<UserAnswerItem[]>(() => {
    const groups = userAnswersPreview.value?.exerciseGroups ?? []

    return groups
        .flatMap((group) => {
            const exerciseTitle = group.exercise.title
            return group.answers.map((answer) => mapAnswerToPanelItem(answer, exerciseTitle))
        })
        .sort((first, second) => {
            return new Date(second.answeredAt).getTime() - new Date(first.answeredAt).getTime()
        })
})

function mapAnswerStatus(isCorrect: boolean | null | undefined): UserAnswerItem['status'] {
    if (isCorrect === true) {
        return 'Correta'
    }

    if (isCorrect === false) {
        return 'Incorreta'
    }

    return 'Pendente'
}

function mapAnswerContent(answerText: string | null, selectedOption: string): string {
    const normalizedText = answerText?.trim()

    if (normalizedText) {
        return normalizedText
    }

    if (selectedOption.trim()) {
        return `Opcao selecionada: ${selectedOption}`
    }

    return 'Resposta enviada.'
}

function mapAnswerToPanelItem(answer: IAnswerByUser, exerciseTitle: string): UserAnswerItem {
    return {
        id: answer.id,
        question: `${exerciseTitle} - Questao #${answer.questionId}`,
        answer: mapAnswerContent(answer.answerText, answer.selectedOption),
        status: mapAnswerStatus(answer.isCorrect),
        answeredAt: answer.answeredAt,
    }
}

function toggleAnswersPanel() {
    showAnswersPanel.value = !showAnswersPanel.value

    // Quando o usuario abre o painel, consideramos que visualizou novas respostas.
    if (showAnswersPanel.value) {
        newAnswersCount.value = 0
    }
}

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

function mapExerciseToTaskCard(exercise: IDailyExercise, phaseId?: number): ExerciseCardTask {
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
            phaseId,
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

async function startExerciseQuiz(task: ExerciseCardTask) {
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

function selectAnswer(questionId: number, optionId: number) {
    selectedAnswers.value[questionId] = optionId
}

function resolveSubmittedOption(question: QuizQuestion) {
    if (question.typeExercise === 2) {
        return -1
    }

    const selectedOptionId = selectedAnswers.value[question.id]
    if (selectedOptionId === null || selectedOptionId === undefined) {
        return -1
    }

    const selectedOption = question.options.find((option) => option.id === selectedOptionId)
    return selectedOption?.optionId ?? selectedOptionId
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
        return acc + (selectedAnswers.value[question.id] === question.correctOptionId ? 1 : 0)
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
        phaseId: selectedTask.value?.source.phaseId ?? 0,
        submissionData: {
            selectedOption: resolveSubmittedOption(question),
            answerText: question.typeExercise === 2 ? (selectedCodeAnswers.value[question.id] ?? '').trim() : undefined,
            isCorrect: question.typeExercise === 2 ? false : selectedAnswers.value[question.id] === question.correctOptionId,
            pointsEarned: question.typeExercise === 2
                ? 0
                : (selectedAnswers.value[question.id] === question.correctOptionId
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

function openUploadCoverAndPicture() {
    showUploadCoverAndPicture.value = true;
}

function openImagePreview(type: 'cover' | 'profile') {
    const coverUrl = profile.value?.coverPictureUrl?.trim()
    const profileUrl = profile.value?.profilePictureUrl?.trim()

    if (type === 'cover') {
        imageViewerSrc.value = coverUrl ? coverUrl : backgroundDefault
        imageViewerTitle.value = 'Capa do perfil'
    } else {
        imageViewerSrc.value = profileUrl ? profileUrl : profileDefault
        imageViewerTitle.value = 'Foto de perfil'
    }

    showImageViewer.value = true
}

function closeImagePreview() {
    showImageViewer.value = false
}

function closeGlobalRanking() {
    showGlobalRanking.value = false
}

async function openGlobalRanking() {
    showGlobalRanking.value = true
    isGlobalRankingLoading.value = true

    try {
        const currentUserId = getUserIdFromSession()
        const [rankingResponse, usersResponse] = await Promise.all([
            $httpClient.point.GetRanking(),
            $httpClient.user.GetUsers(),
        ])

        const rankingList = rankingResponse.result ?? []
        const usersList = usersResponse.result ?? []
        const userMap = new Map(usersList.map((user) => [user.id, user]))

        globalRanking.value = rankingList
            .slice()
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((entry, index) => {
                const user = userMap.get(entry.userId)
                return {
                    position: index + 1,
                    userId: entry.userId,
                    name: user?.name ?? `Aluno ${entry.userId}`,
                    totalPoints: entry.totalPoints,
                    avatarUrl: user?.profilePictureUrl?.trim() ? user.profilePictureUrl : profileDefault,
                    isCurrentUser: currentUserId === entry.userId,
                }
            })
    } catch (error) {
        console.error('Erro ao carregar ranking global:', error)
        globalRanking.value = []
        toast.error('Erro', 'Não foi possível carregar o ranking global. Tente novamente mais tarde.', 4000)
    } finally {
        isGlobalRankingLoading.value = false
    }
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

        const response = await $httpClient.phase.GetCurrentModulePhaseUser(userId);

        if (response.result != null) {
            currentModule.value = response.result;
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

        const response = await $httpClient.exercise.GetDailyTasksForPhase(currentModule.value?.id ?? 0, userId);

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

async function getAImotivacionalMessage() {
    try {
        const response = await $httpClient.AI.GetMotivationalMessage();

        if (response.message != null) {
            messageMotivacional.value = response.message;
        }
    } catch (error) {
        console.error('Erro ao carregar mensagem motivacional:', error)
    }
}

async function getAnswersPreview(userId: number) {
    try {
        const response = await $httpClient.answers.GetAnswersByUserId(userId);

        if (response.result != null) {
            userAnswersPreview.value = response.result;
            newAnswersCount.value = response.result.unreadResponsesCount ?? 0
        }
    } catch (error) {
        console.error('Erro ao carregar prévia de respostas do usuário:', error)
    }
}

onMounted(async () => {
    const userId = getUserIdFromSession();

    if (userId != null && userId > 0) {
        await getAnswersPreview(userId);
    }

    await fetchUserProfile();
    await randomDailyTasks();
    ranking.value = await fetchRankingUser();
    await getAImotivacionalMessage();
});
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
    mask:
        linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    box-sizing: border-box;
}

.preview-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.45);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.42rem 0.72rem;
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
    z-index: 11;
}

.preview-btn:hover {
    transform: translateY(-1px);
    background: rgba(15, 23, 42, 0.65);
}

.preview-btn-cover {
    position: absolute;
    right: 0.85rem;
    bottom: 0.85rem;
}

.preview-btn-profile {
    position: absolute;
    right: -0.35rem;
    bottom: -0.35rem;
    width: 2rem;
    height: 2rem;
    padding: 0;
}

.image-viewer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(6px);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 1200;
}

.image-viewer-content {
    width: min(920px, 100%);
    max-height: calc(100vh - 2rem);
    border-radius: 1rem;
    background: #fff;
    border: 1px solid #fee2e2;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.global-ranking-content {
    width: min(680px, 100%);
    max-height: calc(100vh - 2rem);
    border-radius: 1rem;
    background: #fff;
    border: 1px solid #fee2e2;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.global-ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #fee2e2;
    background: linear-gradient(90deg, #fff7f7 0%, #fff 70%);
}

.global-ranking-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
}

.global-ranking-subtitle {
    margin-top: 0.15rem;
    font-size: 0.95rem;
    color: #64748b;
}

.global-ranking-body {
    padding: 1rem;
    overflow-y: auto;
    max-height: calc(100vh - 10rem);
}

.global-ranking-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid #fee2e2;
    border-radius: 0.85rem;
    padding: 0.55rem 0.65rem;
    background: #fff;
}

.global-ranking-row-highlight {
    border-color: #fb7185;
    background: #fff1f2;
}

.global-ranking-position {
    min-width: 2.2rem;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #be123c;
}

.global-ranking-avatar {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 999px;
    border: 1px solid #fecdd3;
    object-fit: cover;
    background: #fff;
}

.image-viewer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #fee2e2;
    background: linear-gradient(90deg, #fff7f7 0%, #fff 70%);
}

.image-viewer-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
}

.image-viewer-close {
    width: 2rem;
    height: 2rem;
    border: 1px solid #fecaca;
    border-radius: 999px;
    background: #fff;
    color: #be123c;
    cursor: pointer;
}

.image-viewer-image {
    width: 100%;
    max-height: calc(100vh - 8rem);
    object-fit: contain;
    background: radial-gradient(circle at top, #fff8f1, #fff 55%);
}

.image-viewer-fade-enter-active,
.image-viewer-fade-leave-active {
    transition: opacity 0.2s ease;
}

.image-viewer-fade-enter-from,
.image-viewer-fade-leave-to {
    opacity: 0;
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