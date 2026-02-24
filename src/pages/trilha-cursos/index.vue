<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Premium</p>
                        <h2 class="text-2xl font-semibold text-white">Trilha de cursos pagos</h2>
                        <p class="mt-1 text-sm text-white/80">Conteúdos premium para acelerar sua jornada técnica.</p>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <span
                            class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            {{ paidCourses.length }} curso(s)
                        </span>
                        <span
                            class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            {{ totalDuration }}h de conteúdo
                        </span>
                        <span
                            class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                            Ticket médio: {{ formatPrice(avgPrice) }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="paidCourses.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article class="panel p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Concluídos</p>
                <p class="mt-2 text-2xl font-semibold text-brand-600">{{ completedCourses }}</p>
                <p class="text-xs text-ink-500">Cursos com 100% de progresso</p>
            </article>
            <article class="panel p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Em andamento</p>
                <p class="mt-2 text-2xl font-semibold">{{ inProgressCourses }}</p>
                <p class="text-xs text-ink-500">Trilhas iniciadas pelo aluno</p>
            </article>
            <article class="panel p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Média geral</p>
                <p class="mt-2 text-2xl font-semibold">{{ averageProgress }}%</p>
                <p class="text-xs text-ink-500">Progresso médio entre os cursos</p>
            </article>
            <article class="panel p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Investimento total</p>
                <p class="mt-2 text-2xl font-semibold">{{ formatPrice(totalPrice) }}</p>
                <p class="text-xs text-ink-500">Soma dos cursos disponíveis</p>
            </article>
        </section>

        <section v-if="paidCourses.length" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <article v-for="course in paidCourses" :key="course.id" class="panel flex flex-col p-5">
                <div class="flex items-start justify-between gap-3">
                    <span class="chip !bg-red-50 !text-brand-600 !border-brand-200">Premium</span>
                    <span class="text-xs font-semibold text-ink-500">{{ formatPrice(course.price) }}</span>
                </div>

                <div class="mt-3 space-y-2">
                    <h3 class="text-lg font-semibold leading-tight">{{ course.name }}</h3>
                    <p class="text-sm text-ink-500">{{ course.description }}</p>
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                    <span class="chip">{{ course.levelDifficulty }}</span>
                    <span class="chip">{{ course.duration }}h</span>
                </div>

                <div class="mt-4 rounded-xl border border-red-100/80 bg-red-50/60 p-3">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Foco do curso</p>
                    <p class="mt-1 text-sm text-ink-700">{{ course.paidFocus }}</p>
                </div>

                <div class="mt-4 space-y-2">
                    <div class="flex items-center justify-between">
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Progresso</p>
                        <span class="text-xs font-semibold text-ink-700">{{ getCourseProgress(course.id) }}%</span>
                    </div>
                    <div class="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div class="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all"
                            :style="{ width: `${getCourseProgress(course.id)}%` }"></div>
                    </div>
                </div>

                <p class="mt-4 text-xs text-ink-500">Atualizado em {{ formatDate(course.updatedAt) }}</p>

                <button class="bg-red-50 text-ink-900 btn-outline mt-4 h-10 px-4">Continuar trilha</button>
            </article>
        </section>

        <section v-else class="panel p-8 text-center">
            <p class="text-base font-semibold">Nenhum curso pago disponível no momento.</p>
            <p class="mt-1 text-sm text-ink-500">Assim que novos cursos forem publicados, eles aparecerão aqui.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { ICoursePaid } from '~/infra/interfaces/services/course';
import { useUserStore } from '~/infra/store/userStore';


const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();

const userData = useUserStore()
const paidCourses = ref<ICoursePaid[]>([])
const coursesProgress = ref<Record<number, number>>({})

const totalDuration = computed(() => paidCourses.value.reduce((acc, course) => acc + course.duration, 0))
const totalPrice = computed(() => paidCourses.value.reduce((acc, course) => acc + course.price, 0))
const avgPrice = computed(() => {
    if (!paidCourses.value.length) return 0
    return totalPrice.value / paidCourses.value.length
})

const completedCourses = computed(() => paidCourses.value.filter((course) => getCourseProgress(course.id) >= 100).length)
const inProgressCourses = computed(() => paidCourses.value.filter((course) => {
    const progress = getCourseProgress(course.id)
    return progress > 0 && progress < 100
}).length)
const averageProgress = computed(() => {
    if (!paidCourses.value.length) return 0

    const total = paidCourses.value.reduce((acc, course) => acc + getCourseProgress(course.id), 0)
    return Math.round(total / paidCourses.value.length)
})

function getCourseProgress(courseId: number): number {
    return Math.max(0, Math.min(100, coursesProgress.value[courseId] ?? 0))
}

function formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
    }).format(new Date(value))
}

function getUserIdFromSession(): number | null {
    if (userData.userId && userData.userId > 0) {
        return userData.userId;
    }

    const loggedUser = getLoggedUser();
    const recoveredId = Number(loggedUser?.id);

    if (!Number.isFinite(recoveredId) || recoveredId <= 0) {
        return null;
    }

    userData.setUserId(recoveredId);
    return recoveredId;
}

async function fetchPaidCourses() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        const response = await $httpClient.course.GetFullCoursesPaid()

        if (response.success) {
            paidCourses.value = response.result || []
            toast.success('Cursos pagos carregados com sucesso!')
            if (userId) {
                await fetchProgressPaidCourses(userId)
            }
        } else {
            toast.error('Não foi possível carregar os cursos pagos. Tente novamente mais tarde.')
        }
    } catch (error) {
        console.error('Erro ao buscar cursos pagos:', error)
        toast.error('Não foi possível carregar os cursos pagos. Tente novamente mais tarde.')
    } finally {
        loadingPop()
    }
}

async function fetchProgressPaidCourses(userId: number) {
    try {
        const response = await $httpClient.course.GetProgressUserPaidCourses(userId)

        if (response.success) {
            coursesProgress.value = response.result.reduce<Record<number, number>>((acc, item) => {
                acc[item.courseId] = item.progress
                return acc
            }, {})

            toast.success('Progresso dos cursos pagos carregado com sucesso!')
        } else {
            toast.error('Não foi possível carregar o progresso dos cursos pagos. Tente novamente mais tarde.')
        }
    } catch (error) {
        console.error('Erro ao buscar progresso dos cursos pagos:', error)
        toast.error('Não foi possível carregar o progresso dos cursos pagos. Tente novamente mais tarde.')
    }
}

onMounted(async () => {
    await fetchPaidCourses();
})
</script>