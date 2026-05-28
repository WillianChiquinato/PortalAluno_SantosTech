<template>
    <div class="space-y-6 overflow-x-hidden">
        <section class="panel relative overflow-hidden p-0">
            <div
                class="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-5 py-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)] sm:px-7">
                <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                <div class="absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                <div class="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div class="space-y-3">
                        <div>
                            <p class="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-tag-100/80">
                                {{ snapshot?.event.className ?? 'Sem classe' }} · {{ snapshot?.event.moduleName ?? 'Sem módulo' }}
                            </p>
                            <h1 class="max-w-3xl text-xl font-semibold text-tag-100 sm:text-3xl">
                                Desafio Final - {{ snapshot?.event.title ?? 'Sem título' }}
                            </h1>
                        </div>

                        <div class="flex flex-wrap items-center gap-2.5 text-sm">
                            <span class="final-pill final-pill--sky">
                                <i class="pi pi-clock"></i>
                                {{ countdownLabel }}
                            </span>
                            <span class="final-pill final-pill--red">
                                <i class="pi pi-flag"></i>
                                {{ currentClan?.name ?? 'Sem cla' }}
                            </span>
                            <span class="final-pill final-pill--dark">
                                <i class="pi pi-chart-line"></i>
                                {{ currentClan?.progressPercent ?? 0 }}%
                            </span>
                        </div>
                    </div>

                    <div
                        class="flex flex-wrap items-center gap-3 max-sm:w-full max-sm:items-stretch max-sm:[&>*]:w-full lg:justify-end">
                        <div
                            class="rounded-2xl border border-white/20 bg-white/12 px-4 py-3 text-tag-100 backdrop-blur-sm">
                            <p class="text-[11px] uppercase tracking-[0.18em] text-tag-100/75">Barco atual</p>
                            <p class="mt-1 text-base font-semibold">{{ currentClan?.boatName ?? 'Aguardando clã' }}</p>
                        </div>

                        <button type="button" class="final-refresh-btn" :disabled="isRefreshing"
                            @click="loadSnapshot({ silent: true })">
                            <i :class="['pi', isRefreshing ? 'pi-spin pi-spinner' : 'pi-sync']"></i>
                            {{ isRefreshing ? 'Atualizando' : 'Atualizar' }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel p-4 sm:p-5 lg:p-6">
            <div class="flex flex-col gap-3 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.26em] text-ink-500">Arena visual</p>
                    <h2 class="mt-2 text-2xl font-semibold text-ink-900">Mapa dos barcos</h2>
                </div>
                <div class="text-sm text-ink-500 sm:text-right">
                    <p>Dados em Tempo real</p>
                    <p>Atualização: {{ snapshot?.event.refreshIntervalSeconds ?? 40 }}s</p>
                </div>
            </div>

            <div class="final-ocean-stage final-ocean-stage--safe">
                <div class="final-ocean-grid"></div>
                <div class="final-finish-line">
                    <span>Chegada</span>
                </div>

                <article v-for="clan in clans" :key="clan.clanId" class="final-boat" :class="[
                    { 'final-boat--current': clan.isCurrentUserClan },
                    clan.x >= 78 ? 'final-boat--reverse' : 'final-boat--forward',
                ]" :style="{ left: `${clan.x}%`, top: `${clan.y}%`, '--boat-color': clan.color }">
                    <div class="final-boat__wake"></div>
                    <div class="final-boat__body">
                        <div class="final-boat__sail"></div>
                        <div class="final-boat__flag"></div>
                    </div>
                    <div class="final-boat__label">
                        <strong>{{ clan.name }}</strong>
                        <span>{{ clan.totalScore }} pts · {{ clan.progressPercent }}%</span>
                    </div>
                </article>

                <div class="final-ocean-checkpoint final-ocean-checkpoint--1">Checkpoint 1</div>
                <div class="final-ocean-checkpoint final-ocean-checkpoint--2">Checkpoint 2</div>
                <div class="final-ocean-checkpoint final-ocean-checkpoint--3">Boss</div>
            </div>
        </section>

        <section class="panel p-5 final-ranking-panel">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Ranking ao vivo</p>
                    <h2 class="mt-2 text-xl font-semibold text-ink-900">Top clãs</h2>
                </div>
                <span class="chip">{{ leaderboard.length }} grupos</span>
            </div>

            <div class="final-ranking-strip mt-4">
                <article v-for="(clan, index) in leaderboard" :key="clan.clanId" class="final-ranking-card" :class="[
                    `final-ranking-card--${rankingTier(index)}`,
                    { 'final-ranking-card--current': clan.isCurrentUserClan },
                ]">
                    <div class="flex flex-col gap-4">
                        <div class="final-ranking-content">
                            <div class="flex min-w-0 items-start gap-3">
                                <div class="final-ranking-card__position">#{{ index + 1 }}</div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2 text-sm">
                                        <span class="h-3 w-3 rounded-full"
                                            :style="{ backgroundColor: clan.color }"></span>
                                        <p class="final-ranking-card__name font-semibold text-ink-900">{{ clan.name }}
                                        </p>
                                        <span v-if="index < 3" class="final-ranking-card__medal">{{ rankingMedal(index)
                                            }}</span>
                                        <span v-if="clan.isCurrentUserClan" class="final-ranking-card__tag">Seu
                                            clã</span>
                                    </div>
                                    <p class="mt-1 truncate text-xs text-ink-500">{{ clan.boatName }} · {{
                                        clan.currentCheckpoint }}</p>
                                </div>
                            </div>

                            <div class="final-ranking-card__score">
                                <p class="font-semibold text-ink-900">{{ clan.totalScore }} pts</p>
                                <p class="text-xs text-ink-500">{{ Math.round(clan.averageResolutionSeconds / 60) }} min
                                </p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-3 text-xs text-ink-500 sm:grid-cols-2">
                            <div class="rounded-2xl bg-red-50 px-3 py-2">
                                <p class="uppercase tracking-[0.14em] text-[11px] text-ink-400">Barco</p>
                                <p class="mt-1 truncate font-medium text-ink-700">{{ clan.boatName }}</p>
                            </div>
                            <div class="rounded-2xl bg-red-50 px-3 py-2 sm:text-right">
                                <p class="uppercase tracking-[0.14em] text-[11px] text-ink-400">Checkpoint</p>
                                <p class="mt-1 truncate font-medium text-ink-700">{{ clan.currentCheckpoint }}</p>
                            </div>
                        </div>

                        <div class="h-2 overflow-hidden rounded-full bg-red-100">
                            <div class="h-full rounded-full bg-[linear-gradient(90deg,#dc2626,#ef4444)]"
                                :style="{ width: `${clan.progressPercent}%` }"></div>
                        </div>

                        <div class="flex items-center justify-between text-xs text-ink-500">
                            <span>Progresso</span>
                            <span class="font-semibold text-ink-700">{{ clan.progressPercent }}%</span>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <section>
            <article class="panel p-5 final-backlog-panel">
                <div class="flex flex-wrap items-center justify-between gap-3 final-backlog-panel__header">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Pilha de desafios</p>
                        <h2 class="mt-2 text-xl font-semibold text-ink-900">Backlog do clã</h2>
                    </div>
                    <span class="chip">{{ tasks.length }} itens</span>
                </div>

                <div class="mt-4 space-y-3">
                    <article v-for="task in tasks" :key="task.challengeId" class="final-task-card">
                        <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="final-difficulty" :class="`final-difficulty--${task.difficulty}`">{{
                                        difficultyLabel(task.difficulty) }}</span>
                                    <span class="text-xs uppercase tracking-[0.16em] text-slate-500">{{ task.category
                                    }}</span>
                                </div>
                                <h3 class="mt-3 text-lg font-semibold text-slate-900">{{ task.title }}</h3>
                            </div>

                            <div class="text-left sm:text-right">
                                <p class="text-sm font-semibold text-slate-900">{{ task.scoreWeight }} pts</p>
                                <p class="text-xs text-slate-500">Prazo {{ formatDate(task.deadlineAt) }}</p>
                            </div>
                        </div>

                        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="final-task-status" :class="`final-task-status--${task.status}`">{{
                                    statusLabel(task.status) }}</span>
                                <span v-if="task.aiScore !== null && task.aiScore !== undefined">Score IA {{
                                    task.aiScore }}</span>
                                <span v-if="task.bestSubmissionAt">Melhor envio {{ formatTime(task.bestSubmissionAt)
                                }}</span>
                            </div>

                            <button type="button" class="btn-outline h-10 cursor-pointer px-4 text-xs"
                                :disabled="task.status === 'locked'"
                                :class="task.status === 'locked' ? '!cursor-not-allowed !border-slate-300 !bg-slate-100 !text-ink-500' : 'bg-red-50 text-brand-600'"
                                @click="openTaskModal(task)">
                                Ver proposta
                            </button>
                        </div>
                    </article>
                </div>
            </article>
        </section>

        <Teleport to="body">
            <Transition name="final-modal-fade">
                <div v-if="isTaskModalOpen && selectedTask" class="final-modal-overlay" @click.self="closeTaskModal">
                    <div class="final-modal-card">
                        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-red-100 pb-4">
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Desafio</p>
                                <h3 class="mt-2 text-2xl font-semibold text-ink-900">{{ selectedTask.title }}</h3>
                                <p class="mt-2 text-sm text-ink-500">{{ selectedTask.category }} · {{
                                    selectedTask.scoreWeight }} pts · prazo {{ formatDate(selectedTask.deadlineAt) }}
                                </p>
                            </div>

                            <button type="button" class="final-modal-close" @click="closeTaskModal">
                                <i class="pi pi-times"></i>
                            </button>
                        </div>

                        <div class="mt-5 grid gap-5 xl:grid-cols-[1fr_0.95fr]">
                            <section class="rounded-2xl border border-red-100 bg-red-50/60 p-5">
                                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">Proposta</p>
                                <p class="mt-3 text-sm leading-7 text-ink-700">{{ taskBriefing(selectedTask) }}</p>
                            </section>

                            <section class="space-y-4">
                                <div>
                                    <label
                                        class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Sua
                                        resposta</label>
                                    <textarea v-model="taskAnswer" rows="8" class="final-modal-textarea"
                                        placeholder="Descreva sua solucao, arquitetura, estrategia de implementacao e o que foi entregue."></textarea>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Links
                                        ou anexos</label>
                                    <textarea v-model="taskAttachments" rows="3" class="final-modal-textarea"
                                        placeholder="Cole links, um por linha. Ex.: repositorio, deploy, video, Figma."></textarea>
                                </div>

                                <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                                    <p class="text-xs text-ink-500">Os links sao enviados como anexos textuais para o
                                        endpoint do desafio.</p>
                                    <button type="button" class="btn-primary h-11 cursor-pointer px-5 text-sm"
                                        :disabled="isSubmittingTask" @click="submitTaskAnswer">
                                        {{ isSubmittingTask ? 'Enviando...' : 'Enviar resposta' }}
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFinalChallenge } from '~/composables/useFinalChallenge'
import { getUserIdFromSession } from '~/composables/useLoadingConfigurations'
import type { IFinalChallengeTask } from '~/infra/interfaces/services/finalChallenge'

