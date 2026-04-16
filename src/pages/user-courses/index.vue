<template>
    <div class="page-root">
        <div class="hero-bg" :style="{
            backgroundImage: `linear-gradient(150deg, rgba(10,5,5,0.90) 0%, rgba(80,10,10,0.78) 55%, rgba(20,5,5,0.92) 100%), url(${bgSantosGames})`,
        }">
            <!-- Noise grain overlay -->
            <div class="grain-overlay" />

            <div class="content-wrapper">

                <!-- ── Header ── -->
                <header class="mb-12 text-center">
                    <span class="eyebrow-pill">
                        <i class="pi pi-shield text-[10px]" />
                        Portal Santos Tech
                    </span>
                    <h1 class="mt-4 font-display text-3xl font-semibold text-white lg:text-4xl">
                        Bem-vindo! Escolha sua turma
                    </h1>
                    <p class="mt-3 text-sm text-white/55">
                        Selecione a turma que deseja acessar para continuar.
                    </p>
                    <div
                        class="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                </header>

                <!-- ── Skeleton ── -->
                <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="n in 3" :key="n" class="glass-card animate-pulse space-y-4 p-5">
                        <div class="h-5 w-2/3 rounded-full bg-white/12" />
                        <div class="h-3 w-1/3 rounded-full bg-white/8" />
                        <div class="space-y-2">
                            <div class="h-3 w-full rounded-full bg-white/8" />
                            <div class="h-3 w-4/5 rounded-full bg-white/8" />
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="h-8 rounded-xl bg-white/8" />
                            <div class="h-8 rounded-xl bg-white/8" />
                        </div>
                        <div class="h-10 rounded-full bg-white/12" />
                    </div>
                </div>

                <!-- ── Empty state ── -->
                <div v-else-if="userCourses.length === 0"
                    class="glass-card mx-auto max-w-sm p-10 text-center space-y-4">
                    <div
                        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border border-white/20">
                        <i class="pi pi-book text-xl text-white/50" />
                    </div>
                    <p class="font-semibold text-white">Nenhuma turma encontrada</p>
                    <p class="text-sm text-white/55">Você ainda não está matriculado em nenhuma turma.</p>
                </div>

                <!-- ── Cards grid ── -->
                <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <article v-for="course in userCourses" :key="course.id"
                        class="glass-card group flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.13] hover:shadow-2xl hover:shadow-black/40 cursor-pointer"
                        @click="selectCourse(course)">
                        <!-- Badges row -->
                        <div class="flex flex-col items-start justify-between gap-2">
                            <span
                                class="inline-flex max-w-[160px] truncate items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-medium text-white/90">
                                {{ course.courseName }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-full bg-success-200/20 border border-success-500/30 px-2 py-0.5 text-[11px] font-medium text-success-500 shrink-0">
                                <i class="pi pi-verified text-[10px]" />
                                {{ course.courseLevel }}
                            </span>
                        </div>

                        <!-- Name & description -->
                        <div class="flex-1 space-y-1.5">
                            <h2 class="text-base font-semibold leading-snug text-white">{{ course.className }}</h2>
                            <p class="line-clamp-2 text-xs text-white/55">{{ course.courseDescription }}</p>
                        </div>

                        <!-- Meta chips -->
                        <div class="grid grid-cols-2 gap-2 text-xs text-white/70">
                            <div
                                class="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-3 py-2">
                                <i class="pi pi-clock text-brand-400" />
                                <span>{{ formatDuration(course.courseDuration) }}</span>
                            </div>
                            <div
                                class="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/8 px-3 py-2">
                                <i class="pi pi-calendar text-brand-400" />
                                <span>Até {{ formatDate(course.classFinishedAt) }}</span>
                            </div>
                        </div>

                        <!-- Progress bar -->
                        <div class="space-y-1">
                            <div class="flex justify-between text-[10px] text-white/40">
                                <span>{{ formatDate(course.classStartedAt) }}</span>
                                <span class="font-semibold text-white/60">{{ progressPercent(course) }}%</span>
                            </div>
                            <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                                <div class="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 transition-all duration-700"
                                    :style="{ width: `${progressPercent(course)}%` }" />
                            </div>
                        </div>

                        <!-- CTA -->
                        <button
                            class="btn-primary flex items-center justify-center gap-2 cursor-pointer group-hover:bg-brand-600 transition duration-200"
                            @click.stop="selectCourse(course)">
                            Entrar na turma
                            <i
                                class="pi pi-arrow-right text-sm transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </article>
                </div>

                <div class="flex justify-center mt-8">
                    <button
                        class="btn-primary flex items-center justify-center gap-2 cursor-pointer group-hover:bg-brand-600 transition duration-200"
                        @click="goToLogin">
                        <i class="pi pi-arrow-left" />
                        Voltar para o login
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import bgSantosGames from '~/assets/Images-Default/background-default.png'
import type { IUserCourse } from '~/infra/interfaces/services/course'
import { getStudentViewReturnUrl, logout as logoutSession, setStudentViewReturnUrl } from '~/composables/useAuth'
import { useUserStore } from '~/infra/store/userStore'

definePageMeta({ layout: 'auth' })

const { $httpClient } = useNuxtApp()
const router = useRouter()

const userCourses = ref<IUserCourse[]>([])
const loading = ref(true)

async function fetchUserCourses() {
    try {
        const response = await $httpClient.course.GetUserCourses()
        if (!response.success) throw new Error('Failed to fetch user courses')
        return (response.result as IUserCourse[]) ?? []
    } catch (error) {
        console.error('Error fetching user courses:', error)
        return []
    }
}

function selectCourse(course: IUserCourse) {
    const userStore = useUserStore()
    userStore.setEnrollmentId(course.id)
    router.push('/dashboard')
}

function formatDuration(minutes: number): string {
    const hours = Math.round(minutes / 60)
    return `${hours}h`
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function progressPercent(course: IUserCourse): number {
    const start = new Date(course.classStartedAt).getTime()
    const end = new Date(course.classFinishedAt).getTime()
    const now = Date.now()
    if (now <= start) return 0
    if (now >= end) return 100
    return Math.round(((now - start) / (end - start)) * 100)
}

async function goToLogin() {
    await logoutSession();
    navigateTo('/')
}

onMounted(async () => {
    userCourses.value = await fetchUserCourses()
    loading.value = false
})
</script>

<style scoped>
.page-root {
    min-height: 100svh;
    width: 100%;
}

.hero-bg {
    position: relative;
    min-height: 100svh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 2rem 0;
}

.grain-overlay {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
}

.content-wrapper {
    position: relative;
    z-index: 1;
    width: min(100%, 65rem);
    padding: 3.5rem 1.25rem 4rem;
}

@media (min-width: 1024px) {
    .content-wrapper {
        padding: 3.5rem 2.5rem 4rem;
    }
}

.eyebrow-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    border-radius: 9999px;
    background: rgba(220, 38, 38, 0.25);
    border: 1px solid rgba(220, 38, 38, 0.40);
    padding: 0.25rem 0.875rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fecaca;
}

.glass-card {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 1.25rem;
}
</style>