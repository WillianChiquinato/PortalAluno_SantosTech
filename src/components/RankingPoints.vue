<template>
    <div class="flex justify-center text-center">
        <div class="flex items-center gap-3">
            <button type="button" class="ranking-cta group" :class="{ 'ranking-cta--disabled': disabled }"
                :disabled="disabled" :aria-disabled="disabled" :title="disabled ? disabledReason : undefined"
                :aria-label="disabled ? disabledReason : 'Abrir ranking global por pontos'" @click="handleClick">
                <span class="ranking-cta__shine" aria-hidden="true"></span>
                <i class="pi pi-star-fill ranking-cta__icon" aria-hidden="true"></i>
                <span>Ranking por Pontos</span>
                <i class="pi pi-arrow-right ranking-cta__arrow" aria-hidden="true"></i>
            </button>

            <button type="button" class="historico-pontos-btn cursor-pointer" @click="openHistorico"
                :disabled="disabled" :aria-disabled="disabled"
                :title="disabled ? disabledReason : 'Ver histórico de pontos'">
                📊 Histórico
            </button>
        </div>
    </div>

    <!-- Modal de Histórico de Pontos -->
    <Teleport to="body">
        <Transition name="historico-pontos-fade" appear>
            <div v-if="showHistoricoPontosModal" class="historico-pontos-mask"
                @click.self="showHistoricoPontosModal = false">
                <div class="historico-pontos-modal">
                    <div class="historico-pontos-modal__header">
                        <div class="flex items-center gap-3">
                            <div class="historico-pontos-modal__icon">
                                <span class="text-2xl">⭐</span>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-rose-400">Histórico</p>
                                <h3 class="text-base font-semibold text-slate-900">Evolução de pontos 📈</h3>
                            </div>
                        </div>
                        <button type="button" class="historico-pontos-modal__close"
                            @click="showHistoricoPontosModal = false" aria-label="Fechar">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="historico-pontos-modal__body hide-scrollbar">
                        <div v-if="loadingHistorico" class="historico-pontos-empty">
                            <span class="text-4xl">⏳</span>
                            <p class="mt-3 text-sm font-medium text-slate-600">Carregando histórico...</p>
                        </div>
                        <div v-else-if="!historicoEvents.length" class="historico-pontos-empty">
                            <span class="text-4xl">📚</span>
                            <p class="mt-3 text-sm font-medium text-slate-600">Nenhum histórico de pontos disponível
                                ainda.</p>
                            <p class="mt-1 text-xs text-slate-400">Seu histórico de pontos aparecerá aqui.</p>
                        </div>
                        <div v-else class="historico-events-list">
                            <div v-for="event in historicoEvents" :key="event.eventId" class="historico-event-card">
                                <div class="historico-event-card__header">
                                    <div class="flex items-center gap-2 min-w-0">
                                        <span class="historico-event-type-badge"
                                            :class="event.eventType === 'Pontos' ? 'badge--pontos' : 'badge--notas'">
                                            {{ event.eventType === 'Pontos' ? '⭐' : '📝' }} {{ event.eventType }}
                                        </span>
                                        <span class="historico-event-name truncate">{{ event.eventName }}</span>
                                    </div>
                                    <span class="historico-event-date">{{ formatEventDate(event.recordedAt) }}</span>
                                </div>
                                <div class="historico-event-card__winners">
                                    <div v-for="winner in event.winners" :key="winner.awardId"
                                        class="historico-winner-row">
                                        <span class="historico-winner-position">{{ positionEmoji(winner.rankingPosition)
                                            }}</span>
                                        <img v-if="winner.userProfilePictureUrl" :src="winner.userProfilePictureUrl"
                                            :alt="winner.userName" class="historico-winner-avatar" />
                                        <span v-else
                                            class="historico-winner-avatar historico-winner-avatar--placeholder">
                                            {{ winner.userName.charAt(0).toUpperCase() }}
                                        </span>
                                        <div class="historico-winner-info min-w-0">
                                            <p class="historico-winner-name truncate">{{ winner.userName }}</p>
                                            <p class="historico-winner-award truncate">🏆 {{ winner.awardName }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="historico-pontos-modal__footer">
                        <button type="button" class="historico-pontos-close-btn"
                            @click="showHistoricoPontosModal = false">
                            Fechar 👋
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import type { IHistoryRankingEvent } from '~/infra/interfaces/services/point'

const { $httpClient } = useNuxtApp();
const toast = useToastService();

const props = withDefaults(
    defineProps<{
        disabled?: boolean
        disabledReason?: string
    }>(),
    {
        disabled: false,
        disabledReason: 'Você ainda não possui pontos disponíveis para participar do ranking.',
    },
)

const emit = defineEmits<{
    (event: 'click'): void
    (event: 'open-historico-pontos'): void
}>()

const showHistoricoPontosModal = ref(false)
const loadingHistorico = ref(false)
const historicoEvents = ref<IHistoryRankingEvent[]>([])

function handleClick() {
    if (props.disabled) {
        return
    }

    emit('click')
}

function formatEventDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function positionEmoji(pos: number): string {
    if (pos === 1) return '🥇'
    if (pos === 2) return '🥈'
    if (pos === 3) return '🥉'
    return `#${pos}`
}

async function openHistorico() {
    if (props.disabled) {
        return
    }

    showHistoricoPontosModal.value = true
    loadingHistorico.value = true
    historicoEvents.value = []

    try {
        const response = await $httpClient.point.GetHistoryRanking(2)
        if (response.success && response.result) {
            historicoEvents.value = response.result
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error)
    } finally {
        loadingHistorico.value = false
    }
}
</script>

<style scoped lang="scss">
.ranking-cta {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    overflow: hidden;
    border: 1px solid #fda4af;
    border-radius: 999px;
    padding: 0.62rem 1rem;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1;
    color: #9f1239;
    background: linear-gradient(100deg, #fff1f2 0%, #ffe4e6 42%, #fff7ed 100%);
    box-shadow: 0 1px 4px rgba(244, 63, 94, 0.22);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    animation: ranking-pulse 2.2s ease-in-out infinite;
}

.ranking-cta:hover {
    transform: translateY(-1px) scale(1.01);
    border-color: #fb7185;
    box-shadow: 0 2px 10px rgba(244, 63, 94, 0.28);
}

.ranking-cta--disabled {
    opacity: 0.55;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
}

.ranking-cta--disabled:hover {
    transform: none;
    border-color: #fda4af;
    box-shadow: none;
}

.ranking-cta:active {
    transform: translateY(0) scale(0.99);
}

.ranking-cta:focus-visible {
    outline: 2px solid #fb7185;
    outline-offset: 2px;
}

.ranking-cta__icon {
    color: #be123c;
    font-size: 0.8rem;
}

.ranking-cta__arrow {
    font-size: 0.68rem;
    transition: transform 0.2s ease;
}

.group:hover .ranking-cta__arrow {
    transform: translateX(2px);
}

.ranking-cta--disabled .ranking-cta__arrow {
    transform: none;
}

.ranking-cta__shine {
    position: absolute;
    inset: -180% auto;
    left: -45%;
    width: 38%;
    transform: rotate(24deg);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.68), transparent);
    animation: ranking-shine 2.4s linear infinite;
    pointer-events: none;
}

