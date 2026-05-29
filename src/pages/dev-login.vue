<template>
    <section class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-8">

            <div class="mb-8 text-center">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
                    <i class="pi pi-code text-2xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-ink-900 dark:text-white">Login Dev</h1>
                <p class="mt-1 text-sm text-ink-500">
                    Autentica via
                    <span class="font-medium text-brand-500">auth.santos-tech.com</span>
                    (prod)
                </p>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="mb-1 block text-sm font-medium text-ink-700 dark:text-slate-300">
                        Email ou usuário
                    </label>
                    <input
                        v-model="form.identifier"
                        type="text"
                        placeholder="seu@email.com"
                        autocomplete="username"
                        required
                        :disabled="loading"
                        class="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                    />
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-ink-700 dark:text-slate-300">
                        Senha
                    </label>
                    <input
                        v-model="form.password"
                        type="password"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                        :disabled="loading"
                        class="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-sm text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
                    />
                </div>

                <div v-if="errorMsg"
                    class="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                    {{ errorMsg }}
                </div>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                    <template v-if="loading">
                        <i class="pi pi-spin pi-spinner mr-2"></i>Entrando...
                    </template>
                    <template v-else>Entrar</template>
                </button>
            </form>

            <div class="mt-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
                <i class="pi pi-exclamation-triangle mr-1"></i>
                Disponível apenas com <code class="font-mono font-bold">NUXT_PUBLIC_DEV_AUTH=true</code>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { checkAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth' })

const form = reactive({ identifier: '', password: '' })
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function handleLogin() {
    loading.value = true
    errorMsg.value = null

    try {
        await $fetch('/dev-auth/auth/login', {
            method: 'POST',
            body: { identifier: form.identifier, password: form.password },
        })

        const ok = await checkAuth(true)
        if (!ok) {
            errorMsg.value = 'Login realizado mas a sessão não pôde ser validada pelo portal.'
            return
        }

        await navigateTo('/dashboard')
    } catch (err: any) {
        errorMsg.value = err?.data?.message ?? err?.message ?? 'Credenciais inválidas'
    } finally {
        loading.value = false
    }
}
</script>