definePageMeta({
    layout: 'default',
})

useHead({
    title: 'Desafio Final',
})

const { $httpClient } = useNuxtApp()
const toast = useToastService()

const {
    snapshot,
    clans,
    tasks,
    leaderboard,
    currentClan,
    countdownLabel,
    isRefreshing,
    loadSnapshot,
} = useFinalChallenge()

const isTaskModalOpen = ref(false)
const selectedTask = ref<IFinalChallengeTask | null>(null)
const taskAnswer = ref('')
const taskAttachments = ref('')
const isSubmittingTask = ref(false)

async function ensureFinalChallengeAccess() {
    const user = getUserIdFromSession()

    if (!user?.enrollmentId) {
        toast.error('Sessão inválida', 'Faça login novamente para continuar.', 4000)
        await navigateTo('/')
        return false
    }

    try {
        const response = await $httpClient.class.GetClassOfFinalChallengeByEnrollmentId(user.enrollmentId)

        if (response?.result?.id) {
            var responseAcess = await $httpClient.finalChallenge.FinalChallengeAccess(response.result.courseId)

            if (responseAcess.result.hasAccess) {
                return true
            }
        }
    } catch (error) {
        console.error('Erro ao validar acesso ao desafio final:', error)
    }

    toast.warn('Desafio final bloqueado', 'A arena só fica disponível no último módulo.', 4000)
    await navigateTo('/trilha-aluno')
    return false
}

