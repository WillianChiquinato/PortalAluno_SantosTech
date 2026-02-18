<template>
    <Teleport to="body">
        <Transition name="upload-modal-fade">
            <div v-if="model" class="upload-cover-mask" @click.self="handleBack">
                <div class="upload-cover-modal panel w-[min(92vw,560px)] border-red-100/80 bg-white">
                    <div class="flex items-center justify-between border-b border-red-100/80 px-6 py-4">
                        <h3 class="text-base font-semibold text-ink-900">{{ props.name }}</h3>
                        <button type="button" class="chip h-8 w-8 justify-center p-0 cursor-pointer" @click="handleBack"
                            :disabled="loading" aria-label="Fechar modal">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>

                    <div class="space-y-4 bg-gradient-to-b from-white to-red-50/30 px-6 py-5">
                        <p class="text-sm text-ink-500">Selecione um arquivo para enviar.</p>

                        <input ref="fileInput" type="file" class="hidden" :accept="props.accept"
                            @change="onFileChange" />

                        <button type="button"
                            class="upload-drop panel w-full border-dashed border-red-200 p-5 text-left transition cursor-pointer"
                            @click="openFilePicker">
                            <p class="text-sm font-semibold text-ink-900">Escolher arquivo</p>
                            <p class="mt-1 text-xs text-ink-500">Clique para selecionar no computador.</p>
                        </button>

                        <div v-if="selectedFile" class="panel flex items-center gap-3 p-3">
                            <img v-if="previewUrl" :src="previewUrl" alt="Preview do arquivo"
                                class="h-12 w-12 rounded-lg border border-red-100 object-cover" />

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-ink-900">{{ selectedFile.name }}</p>
                                <p class="text-xs text-ink-500">{{ fileSizeLabel }}</p>
                            </div>

                            <button type="button" class="chip cursor-pointer" @click="removeFile" :disabled="loading">
                                Remover
                            </button>
                        </div>

                        <slot></slot>
                    </div>

                    <div class="flex items-center justify-end gap-2 border-t border-red-100/80 px-6 py-4">
                        <button type="button" class="btn-outline h-9 px-4 text-xs cursor-pointer" @click="handleBack"
                            :disabled="loading">
                            Voltar
                        </button>

                        <button type="button"
                            class="btn-primary h-9 px-4 text-xs cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            @click="handleSave" :disabled="loading || !selectedFile">
                            {{ loading ? 'Salvando...' : 'Salvar' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits<{
    (event: 'back'): void
    (event: 'save', file: File): void
}>()

const model = defineModel<boolean>('visible', { default: false })

const props = withDefaults(defineProps<{
    name: string
    accept?: string
}>(), {
    accept: 'image/*'
})

const loading = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const fileSizeLabel = computed(() => {
    if (!selectedFile.value) return ''
    return `${(selectedFile.value.size / 1024 / 1024).toFixed(2)} MB`
})

function cleanupPreview() {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
        previewUrl.value = ''
    }
}

function setSelectedFile(file: File | null) {
    cleanupPreview()
    selectedFile.value = file

    if (file?.type.startsWith('image/')) {
        previewUrl.value = URL.createObjectURL(file)
    }
}

function openFilePicker() {
    fileInput.value?.click()
}

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null
    setSelectedFile(file)
}

function removeFile() {
    setSelectedFile(null)

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

function handleSave() {
    if (!selectedFile.value) return

    loading.value = true
    emit('save', selectedFile.value)
}

function handleBack() {
    if (loading.value) return
    model.value = false
    emit('back')
}

watch(model, (newValue) => {
    if (!newValue) {
        loading.value = false
        removeFile()
    }
})

onUnmounted(() => {
    cleanupPreview()
})

</script>

<style scoped>
.upload-cover-mask {
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

.upload-cover-modal {
    box-shadow: 0 28px 70px rgba(2, 6, 23, 0.28), 0 10px 24px rgba(220, 38, 38, 0.1) !important;
}

.upload-drop {
    border-width: 2px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 242, 242, 0.7) 100%);
}

.upload-drop:hover {
    transform: translateY(-1px);
    border-color: rgba(220, 38, 38, 0.35);
    box-shadow: 0 10px 22px rgba(220, 38, 38, 0.12);
}

.upload-modal-fade-enter-active,
.upload-modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.upload-modal-fade-enter-from,
.upload-modal-fade-leave-to {
    opacity: 0;
}
</style>