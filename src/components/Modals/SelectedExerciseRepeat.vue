<template>
    <Teleport to="body">
        <Transition name="upload-modal-fade">
            <div v-if="model" class="upload-cover-mask" @click.self="handleBack">
                <div class="upload-cover-modal panel w-[min(92vw,560px)] border-red-100/80 bg-white">
                    <div class="flex items-center justify-between border-b border-red-100/80 px-6 py-4">
                        <h3 class="text-base font-semibold text-ink-900">{{ props.name }}</h3>
                        <button type="button" class="chip h-8 w-8 justify-center p-0 cursor-pointer" @click="handleBack"
                            aria-label="Fechar modal">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="space-y-4 px-6 py-6">
                        <p class="text-sm text-ink-600">Escolha como deseja continuar com este exercício:</p>

                        <div class="flex flex-col gap-3">
                            <button type="button" class="btn-primary w-full py-3 font-semibold transition-all cursor-pointer"
                                @click="handleGenerateWithAI">
                                <i class="pi pi-sparkles mr-2"></i>
                                Gerar outro exercício similar (beta)
                            </button>

                            <button type="button"
                                class="btn-outline w-full py-3 font-semibold transition-all border-ink-900 text-ink-900 hover:bg-ink-50 cursor-pointer"
                                @click="handleRepeatCurrent">
                                <i class="pi pi-refresh mr-2"></i>
                                Repetir exercício atual
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    name: string
    modelValue: boolean
}

const props = withDefaults(defineProps<Props>(), {
    name: 'Opções de Exercício',
    modelValue: false
})

const emit = defineEmits<{
    'back': [value: boolean]
    'update:modelValue': [value: boolean]
    'generate-with-ai': []
    'repeat-current': []
}>()

const model = computed({
    get: () => props.modelValue,
    set: (value: boolean) => emit('update:modelValue', value)
})

function handleBack() {
    model.value = false
    emit('back', false)
}

function handleGenerateWithAI() {
    emit('generate-with-ai')
    handleBack()
}

function handleRepeatCurrent() {
    emit('repeat-current')
    handleBack()
}
</script>

<style scoped>
.upload-cover-mask {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 50;
}

.upload-cover-modal {
    border-radius: 1rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
}

.upload-modal-fade-enter-active,
.upload-modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.upload-modal-fade-enter-from,
.upload-modal-fade-leave-to {
    opacity: 0;
}
</style>
