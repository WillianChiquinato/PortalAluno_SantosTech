<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Biblioteca</p>
                        <h2 class="text-2xl font-semibold text-white">Vídeos de conhecimento</h2>
                        <p class="mt-1 text-sm text-white/80">Conteúdos extras produzidos pela Santos Games.</p>
                    </div>

                    <span
                        class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {{ videos.length }} vídeo(s)
                    </span>
                </div>
            </div>
        </section>

        <section v-if="continueWatchingVideos.length" class="space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Continuar assistindo</h3>
                <span class="chip">{{ continueWatchingVideos.length }} em andamento</span>
            </div>

            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <VideoCard v-for="video in continueWatchingVideos" :key="`continue-${video.id}`" v-bind="video"
                    cta-label="Continuar assistindo" :start-at-seconds="video.watchSeconds" />
            </div>
        </section>

        <section v-if="videos.length" class="space-y-3">
            <h3 class="text-lg font-semibold">Todos os vídeos</h3>
            <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <VideoCard v-for="video in videos" :key="video.id" v-bind="video"
                    :cta-label="video.progress > 0 && video.progress < 100 ? 'Continuar assistindo' : 'Assistir'"
                    :start-at-seconds="video.watchSeconds" />
            </div>
        </section>

        <section v-else class="panel p-8 text-center">
            <p class="text-base font-semibold">Nenhum vídeo disponível no momento.</p>
            <p class="mt-1 text-sm text-ink-500">Assim que novos conteúdos forem publicados, eles vão aparecer aqui.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import VideoCard from '@/components/VideoCard.vue'
import type { IVideo, IVideoProgress } from '~/infra/interfaces/services/video';
import { useUserStore } from '~/infra/store/userStore';

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();

const userData = useUserStore()

type IVideoListItem = IVideo & {
    progress: number;
    watchSeconds: number;
    isCompleted: boolean;
    lastWatched: string | null;
}

const videos = ref<IVideoListItem[]>([])
const progressVideosUser = ref<IVideoProgress[]>([])

const continueWatchingVideos = computed(() => {
    return videos.value
        .filter((video) => video.watchSeconds > 0 && !video.isCompleted)
        .sort((firstVideo, secondVideo) => {
            const firstDate = new Date(firstVideo.lastWatched ?? '').getTime() || 0;
            const secondDate = new Date(secondVideo.lastWatched ?? '').getTime() || 0;

            if (firstDate !== secondDate) {
                return secondDate - firstDate;
            }

            return secondVideo.progress - firstVideo.progress;
        });
})

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

async function fetchAllVideos() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        const response = await $httpClient.video.GetAllVideos();
        if (response.success) {
            videos.value = response.result.map((video) => ({
                ...video,
                progress: 0,
                watchSeconds: 0,
                isCompleted: false,
                lastWatched: null,
            }));

            if (userId) {
                await fetchProgressUserVideos(userId);
            }

            toast.success('Vídeos carregados com sucesso!')
        } else {
            toast.error('Não foi possível carregar os vídeos. Tente novamente mais tarde.')
        }
    } catch (error) {
        console.error('Erro ao buscar videos:', error)
        toast.error('Não foi possível carregar os vídeos. Tente novamente mais tarde.')
    } finally {
        loadingPop();
    }
}

async function fetchProgressUserVideos(userId: number) {
    try {
        const response = await $httpClient.video.GetProgressUserVideos(userId);
        if (response.success) {
            progressVideosUser.value = response.result;
            videos.value = videos.value.map(video => {
                const progress = progressVideosUser.value.find(pv => pv.videoId === video.id);
                const watchSeconds = Math.max(0, Number(progress?.watchSeconds) || 0);
                const progressPercentage = progress?.isCompleted
                    ? 100
                    : video.durationSeconds > 0
                        ? Math.min(100, Math.round((watchSeconds / video.durationSeconds) * 100))
                        : 0;

                return {
                    ...video,
                    progress: progressPercentage,
                    watchSeconds,
                    isCompleted: Boolean(progress?.isCompleted),
                    lastWatched: progress?.lastWatched ?? null,
                };
            });
        } else {
            toast.error('Não foi possível carregar o progresso dos vídeos. Tente novamente mais tarde.')
        }
    } catch (error) {
        console.error('Erro ao buscar progresso dos vídeos:', error)
        toast.error('Não foi possível carregar o progresso dos vídeos. Tente novamente mais tarde.')
    }
}

onMounted(async () => {
    await fetchAllVideos();
})
</script>