function formatDate(value: string) {
    return new Date(value).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatTime(value: string) {
    return new Date(value).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function difficultyLabel(value: IFinalChallengeTask['difficulty']) {
    if (value === 'easy') {
        return 'Leve'
    }

    if (value === 'medium') {
        return 'Medio'
    }

    if (value === 'hard') {
        return 'Hard'
    }

    return 'Boss'
}

function statusLabel(value: IFinalChallengeTask['status']) {
    if (value === 'locked') {
        return 'Bloqueado'
    }

    if (value === 'open') {
        return 'Aberto'
    }

    if (value === 'submitted') {
        return 'Enviado'
    }

    return 'Validado'
}

function rankingTier(index: number) {
    if (index === 0) {
        return 'gold'
    }

    if (index === 1) {
        return 'silver'
    }

    if (index === 2) {
        return 'bronze'
    }

    return 'default'
}

function rankingMedal(index: number) {
    if (index === 0) {
        return 'Ouro'
    }

    if (index === 1) {
        return 'Prata'
    }

    if (index === 2) {
        return 'Bronze'
    }

    return ''
}

function openTaskModal(task: IFinalChallengeTask) {
    selectedTask.value = task
    taskAnswer.value = ''
    taskAttachments.value = ''
    isTaskModalOpen.value = true
}

function closeTaskModal() {
    isTaskModalOpen.value = false
    selectedTask.value = null
    taskAnswer.value = ''
    taskAttachments.value = ''
}

function taskBriefing(task: IFinalChallengeTask) {
    if (task.briefing && task.briefing.trim().length > 0) {
        return task.briefing
    }

    return `Resolva o desafio ${task.title} com foco principal em ${task.category}. Entregue a estrategia adotada, evidencias do que foi construido e justificativa tecnica da sua solucao.`
}

function parsedTaskAttachments() {
    return taskAttachments.value
        .split(/\r?\n|,/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
}

function markTaskAsSubmitted(task: IFinalChallengeTask) {
    task.status = 'submitted'
    task.bestSubmissionAt = new Date().toISOString()
}

async function submitTaskAnswer() {
    if (!selectedTask.value) {
        return
    }

    if (!taskAnswer.value.trim()) {
        toast.warn('Resposta obrigatoria', 'Descreva a sua proposta antes de enviar.', 3500)
        return
    }

    const eventId = snapshot.value?.event.eventId
    if (!eventId) {
        toast.error('Evento indisponivel', 'Nao foi possivel identificar o evento atual do desafio.', 3500)
        return
    }

    isSubmittingTask.value = true

    try {
        const attachments = parsedTaskAttachments()

        const response = await $httpClient.finalChallenge.SubmitAnswer({
            eventId,
            challengeId: selectedTask.value.challengeId,
            answer: taskAnswer.value.trim(),
            attachments: attachments.length > 0 ? attachments : undefined,
        })

        if (!response?.success) {
            throw new Error('Falha ao enviar resposta do desafio.')
        }

        markTaskAsSubmitted(selectedTask.value)
        toast.success('Resposta enviada', response.result?.message || 'Sua resposta entrou na fila de avaliacao.', 3500)
        closeTaskModal()
    } catch (error) {
        console.error('Erro ao enviar resposta do desafio:', error)
        toast.error('Falha no envio', 'Nao foi possivel enviar a resposta do desafio.', 3500)
    } finally {
        isSubmittingTask.value = false
    }
}

onMounted(async () => {
    await ensureFinalChallengeAccess()
})
</script>

<style scoped lang="scss">
.final-refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(8px);
}

.final-refresh-btn:disabled {
    opacity: 0.7;
    cursor: wait;
}

.final-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    border-radius: 999px;
    padding: 0.45rem 0.8rem;
    font-weight: 600;
}

.final-pill--sky {
    background: rgba(255, 255, 255, 0.88);
    color: #b91c1c;
}

.final-pill--red {
    background: rgba(255, 236, 236, 0.95);
    color: #991b1b;
}

.final-pill--dark {
    background: rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.92);
}

