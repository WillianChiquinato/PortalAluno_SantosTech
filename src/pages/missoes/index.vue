<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl"></div>
                <div class="absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>

                <div class="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">Missões do aluno</p>
                        <h2 class="text-2xl font-semibold text-tag-100">Desafios e recompensas</h2>
                        <p class="mt-1 max-w-2xl text-sm text-tag-100/85">
                            Ao concluir missões, o aluno evolui com pontuacao, desbloqueio de medalhas e progresso
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
                            <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Missões do curso</p>
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
                    Todas as missões
                </button>
                <button type="button" class="chip cursor-pointer transition"
                    :class="selectedTab === 'active' ? '!border-brand-500 !bg-red-50 !text-brand-600' : ''"
                    @click="selectedTab = 'active'">
                    Minhas missões
                </button>
            </div>
        </section>

        <section v-if="selectedTab === 'all' && goals.length" class="grid gap-4 lg:grid-cols-2">
            <article v-for="goal in goals" :key="getGoalRewardId(goal)"
                class="panel relative overflow-hidden border-red-100/90 p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
                <div class="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand-100/50 blur-2xl"></div>

                <div class="relative z-10 space-y-4 flex flex-col h-full">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="space-y-1">
                            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                                {{ getGoalTypeLabel(goal.goalType) }}
                            </p>
                            <h3 class="text-lg font-semibold text-ink-900 sm:text-xl">{{ goal.goalName }}</h3>
                            <p class="max-w-2xl text-sm leading-relaxed text-ink-600">{{ goal.goalDescription }}</p>
                        </div>
                    </div>

                    <div class="flex w-full">
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
                                Medalhas da missão
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

                    <div class="mt-auto flex items-center justify-end gap-2">
                        <button type="button" class="btn-primary h-9 px-4 text-xs text-white cursor-pointer"
                            :class="isLoadingUpdate ? 'cursor-not-allowed bg-gray-400' : isGoalActivated(getGoalRewardId(goal)) ? '!bg-emerald-500 hover:!bg-emerald-600' : ''"
                            @click="activateGoal(goal)" :disabled="isLoadingUpdate">
                            <i :class="isGoalActivated(getGoalRewardId(goal)) ? 'pi pi-check-circle' : 'pi pi-bolt'"
                                class="mr-2 text-[11px]"></i>
                            {{ isGoalActivated(getGoalRewardId(goal)) ? 'Desafio ativado' : 'Ativar desafio' }}
                        </button>
                    </div>
                </div>
            </article>
        </section>

        <section v-if="selectedTab === 'active' && activatedGoalsDetailed.length" class="grid gap-4 lg:grid-cols-2">
            <article v-for="goal in activatedGoalsDetailed" :key="goal.id"
                class="panel relative overflow-hidden border-emerald-100 p-4 sm:p-5">
                <div class="relative z-10 space-y-4">
                    <div class="flex flex-col items-start justify-between gap-3">
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

                    <div v-if="goal.isCompleted || formatProgress(goal.progress) >= 100"
                        class="mt-auto flex items-center justify-end">
                        <button type="button" @click="redeemGoal(goal)"
                            class="transition hover:scale-105 disabled:opacity-50">
                            <span v-if="!goal.rewardClaimed"
                                class="flex items-center gap-2 px-5 py-2 rounded-[1rem] font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 border border-emerald-400 shadow-md text-sm hover:from-emerald-600 hover:to-emerald-500 active:scale-95 cursor-pointer animate-fade-in">
                                <i class="pi pi-gift text-[16px] drop-shadow"></i>
                                Resgatar recompensa
                            </span>
                            <span v-else
                                class="flex items-center gap-2 px-5 py-2 rounded-[1rem] font-semibold text-white bg-gradient-to-r from-amber-400 to-orange-400 border border-amber-300 shadow-md text-sm animate-pulse cursor-pointer animate-fade-in">
                                <i class="pi pi-gift text-[16px] drop-shadow animate-twinkle"></i>
                                Recompensa Resgatada
                            </span>
                        </button>
                    </div>
                </div>
            </article>
        </section>

        <section v-if="selectedTab === 'all' && !goals.length"
            class="panel border-slate-200 bg-slate-50/70 p-8 text-center">
            <p class="text-base font-semibold text-ink-700">Nenhuma missão disponivel</p>
            <p class="mt-1 text-sm text-ink-500">As missões deste curso aparecerão aqui quando forem criadas no painel
                administrativo.</p>
        </section>

        <section v-if="selectedTab === 'active' && !activatedGoalsDetailed.length"
            class="panel border-slate-200 bg-slate-50/70 p-8 text-center">
            <p class="text-base font-semibold text-ink-700">Nenhuma missão ativada</p>
            <p class="mt-1 text-sm text-ink-500">Ative um desafio na aba "Todas as missões" para acompanhar seu
                progresso
                aqui.</p>
        </section>
    </div>

    <Teleport to="body">
        <Transition name="reward-overlay">
            <div v-if="showRewardAnimation" class="reward-screen" @click.self="ResetPageGoals()">

                <!-- Confetti -->
                <div class="confetti-wrap" aria-hidden="true">
                    <span v-for="i in 36" :key="i" class="confetti-piece" :style="confettiStyle(i)" />
                </div>

                <!-- Card principal -->
                <div class="reward-panel">
                    <div class="pulse-ring ring-a" />
                    <div class="pulse-ring ring-b" />

                    <!-- Label topo -->
                    <div class="mission-label">
                        <i class="pi pi-bolt text-[12px]" />
                        MISSÃO CUMPRIDA
                        <i class="pi pi-bolt text-[12px]" />
                    </div>

                    <!-- Badge Lottie com glow -->
                    <div class="lottie-stage">
                        <div class="lottie-glow" />
                        <BaseLottie :animation-data="BadgeUnlocked" :loop="false" :autoplay="true"
                            class="relative z-10 h-12 w-12 sm:h-36 sm:w-36" />
                    </div>

                    <!-- Nome da missão -->
                    <h2 class="reward-title">{{ redeemedGoalData?.name }}</h2>

                    <!-- Pontos ganhos -->
                    <div v-if="redeemedGoalData?.points" class="points-pill">
                        <i class="pi pi-star-fill text-amber-300 text-[13px]" />
                        <span>+{{ redeemedGoalData.points }} pontos conquistados</span>
                    </div>

                    <!-- Medalhas desbloqueadas -->
                    <div v-if="redeemedGoalData?.badges" class="badges-pill">
                        <i class="pi pi-trophy text-[13px]" />
                        <span>
                            {{ redeemedGoalData.badges }}
                            medalha{{ redeemedGoalData.badges !== 1 ? 's' : '' }}
                            desbloqueada{{ redeemedGoalData.badges !== 1 ? 's' : '' }}
                        </span>
                    </div>

                    <!-- Estrelas animadas -->
                    <div class="stars-row">
                        <span v-for="s in 5" :key="s" class="star-icon" :style="`--d: ${(s - 1) * 120}ms`">★</span>
                    </div>

                    <p class="reward-sub">Seus pontos e medalhas foram adicionados ao seu perfil.</p>

                    <button class="reward-close-btn" type="button" @click="ResetPageGoals()">
                        Continuar explorando
                        <i class="pi pi-arrow-right ml-2 text-[13px]" />
                    </button>
                </div>

            </div>
        </Transition>
    </Teleport>
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
const showRewardAnimation = ref(false)
const redeemedGoalData = ref<{ name: string; points: number; badges: number } | null>(null)

