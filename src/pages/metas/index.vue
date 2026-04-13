<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl"></div>
                <div class="absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>

                <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">Metas do aluno</p>
                        <h2 class="text-2xl font-semibold text-tag-100">Desafios e recompensas</h2>
                        <p class="mt-1 max-w-2xl text-sm text-tag-100/85">
                            Ao concluir metas, o aluno evolui com pontuacao, desbloqueio de medalhas e progresso
                            visivel.
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                            <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Pontos</p>
                            <p class="mt-1 text-xl font-semibold">{{ totalPoints }}</p>
                        </div>
                        <div class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100">
                            <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Medalhas</p>
                            <p class="mt-1 text-xl font-semibold">{{ unlockedBadges }}/{{ allBadges }}</p>
                        </div>
                        <div
                            class="rounded-2xl border border-white/30 bg-white/10 p-3 text-tag-100 col-span-2 sm:col-span-1">
                            <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Metas do curso</p>
                            <p class="mt-1 text-xl font-semibold">{{ goals.length }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel p-3 sm:p-4">
            <div class="flex flex-wrap items-center gap-2">
                <button type="button" class="chip cursor-pointer transition"
                    :class="selectedTab === 'all' ? '!border-brand-500 !bg-red-50 !text-brand-600' : ''"
                    @click="selectedTab = 'all'">
                    Todas as metas
                </button>
                <button type="button" class="chip cursor-pointer transition"
                    :class="selectedTab === 'active' ? '!border-brand-500 !bg-red-50 !text-brand-600' : ''"
                    @click="selectedTab = 'active'">
                    Minhas metas
                </button>
            </div>
        </section>

        <section v-if="selectedTab === 'all' && goals.length" class="grid gap-4 lg:grid-cols-2">
            <article v-for="goal in goals" :key="goal.goalId"
                class="panel relative overflow-hidden border-red-100/90 p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                <div class="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-100/50 blur-2xl"></div>

                <div class="relative z-10 space-y-4">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                                {{ getGoalTypeLabel(goal.goalType) }}
                            </p>
                            <h3 class="text-lg font-semibold text-ink-900 sm:text-xl">{{ goal.goalName }}</h3>
                            <p class="max-w-2xl text-sm leading-relaxed text-ink-600">{{ goal.goalDescription }}</p>
                        </div>

                        <span class="chip shrink-0 !border-amber-200 !bg-amber-50 !text-amber-700">
                            <i class="pi pi-star-fill text-[11px]"></i>
                            {{ goal.points }} pts
                        </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <span class="chip !border-brand-200 !bg-red-50 !text-brand-600">
                            <i class="pi pi-trophy text-[11px]"></i>
                            {{ goal.badges.length }} medalha{{ goal.badges.length !== 1 ? 's' : '' }}
                        </span>
                        <span class="chip !border-slate-200 !bg-white !text-ink-500">
                            Recompensa do curso
                        </span>
                    </div>

                    <div class="rounded-2xl border border-red-100 bg-red-50/50 p-3 sm:p-4">
                        <div class="mb-3 flex items-center justify-between gap-3">
                            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
                                Medalhas da meta
                            </p>
                            <span class="text-xs font-medium text-ink-500">Passe o mouse para ler</span>
                        </div>

                        <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                            <div v-for="badge in goal.badges" :key="badge.id"
                                class="group relative rounded-xl border border-brand-200 bg-white p-2 text-center text-xs transition hover:border-brand-300 hover:bg-red-50">
                                <div class="flex justify-center items-center h-10">
                                    <BaseLottie :animation-data="BadgeUnlocked" :loop="true" :autoplay="true"
                                        class="h-9 w-9" />
                                </div>
                                <p class="mt-1 truncate font-semibold text-ink-900">{{ badge.name }}</p>
                                <p class="mt-0.5 truncate text-[10px] text-ink-500">{{ badge.description }}</p>

                                <div
                                    class="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[180px] -translate-x-1/2 scale-95 rounded-lg bg-ink-900 px-2 py-1.5 text-center text-[10px] font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                                    {{ badge.description }}
                                    <div
                                        class="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 rotate-45 bg-ink-900">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2">
                        <button type="button" class="btn-primary h-9 px-4 text-xs text-white cursor-pointer"
                            :class="isLoadingUpdate ? 'cursor-not-allowed bg-gray-400' : isGoalActivated(goal.goalId) ? '!bg-emerald-500 hover:!bg-emerald-600' : ''"
                            @click="activateGoal(goal)" :disabled="isLoadingUpdate">
                            <i :class="isGoalActivated(goal.goalId) ? 'pi pi-check-circle' : 'pi pi-bolt'"
                                class="mr-2 text-[11px]"></i>
                            {{ isGoalActivated(goal.goalId) ? 'Desafio ativado' : 'Ativar desafio' }}
                        </button>
                    </div>
                </div>
            </article>
        </section>

        <section v-if="selectedTab === 'active' && activatedGoalsDetailed.length" class="grid gap-4 lg:grid-cols-2">
            <article v-for="goal in activatedGoalsDetailed" :key="goal.id"
                class="panel relative overflow-hidden border-emerald-100 p-4 sm:p-5">
                <div class="relative z-10 space-y-4">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                                {{ getGoalTypeLabel(goal.goalType) }}
                            </p>
                            <h3 class="text-lg font-semibold text-ink-900 sm:text-xl">{{ goal.goalName }}</h3>
                            <p class="max-w-2xl text-sm leading-relaxed text-ink-600">{{ goal.goalDescription }}</p>
                        </div>

                        <span class="chip !border-emerald-200 !bg-emerald-50 !text-emerald-700">
                            <i class="pi pi-check-circle text-[11px]"></i>
                            Ativa
                        </span>
                    </div>

                    <div class="space-y-2">
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-semibold uppercase tracking-[0.12em] text-ink-500">Progresso</span>
                            <span class="font-semibold text-ink-700">{{ formatProgress(goal.progress) }}%</span>
                        </div>
                        <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                                :style="{ width: `${formatProgress(goal.progress)}%` }"></div>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <span class="chip"
                            :class="goal.isCompleted ? '!border-emerald-200 !bg-emerald-50 !text-emerald-700' : '!border-amber-200 !bg-amber-50 !text-amber-700'">
                            {{ goal.isCompleted ? 'Concluida' : 'Em andamento' }}
                        </span>
                        <span v-if="goal.completedAt" class="chip !border-slate-200 !bg-white !text-ink-500">
                            Finalizada em {{ formatCompletedDate(goal.completedAt) }}
                        </span>
                    </div>
                </div>
            </article>
        </section>

        <section v-if="selectedTab === 'all' && !goals.length"
            class="panel border-slate-200 bg-slate-50/70 p-8 text-center">
            <p class="text-base font-semibold text-ink-700">Nenhuma meta disponivel</p>
            <p class="mt-1 text-sm text-ink-500">As metas deste curso aparecerão aqui quando forem criadas no painel
                administrativo.</p>
        </section>

        <section v-if="selectedTab === 'active' && !activatedGoalsDetailed.length"
            class="panel border-slate-200 bg-slate-50/70 p-8 text-center">
            <p class="text-base font-semibold text-ink-700">Nenhuma meta ativada</p>
            <p class="mt-1 text-sm text-ink-500">Ative um desafio na aba "Todas as metas" para acompanhar seu progresso
                aqui.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { getUserIdFromSession } from '~/composables/useLoadingConfigurations'
import { GoalType, type IActivatedGoalUser, type IGoalRewardsData } from '~/infra/interfaces/services/badge'
import type { IUserProfileData } from '~/infra/interfaces/services/user'
import BaseLottie from '@/components/BaseLottie.vue'
import BadgeUnlocked from '~/assets/lottie/Badges.json'

const profile = ref<IUserProfileData | null>(null)
const goals = ref<IGoalRewardsData[]>([])
const allBadges = ref(0)
const activatedGoalIds = ref<number[]>([])
const activatedGoals = ref<IActivatedGoalUser[]>([])
const isLoadingUpdate = ref(false)
const selectedTab = ref<'all' | 'active'>('all')

const { $httpClient } = useNuxtApp()
const { loadingPush, loadingPop } = useLoading()
const toast = useToastService()

const totalPoints = computed(() => profile.value?.pointsQuantity ?? 0)
const unlockedBadges = computed(() => profile.value?.studentBadges?.length ?? 0)
const goalsById = computed(() => {
    const map = new Map<number, IGoalRewardsData>()
    for (const goal of goals.value) {
        map.set(goal.goalId, goal)
    }
    return map
})

const activatedGoalsDetailed = computed(() => {
    return activatedGoals.value.map((activeGoal) => {
        const goal = goalsById.value.get(activeGoal.goalId)

        return {
            ...activeGoal,
            goalName: goal?.goalName ?? `Meta #${activeGoal.goalId}`,
            goalDescription: goal?.goalDescription ?? 'Descricao indisponivel para esta meta.',
            goalType: goal?.goalType ?? GoalType.Custom,
        }
    })
})

const goalTypeLabels: Record<GoalType, string> = {
    1: 'Completar Curso',
    2: 'Completar Fase',
    3: 'Quantidade de Tarefas',
    4: 'Tempo Investido',
    5: 'Meta Customizada',
}

function getGoalTypeLabel(goalType: GoalType): string {
    return goalTypeLabels[goalType] ?? 'Meta Desconhecida'
}

function isGoalActivated(goalId: number): boolean {
    return activatedGoalIds.value.includes(goalId)
}

function formatProgress(progress: number): number {
    if (!Number.isFinite(progress)) return 0
    return Math.min(100, Math.max(0, Math.round(progress * 1)))
}

function formatCompletedDate(value: string): string {
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) {
        return value
    }

    return parsedDate.toLocaleDateString('pt-BR')
}

