<template>
    <div class="flex justify-center text-center">
        <button type="button" class="ranking-cta group" :class="{ 'ranking-cta--disabled': disabled }"
            :disabled="disabled" :aria-disabled="disabled" :title="disabled ? disabledReason : undefined"
            :aria-label="disabled ? disabledReason : 'Abrir ranking global por notas'" @click="handleClick">
            <span class="ranking-cta__shine" aria-hidden="true"></span>
            <i class="pi pi-trophy ranking-cta__icon" aria-hidden="true"></i>
            <span>Ranking Global por Notas</span>
            <i class="pi pi-arrow-right ranking-cta__arrow" aria-hidden="true"></i>
        </button>
    </div>
</template>

<script setup lang="ts">
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

function handleClick() {
    if (props.disabled) {
        return
    }

    emit('click')
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
</style>