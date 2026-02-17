<template>
    <aside v-if="!isMobile"
        class="flex w-72 flex-col gap-8 border-r border-slate-200/70 bg-white/70 px-6 py-8 backdrop-blur">
        <div class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Santos Games</p>
            <h1 class="text-2xl font-semibold">Portal do Aluno</h1>
            <p class="text-sm text-ink-500">Gamificacao diaria e progresso em tempo real.</p>
        </div>

        <div class="flex-1 space-y-2">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                :class="['nav-link', isActive(item.path) && 'nav-link-active']">
                <span class="h-2 w-2 rounded-full"
                    :class="isActive(item.path) ? 'bg-accent-200' : 'bg-slate-300'"></span>
                <span class="flex flex-col">
                    <span>{{ item.label }}</span>
                    <span class="text-xs font-normal text-ink-500">{{ item.note }}</span>
                </span>
            </NuxtLink>
        </div>

        <div class="space-y-2">
            <template v-for="item in footerItems" :key="item.label">
                <NuxtLink v-if="item.type === 'link'" :to="item.path" class="nav-link">
                    <span class="h-2 w-2 rounded-full bg-slate-300"></span>
                    <span>{{ item.label }}</span>
                </NuxtLink>

                <button v-else type="button" class="nav-link w-full" @click="logout">
                    <span class="h-2 w-2 rounded-full bg-slate-300"></span>
                    <span>{{ item.label }}</span>
                </button>
            </template>
        </div>
    </aside>

    <nav v-else class="fixed bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur">
        <div class="flex items-center justify-between gap-2 text-xs font-medium text-ink-700">
            <NuxtLink v-for="item in navItems.slice(0, 4)" :key="item.path" :to="item.path"
                class="flex flex-col items-center gap-1" :class="isActive(item.path) ? 'text-ink-900' : 'text-ink-500'">
                <span class="h-2 w-2 rounded-full"
                    :class="isActive(item.path) ? 'bg-brand-500' : 'bg-slate-300'"></span>
                <span>{{ item.label }}</span>

            </NuxtLink>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { computed } from 'vue'

const props = withDefaults(defineProps<{ mode?: 'sidebar' | 'mobile' }>(), {
    mode: 'sidebar',
})

const route = useRoute()

const isMobile = computed(() => props.mode === 'mobile')

const navItems = [
    { label: 'Dashboard', path: '/dashboard', note: 'Visao geral' },
    { label: 'Perfil', path: '/perfil', note: 'Medalhas e relatorios' },
    { label: 'Trilha de cursos', path: '/trilha-cursos', note: 'Cursos e desbloqueios' },
    { label: 'Trilha do aluno', path: '/trilha-aluno', note: 'Fluxo e exercicios' },
    { label: 'Material adicional', path: '/materiais', note: 'Docs e extras' },
    { label: 'Videos', path: '/videos', note: 'Conteudos gerais' },
]

const footerItems = [
    { label: 'Configuracoes', path: '/configuracoes', type: 'link' },
    { label: 'Sair', type: 'action' },
] as const

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }

    return route.path.startsWith(path)
}

const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('loggedUser')

    console.log("Logout User");

    return navigateTo('/')
}
</script>

<style scoped lang="scss"></style>