async function activateGoal(goal: IGoalRewardsData) {
    if (isGoalActivated(goal.goalId)) {
        toast.info('Desafio ja ativado', `${goal.goalName} ja esta marcado como desafio ativo.`, 3000)
        return
    }

    isLoadingUpdate.value = true

    try {
        const resultUpdate = await $httpClient.badge.UpdateActivatedGoalId(goal.goalId)

        if (!resultUpdate.success || !resultUpdate.result) {
            toast.error('Erro', resultUpdate.errors?.[0] ?? 'Nao foi possivel ativar o desafio.', 3500)
            return
        }

        activatedGoalIds.value = [...activatedGoalIds.value, goal.goalId]
        toast.success('Desafio ativado', `${goal.goalName} foi ativado com sucesso.`, 3000)
        await fetchActivedGoalsUserData()
    } catch (error) {
        console.error('Erro ao ativar desafio:', error)
        toast.error('Erro', 'Nao foi possivel ativar o desafio agora.', 3500)
    } finally {
        isLoadingUpdate.value = false
    }
}

async function fetchActivedGoalsUserData() {
    loadingPush()

    try {
        const response = await $httpClient.badge.GetActivatedGoalsByUserId()

        if (response.result) {
            activatedGoals.value = response.result
            activatedGoalIds.value = response.result.map((item) => item.goalId)
        }
    } catch (error) {
        console.error('Erro ao carregar metas ativas do usuario:', error)
        toast.error('Erro', 'Nao foi possivel carregar as metas ativas do aluno.', 4000)
    } finally {
        loadingPop()
    }
}