.ranking-cta--disabled .ranking-cta__shine {
    display: none;
}

@keyframes ranking-pulse {

    0%,
    100% {
        box-shadow: 0 10px 24px rgba(244, 63, 94, 0.22);
    }

    50% {
        box-shadow: 0 14px 30px rgba(244, 63, 94, 0.34);
    }
}

@keyframes ranking-shine {
    0% {
        transform: translateX(-170%) rotate(24deg);
    }

    100% {
        transform: translateX(330%) rotate(24deg);
    }
}

@media (prefers-reduced-motion: reduce) {

    .ranking-cta,
    .ranking-cta__shine {
        animation: none;
    }
}

/* ── Histórico de Pontos button ────────────────────────── */
.historico-pontos-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    height: 2.25rem;
    padding: 0 1rem;
    border-radius: 0.75rem;
    border: 1.5px solid #fb7185;
    background: linear-gradient(135deg, #ffe4e6 0%, #fda4af 100%);
    color: #9f1239;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(244, 63, 94, 0.15);
    transition: all 0.18s ease;

    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #fda4af 0%, #f43f5e 100%);
        border-color: #f43f5e;
        box-shadow: 0 4px 14px rgba(244, 63, 94, 0.25);
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
}

/* ── Histórico de Pontos modal ─────────────────────────── */
.historico-pontos-mask {
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

.historico-pontos-modal {
    width: min(94vw, 580px);
    max-height: min(88vh, 700px);
    display: flex;
    flex-direction: column;
    border-radius: 1.25rem;
    border: 1.5px solid #fda4af;
    background: #fff;
    box-shadow:
        0 32px 80px rgba(244, 63, 94, 0.18),
        0 8px 24px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

.historico-pontos-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.4rem;
    background: linear-gradient(135deg, #ffe4e6 0%, #fff1f2 100%);
    border-bottom: 1.5px solid #fda4af;
}

.historico-pontos-modal__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.875rem;
    border: 1.5px solid #fda4af;
    background: linear-gradient(135deg, #ffe4e6, #fff1f2);
    box-shadow: 0 2px 8px rgba(244, 63, 94, 0.2);
}

.historico-pontos-modal__close {
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
        border-color: #fb7185;
        background: #ffe4e6;
        color: #9f1239;
    }
}

.historico-pontos-modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.4rem;
}