.final-ocean-stage {
    position: relative;
    overflow-x: clip;
    overflow-y: hidden;
    isolation: isolate;
    min-height: clamp(24rem, 52vw, 40rem);
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 1.75rem;
    border: 1px solid rgba(252, 165, 165, 0.45);
    background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.5), transparent 30%),
        linear-gradient(180deg, #fff5f5 0%, #fecaca 35%, #f87171 100%);
}

.final-ocean-stage--safe {
    padding-right: 8rem;
    padding-left: 1rem;
}

.final-ocean-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
    background-size: 4.5rem 4.5rem;
    opacity: 0.55;
}

.final-finish-line {
    position: absolute;
    top: 1rem;
    right: 2rem;
    bottom: 0;
    width: 0.5rem;
    background: repeating-linear-gradient(180deg,
            rgba(15, 23, 42, 0.9) 0,
            rgba(15, 23, 42, 0.9) 14px,
            rgba(255, 255, 255, 0.95) 14px,
            rgba(255, 255, 255, 0.95) 28px);
}

.final-finish-line span {
    position: absolute;
    right: -0.9rem;
    top: 1rem;
    transform: rotate(90deg);
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(127, 29, 29, 0.9);
}

.final-ocean-checkpoint {
    position: absolute;
    padding: 0.5rem 0.75rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    color: #7f1d1d;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.final-ocean-checkpoint--1 {
    left: 30%;
    top: 16%;
}

