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

                    <div class="space-y-2 bg-gradient-to-b from-white to-red-50/30 px-6 py-5">
                        <p class="text-sm text-ink-700">
                            Enviamos um e-mail para <strong>{{ userEmail }}</strong> com código de
                            confirmação. Por
                            favor, insira o código abaixo para confirmar seu endereço de e-mail.
                        </p>
                        <p class="flex w-full justify-center text-sm text-ink-700 font-bold">Verifique sua caixa de SPAM
                        </p>
                        <div class="flex flex-col items-center gap-4">
                            <div class="flex gap-2 justify-center">
                                <input v-for="(digit, idx) in codeDigits" :key="idx" :ref="setCodeInputRef(idx)"
                                    v-model="codeDigits[idx]" type="text" inputmode="numeric" maxlength="1"
                                    autocomplete="one-time-code"
                                    class="w-10 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                                    @input="onInput(idx, $event)" @keydown.backspace="onBackspace(idx, $event)"
                                    @paste="onPaste($event)" />
                            </div>
                            <div v-if="!EmailSendState" class="flex flex-col gap-2 w-full mt-2">
                                <button class="btn btn-primary flex-1 cursor-pointer" @click="sendCode">
                                    Enviar Código
                                </button>
                            </div>
                            <div v-else class="flex flex-col gap-2 w-full mt-2">
                                <button class="btn btn-primary flex-1 cursor-pointer" @click="confirmCode">
                                    Confirmar código
                                </button>
                                <button class="btn btn-secondary cursor-pointer hover:scale-103 transition-transform"
                                    @click="resendCode">
                                    Reenviar código
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { getLoggedUser } from '~/composables/useAuth';
import { useUserStore } from '~/infra/store/userStore';

const emit = defineEmits<{
    (event: 'back'): void
}>()

const model = defineModel<boolean>('visible', { default: false })

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore();
const userEmail = computed(() => userData.userEmail || getLoggedUser()?.email || '');

const EmailSendState = ref(false);

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

const codeDigits = ref<string[]>(Array(6).fill(''));
const codeInputRefs = ref<(HTMLInputElement | null)[]>([]);

function setCodeInputRef(idx: number) {
    return (el: Element | import('vue').ComponentPublicInstance | null) => {
        codeInputRefs.value[idx] = el as HTMLInputElement | null;
    };
}

function onInput(idx: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');
    if (val.length > 1) val = val.slice(-1);
    codeDigits.value[idx] = val;
    if (val && idx < codeDigits.value.length - 1) {
        nextTick(() => codeInputRefs.value[idx + 1]?.focus());
    }
}

function onBackspace(idx: number, event: KeyboardEvent) {
    if (!codeDigits.value[idx] && idx > 0) {
        nextTick(() => codeInputRefs.value[idx - 1]?.focus());
    }
}

function onPaste(event: ClipboardEvent) {
    const paste = event.clipboardData?.getData('text') || '';
    if (/^\d{6}$/.test(paste)) {
        for (let i = 0; i < 6; i++) {
            codeDigits.value[i] = paste[i];
        }
        nextTick(() => codeInputRefs.value[5]?.focus());
        event.preventDefault();
    }
}

async function sendCode() {
    if (!userEmail.value) {
        toast.error('Email nao encontrado', 'Nao foi possivel identificar seu email. Faça login novamente e tente de novo.', 3500);
        return;
    }

    loadingPush()

    try {
        const response = await $httpClient.user.SendEmailVerify(userEmail.value);

        if (response.success) {
            toast.success('Código enviado', 'O código de confirmação foi enviado para seu e-mail.', 3000);
            EmailSendState.value = true;
        }
    } catch (error) {
        toast.error('Erro ao enviar código', 'Ocorreu um erro ao enviar o código. Por favor, tente novamente.', 3000);
    } finally {
        loading.value = false
        loadingPop()
    }
}

async function confirmCode() {
    const code = codeDigits.value.join('');

    if (!userEmail.value) {
        toast.error('Email nao encontrado', 'Nao foi possivel identificar seu email. Faça login novamente e tente de novo.', 3500);
        return;
    }

    if (code.length !== 6) {
        toast.error('Código inválido', 'Por favor, insira o código de 6 dígitos enviado para seu e-mail.', 3000);
        return;
    }

    loadingPush();

    try {
        const resultCorreclyCode = await $httpClient.user.ConfirmEmailVerify(userEmail.value, code);
        if (!resultCorreclyCode) {
            toast.error('Código inválido', 'O código inserido é inválido. Por favor, tente novamente.', 3000);
            return;
        }

        toast.success('E-mail confirmado', 'Seu endereço de e-mail foi confirmado com sucesso.', 3000);
        handleBack();
    } catch (error) {
        toast.error('Código inválido', 'O código inserido é inválido. Por favor, tente novamente.', 3000);
    } finally {
        loadingPop();
    }
}

function resendCode() {
    codeDigits.value = Array(6).fill('');
    sendCode();
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