<template>
    <section class="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-6 py-16">
        <div class="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/90 p-10 text-center shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <i class="pi pi-spin pi-spinner text-2xl"></i>
            </div>
            <p class="text-xs font-semibold uppercase tracking-[0.28em] text-ink-500">Autenticacao</p>
            <h1 class="mt-3 text-3xl font-semibold text-ink-900">Concluindo seu acesso</h1>
            <p class="mt-3 text-sm leading-6 text-ink-600">
                Estamos validando sua sessao e preparando seu ambiente no portal.
            </p>
        </div>
    </section>
</template>

<script setup lang="ts">
import { checkAuth, getLoggedUser, setStudentViewReturnUrl } from '~/composables/useAuth'
import { useLoadingConfigurations } from '~/composables/useLoadingConfigurations'
import { useUserStore } from '~/infra/store/userStore'

const route = useRoute()
const toast = useToastService()
const { loadConfigurations } = useLoadingConfigurations()
const userStore = useUserStore()

onMounted(async () => {
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
        toast.error('Acesso nao autorizado', errorMessage, 4500)
        await navigateTo('/')
        return
    }

    const isAuthenticated = await checkAuth(true)
    if (!isAuthenticated) {
        toast.error('Falha na autenticacao', 'Nao foi possivel concluir seu login social.', 4500)
        await navigateTo('/')
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