.final-ocean-checkpoint--2 {
    left: 52%;
    top: 72%;
}

.final-ocean-checkpoint--3 {
    right: 6.5rem;
    top: 30%;
}

.final-boat {
    --boat-color: #b91c1c;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: left 0.9s ease, top 0.9s ease, transform 0.4s ease;
}

.final-boat:hover {
    transform: translate(-50%, -50%) scale(1.02);
}

.final-boat--current .final-boat__label {
    border-color: rgba(185, 28, 28, 0.45);
    box-shadow: 0 16px 34px rgba(185, 28, 28, 0.16);
}

.final-boat--reverse {
    transform: translate(-85%, -50%);
}

.final-boat--reverse:hover {
    transform: translate(-100%, -50%) scale(1.02);
}

.final-boat--reverse .final-boat__wake {
    left: auto;
    right: -4rem;
    background: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
}

.final-boat--reverse .final-boat__label {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.final-boat__wake {
    position: absolute;
    left: -4rem;
    top: 1.6rem;
    width: 4.2rem;
    height: 1rem;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
    filter: blur(2px);
    animation: wake-pulse 2.4s ease-in-out infinite;
}

.final-boat__body {
    position: relative;
    width: 6.4rem;
    height: 4rem;
}

.final-boat__body::before {
    content: '';
    position: absolute;
    left: 0.8rem;
    right: 0;
    bottom: 0;
    height: 1.5rem;
    border-radius: 0.8rem 1.1rem 1.5rem 1.5rem;
    background: linear-gradient(180deg, color-mix(in srgb, var(--boat-color) 70%, white), var(--boat-color));
    box-shadow: inset 0 -3px 0 rgba(15, 23, 42, 0.18);
}

.final-boat__sail {
    position: absolute;
    left: 2.8rem;
    bottom: 1.3rem;
    width: 0.2rem;
    height: 1.9rem;
    background: rgba(15, 23, 42, 0.75);
}

.final-boat__sail::before {
    content: '';
    position: absolute;
    left: 0.12rem;
    top: 0.1rem;
    width: 1.6rem;
    height: 1.45rem;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    background: rgba(255, 255, 255, 0.95);
}

.final-boat__flag {
    position: absolute;
    left: 2.9rem;
    top: 0.34rem;
    width: 1.2rem;
    height: 0.6rem;
    border-radius: 0 0.5rem 0.5rem 0;
    background: var(--boat-color);
}

.final-boat__label {
    overflow: hidden;
    width: max-content;
    min-width: 0;
    max-width: 9rem;
    margin-top: 0.7rem;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 1rem;
    padding: 0.8rem 0.95rem;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(6px);
}

.final-boat__label strong,
.final-boat__label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.final-boat__label strong {
    font-size: 0.95rem;
    color: #111827;
}

.final-boat__label span {
    margin-top: 0.15rem;
    font-size: 0.8rem;
    color: #6b7280;
}

.final-ranking-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.9rem;
    align-items: center;
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 1.2rem;
    padding: 0.9rem;
    background: rgba(255, 255, 255, 0.88);
}

