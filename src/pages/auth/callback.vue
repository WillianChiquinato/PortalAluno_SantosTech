<template>
    <section class="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
        <div class="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/90 p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">

            <template v-if="authError">
                <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <i class="pi pi-times-circle text-2xl"></i>
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">Erro de autenticação</p>
                <h1 class="mt-3 text-2xl font-semibold text-ink-900">Não foi possível concluir o acesso</h1>
                <p class="mt-3 text-sm leading-6 text-ink-600">{{ authError }}</p>
                <a :href="retryUrl"
                    class="mt-6 inline-block rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition">
                    Tentar novamente
                </a>
            </template>

            <template v-else>
                <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <i class="pi pi-spin pi-spinner text-2xl"></i>
                </div>
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">Autenticacao</p>
                <h1 class="mt-3 text-3xl font-semibold text-ink-900">Concluindo seu acesso</h1>
                <p class="mt-3 text-sm leading-6 text-ink-600">
                    Estamos validando sua sessao e preparando seu ambiente no portal.
                </p>
            </template>

        </div>
    </section>
</template>

<script setup lang="ts">
import { checkAuth, getLoggedUser, setStudentViewReturnUrl } from '~/composables/useAuth'
import { useLoadingConfigurations } from '~/composables/useLoadingConfigurations'
import { useUserStore } from '~/infra/store/userStore'

const AUTH_ORIGIN = 'https://auth.santos-tech.com'

const route = useRoute()
const toast = useToastService()
const { loadConfigurations } = useLoadingConfigurations()
const userStore = useUserStore()

const authError = ref<string | null>(null)
const retryUrl = ref(`${AUTH_ORIGIN}?redirect=%2Fdashboard`)

onMounted(async () => {
    retryUrl.value = `${AUTH_ORIGIN}?redirect=${encodeURIComponent(window.location.origin + '/dashboard')}`

    const queryReturnTo = Array.isArray(route.query.returnTo)
        ? route.query.returnTo[0]
        : route.query.returnTo

    if (typeof queryReturnTo === 'string' && queryReturnTo.trim()) {
        setStudentViewReturnUrl(queryReturnTo)
    } else if (import.meta.client) {
        const referrer = document.referrer

        if (referrer) {
            try {
                const referrerUrl = new URL(referrer)
                if (referrerUrl.origin !== window.location.origin) {
                    setStudentViewReturnUrl(referrerUrl.toString())
                } else {
                    setStudentViewReturnUrl(null)
                }
            } catch {
                setStudentViewReturnUrl(null)
            }
        } else {
            setStudentViewReturnUrl(null)
        }
    }

    const errorMessage = Array.isArray(route.query.message)
        ? route.query.message[0]
        : route.query.message

    if (errorMessage) {
        // Não redirecionar para auth automaticamente — isso causaria loop infinito
        // se o auth server mandar de volta para cá sem resolver o erro
        authError.value = String(errorMessage)
        toast.error('Acesso nao autorizado', String(errorMessage), 4500)
        return
    }

    const isAuthenticated = await checkAuth(true)
    if (!isAuthenticated) {
        // Não redirecionar para auth automaticamente — quebraria o loop:
        // callback → auth (já autenticado lá) → callback → ...
        authError.value = 'Nao foi possivel validar sua sessao. Clique em "Tentar novamente".'
        toast.error('Falha na autenticacao', 'Nao foi possivel concluir seu login.', 4500)
        return
    }

    const loggedUser = getLoggedUser()
    userStore.setUserId(loggedUser?.id ?? null)
    userStore.setUserEmail(loggedUser?.email ?? null)

    await loadConfigurations()
    toast.success('Login realizado', 'Sua conta foi autenticada com sucesso.', 3000)
    await navigateTo('/dashboard')
})

definePageMeta({
    layout: 'auth',
})
</script>
