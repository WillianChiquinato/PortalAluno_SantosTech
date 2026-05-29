<template>
    <section class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div class="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-8">

            <div class="mb-6 text-center">
                <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
                    <i class="pi pi-code text-2xl"></i>
                </div>
                <h1 class="text-2xl font-bold text-ink-900 dark:text-white">Login Dev</h1>
                <p class="mt-1 text-sm text-ink-500">
                    Autentica via <span class="font-medium text-brand-500">auth.santos-tech.com</span>
                </p>
            </div>

            <!-- Tabs -->
            <div class="mb-6 flex rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden">
                <button
                    v-for="tab in tabs" :key="tab.id"
                    type="button"
                    @click="activeTab = tab.id"
                    :class="[
                        'flex-1 py-2 text-sm font-medium transition-colors',
                        activeTab === tab.id
                            ? 'bg-brand-500 text-white'
                            : 'text-ink-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                    ]">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Tab: Email/senha -->
            <form v-if="activeTab === 'password'" @submit.prevent="handlePasswordLogin" class="space-y-4">
                <div>
                    <label class="mb-1 block text-sm font-medium text-ink-700 dark:text-slate-300">Email ou usuário</label>
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
                    <label class="mb-1 block text-sm font-medium text-ink-700 dark:text-slate-300">Senha</label>
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
                <p v-if="errorMsg" class="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
                <button type="submit" :disabled="loading" class="w-full rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                    <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                    {{ loading ? 'Entrando...' : 'Entrar com senha' }}
                </button>
            </form>

            <!-- Tab: Token JWT -->
            <form v-if="activeTab === 'token'" @submit.prevent="handleTokenLogin" class="space-y-4">
                <div class="rounded-xl bg-blue-50 dark:bg-blue-900/20 px-4 py-3 text-xs text-blue-700 dark:text-blue-300">
                    <p class="font-semibold mb-1">Como obter seu token (conta Google):</p>
                    <ol class="list-decimal ml-4 space-y-0.5">
                        <li>
                            <a href="https://portal.santos-tech.com" target="_blank" class="underline font-medium">portal.santos-tech.com</a>
                            → faça login com Google
                        </li>
                        <li>DevTools (F12) → Application → Cookies</li>
                        <li>Copie o valor de <code class="font-mono bg-blue-100 dark:bg-blue-800 px-0.5 rounded">access_token</code></li>
                        <li>Cole abaixo e clique em Entrar</li>
                    </ol>
                </div>
                <div>
                    <label class="mb-1 block text-sm font-medium text-ink-700 dark:text-slate-300">Token JWT</label>
                    <textarea
                        v-model="form.token"
                        rows="4"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        required
                        :disabled="loading"
                        class="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2.5 text-xs font-mono text-ink-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60 resize-none"
                    />
                </div>
                <p v-if="errorMsg" class="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">{{ errorMsg }}</p>
                <button type="submit" :disabled="loading" class="w-full rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
                    <i v-if="loading" class="pi pi-spin pi-spinner mr-2"></i>
                    {{ loading ? 'Validando...' : 'Entrar com token' }}
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

const tabs = [
    { id: 'password', label: 'Email / senha' },
    { id: 'token', label: 'Token JWT' },
]
const activeTab = ref<'password' | 'token'>('password')

const form = reactive({ identifier: '', password: '', token: '' })
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function applyTokenAndValidate(token: string) {
    // Seta via endpoint server-side → cookie HttpOnly para localhost
    await $fetch('/portal-utils/set-token', { method: 'POST', body: { token } })

    const ok = await checkAuth(true)
    if (!ok) {
        errorMsg.value = 'Token inválido ou expirado. TTL é 2h — copie um token novo do portal.'
        return
    }
    await navigateTo('/dashboard')
}

async function handlePasswordLogin() {
    loading.value = true
    errorMsg.value = null
    try {
        const res = await $fetch<any>('/dev-auth/auth/login', {
            method: 'POST',
            body: { identifier: form.identifier, password: form.password },
        })
        // O proxy injeta _devToken no body quando login é bem-sucedido
        if (res?._devToken) {
            await applyTokenAndValidate(res._devToken)
        } else {
            const ok = await checkAuth(true)
            if (!ok) {
                errorMsg.value = 'Login OK mas sessão não validada. Use a aba "Token JWT" como alternativa.'
                return
            }
            await navigateTo('/dashboard')
        }
    } catch (err: any) {
        errorMsg.value = err?.data?.message ?? err?.message ?? 'Credenciais inválidas'
    } finally {
        loading.value = false
    }
}

async function handleTokenLogin() {
    loading.value = true
    errorMsg.value = null
    try {
        await applyTokenAndValidate(form.token.trim())
    } catch (err: any) {
        errorMsg.value = err?.data?.message ?? err?.message ?? 'Erro ao aplicar token'
    } finally {
        loading.value = false
    }
}
</script>