.final-ranking-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
}

.final-ranking-strip {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.85rem;
}

.final-ranking-card {
    display: grid;
    gap: 0.85rem;
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 1.5rem;
    padding: 0.85rem;
    background: rgba(255, 255, 255, 0.92);
    min-width: 0;
}

.final-ranking-card--gold {
    border-color: rgba(234, 179, 8, 0.5);
    background: linear-gradient(180deg, rgba(255, 251, 235, 0.98), rgba(254, 249, 195, 0.88));
}

.final-ranking-card--silver {
    border-color: rgba(148, 163, 184, 0.45);
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(226, 232, 240, 0.88));
}

.final-ranking-card--bronze {
    border-color: rgba(180, 83, 9, 0.38);
    background: linear-gradient(180deg, rgba(255, 247, 237, 0.98), rgba(254, 215, 170, 0.88));
}

.final-ranking-card--current {
    border-color: rgba(185, 28, 28, 0.4);
    background: rgba(254, 242, 242, 0.95);
}

.final-ranking-card--gold.final-ranking-card--current,
.final-ranking-card--silver.final-ranking-card--current,
.final-ranking-card--bronze.final-ranking-card--current {
    box-shadow: inset 0 0 0 1px rgba(185, 28, 28, 0.18);
}

.final-ranking-card__position {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 999px;
    background: #0f172a;
    color: #fff;
    font-weight: 700;
    flex-shrink: 0;
}