.historico-pontos-modal__footer {
    padding: 0.9rem 1.4rem;
    border-top: 1.5px solid #fda4af;
    background: #fff1f2;
    display: flex;
    justify-content: flex-end;
}

.historico-pontos-close-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    height: 2.1rem;
    padding: 0 1.1rem;
    border-radius: 0.625rem;
    border: 1.5px solid #fb7185;
    background: linear-gradient(135deg, #ffe4e6, #fda4af);
    color: #9f1239;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: linear-gradient(135deg, #fda4af, #fb7185);
        box-shadow: 0 2px 10px rgba(244, 63, 94, 0.2);
    }
}

.historico-pontos-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    text-align: center;
}

.historico-pontos-fade-enter-active,
.historico-pontos-fade-leave-active {
    transition: opacity 0.2s ease;

    .historico-pontos-modal {
        transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
}

.historico-pontos-fade-enter-from,
.historico-pontos-fade-leave-to {
    opacity: 0;

    .historico-pontos-modal {
        opacity: 0;
        transform: scale(0.92) translateY(12px);
    }
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

/* ── History events list ───────────────────────────────── */
.historico-events-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.historico-event-card {
    border: 1.5px solid #fda4af;
    border-radius: 0.875rem;
    overflow: hidden;
    background: #fff;
}

.historico-event-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.6rem 0.9rem;
    background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%);
    border-bottom: 1px solid #fda4af;
}

.historico-event-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    white-space: nowrap;

    &.badge--pontos {
        background: #ffe4e6;
        color: #9f1239;
        border: 1px solid #fda4af;
    }

    &.badge--notas {
        background: #eff6ff;
        color: #1e40af;
        border: 1px solid #93c5fd;
    }
}

.historico-event-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1e293b;
}

.historico-event-date {
    font-size: 0.68rem;
    color: #94a3b8;
    white-space: nowrap;
    flex-shrink: 0;
}

.historico-event-card__winners {
    display: flex;
    flex-direction: column;
    gap: 0;
}

.historico-winner-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.55rem 0.9rem;
    border-bottom: 1px solid #f1f5f9;

    &:last-child {
        border-bottom: none;
    }
}

.historico-winner-position {
    font-size: 1.1rem;
    width: 1.5rem;
    text-align: center;
    flex-shrink: 0;
}

.historico-winner-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1.5px solid #fda4af;

    &.historico-winner-avatar--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ffe4e6, #fda4af);
        color: #9f1239;
        font-size: 0.75rem;
        font-weight: 700;
    }
}

.historico-winner-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
}

.historico-winner-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: #1e293b;
}

.historico-winner-award {
    font-size: 0.68rem;
    color: #64748b;
}
</style>
