<template>
    <Transition name="fade" appear>
        <div class="loading-screen" role="status" aria-live="polite">
            <div class="loading-card">
                <img :src="logoSrc" alt="Santos Games" class="brand-logo" />
                <p class="loading-text">{{ RandomNames }}</p>
                <div class="progress-shell" aria-hidden="true">
                    <div class="progress-fill"></div>
                </div>
                <div class="dots" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import logoSrc from '@/assets/logoPreta.png';

const RandomNames = [
    'Carregando conquistas...',
    'Preparando desafios...',
    'Ajustando recompensas...',
    'Sincronizando progresso...',
    'Gamificando sua jornada...'
][Math.floor(Math.random() * 5)]

</script>

<style scoped>
.fade-enter-active,
.fade-appear-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-appear-from,
.fade-leave-to {
    opacity: 0;
}

.loading-card {
    transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.42s ease;
}

.fade-enter-from .loading-card,
.fade-appear-from .loading-card {
    opacity: 0;
    transform: translateY(8px) scale(0.78);
}

.fade-leave-to .loading-card {
    opacity: 0;
    transform: translateY(10px) scale(0.9);
}

.loading-screen {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 9999;
    background:
        radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--color-brand-500) 16%, transparent) 0%, transparent 45%),
        radial-gradient(circle at 80% 85%, color-mix(in srgb, var(--color-accent-500) 18%, transparent) 0%, transparent 40%),
        color-mix(in srgb, var(--color-ink-900) 74%, transparent);
    backdrop-filter: blur(10px);
}

.loading-card {
    position: relative;
    overflow: hidden;
    width: min(90vw, 360px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.95rem;
    padding: 1.35rem 1.1rem;
    border-radius: 18px;
    border: 1px solid color-mix(in srgb, var(--color-sand-100) 20%, transparent);
    background:
        linear-gradient(140deg,
            color-mix(in srgb, var(--color-sand-100) 9%, transparent),
            color-mix(in srgb, var(--color-brand-500) 12%, transparent));
    box-shadow:
        0 16px 36px color-mix(in srgb, var(--color-ink-900) 45%, transparent),
        inset 0 1px 0 color-mix(in srgb, var(--color-sand-100) 22%, transparent);
}

.loading-card::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(115deg,
            color-mix(in srgb, var(--color-accent-500) 28%, transparent),
            transparent 35%,
            transparent 65%,
            color-mix(in srgb, var(--color-brand-500) 30%, transparent));
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude;
    padding: 1px;
}

.brand-logo {
    width: min(150px, 46vw);
    height: auto;
    object-fit: contain;
    filter:
        drop-shadow(0 9px 16px color-mix(in srgb, var(--color-ink-900) 35%, transparent)) drop-shadow(0 0 18px color-mix(in srgb, var(--color-accent-500) 16%, transparent));
    animation: breathe 1.6s ease-in-out infinite;
}

.loading-text {
    margin: 0;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    color: color-mix(in srgb, var(--color-sand-100) 88%, transparent);
}

.progress-shell {
    width: 100%;
    height: 7px;
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-sand-100) 14%, transparent);
}

.progress-fill {
    width: 45%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg,
            color-mix(in srgb, var(--color-accent-500) 90%, transparent),
            color-mix(in srgb, var(--color-brand-500) 90%, transparent));
    box-shadow: 0 0 16px color-mix(in srgb, var(--color-accent-500) 24%, transparent);
    animation: run 1.3s ease-in-out infinite;
}

.dots {
    display: flex;
    gap: 0.38rem;
}

.dots span {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-accent-500) 88%, transparent);
    animation: dot 0.9s ease-in-out infinite;
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent-500) 28%, transparent);
}

.dots span:nth-child(2) {
    animation-delay: 0.12s;
}

.dots span:nth-child(3) {
    animation-delay: 0.24s;
}

@keyframes dot {

    0%,
    100% {
        transform: translateY(0);
        opacity: 0.55;
    }

    50% {
        transform: translateY(-3px);
        opacity: 1;
    }
}

@keyframes breathe {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.03);
    }
}

@keyframes run {
    0% {
        transform: translateX(-120%);
    }

    100% {
        transform: translateX(220%);
    }
}
</style>
