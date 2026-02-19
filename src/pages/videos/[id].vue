<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Player interno</p>
                        <h2 class="text-2xl font-semibold text-white">{{ video?.title ?? 'Carregando vídeo...' }}</h2>
                        <p class="mt-1 text-sm text-white/80">Assista sem sair da plataforma.</p>
                    </div>

                    <button
                        class="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                        @click="handleBackToVideos" :disabled="isLoadingBtn">{{ isLoadingBtn ? 'Salvando...' : 'Voltar para Vídeos' }}</button>
                </div>
            </div>
        </section>

        <section class="panel overflow-hidden p-0">
            <div class="aspect-video w-full bg-black">
                <div v-if="canRenderPlayer" ref="playerHost" class="h-full w-full"></div>

                <div v-else class="flex h-full items-center justify-center p-6 text-center text-white/80">
                    Não foi possível carregar este vídeo no player interno.
                </div>
            </div>
        </section>

        <section v-if="video" class="panel p-5">
            <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="chip">{{ formattedDuration }}</span>
                    <span class="chip">{{ publishedAt }}</span>
                    <span class="chip" v-if="progressPercent > 0">{{ progressPercent }}% assistido</span>
                </div>

                <p class="text-sm text-ink-500">{{ video.description }}</p>

                <div v-if="progressPercent > 0" class="space-y-1">
                    <div class="flex items-center justify-between text-xs text-ink-500">
                        <span>Progresso do vídeo</span>
                        <span class="font-semibold text-ink-700">{{ progressPercent }}%</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-sand-100">
                        <div class="h-full rounded-full bg-brand-500" :style="{ width: `${progressPercent}%` }"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import type { IVideo, IVideoProgress } from '~/infra/interfaces/services/video'
import { useUserStore } from '~/infra/store/userStore'

type YoutubePlayerState = {
    PLAYING: number
    PAUSED: number
    ENDED: number
}

type YoutubePlayer = {
    getCurrentTime: () => number
    getDuration: () => number
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void
    destroy: () => void
}

type YoutubePlayerEvent = {
    target: YoutubePlayer
    data: number
}

type YoutubeNamespace = {
    Player: new (
        element: HTMLElement,
        options: {
            videoId: string
            playerVars?: Record<string, number | string>
            events?: {
                onReady?: (event: YoutubePlayerEvent) => void
                onStateChange?: (event: YoutubePlayerEvent) => void
            }
        },
    ) => YoutubePlayer
    PlayerState: YoutubePlayerState
}

declare global {
    interface Window {
        YT?: YoutubeNamespace
        onYouTubeIframeAPIReady?: () => void
    }
}

const route = useRoute()
const { $httpClient } = useNuxtApp()
const { loadingPush, loadingPop } = useLoading()
const isLoadingBtn = ref(false)
const isSavingProgress = ref(false)
const toast = useToastService()
const userData = useUserStore()

const video = ref<IVideo | null>(null)
const userProgress = ref<IVideoProgress | null>(null)
const playerHost = ref<HTMLElement | null>(null)
const player = ref<YoutubePlayer | null>(null)
const progressSyncTimer = ref<ReturnType<typeof setInterval> | null>(null)
const currentWatchSeconds = ref(0)
const lastSavedWatchSeconds = ref(0)
const hasCompletedVideo = ref(false)

const videoId = computed(() => {
    const parsedId = Number(route.params.id)
    return Number.isFinite(parsedId) ? parsedId : 0
})

const resumeAtSeconds = computed(() => {
    const queryValue = Number(route.query.t)

    if (Number.isFinite(queryValue) && queryValue > 0) {
        return Math.floor(queryValue)
    }

    return Math.max(0, Number(userProgress.value?.watchSeconds) || 0)
})

const youtubeVideoId = computed(() => {
    if (!video.value?.url) {
        return null
    }

    return extractYoutubeVideoId(video.value.url)
})

const canRenderPlayer = computed(() => Boolean(youtubeVideoId.value))

