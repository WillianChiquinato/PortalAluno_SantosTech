<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="model" class="cover-mask" @click.self="handleBack">
                <div class="cover-modal panel w-[min(92vw,560px)] border-red-100/80 bg-white">
                    <div class="flex items-center justify-between border-b border-red-100/80 px-6 py-4">
                        <h3 class="text-base font-semibold text-ink-900">{{ props.name }}</h3>
                        <button type="button" class="chip h-8 w-8 justify-center p-0 cursor-pointer" @click="handleBack"
                            :disabled="loading" aria-label="Fechar modal">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="space-y-4 bg-gradient-to-b from-white to-red-50/30 px-6 py-5">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    (event: 'back'): void
    (event: 'save', file: File): void
}>()

const model = defineModel<boolean>('visible', { default: false })

const props = withDefaults(defineProps<{
    name: string
}>(), {
    name: 'Modal'
})

const loading = ref(false)

function handleBack() {
    if (loading.value) return

    model.value = false
    emit('back')
}
</script>

<style scoped lang="scss">
.cover-mask {
    position: fixed;
    inset: 0;
    z-index: 3200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.58) !important;
    backdrop-filter: blur(6px);
}

.cover-modal {
    box-shadow: 0 28px 70px rgba(2, 6, 23, 0.28), 0 10px 24px rgba(220, 38, 38, 0.1) !important;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>