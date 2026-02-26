<template>
    <Toast :key="toastKey" :position="toastPosition" appendTo="body" :baseZIndex="8000" :pt="{
        root: { class: 'toast-container', style: 'z-index:14000 !important;border:0;outline:0;box-shadow:none;background:transparent;' },
        message: { class: 'toast-message-wrapper', style: 'border:0;outline:0;box-shadow:none;background:transparent;' },
        messageContent: { style: 'border:0;outline:0;box-shadow:none;background:transparent;padding:0;' },
        closeButton: { style: 'display: none' }
    }">
        <template #message="slotProps">
            <div class="app-toast" :class="slotProps.message.severity">
                <div class="toast-icon-wrapper">
                    <i :class="iconMap[slotProps.message.severity]" class="toast-icon" />
                </div>

                <div class="content">
                    <strong class="toast-title">{{ slotProps.message.summary }}</strong>
                    <p class="toast-message">{{ slotProps.message.detail }}</p>
                </div>

                <button @click="() => toast.remove(slotProps.message)" class="toast-close-btn" aria-label="Fechar">
                    <i class="pi pi-times"></i>
                </button>
            </div>
        </template>
    </Toast>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const isMobile = ref(false)
const toastKey = ref(0)

const toastPosition = computed(() => {
    if (isMobile.value) return 'top-center'
    return 'top-right'
})

const onResize = () => {
    if (typeof window === 'undefined') return
    isMobile.value = window.innerWidth <= 640
}

onMounted(() => {
    onResize()
    window.addEventListener('resize', onResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', onResize)
})

const iconMap: Record<string, string> = {
    success: 'pi pi-check-circle',
    info: 'pi pi-info-circle',
    warn: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle'
}
</script>

<style lang="scss">
.app-toast {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 10px 20px;
    border-radius: 14px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    animation: toastSlideIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.34);
    overflow: hidden;
}

.app-toast::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.35);
}

.app-toast::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    pointer-events: none;
    animation: shimmer 2s ease-in-out infinite;
}

@keyframes toastSlideIn {
    from {
        transform: translateX(120%) scale(0.8);
        opacity: 0;
    }

    to {
        transform: translateX(0) scale(1);
        opacity: 1;
    }
}

@keyframes shimmer {

    0%,
    100% {
        transform: rotate(0deg) translate(0, 0);
        opacity: 0;
    }

    50% {
        opacity: 0.3;
    }
}

.app-toast.success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%);
    color: #ffffff;
    border-color: rgba(167, 243, 208, 0.55);
}

.app-toast.error {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%);
    color: #ffffff;
    border-color: rgba(254, 202, 202, 0.55);
}

.app-toast.warn {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%);
    color: #ffffff;
    border-color: rgba(253, 230, 138, 0.55);
}

.app-toast.info {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%);
    color: #ffffff;
    border-color: rgba(191, 219, 254, 0.55);
}

.toast-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
}

.toast-icon-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

.toast-icon {
    font-size: 1.5rem;
    animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.1s both;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

@keyframes iconBounce {
    0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
    }

    50% {
        transform: scale(1.2) rotate(10deg);
    }

    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.toast-title {
    font-size: 1.05rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 0.2px;
    line-height: 1.3;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toast-message {
    margin: 0;
    font-size: 0.9rem;
    opacity: 0.92;
    line-height: 1.5;
    font-weight: 400;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toast-close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    outline: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    backdrop-filter: blur(10px);
}

.toast-close-btn:focus,
.toast-close-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.35);
}

.toast-close-btn:hover {
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.08) rotate(90deg);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-close-btn:active {
    transform: scale(0.92) rotate(90deg);
}

.toast-close-btn i {
    font-size: 1rem;
    font-weight: bold;
}

/* Override PrimeVue default styles */
.p-toast {
    --p-toast-message-gap: 16px;
    z-index: 8000 !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

.p-toast-message {
    --p-toast-message-border-width: 0 !important;
    --p-toast-message-border-color: transparent !important;
    position: relative !important;
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    will-change: opacity, transform;
    backface-visibility: hidden;
}

.p-toast-message.toast-message-wrapper {
    transition: opacity 0.22s ease, transform 0.22s ease !important;
    transform-origin: top right;
}

.p-toast-message-enter-from.toast-message-wrapper,
.p-toast-message-leave-to.toast-message-wrapper {
    opacity: 0;
    transform: translateY(-10px) scale(0.97);
}

.p-toast-message-enter-to.toast-message-wrapper,
.p-toast-message-leave-from.toast-message-wrapper {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.p-toast-message-success,
.p-toast-message-info,
.p-toast-message-warn,
.p-toast-message-error {
    border: none !important;
    border-inline-start: 0 !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
}

.p-toast-message-content {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin-bottom: 12px;
}

.p-toast-message-text,
.p-toast-summary,
.p-toast-detail,
.p-toast-close-button,
.p-toast-close-icon,
.toast-container,
.toast-message-wrapper {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

.p-toast-message-icon,
.p-toast-message-text {
    display: none !important;
}

.toast-message-wrapper {
    margin-bottom: 16px;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
}

.toast-message-wrapper:last-child {
    margin-bottom: 0;
}

@media (max-width: 640px) {

  .p-toast {
    width: 100% !important;
    left: 0 !important;
    right: 0 !important;
    transform: none !important;
    padding: 0 12px;
  }

  .p-toast-top-right,
  .p-toast-top-center {
    top: 16px !important;
    left: 0 !important;
    right: 0 !important;
    transform: none !important;
    display: flex;
    justify-content: center;
  }

  .app-toast {
    width: 100%;
    max-width: 100%;
    padding: 12px;
    border-radius: 12px;
    gap: 12px;
  }

  .content {
    min-width: 0;
  }

  .toast-title,
  .toast-message {
    word-break: break-word;
  }
}
</style>