const formattedDuration = computed(() => {
    const totalSeconds = Math.max(0, Number(video.value?.durationSeconds) || 0)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const publishedAt = computed(() => {
    const date = new Date(video.value?.createdAt ?? '')

    if (Number.isNaN(date.getTime())) {
        return 'Data indisponível'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
})

const progressPercent = computed(() => {
    if (!video.value) {
        return 0
    }

    if (hasCompletedVideo.value || userProgress.value?.isCompleted) {
        return 100
    }

    const duration = Math.max(0, Number(video.value.durationSeconds) || 0)
    const watchSeconds = Math.max(0, Number(currentWatchSeconds.value) || 0)

    if (duration === 0) {
        return 0
    }

    return Math.min(100, Math.round((watchSeconds / duration) * 100))
})

function getUserIdFromSession(): number | null {
    if (userData.userId && userData.userId > 0) {
        return userData.userId
    }

    const loggedUser = getLoggedUser()
    const recoveredId = Number(loggedUser?.id)

    if (!Number.isFinite(recoveredId) || recoveredId <= 0) {
        return null
    }

    userData.setUserId(recoveredId)
    return recoveredId
}

function extractYoutubeVideoId(url: string): string | null {
    try {
        const parsedUrl = new URL(url)

        if (parsedUrl.hostname.includes('youtu.be')) {
            return parsedUrl.pathname.replace('/', '') || null
        }

        if (parsedUrl.pathname.includes('/embed/')) {
            return parsedUrl.pathname.split('/embed/')[1] || null
        }

        if (parsedUrl.hostname.includes('youtube.com')) {
            return parsedUrl.searchParams.get('v')
        }

        return null
    } catch {
        return null
    }
}

async function fetchVideoData() {
    loadingPush()

    try {
        if (!videoId.value) {
            toast.error('Vídeo inválido')
            await navigateTo('/videos')
            return
        }

        const allVideosResponse = await $httpClient.video.GetAllVideos()

        if (!allVideosResponse.success) {
            toast.error('Não foi possível carregar os dados do vídeo.')
            return
        }

        const selectedVideo = allVideosResponse.result.find((item) => item.id === videoId.value)

        if (!selectedVideo) {
            toast.error('Vídeo não encontrado.')
            await navigateTo('/videos')
            return
        }

        video.value = selectedVideo

        const userId = getUserIdFromSession()

        if (!userId) {
            return
        }

        const progressResponse = await $httpClient.video.GetProgressUserVideos(userId)

        if (progressResponse.success) {
            userProgress.value = progressResponse.result.find((item) => item.videoId === videoId.value) ?? null
            currentWatchSeconds.value = Math.max(0, Number(userProgress.value?.watchSeconds) || 0)
            lastSavedWatchSeconds.value = currentWatchSeconds.value
            hasCompletedVideo.value = Boolean(userProgress.value?.isCompleted)
        }
    } catch (error) {
        console.error('Erro ao carregar player de vídeo:', error)
        toast.error('Não foi possível carregar este vídeo no momento.')
    } finally {
        loadingPop()
    }
}

function readPlayerTime() {
    if (!player.value) {
        return
    }

    const currentSecond = Math.floor(player.value.getCurrentTime())
    if (currentSecond > currentWatchSeconds.value) {
        currentWatchSeconds.value = currentSecond
    }

    const duration = Math.max(0, Number(video.value?.durationSeconds) || Math.floor(player.value.getDuration()))
    if (duration > 0 && currentWatchSeconds.value >= duration - 1) {
        hasCompletedVideo.value = true
    }
}

function startProgressSyncTimer() {
    if (progressSyncTimer.value) {
        clearInterval(progressSyncTimer.value)
    }

    progressSyncTimer.value = setInterval(async () => {
        readPlayerTime()
        await saveVideoProgress({ force: false })
    }, 10000)
}

function stopProgressSyncTimer() {
    if (!progressSyncTimer.value) {
        return
    }

    clearInterval(progressSyncTimer.value)
    progressSyncTimer.value = null
}

async function saveVideoProgress({ force }: { force: boolean }) {
    if (isSavingProgress.value) {
        return
    }

    try {
        if (!video.value) {
            return
        }

        const userId = getUserIdFromSession()

        if (!userId) {
            return
        }

        const watchSeconds = Math.max(0, Math.floor(currentWatchSeconds.value))
        const duration = Math.max(0, Number(video.value.durationSeconds) || 0)
        const isCompleted = duration > 0 ? watchSeconds >= duration - 1 : hasCompletedVideo.value
        const secondsSinceLastSave = Math.abs(watchSeconds - lastSavedWatchSeconds.value)

        if (!force && secondsSinceLastSave < 10 && !isCompleted) {
            return
        }

        isSavingProgress.value = true

        const payloadVideos: IVideoProgress = {
            videoId: video.value.id,
            userId,
            watchSeconds,
            isCompleted,
            lastWatched: new Date().toISOString(),
        }

        const responseProgress = await $httpClient.video.SaveProgressVideo(payloadVideos)

        if (responseProgress.result == null) {
            return
        }

        userProgress.value = {
            videoId: payloadVideos.videoId,
            userId: payloadVideos.userId,
            watchSeconds: payloadVideos.watchSeconds,
            isCompleted: payloadVideos.isCompleted,
            lastWatched: payloadVideos.lastWatched,
        }
        hasCompletedVideo.value = payloadVideos.isCompleted
        lastSavedWatchSeconds.value = watchSeconds
    } catch (error) {
        console.error('Erro ao salvar progresso do vídeo:', error)
    } finally {
        isSavingProgress.value = false
    }
}

function loadYoutubeApi(): Promise<void> {
    if (window.YT?.Player) {
        return Promise.resolve()
    }

    return new Promise((resolve) => {
        const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]')
        if (!existingScript) {
            const script = document.createElement('script')
            script.src = 'https://www.youtube.com/iframe_api'
            script.async = true
            document.head.appendChild(script)
        }

        const previousReady = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
            previousReady?.()
            resolve()
        }
    })
}

async function initializePlayer() {
    if (!playerHost.value || !youtubeVideoId.value) {
        return
    }

    await loadYoutubeApi()

    if (!window.YT?.Player || !window.YT?.PlayerState) {
        return
    }

    player.value?.destroy()

    player.value = new window.YT.Player(playerHost.value, {
        videoId: youtubeVideoId.value,
        playerVars: {
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
            playsinline: 1,
        },
        events: {
            onReady: (event) => {
                if (resumeAtSeconds.value > 0) {
                    event.target.seekTo(resumeAtSeconds.value, true)
                    currentWatchSeconds.value = resumeAtSeconds.value
                    lastSavedWatchSeconds.value = resumeAtSeconds.value
                }
            },
            onStateChange: async (event) => {
                const playerState = window.YT?.PlayerState
                if (!playerState) {
                    return
                }

                if (event.data === playerState.PLAYING) {
                    startProgressSyncTimer()
                    return
                }

                readPlayerTime()
                stopProgressSyncTimer()

                if (event.data === playerState.ENDED) {
                    hasCompletedVideo.value = true
                    await saveVideoProgress({ force: true })
                    return
                }

                if (event.data === playerState.PAUSED) {
                    await saveVideoProgress({ force: true })
                }
            },
        },
    })
}

async function handleBackToVideos() {
    isLoadingBtn.value = true

    try {
        readPlayerTime()
        await saveVideoProgress({ force: true })
        toast.success('Progresso do vídeo salvo com sucesso!', '', 600)

        setTimeout(async () => {
            await navigateTo('/videos')
        }, 700)
    } catch (error) {
        console.error('Erro ao voltar para lista de vídeos:', error)
    } finally {
        isLoadingBtn.value = false
    }
}

onMounted(async () => {
    await fetchVideoData()
    await initializePlayer()
})

onBeforeUnmount(async () => {
    try {
        readPlayerTime()
        stopProgressSyncTimer()
        await saveVideoProgress({ force: true })
    } catch (error) {
        console.error('Erro ao persistir progresso no fechamento do player:', error)
    } finally {
        player.value?.destroy()
        player.value = null
    }
})
</script>
