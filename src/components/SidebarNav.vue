<template>
    <aside v-if="!isMobile"
        class="flex h-screen w-72 flex-col gap-8 overflow-hidden border-r border-slate-200/70 bg-white/70 px-6 py-8 backdrop-blur">
        <div
            class="flex items-start gap-3 rounded-2xl border border-brand-200/70 bg-gradient-to-br from-brand-200/60 via-accent-200/80 to-white p-4">
            <img :src="logoColorida" alt="Santos Games Logo" class="h-11 w-auto shrink-0 drop-shadow-sm">
            <div class="min-w-0 space-y-2">
                <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">Santos Tech</p>
                <h1
                    class="bg-gradient-to-r from-brand-600 via-brand-500 to-ink-900 bg-clip-text text-2xl font-semibold text-transparent">
                    Portal do Aluno</h1>
                <div class="h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 mb-2"></div>
            </div>
        </div>

        <div class="flex-1 space-y-4">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                :class="['nav-link', isActive(item.path) && 'nav-link-active', isActive(item.path) ? 'text-ink-900 scale-107' : 'text-ink-500']"
                class="hover:scale-104 transition-transform">
                <span class="h-2 w-2 rounded-full"
                    :class="isActive(item.path) ? 'bg-accent-200' : 'bg-slate-300'"></span>
                <span class="flex flex-col">
                    <span>{{ item.label }}</span>
                    <span class="text-xs font-normal text-ink-600">{{ item.note }}</span>
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
    <nav v-else class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md">
        <div class="flex justify-around items-center h-16 relative">

            <!-- Principais -->
            <NuxtLink v-for="item in navItems.slice(0, 4)" :key="item.path" :to="item.path"
                class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200" :class="isActive(item.path)
                    ? 'text-brand-600 scale-105'
                    : 'text-slate-500'">
                <i :class="[item.icon, 'text-lg']"></i>
                <span class="text-[11px] leading-none">
                    {{ item.short }}
                </span>

                <span v-if="isActive(item.path)" class="absolute bottom-0 h-1 w-6 rounded-full bg-brand-500" />
            </NuxtLink>

            <!-- Botão Mais -->
            <button class="flex flex-col items-center justify-center gap-1 flex-1 py-2 text-slate-500"
                @click="showMobileMenu = true">
                <i class="pi pi-ellipsis-h text-lg"></i>
                <span class="text-[11px] leading-none">
                    Mais
                </span>
            </button>
        </div>

        <Teleport to="body">
            <transition name="fade">
                <div v-if="isMobile && showMobileMenu" class="sidebar-mobile-overlay"
                    @click.self="showMobileMenu = false">
                    <div class="sidebar-mobile-menu animate-slideUp" @click.stop>
                        <NuxtLink to="/configuracoes" class="block text-base font-medium text-ink-700"
                            @click="showMobileMenu = false">
                            <i class="pi pi-cog text-lg"></i> Configurações
                        </NuxtLink>
                        <button class="block w-full text-left text-base font-medium text-red-500" @click="handleLogout">
                            <i class="pi pi-sign-out text-lg"></i> Sair
                        </button>
                    </div>
                </div>
            </transition>
        </Teleport>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app';
import { computed } from 'vue'
import logoColorida from '@/assets/LogoColorida.png'

const props = withDefaults(defineProps<{ mode?: 'sidebar' | 'mobile' }>(), {
    mode: 'sidebar',
})

const route = useRoute()

const isMobile = computed(() => props.mode === 'mobile')
const showMobileMenu = ref(false)

const navItems = [
    { label: 'Dashboard', short: 'Home', icon: 'pi pi-home', path: '/dashboard', note: 'Perfil, Medalhas e Relatorios' },
    { label: 'Trilha do aluno', short: 'Trilha', icon: 'pi pi-compass', path: '/trilha-aluno', note: 'Fluxo e Exercicios' },
    { label: 'Trilha de cursos', short: 'Cursos', icon: 'pi pi-book', path: '/trilha-cursos', note: 'Cursos Pagos e Personalizados' },
    { label: 'Material adicional', short: 'Materiais', icon: 'pi pi-folder', path: '/materiais', note: 'Documentos para Atribuições' },
    { label: 'Videos', short: 'Vídeos', icon: 'pi pi-video', path: '/videos', note: 'Videos Gerais' },
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

const handleLogout = async () => {
    showMobileMenu.value = false;
    await logout();
}
</script>

<style scoped lang="scss">
/* Overlay escuro cobrindo toda a tela e menu mobile animado */
.sidebar-mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0.40);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    cursor: pointer;
}

.sidebar-mobile-menu {
    width: 100vw;
    background: #fff;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    padding: 1.5rem 1.2rem 1.2rem 1.2rem;
    box-shadow: 0 -2px 16px 0 rgba(0, 0, 0, 0.08);
    cursor: auto;
    pointer-events: auto;
    min-height: 120px;
    max-width: 480px;
    gap: 1rem;
    margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }

    to {
        transform: translateY(0);
    }
}

.animate-slideUp {
    animation: slideUp 0.25s ease-out;
}
</style>