const { $httpClient } = useNuxtApp()
const { loadingPush, loadingPop } = useLoading()
const toast = useToastService()

const totalPoints = computed(() => profile.value?.pointsQuantity ?? 0)
const unlockedBadges = computed(() => profile.value?.studentBadges?.length ?? 0)

function getGoalRewardId(goal: IGoalRewardsData): number {
    return goal.goalRewardId ?? 0
}

const goalsById = computed(() => {
    const map = new Map<number, IGoalRewardsData>()
    for (const goal of goals.value) {
        map.set(getGoalRewardId(goal), goal)
    }
    return map
})

const activatedGoalsDetailed = computed(() => {
    return activatedGoals.value.map((activeGoal) => ({
        ...activeGoal,
        goalName: activeGoal.goalName,
        goalDescription: activeGoal.goalDescription,
        goalType: activeGoal.goalType,
    }))
})

const goalTypeLabels: Record<GoalType, string> = {
    1: 'Completar Curso',
    2: 'Completar Fase',
    3: 'Missões por Pontos',
    4: 'Tempo Investido',
    5: 'Missão Customizada',
}

function getGoalTypeLabel(goalType: GoalType): string {
    return goalTypeLabels[goalType] ?? 'Missão Desconhecida'
}

function isGoalActivated(goalRewardId: number): boolean {
    return activatedGoalIds.value.includes(goalRewardId)
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

function confettiStyle(i: number): Record<string, string> {
    const colors = ['#f59e0b', '#f97316', '#eab308', '#22c55e', '#a78bfa', '#f472b6', '#38bdf8', '#fb7185', '#facc15', '#34d399']
    const color = colors[(i - 1) % colors.length]
    const left = (((i - 1) * 37 + 3) % 98) + 1
    const delay = (((i - 1) * 13) % 20) / 10
    const duration = 1.4 + (((i - 1) * 7) % 6) * 0.2
    const size = 6 + (((i - 1) * 3) % 4) * 2
    return {
        '--color': color,
        '--left': `${left}%`,
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--size': `${size}px`,
    }
}

async function ResetPageGoals() {
    await delay(150)

    showRewardAnimation.value = false
    redeemedGoalData.value = null
    await fetchGoalData()
    await fetchActivedGoalsUserData()
}

async function redeemGoal(goal: IActivatedGoalUser) {
    if (goal.rewardClaimed) {
        toast.info('Recompensa ja resgatada', 'Voce ja resgatou a recompensa deste desafio.', 3000)
        return
    }

    const rewardData = goalsById.value.get(goal.goalRewardId)
    redeemedGoalData.value = {
        name: goal.goalName,
        points: rewardData?.points ?? 0,
        badges: rewardData?.badges.length ?? 0,
    }
    showRewardAnimation.value = true

    await redeemGoalReward(goal)
}

async function redeemGoalReward(goal: IActivatedGoalUser) {
    try {
        const response = await $httpClient.badge.GoalRewardOperation(goal.goalRewardId)

        if (!response.success || !response.result) {
            toast.error('Erro', response.errors?.[0] ?? 'Nao foi possivel resgatar a recompensa do desafio.', 3500)
            return
        }

        toast.success('Recompensa resgatada', 'Parabens por concluir o desafio! Sua recompensa foi adicionada ao seu perfil.', 3500)
    } catch (error) {
        console.error('Erro ao resgatar recompensa do desafio:', error)
        toast.error('Erro', 'Nao foi possivel resgatar a recompensa do desafio agora.', 3500)
    }
}

async function activateGoal(goal: IGoalRewardsData) {
    const goalRewardId = getGoalRewardId(goal)

    if (isGoalActivated(goalRewardId)) {
        toast.info('Desafio ja ativado', `${goal.goalName} ja esta marcado como desafio ativo.`, 3000)
        return
    }

    if (!goalRewardId) {
        toast.error('Erro', 'Nao foi possivel identificar o desafio para ativacao.', 3500)
        return
    }

    isLoadingUpdate.value = true

    try {
        const resultUpdate = await $httpClient.badge.UpdateActivatedGoalId(goalRewardId)

        if (!resultUpdate.success || !resultUpdate.result) {
            toast.error('Erro', resultUpdate.errors?.[0] ?? 'Nao foi possivel ativar o desafio.', 3500)
            return
        }

        activatedGoalIds.value = [...activatedGoalIds.value, goalRewardId]
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
            activatedGoalIds.value = response.result.map((item) => item.goalRewardId ?? 0)

            setTimeout(() => {
                toast.success('Missões ativadas', 'As missões foram carregadas com sucesso.', 3000)
            }, 600)

            for (const activeGoal of response.result) {
                const goalRewardId = activeGoal.goalRewardId
                const rewardType = activeGoal.rewardType

                if (goalRewardId && rewardType !== null && rewardType !== undefined) {
                    await evaluateProgress(goalRewardId, rewardType)
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar missões ativas do usuario:', error)
        toast.error('Erro', 'Nao foi possivel carregar as missões ativas do aluno.', 4000)
    } finally {
        loadingPop()
    }
}

async function fetchGoalData() {
    loadingPush()

    try {
        const userId = getUserIdFromSession()

        if (!userId) {
            toast.error('Sessao invalida', 'Faca login novamente para carregar suas missões.', 3500)
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
            console.warn('Nenhum courseId disponivel. Missões nao carregadas.')
            goals.value = []
        }
    } catch (error) {
        console.error('Erro ao carregar dados de missões:', error)
        toast.error('Erro', 'Nao foi possivel carregar as missões do aluno.', 4000)
    } finally {
        loadingPop()
    }
}

async function evaluateProgress(GoalRewardId: number, RewardType: number) {
    try {
        const response = await $httpClient.progress.EvaluateProgress(GoalRewardId, RewardType)

        if (!response.success) {
            console.warn('Nao foi possivel avaliar o progresso das missões ativas:', response.errors)
        }
    } catch (error) {
        console.error('Erro ao avaliar progresso das missões ativas:', error)
    }
}

onMounted(async () => {
    await fetchGoalData();
    await fetchActivedGoalsUserData();
})
</script>

<style scoped>
/* === Transição do overlay === */
.reward-overlay-enter-active,
.reward-overlay-leave-active {
    transition: opacity 0.35s ease;
}

.reward-overlay-enter-from,
.reward-overlay-leave-to {
    opacity: 0;
}

/* === Tela de fundo === */
.reward-screen {
    position: fixed;
    inset: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 30%, rgba(30, 10, 70, 0.97) 0%, rgba(5, 5, 20, 0.99) 100%);
    overflow: hidden;
}

/* === Confetti === */
.confetti-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.confetti-piece {
    position: absolute;
    width: var(--size, 8px);
    height: var(--size, 8px);
    background: var(--color, #f59e0b);
    left: var(--left, 50%);
    top: -16px;
    border-radius: 2px;
    animation: confetti-fall var(--duration, 2s) ease-in var(--delay, 0s) forwards;
}

@keyframes confetti-fall {
    0% {
        transform: translateY(0) rotate(0deg) scaleX(1);
        opacity: 1;
    }

    80% {
        opacity: 1;
    }

    100% {
        transform: translateY(110vh) rotate(720deg) scaleX(0.3);
        opacity: 0;
    }
}

/* === Card central === */
.reward-panel {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.9rem;
    text-align: center;
    background: linear-gradient(160deg, #1c0b40 0%, #0e0826 100%);
    border: 1px solid rgba(251, 191, 36, 0.28);
    border-radius: 1.75rem;
    padding: 2.5rem 2rem 2rem;
    width: min(480px, calc(100vw - 2rem));
    box-shadow:
        0 0 0 1px rgba(251, 191, 36, 0.08),
        0 0 70px rgba(168, 85, 247, 0.2),
        0 40px 90px rgba(0, 0, 0, 0.7);
    animation: panel-in 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

@keyframes panel-in {
    from {
        transform: scale(0.65) translateY(50px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

/* === Anéis pulsantes === */
.pulse-ring {
    position: absolute;
    border-radius: 9999px;
    pointer-events: none;
}

.ring-a {
    inset: -18px;
    border: 1.5px solid rgba(251, 191, 36, 0.22);
    animation: pulse-ring 2.2s ease-out infinite;
}

.ring-b {
    inset: -38px;
    border: 1px solid rgba(168, 85, 247, 0.14);
    animation: pulse-ring 2.2s ease-out 0.55s infinite;
}

@keyframes pulse-ring {
    0% {
        transform: scale(0.94);
        opacity: 0.7;
    }

    70% {
        transform: scale(1.04);
        opacity: 0.15;
    }

    100% {
        transform: scale(1.06);
        opacity: 0;
    }
}

/* === Label missão === */
.mission-label {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #fbbf24;
    animation: fade-up 0.4s 0.25s both;
}

/* === Lottie stage === */
.lottie-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lottie-glow {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 9999px;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
    animation: glow-pulse 1.6s ease-in-out infinite alternate;
}

@keyframes glow-pulse {
    from {
        transform: scale(0.9);
        opacity: 0.6;
    }

    to {
        transform: scale(1.18);
        opacity: 1;
    }
}

/* === Título da missão === */
.reward-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1.3;
    animation: fade-up 0.4s 0.5s both;
}

/* === Pills === */
.points-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: linear-gradient(90deg, rgba(251, 191, 36, 0.14), rgba(249, 115, 22, 0.14));
    border: 1px solid rgba(251, 191, 36, 0.32);
    border-radius: 9999px;
    padding: 0.3rem 1rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #fde68a;
    animation: fade-up 0.4s 0.65s both;
}

.badges-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(168, 85, 247, 0.1);
    border: 1px solid rgba(168, 85, 247, 0.28);
    border-radius: 9999px;
    padding: 0.3rem 1rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: #d8b4fe;
    animation: fade-up 0.4s 0.78s both;
}

/* === Estrelas === */
.stars-row {
    display: flex;
    gap: 0.3rem;
}

.star-icon {
    font-size: 1.5rem;
    color: #fbbf24;
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.7);
    animation: star-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.6) var(--d, 0ms) both;
}

@keyframes star-pop {
    from {
        transform: scale(0) rotate(-40deg);
        opacity: 0;
    }

    to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

/* === Texto descritivo === */
.reward-sub {
    font-size: 0.76rem;
    color: rgba(255, 255, 255, 0.45);
    max-width: 280px;
    animation: fade-up 0.4s 1s both;
}

/* === Botão === */
.reward-close-btn {
    margin-top: 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #f59e0b, #f97316);
    border: none;
    border-radius: 0.875rem;
    padding: 0.7rem 2.2rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
    animation: fade-up 0.4s 1.15s both;
    box-shadow: 0 8px 28px rgba(249, 115, 22, 0.45);
}

.reward-close-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}

.reward-close-btn:active {
    transform: scale(0.97);
}

/* === Utilitário compartilhado === */
@keyframes fade-up {
    from {
        transform: translateY(14px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
