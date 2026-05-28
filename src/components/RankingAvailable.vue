<template>
    <div class="flex justify-center text-center">
        <div class="flex items-center gap-3">
            <button type="button" class="ranking-cta group" :class="{ 'ranking-cta--disabled': disabled }"
                :disabled="disabled" :aria-disabled="disabled" :title="disabled ? disabledReason : undefined"
                :aria-label="disabled ? disabledReason : 'Abrir ranking global por notas'" @click="handleClick">
                <span class="ranking-cta__shine" aria-hidden="true"></span>
                <i class="pi pi-trophy ranking-cta__icon" aria-hidden="true"></i>
                <span>Ranking Global por Notas</span>
                <i class="pi pi-arrow-right ranking-cta__arrow" aria-hidden="true"></i>
            </button>

            <button type="button" class="historico-btn cursor-pointer" @click="openHistorico" :disabled="disabled"
                :aria-disabled="disabled" :title="disabled ? disabledReason : 'Ver histórico de ranking'">
                📊 Ver Histórico
            </button>
        </div>
    </div>

    <!-- Modal de Histórico de Ranking -->
    <Teleport to="body">
        <Transition name="historico-fade" appear>
            <div v-if="showHistoricoModal" class="historico-mask" @click.self="showHistoricoModal = false">
                <div class="historico-modal">
                    <div class="historico-modal__header">
                        <div class="flex items-center gap-3">
                            <div class="historico-modal__icon">
                                <span class="text-2xl">📈</span>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-400">Histórico</p>
                                <h3 class="text-base font-semibold text-slate-900">Seu progresso no ranking 🎯</h3>
                            </div>
                        </div>
                        <button type="button" class="historico-modal__close" @click="showHistoricoModal = false"
                            aria-label="Fechar">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="historico-modal__body hide-scrollbar">
                        <slot name="historico-content">
                            <div class="historico-empty">
                                <span class="text-4xl">📋</span>
                                <p class="mt-3 text-sm font-medium text-slate-600">Nenhum histórico disponível ainda.
                                </p>
                                <p class="mt-1 text-xs text-slate-400">Seu histórico de ranking aparecerá aqui.</p>
                            </div>
                        </slot>
                    </div>

                    <div class="historico-modal__footer">
                        <button type="button" class="historico-close-btn" @click="showHistoricoModal = false">
                            Fechar 👋
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
const { $httpClient } = useNuxtApp();
const toast = useToastService();

const props = withDefaults(
    defineProps<{
        disabled?: boolean
        disabledReason?: string
    }>(),
    {
        disabled: false,
        disabledReason: 'Você ainda não possui nota disponível para participar do ranking.',
    },
)

const emit = defineEmits<{
    (event: 'click'): void
}>()

const showHistoricoModal = ref(false)

function handleClick() {
    if (props.disabled) {
        return
    }

    emit('click')
}

async function openHistorico() {
    if (props.disabled) {
        return
    }

    showHistoricoModal.value = true

    try {
        var response = await $httpClient.point.GetHistoryRanking(1);
    } catch (error) {
        console.error('Erro ao disparar evento open-historico:', error)
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
    border: 1px solid #8DC4E8;
    border-radius: 999px;
    padding: 0.62rem 1rem;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1;
    color: #04325A;
    background: linear-gradient(100deg, #EBF5FF 0%, #BDD9F2 50%, #ffffff 100%);
    box-shadow: 0 1px 4px rgba(24, 122, 191, 0.22);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    animation: ranking-pulse 2.2s ease-in-out infinite;
}

.ranking-cta:hover {
    transform: translateY(-1px) scale(1.01);
    border-color: #49A8EB;
    box-shadow: 0 2px 10px rgba(24, 122, 191, 0.28);
}

.ranking-cta--disabled {
    opacity: 0.55;
    cursor: not-allowed;
    animation: none;
    box-shadow: none;
}

.ranking-cta--disabled:hover {
    transform: none;
    border-color: #8DC4E8;
    box-shadow: none;
}

.ranking-cta:active {
    transform: translateY(0) scale(0.99);
}

.ranking-cta:focus-visible {
    outline: 2px solid #49A8EB;
    outline-offset: 2px;
}

.ranking-cta__icon {
    color: #187ABF;
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
        box-shadow: 0 10px 24px rgba(24, 122, 191, 0.22);
    }

    50% {
        box-shadow: 0 14px 30px rgba(24, 122, 191, 0.34);
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

/* ── Histórico button ────────────────────────── */
.historico-btn {
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

    &:hover:not(:disabled) {
        background: linear-gradient(135deg, #8DC4E8 0%, #187ABF 100%);
        border-color: #187ABF;
        box-shadow: 0 4px 14px rgba(24, 122, 191, 0.25);
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

/* ── Histórico modal ─────────────────────────── */
.historico-mask {
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

.historico-modal {
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

.historico-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1rem 1.4rem;
    background: linear-gradient(135deg, #BDD9F2 0%, #EBF5FF 100%);
    border-bottom: 1.5px solid #8DC4E8;
}

.historico-modal__icon {
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

.historico-modal__close {
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
        border-color: #8DC4E8;
        background: #BDD9F2;
        color: #04325A;
    }
}

.historico-modal__body {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.4rem;
}

.historico-modal__footer {
    padding: 0.9rem 1.4rem;
    border-top: 1.5px solid #8DC4E8;
    background: #EBF5FF;
    display: flex;
    justify-content: flex-end;
}

.historico-close-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    height: 2.1rem;
    padding: 0 1.1rem;
    border-radius: 0.625rem;
    border: 1.5px solid #8DC4E8;
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

.historico-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    text-align: center;
}

.historico-fade-enter-active,
.historico-fade-leave-active {
    transition: opacity 0.2s ease;

    .historico-modal {
        transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
}

.historico-fade-enter-from,
.historico-fade-leave-to {
    opacity: 0;

    .historico-modal {
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
</style>