async function fetchGoalData() {
    loadingPush()

    try {
        const userId = getUserIdFromSession()

        if (!userId) {
            toast.error('Sessao invalida', 'Faca login novamente para carregar suas metas.', 3500)
            await navigateTo('/')
            return
        }

        const [profileResponse, badgeResponse, classResponse] = await Promise.all([
            $httpClient.user.GetProfileData(userId),
            $httpClient.badge.GetBadges(),
            $httpClient.class.GetClassesByUserId(),
        ])

        if (profileResponse.result) {
            profile.value = profileResponse.result
        }

        allBadges.value = badgeResponse.result?.length ?? 0
        let courseId = 0

        classResponse.result?.forEach(c => {
            if (c.id > 0) {
                courseId = c.id
            }
        })

        if (courseId > 0) {
            const goalsResponse = await $httpClient.badge.GetGoalsWithBadgesByCourseId(courseId)
            goals.value = goalsResponse.result ?? []
        } else {
            console.warn('Nenhum courseId disponivel. Metas nao carregadas.')
            goals.value = []
        }
    } catch (error) {
        console.error('Erro ao carregar dados de metas:', error)
        toast.error('Erro', 'Nao foi possivel carregar as metas do aluno.', 4000)
    } finally {
        loadingPop()
    }
}

onMounted(async () => {
    await fetchGoalData();
    await fetchActivedGoalsUserData();
})
</script>