.final-ranking-card--gold .final-ranking-card__position {
    background: linear-gradient(180deg, #f59e0b, #ca8a04);
}

.final-ranking-card--silver .final-ranking-card__position {
    background: linear-gradient(180deg, #94a3b8, #64748b);
}

.final-ranking-card--bronze .final-ranking-card__position {
    background: linear-gradient(180deg, #c2410c, #9a3412);
}

.final-ranking-card__score {
    flex-shrink: 0;
    text-align: left;
}

.final-ranking-card__name {
    min-width: 0;
    white-space: normal;
    word-break: break-word;
}

.final-ranking-card__tag {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
    background: rgba(220, 38, 38, 0.1);
    color: #b91c1c;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.final-ranking-card__medal {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.5rem;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.final-ranking-card--gold .final-ranking-card__medal {
    background: rgba(234, 179, 8, 0.16);
    color: #a16207;
}

@media (min-width: 768px) {
    .final-ranking-content {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.25rem;
    }

    .final-ranking-strip {
        grid-auto-flow: column;
        grid-auto-columns: 40%;
        grid-template-columns: none;
        overflow-x: auto;
        padding-bottom: 0.35rem;
        padding-inline: 0.1rem;
        overscroll-behavior-x: contain;
        scroll-snap-type: x proximity;
    }

    .final-ranking-card {
        scroll-snap-align: start;
    }

    .final-ranking-card__score {
        text-align: right;
    }

    .final-ranking-card__name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.final-ranking-card--silver .final-ranking-card__medal {
    background: rgba(148, 163, 184, 0.16);
    color: #475569;
}

.final-ranking-card--bronze .final-ranking-card__medal {
    background: rgba(194, 65, 12, 0.14);
    color: #9a3412;
}

.final-ranking-row--current {
    border-color: rgba(185, 28, 28, 0.36);
    background: rgba(254, 242, 242, 0.88);
}

.final-ranking-row__position {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    background: #0f172a;
    color: #fff;
    font-weight: 700;
}

.final-ranking-row__meta {
    min-width: 0;
}

.final-task-card {
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 1.5rem;
    padding: 1rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(254, 242, 242, 0.88));
}

.final-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.46);
    backdrop-filter: blur(6px);
}

.final-modal-card {
    width: min(100%, 70rem);
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 1.75rem;
    padding: 1.25rem;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
}

.final-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 999px;
    background: #fff5f5;
    color: #991b1b;
    cursor: pointer;
}

.final-modal-textarea {
    width: 100%;
    border: 1px solid rgba(254, 202, 202, 0.95);
    border-radius: 1rem;
    padding: 0.95rem 1rem;
    resize: vertical;
    background: rgba(255, 255, 255, 0.96);
    color: #111827;
}

.final-modal-textarea:focus {
    outline: 2px solid rgba(220, 38, 38, 0.18);
    outline-offset: 0;
    border-color: rgba(220, 38, 38, 0.5);
}

.final-modal-fade-enter-active,
.final-modal-fade-leave-active {
    transition: opacity 0.24s ease;
}

.final-modal-fade-enter-from,
.final-modal-fade-leave-to {
    opacity: 0;
}

.final-difficulty,
.final-task-status {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.3rem 0.65rem;
    font-weight: 700;
}

.final-difficulty--easy {
    background: #dcfce7;
    color: #166534;
}

.final-difficulty--medium {
    background: #fef3c7;
    color: #92400e;
}

.final-difficulty--hard {
    background: #fee2e2;
    color: #991b1b;
}

.final-difficulty--boss {
    background: #ede9fe;
    color: #6d28d9;
}

@media (max-width: 1243px) {
    .final-ranking-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
}

@media (max-width: 1024px) {
    .final-ranking-strip {
        grid-auto-columns: 50%;
    }
}

