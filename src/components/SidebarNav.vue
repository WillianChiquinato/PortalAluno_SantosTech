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
                    {{ t('sidebarTitle') }}</h1>
                <div class="mb-2 h-1 w-20 rounded-full bg-gradient-to-r from-brand-500 to-accent-500"></div>
            </div>
        </div>

        <div class="flex-1 space-y-4">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                :class="['nav-link', isActive(item.path) && 'nav-link-active', isActive(item.path) ? 'text-ink-900 scale-107' : 'text-ink-500', item.isActive ? '' : 'pointer-events-none opacity-50']"
                class="hover:scale-104 transition-transform">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg border"
                    :class="isActive(item.path) ? 'border-white/50 bg-white/15 text-white' : 'border-slate-200 bg-white text-ink-500'">
                    <i :class="[item.icon, 'text-sm']"></i>
                </span>
                <span class="flex flex-col">
                    <span>{{ item.label }}</span>
                    <span class="text-xs font-normal" :class="isActive(item.path) ? 'text-white/85' : 'text-ink-600'">{{
                        item.note }}</span>
                </span>
            </NuxtLink>
        </div>

        <div class="space-y-2">
            <button v-if="studentViewReturnUrl" type="button" class="nav-link w-full" @click="returnToAdminPortal">
                <span class="h-2 w-2 rounded-full bg-brand-400"></span>
                <span>Voltar ao portal</span>
            </button>
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
        <div class="relative flex h-16 items-center justify-around">
            <NuxtLink v-for="item in navItems.slice(0, 5)" :key="item.path" :to="item.path"
                class="flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-all duration-200" :class="isActive(item.path)
                    ? 'text-brand-600 scale-105'
                    : 'text-slate-500'">
                <i :class="[item.icon, 'text-lg']"></i>
                <span class="text-[11px] leading-none">
                    {{ item.short }}
                </span>

                <span v-if="isActive(item.path)" class="absolute bottom-0 h-1 w-6 rounded-full bg-brand-500" />
            </NuxtLink>

            <button class="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-slate-500"
                @click="showMobileMenu = true">
                <i class="pi pi-ellipsis-h text-lg"></i>
                <span class="text-[11px] leading-none">
                    {{ t('mobileMore') }}
                </span>
            </button>
        </div>

        <Teleport to="body">
            <transition name="fade">
                <div v-if="isMobile && showMobileMenu" class="sidebar-mobile-overlay"
                    @click.self="showMobileMenu = false">
                    <div class="sidebar-mobile-menu animate-slideUp" @click.stop>
                        <button v-if="studentViewReturnUrl"
                            class="block w-full text-left text-base font-medium text-brand-600"
                            @click="handleReturnToAdminPortal">
                            <i class="pi pi-arrow-left text-lg"></i> Voltar ao portal
                        </button>
                        <NuxtLink to="/metas" class="block text-base font-medium text-black"
                            @click="showMobileMenu = false">
                            <i class="pi pi-trophy text-lg"></i> {{ t('navGoals') }}
                        </NuxtLink>
                        <NuxtLink to="/configuracoes" class="block text-base font-medium text-black"
                            @click="showMobileMenu = false">
                            <i class="pi pi-cog text-lg"></i> {{ t('navSettings') }}
                        </NuxtLink>
                        <button class="block w-full text-left text-base font-medium text-red-500" @click="handleLogout">
                            <i class="pi pi-sign-out text-lg"></i> {{ t('navLogout') }}
                        </button>
                    </div>
                </div>
            </transition>
        </Teleport>
    </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app'
import { computed, watchEffect } from 'vue'
import logoColorida from '@/assets/LogoColorida.png'
import { getStudentViewReturnUrl, logout as logoutSession, setStudentViewReturnUrl } from '~/composables/useAuth'
import { usePortalI18n } from '~/composables/usePortalI18n'

const props = withDefaults(defineProps<{ mode?: 'sidebar' | 'mobile' }>(), {
    mode: 'sidebar',
})

const route = useRoute()
const { t } = usePortalI18n()

const isMobile = computed(() => props.mode === 'mobile')
const showMobileMenu = ref(false)

const routeReturnTo = computed(() => {
    const value = Array.isArray(route.query.returnTo)
        ? route.query.returnTo[0]
        : route.query.returnTo

    return typeof value === 'string' && value.trim().length > 0 ? value : null
})

watchEffect(() => {
    if (routeReturnTo.value) {
        setStudentViewReturnUrl(routeReturnTo.value)
    }
})

const studentViewReturnUrl = computed(() => routeReturnTo.value || getStudentViewReturnUrl())

const navItems = computed(() => [
    { label: t('navDashboard'), short: t('navDashboardShort'), icon: 'pi pi-home', path: '/dashboard', note: t('navDashboardNote'), isActive: true },
    { label: t('navGoals'), short: t('navGoalsShort'), icon: 'pi pi-trophy', path: '/metas', note: t('navGoalsNote'), isActive: true },
    { label: t('navStudentTrack'), short: t('navStudentTrackShort'), icon: 'pi pi-compass', path: '/trilha-aluno', note: t('navStudentTrackNote'), isActive: true },
    { label: t('navCoursesTrack'), short: t('navCoursesTrackShort'), icon: 'pi pi-book', path: '/trilha-cursos', note: t('navCoursesTrackNote'), isActive: false },
    { label: t('navMaterial'), short: t('navMaterialShort'), icon: 'pi pi-folder', path: '/materiais', note: t('navMaterialNote'), isActive: true },
    { label: t('navVideos'), short: t('navVideosShort'), icon: 'pi pi-video', path: '/videos', note: t('navVideosNote'), isActive: true },
])

const footerItems = computed(() => [
    { label: t('navSettings'), path: '/configuracoes', type: 'link' },
    { label: t('navLogout'), type: 'action' },
] as const)

const isActive = (path: string) => {
    if (path === '/') {
        return route.path === '/'
    }

    return route.path.startsWith(path)
}

const logout = async () => {
    try {
        await logoutSession()
    } catch (error) {
        console.error('Erro ao invalidar sessao:', error)
    }

    return navigateTo('/')
}

const returnToAdminPortal = () => {
    const target = studentViewReturnUrl.value
    if (!target || !import.meta.client) {
        return
    }

    window.location.href = target
}

const handleLogout = async () => {
    showMobileMenu.value = false
    await logout()
}

const handleReturnToAdminPortal = () => {
    showMobileMenu.value = false
    returnToAdminPortal()
}
</script>

<style scoped lang="scss">
.sidebar-mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0.4);
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
