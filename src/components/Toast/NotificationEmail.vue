<template>
    <transition name="email-notification-fade">
        <div v-if="isVisible" class="notification-wrapper" aria-live="polite">
            <section class="notification-card" role="status">
                <div class="notification-icon" aria-hidden="true">
                    <i class="pi pi-envelope" />
                </div>

                <div class="notification-content">
                    <p class="notification-title">Confirme seu e-mail</p>
                    <p class="notification-message">
                        Por segurança, confirme <strong>{{ emailToShow }}</strong> para manter sua conta protegida.
                    </p>
                </div>

                <div class="notification-actions">
                    <button type="button" class="action-primary" @click="goToEmailConfirmation">
                        Confirmar agora
                    </button>
                    <button type="button" class="action-secondary" @click="dismiss">
                        Lembrar depois
                    </button>
                </div>
            </section>
        </div>
    </transition>

    <SendEmailModal v-model:visible="showModalConfirmedEmail" :name="'Confirme seu e-mail'"
        @back="showModalConfirmedEmail = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SendEmailModal from '../Modals/SendEmailModal.vue';

const props = defineProps<{
    email?: string
}>()

const isVisible = ref(true)
const emailToShow = computed(() => {
    if (!props.email || !props.email.trim()) {
        return 'seu e-mail'
    }

    return props.email
})


const showModalConfirmedEmail = ref(false);

function dismiss() {
    isVisible.value = false
}

async function goToEmailConfirmation() {
    showModalConfirmedEmail.value = true;
    isVisible.value = false
}
</script>

<style scoped lang="scss">
.notification-wrapper {
    position: fixed;
    top: 20px;
    right: 16px;
    z-index: 7000;
    pointer-events: none;
}

.notification-card {
    width: min(92vw, 360px);
    border-radius: 14px;
    border: 2px solid rgba(232, 92, 92, 0.54);
    background: var(--color-white);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
    backdrop-filter: blur(10px);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    padding: 12px;
    pointer-events: auto;
}

.notification-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.95rem;
    margin-top: 2px;
}

.notification-content {
    min-width: 0;
}

.notification-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-ink-900);
}

.notification-message {
    margin: 4px 0 0;
    font-size: 0.8rem;
    line-height: 1.35;
    color: var(--color-ink-700);
}

.notification-actions {
    grid-column: 1 / -1;
    display: flex;
    gap: 8px;
}

.action-primary,
.action-secondary {
    height: 32px;
    border-radius: 9px;
    border: 1px solid transparent;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-primary {
    flex: 1;
    background: #dc2626;
    color: #fff;
}

.action-primary:hover {
    background: #b91c1c;
}

.action-secondary {
    min-width: 112px;
    background: transparent;
    border-color: rgba(148, 163, 184, 0.35);
    color: var(--color-ink-700);
}

.action-secondary:hover {
    background: rgba(148, 163, 184, 0.12);
}

.email-notification-fade-enter-active,
.email-notification-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.email-notification-fade-enter-from,
.email-notification-fade-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

:global(.dark) .notification-card {
    background: rgba(15, 23, 42, 0.9);
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.45);
}

:global(.dark) .notification-icon {
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
}

:global(.dark) .action-secondary {
    border-color: rgba(148, 163, 184, 0.45);
}

@media (max-width: 640px) {
    .notification-wrapper {
        right: 10px;
        left: 10px;
    }

    .notification-card {
        width: 100%;
    }
}
</style>