@media (max-width: 640px) {

    .final-pill,
    .final-refresh-btn {
        justify-content: center;
        width: 100%;
    }

    .final-ocean-stage {
        min-height: 21rem;
    }

    .final-ocean-stage--safe {
        padding-right: 4.5rem;
        padding-left: 0.75rem;
    }

    .final-finish-line {
        right: 1rem;
        width: 0.35rem;
    }

    .final-finish-line span {
        right: -1.15rem;
        font-size: 0.62rem;
        letter-spacing: 0.14em;
    }

    .final-ocean-checkpoint {
        padding: 0.35rem 0.55rem;
        font-size: 0.62rem;
    }

    .final-ocean-checkpoint--1 {
        left: 24%;
        top: 14%;
    }

    .final-ocean-checkpoint--2 {
        left: 47%;
        top: 74%;
    }

    .final-ocean-checkpoint--3 {
        right: 3.6rem;
        top: 31%;
    }

    .final-boat__wake {
        width: 2.8rem;
        left: -2.7rem;
    }

    .final-boat--reverse .final-boat__wake {
        right: -2.7rem;
    }

    .final-boat__body {
        width: 4.8rem;
        height: 3.1rem;
    }

    .final-boat__body::before {
        left: 0.55rem;
        height: 1.15rem;
    }

    .final-boat__sail {
        left: 2.1rem;
        bottom: 1rem;
        height: 1.5rem;
    }

    .final-boat__sail::before {
        width: 1.2rem;
        height: 1.1rem;
    }

    .final-boat__flag {
        left: 2.2rem;
        top: 0.4rem;
        width: 0.9rem;
        height: 0.5rem;
    }

    .final-boat__label {
        max-width: 6.4rem;
        padding: 0.55rem 0.65rem;
        border-radius: 0.85rem;
    }

    .final-boat__label strong {
        font-size: 0.78rem;
    }

    .final-boat__label span {
        font-size: 0.68rem;
    }

    .final-ranking-strip {
        grid-auto-columns: 80%;
    }

    .final-ranking-card__score {
        width: 100%;
        text-align: left;
    }

    .final-modal-card {
        padding: 1rem;
        border-radius: 1.25rem;
    }
}

@media (max-width: 500px) {
    .final-ocean-stage {
        min-height: 18.5rem;
        border-radius: 1.25rem;
    }

    .final-ocean-stage--safe {
        padding-right: 3.4rem;
        padding-left: 0.5rem;
    }

    .final-ocean-grid {
        background-size: 3rem 3rem;
    }

    .final-finish-line {
        top: 0.75rem;
        right: 0.7rem;
    }

    .final-finish-line span {
        right: -1rem;
        top: 0.6rem;
    }

    .final-ocean-checkpoint {
        letter-spacing: 0.04em;
    }

    .final-ocean-checkpoint--1 {
        left: 20%;
        top: 12%;
    }

    .final-ocean-checkpoint--2 {
        left: 42%;
        top: 77%;
    }

    .final-ocean-checkpoint--3 {
        right: 2.6rem;
        top: 34%;
    }

    .final-boat__wake,
    .final-boat--reverse .final-boat__wake {
        display: none;
    }

    .final-boat--reverse {
        transform: translate(-78%, -50%);
    }

    .final-boat--reverse:hover {
        transform: translate(-78%, -50%) scale(1.02);
    }

    .final-boat__body {
        width: 4rem;
        height: 2.6rem;
    }

    .final-boat__sail {
        left: 1.7rem;
        bottom: 0.82rem;
        height: 1.25rem;
    }

    .final-boat__sail::before {
        width: 1rem;
        height: 0.9rem;
    }

    .final-boat__flag {
        left: 1.8rem;
        width: 0.72rem;
    }

    .final-boat__label {
        max-width: 5rem;
        margin-top: 0.45rem;
        padding: 0.45rem 0.55rem;
    }

    .final-ranking-strip {
        grid-auto-columns: 88%;
    }

    .final-ranking-card {
        border-radius: 1.2rem;
        padding: 0.75rem;
    }

    .final-task-card {
        border-radius: 1.2rem;
        padding: 0.85rem;
    }

    .final-modal-overlay {
        padding: 0.75rem;
    }
}

.final-task-status--locked {
    background: #e2e8f0;
    color: #334155;
}

.final-task-status--open {
    background: #dbeafe;
    color: #1d4ed8;
}

.final-task-status--submitted {
    background: #fef3c7;
    color: #92400e;
}

.final-task-status--validated {
    background: #dcfce7;
    color: #166534;
}

@keyframes wake-pulse {

    0%,
    100% {
        opacity: 0.45;
        transform: scaleX(1);
    }

    50% {
        opacity: 0.9;
        transform: scaleX(1.12);
    }
}
</style>