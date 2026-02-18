<template>
    <div class="space-y-8">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative h-42 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <img :src="profile?.coverPictureUrl ?? backgroundDefault" alt="Capa do perfil"
                    class="h-full w-full object-cover brightness-75" />
                <div class="absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/20 blur-2xl"></div>
                <div class="absolute left-8 top-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                    Perfil do aluno
                </div>
            </div>

            <div class="space-y-4 p-5 pt-4 z-10 relative">
                <div class="-mt-10 flex flex-wrap items-end justify-between gap-4">
                    <div class="flex items-end gap-4 min-w-0">
                        <img :src="profile?.profilePictureUrl ?? profileDefault" alt="Foto de perfil"
                            class="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md bg-white/80" />
                        <div class="space-y-1 min-w-0">
                            <h2 class="text-xl font-semibold">{{ profile?.name ?? 'Nome não disponível' }}</h2>
                            <p class="text-sm text-ink-500">{{ profile?.class?.name ?? 'Turma não disponível' }} • Nivel
                                {{
                                    profile?.levelUser ?? 'Nível não disponível' }}</p>
                        </div>
                    </div>

                    <button class="btn-outline h-9 px-4 text-xs cursor-pointer">Editar capa</button>
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
                        <div v-for="badge in badgeSlots" :key="badge.name"
                            class="rounded-xl border p-2 text-center text-xs cursor-pointer"
                            :class="badge.unlocked ? 'border-brand-200 bg-red-50 text-brand-600' : 'border-slate-200 bg-slate-50 text-ink-500'">
                            <p class="text-base leading-none">{{ badge.unlocked ? '🏅' : '🔒' }}</p>
                            <p class="mt-1 truncate">{{ badge.name }}</p>
                        </div>
                    </div>
                </div>
            </div>
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

import profileDefault from '@/assets/Images-Default/profile-default.png'
import backgroundDefault from '@/assets/Images-Default/background-default.png'
import { getLoggedUser } from '~/composables/useAuth'
import type { IUserProfileData } from '~/infra/interfaces/services/user'
import { useUserStore } from '~/infra/store/userStore'
import type { IBadge } from '~/infra/interfaces/services/badge'
import type { ICurrentPhaseUser } from '~/infra/interfaces/services/phase'

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
}>>(() => [
    { label: 'Pontuacao Total', value: String(profile.value?.pointsQuantity ?? 0), helper: rankingMessage.value, status: 'success' },
    { label: 'Fase atual', value: currentPhase.value?.name ?? 'Indisponível', helper: currentPhase.value?.module?.name ?? 'Modulo Indisponível', status: 'progress' },
    { label: 'Desafio Diário', value: 'Liberado', helper: 'Entrega ate sexta', status: 'warning' },
])

const tasks = [
    { title: 'Revisar classes CSS', due: 'Hoje, 18:00', points: '120', status: 'Em aberto' },
    { title: 'Quiz de grid layout', due: 'Amanha, 10:00', points: '80', status: 'Em aberto' },
    { title: 'Video: Flexbox aplicado', due: 'Quarta, 20:00', points: '60', status: 'Em andamento' },
]

const highlights = [
    { label: 'Ranking diario', value: '#4', helper: 'Subiu 2 posicoes hoje' },
    { label: 'Medalhas novas', value: '2', helper: 'CSS Sprint + UI Forge' },
]

const unlockedMedals = computed(() => badgeSlots.value.filter((badge) => badge.unlocked).length);

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

onMounted(async () => {
    await fetchUserProfile();
    ranking.value = await fetchRankingUser();
})
</script>