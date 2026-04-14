<template>
    <div class="notifications-page space-y-6">
        <section class="panel notifications-hero overflow-hidden p-0 dark:border-slate-800/90 dark:bg-black">
            <div class="notifications-hero-surface relative overflow-hidden px-5 py-6">
                <div class="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div class="min-w-0">
                        <p class="notifications-hero-eyebrow text-xs font-semibold uppercase tracking-[0.2em]">{{ t('notificationsHeroEyebrow') }}</p>
                        <h2 class="notifications-hero-title mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                            {{ t('notificationsHeroTitle') }}
                        </h2>
                        <p class="notifications-hero-text mt-2 max-w-2xl text-sm leading-6">
                            {{ t('notificationsHeroDescription') }}
                        </p>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                        <div class="rounded-2xl border border-brand-100 bg-white/90 px-4 py-3 text-ink-950 shadow-[0_18px_50px_-32px_rgba(37,99,235,0.18)] backdrop-blur-sm dark:border-slate-800 dark:bg-black/80 dark:text-white">
                            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 dark:text-slate-400">
                                {{ t('notificationsUnread') }}
                            </p>
                            <p class="mt-1 text-lg font-semibold leading-none">
                                {{ unreadCount }}
                            </p>
                        </div>

                        <div class="rounded-2xl border border-brand-100 bg-white/90 px-4 py-3 text-ink-950 shadow-[0_18px_50px_-32px_rgba(37,99,235,0.18)] backdrop-blur-sm dark:border-slate-800 dark:bg-black/80 dark:text-white">
                            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400 dark:text-slate-400">
                                {{ t('notificationsTotal') }}
                            </p>
                            <p class="mt-1 text-lg font-semibold leading-none">
                                {{ notifications.length }}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="relative z-10 mt-5 flex flex-wrap items-center gap-3">
                    <span
                        class="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-700 dark:border-slate-800 dark:bg-black/80 dark:text-brand-200">
                        {{ unreadCount }} {{ unreadCount === 1 ? t('notificationsUnreadSingular') : t('notificationsUnreadPlural') }}
                    </span>
                    <button
                        class="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-black/80 dark:text-brand-200 dark:hover:bg-slate-950"
                        :disabled="!hasUnread || isLoading" @click="handleMarkAllAsRead">
                        {{ t('notificationsMarkAllRead') }}
                    </button>
                </div>
            </div>
        </section>

        <section class="panel notifications-shell overflow-hidden p-0" :class="isDarkMode ? 'border-slate-800/90 !bg-black/95' : 'border-slate-200/80 !bg-white/95'">
            <div class="notifications-section-head border-b px-5 py-5 sm:px-6" :class="isDarkMode ? 'border-slate-800/90 !bg-black/95' : 'border-slate-200/80 !bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))]'">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div class="min-w-0">
                        <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-500">{{ t('notificationsPersonalInbox') }}</p>
                        <h3 class="mt-2 text-xl font-semibold tracking-tight text-ink-950 sm:text-[1.75rem]" :style="inboxTitleStyle">
                            {{ t('notificationsStudentCenter') }}
                        </h3>
                        <p class="mt-2 max-w-2xl text-sm leading-6 text-ink-500" :style="inboxTextStyle">
                            {{ t('notificationsStudentCenterDescription') }}
                        </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <div class="notifications-summary-card rounded-2xl border px-4 py-3 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.3)]" :class="isDarkMode ? 'border-slate-800/90 !bg-black/90' : 'border-slate-200 bg-white/95'">
                            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-400" :style="inboxMutedTextStyle">{{ t('notificationsSummary') }}</p>
                            <div class="mt-1 flex items-baseline gap-2">
                                <p class="text-sm font-semibold text-ink-900" :style="inboxTitleStyle">
                                    {{ unreadCount }} {{ unreadCount === 1 ? t('notificationsUnreadSingular') : t('notificationsUnreadPlural') }}
                                </p>
                                <span class="text-xs text-ink-400" :style="inboxMutedTextStyle">{{ t('notificationsOutOf') }} {{ notifications.length }}</span>
                            </div>
                        </div>

                        <button class="notifications-action-btn btn-secondary rounded-full px-4 py-2.5 text-sm shadow-sm transition hover:-translate-y-0.5"
                            :disabled="isLoading" @click="handleRefresh">
                            {{ isLoading ? t('notificationsRefreshing') : t('notificationsRefresh') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="p-5 sm:p-6">
                <div class="mb-5 flex flex-wrap items-center gap-3">
                    <button
                        class="notifications-tab inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200"
                        :class="activeTab === 'inbox'
                            ? (isDarkMode ? 'border-brand-500/60 bg-brand-500/15 text-brand-200 shadow-sm' : 'border-brand-300 bg-brand-500/10 text-brand-700 shadow-sm')
                            : (isDarkMode ? 'border-slate-800 bg-black/85 text-slate-300 hover:border-slate-700 hover:text-slate-100' : 'border-slate-200 bg-white text-ink-500 hover:border-slate-300 hover:text-ink-700')"
                        @click="activeTab = 'inbox'">
                        {{ t('notificationsInboxTab') }}
                        <span class="rounded-full px-2 py-0.5 text-xs shadow-sm" :class="isDarkMode ? 'bg-black/90 text-slate-200' : 'bg-white/90 text-ink-700'">
                            {{ unreadNotifications.length }}
                        </span>
                    </button>

                    <button
                        class="notifications-tab inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200"
                        :class="activeTab === 'historico'
                            ? (isDarkMode ? 'border-brand-500/60 bg-brand-500/15 text-brand-200 shadow-sm' : 'border-brand-300 bg-brand-500/10 text-brand-700 shadow-sm')
                            : (isDarkMode ? 'border-slate-800 bg-black/85 text-slate-300 hover:border-slate-700 hover:text-slate-100' : 'border-slate-200 bg-white text-ink-500 hover:border-slate-300 hover:text-ink-700')"
                        @click="activeTab = 'historico'">
                        {{ t('notificationsHistoryTab') }}
                        <span class="rounded-full px-2 py-0.5 text-xs shadow-sm" :class="isDarkMode ? 'bg-black/90 text-slate-200' : 'bg-white/90 text-ink-700'">
                            {{ readNotifications.length }}
                        </span>
                    </button>
                </div>

                <div class="mb-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <label
                        class="notifications-search flex items-center gap-3 rounded-[22px] border px-4 py-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]"
                        :class="isDarkMode ? 'border-slate-800/90 !bg-black/90' : 'border-slate-200 bg-white'">
                        <i class="pi pi-search text-sm text-ink-400"></i>
                        <input
                            v-model.trim="searchQuery"
                            type="text"
                            class="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                            :placeholder="t('notificationsSearchPlaceholder')" />
                    </label>

                    <div class="flex flex-wrap items-center gap-3">
                        <div
                            class="notifications-counter rounded-2xl border px-4 py-3 text-sm text-ink-500 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]"
                            :class="isDarkMode ? 'border-slate-800/90 !bg-black/90' : 'border-slate-200 bg-white/95'">
                            {{ t('notificationsShowing') }} <span class="font-semibold text-ink-900">{{ activeNotifications.length }}</span>
                            {{ t('notificationsOutOf') }} <span class="font-semibold text-ink-900">{{ activeBaseCount }}</span>
                        </div>

                        <button
                            v-if="searchQuery"
                            class="rounded-full border px-4 py-2 text-sm font-semibold transition hover:border-slate-300 hover:text-ink-900"
                            :class="isDarkMode ? 'border-slate-800 !bg-black/90 text-slate-300 hover:border-slate-700 hover:text-slate-100' : 'border-slate-200 bg-white text-ink-600'"
                            @click="searchQuery = ''">
                            {{ t('notificationsClearSearch') }}
                        </button>
                    </div>
                </div>

                <div v-if="isLoading && notifications.length === 0"
                    class="notifications-empty notifications-empty-card rounded-[28px] border border-dashed px-5 py-16 text-center text-sm text-ink-500"
                    :class="isDarkMode ? 'border-slate-800/90 !bg-black/95 text-slate-300' : 'border-slate-200'"
                    >
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
                        <i class="pi pi-spinner pi-spin text-lg"></i>
                    </div>
                    <p class="mt-4 text-base font-semibold text-ink-900">{{ t('notificationsLoadingTitle') }}</p>
                    <p class="mt-2 text-sm text-ink-500">{{ t('notificationsLoadingDescription') }}</p>
                </div>

                <div v-else-if="notifications.length === 0"
                    class="notifications-empty notifications-empty-card rounded-[28px] border border-dashed px-5 py-16 text-center"
                    :class="isDarkMode ? 'border-slate-800/90 !bg-black/95 text-slate-300' : 'border-slate-200'"
                    >
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <i class="pi pi-inbox text-lg"></i>
                    </div>
                    <p class="mt-4 text-base font-semibold text-ink-900">{{ t('notificationsEmptyTitle') }}</p>
                    <p class="mt-2 text-sm text-ink-500">
                        {{ t('notificationsEmptyDescription') }}
                    </p>
                </div>

                <div v-else-if="activeNotifications.length === 0"
                    class="notifications-empty notifications-empty-card rounded-[28px] border border-dashed px-5 py-16 text-center"
                    :class="isDarkMode ? 'border-slate-800/90 !bg-black/95 text-slate-300' : 'border-slate-200'"
                    >
                    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                        :class="searchQuery
                            ? 'bg-slate-100 text-slate-500'
                            : activeTab === 'inbox'
                                ? 'bg-brand-500/10 text-brand-600'
                                : 'bg-slate-100 text-slate-500'">
                        <i
                            :class="searchQuery
                                ? 'pi pi-search text-lg'
                                : activeTab === 'inbox'
                                    ? 'pi pi-bell text-lg'
                                    : 'pi pi-history text-lg'"></i>
                    </div>
                    <p class="mt-4 text-base font-semibold text-ink-900">
                        {{ searchQuery
                            ? t('notificationsNoResultsTitle')
                            : activeTab === 'inbox'
                                ? t('notificationsNoPendingTitle')
                                : t('notificationsNoHistoryTitle') }}
                    </p>
                    <p class="mt-2 text-sm text-ink-500">
                        {{ searchQuery
                            ? t('notificationsNoResultsDescription')
                            : activeTab === 'inbox'
                                ? t('notificationsNoPendingDescription')
                                : t('notificationsNoHistoryDescription') }}
                    </p>
                </div>

                <div
                    v-else
                    ref="notificationsListRef"
                    class="max-h-[42rem] space-y-4 overflow-y-auto pr-1"
                    @scroll="handleNotificationsScroll">
                    <article v-for="notification in visibleNotifications" :key="notification.id"
                        class="notification-card group relative overflow-hidden rounded-[30px] border p-5 transition duration-200 sm:p-6"
                        :class="notification.isRead
                            ? 'border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.88))] hover:border-slate-300 dark:border-slate-800/90 dark:bg-[linear-gradient(180deg,rgba(0,0,0,0.98),rgba(10,10,10,0.96))] dark:hover:border-slate-700'
                            : 'border-brand-200 bg-[linear-gradient(180deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))] shadow-[0_18px_50px_-28px_rgba(249,115,22,0.35)] hover:border-brand-300 dark:border-brand-500/40 dark:bg-[linear-gradient(180deg,rgba(0,0,0,0.98),rgba(15,23,42,0.94))] dark:hover:border-brand-400/60'">
                        <div class="absolute inset-y-0 left-0 w-1.5 rounded-r-full"
                            :class="notification.isRead ? 'bg-slate-200' : 'bg-gradient-to-b from-brand-500 to-accent-500'">
                        </div>

                        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div class="min-w-0 flex-1 pl-2">
                                <div class="flex flex-wrap items-center gap-2.5">
                                    <span
                                        class="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
                                        :class="notification.isRead ? 'bg-slate-100 text-slate-500 dark:bg-black/80 dark:text-slate-300' : 'bg-brand-500/12 text-brand-700 dark:bg-brand-500/20 dark:text-brand-200'">
                                        {{ notification.isRead ? t('notificationsStatusRead') : t('notificationsStatusNew') }}
                                    </span>
                                    <span v-if="notification.templateName"
                                        class="inline-flex items-center rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700 dark:border-slate-800 dark:bg-black/80 dark:text-slate-200">
                                        {{ notification.templateName }}
                                    </span>
                                </div>

                                <h4 class="mt-4 text-[1.45rem] font-semibold leading-tight tracking-tight text-ink-950 sm:text-[1.6rem]">
                                    {{ notification.title }}
                                </h4>
                                <p class="mt-3 max-w-4xl whitespace-pre-line text-[15px] leading-7 text-ink-600">
                                    {{ notification.message }}
                                </p>

                                <div class="mt-5 flex flex-wrap gap-2.5 text-xs text-ink-500">
                                    <span v-if="notification.courseName"
                                        class="rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 shadow-sm dark:border-slate-800 dark:bg-black/80">
                                        {{ t('notificationsCourse') }}: {{ notification.courseName }}
                                    </span>
                                    <span v-if="notification.className"
                                        class="rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 shadow-sm dark:border-slate-800 dark:bg-black/80">
                                        {{ t('notificationsClass') }}: {{ notification.className }}
                                    </span>
                                    <span class="rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 shadow-sm dark:border-slate-800 dark:bg-black/80">
                                        {{ formatDate(notification.createdAt) }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                                <span v-if="notification.isRead"
                                    class="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-black/80 dark:text-slate-300">
                                    <i class="pi pi-check mr-2 text-[11px]"></i>
                                    {{ t('notificationsStatusRead') }}
                                </span>

                                <button v-if="!notification.isRead"
                                    class="shrink-0 rounded-full border border-brand-300 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-md dark:border-brand-500/60 dark:bg-black/85 dark:text-brand-200 dark:hover:bg-brand-500/15"
                                    @click="handleMarkAsRead(notification.id)">
                                    {{ t('notificationsMarkAsRead') }}
                                </button>
                            </div>
                        </div>
                    </article>

                    <div v-if="hasMoreNotifications"
                        class="notifications-empty-card rounded-[24px] border border-dashed px-4 py-4 text-center text-sm text-ink-500"
                        :class="isDarkMode ? 'border-slate-800/90 !bg-black/90 text-slate-300' : 'border-slate-200 bg-white/70'">
                        {{ t('notificationsShowing') }} {{ visibleNotifications.length }} {{ t('notificationsOutOf') }} {{ activeNotifications.length }}.
                        {{ t('notificationsScrollMore') }}
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'
import { usePortalI18n } from '~/composables/usePortalI18n'
import { useToastService } from '~/composables/useToast'
import { useUserStore } from '~/infra/store/userStore'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const toast = useToastService()
const { t, locale } = usePortalI18n()
const userStore = useUserStore()
const {
    notifications,
    unreadCount,
    hasUnread,
    isLoading,
    isInitialized,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
} = useNotifications()
const activeTab = ref<'inbox' | 'historico'>('inbox')
const searchQuery = ref('')
const notificationsListRef = ref<HTMLElement | null>(null)
const visibleCount = ref(10)
const notificationsPageSize = 10

const unreadNotifications = computed(() =>
    notifications.value.filter((notification) => !notification.isRead),
)

const readNotifications = computed(() =>
    notifications.value.filter((notification) => notification.isRead),
)

const activeBaseNotifications = computed(() =>
    activeTab.value === 'inbox' ? unreadNotifications.value : readNotifications.value,
)

const activeBaseCount = computed(() => activeBaseNotifications.value.length)

const activeNotifications = computed(() =>
    activeBaseNotifications.value.filter((notification) => {
        const query = searchQuery.value.trim().toLowerCase()

        if (!query) {
            return true
        }

        const haystack = [
            notification.title,
            notification.message,
            notification.templateName,
            notification.courseName,
            notification.className,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        return haystack.includes(query)
    }),
)

const visibleNotifications = computed(() =>
    activeNotifications.value.slice(0, visibleCount.value),
)

const hasMoreNotifications = computed(() =>
    visibleNotifications.value.length < activeNotifications.value.length,
)

const isDarkMode = ref(false)

function syncDarkModeFromDom() {
    if (!import.meta.client) return
    isDarkMode.value = document.documentElement.classList.contains('dark')
}

let darkModeObserver: MutationObserver | null = null

const inboxShellStyle = computed(() =>
    isDarkMode.value
        ? {
            background: 'rgba(0,0,0,0.95)',
            borderColor: 'rgba(30, 41, 59, 0.9)',
          }
        : {
            background: 'rgba(255,255,255,0.96)',
            borderColor: 'rgba(203, 213, 225, 0.9)',
          },
)

const inboxHeadStyle = computed(() =>
    isDarkMode.value
        ? {
            background: 'rgba(0,0,0,0.95)',
            borderColor: 'rgba(30, 41, 59, 0.9)',
          }
        : {
            background: 'rgba(255,255,255,0.96)',
            borderColor: 'rgba(203, 213, 225, 0.9)',
          },
)

const inboxSummaryStyle = computed(() =>
    isDarkMode.value
        ? {
            background: 'rgba(0, 0, 0, 0.9)',
            borderColor: 'rgba(30, 41, 59, 0.9)',
          }
        : {
            background: 'rgba(255, 255, 255, 0.92)',
            borderColor: 'rgba(203, 213, 225, 0.9)',
          },
)

const inboxEmptyStyle = computed(() =>
    isDarkMode.value
        ? {
            background: 'rgba(0,0,0,0.95)',
            borderColor: 'rgba(30, 41, 59, 0.9)',
            color: '#cbd5e1',
          }
        : {
            background: 'rgba(255,255,255,0.96)',
            borderColor: 'rgba(203, 213, 225, 0.9)',
            color: '#6b7280',
          },
)

const inboxTitleStyle = computed(() => ({
    color: isDarkMode.value ? '#f3f4f6' : '#1f2937',
}))

const inboxTextStyle = computed(() => ({
    color: isDarkMode.value ? '#94a3b8' : '#6b7280',
}))

const inboxMutedTextStyle = computed(() => ({
    color: isDarkMode.value ? '#94a3b8' : '#6b7280',
}))

function formatDate(value: string) {
    return new Date(value).toLocaleString(locale.value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function resetVisibleNotifications() {
    visibleCount.value = notificationsPageSize

    if (import.meta.client) {
        requestAnimationFrame(() => {
            notificationsListRef.value?.scrollTo({ top: 0 })
        })
    }
}

function handleNotificationsScroll(event: Event) {
    const element = event.target as HTMLElement
    const distanceToBottom = element.scrollHeight - element.scrollTop - element.clientHeight

    if (distanceToBottom > 80 || !hasMoreNotifications.value) {
        return
    }

    visibleCount.value = Math.min(
        visibleCount.value + notificationsPageSize,
        activeNotifications.value.length,
    )
}

async function handleRefresh() {
    try {
        await refreshNotifications()
        resetVisibleNotifications()
    } catch (error: any) {
        toast.error(t('notificationsLoadErrorTitle'), error?.errors?.[0] ?? t('notificationsTryAgain'))
    }
}

async function handleMarkAsRead(notificationId: number) {
    try {
        await markAsRead(notificationId)
        resetVisibleNotifications()
    } catch (error: any) {
        toast.error(t('notificationsUpdateErrorTitle'), error?.errors?.[0] ?? t('notificationsTryAgain'))
    }
}

async function handleMarkAllAsRead() {
    try {
        await markAllAsRead()
        resetVisibleNotifications()
        toast.success(t('notificationsInboxUpdatedTitle'), t('notificationsInboxUpdatedDescription'))
    } catch (error: any) {
        toast.error(t('notificationsInboxUpdateErrorTitle'), error?.errors?.[0] ?? t('notificationsTryAgain'))
    }
}

watch([activeTab, searchQuery, notifications], () => {
    resetVisibleNotifications()
})

onMounted(async () => {
    syncDarkModeFromDom()

    darkModeObserver = new MutationObserver(() => {
        syncDarkModeFromDom()
    })

    darkModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    })

    if (isInitialized.value) {
        return
    }

    await handleRefresh()
})

onBeforeUnmount(() => {
    darkModeObserver?.disconnect()
})
</script>

<style scoped>
.notifications-page {
    position: relative;
    isolation: isolate;
}

.notifications-page::before {
    content: '';
    position: absolute;
    inset: -120px -40px auto;
    height: 420px;
    background:
        radial-gradient(circle at 15% 20%, rgba(220, 38, 38, 0.12), transparent 42%),
        radial-gradient(circle at 85% 10%, rgba(249, 115, 22, 0.12), transparent 36%);
    pointer-events: none;
    z-index: 0;
}

.notifications-page::after {
    content: '';
    position: absolute;
    inset: auto -80px -160px;
    height: 320px;
    background: radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.06), transparent 58%);
    pointer-events: none;
    z-index: 0;
}

.notifications-page > * {
    position: relative;
    z-index: 1;
}

.notifications-hero-surface {
    background:
        radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 34%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)) !important;
}

.notifications-hero-eyebrow {
    color: rgb(37 99 235) !important;
}

.notifications-hero-title {
    color: rgb(15 23 42) !important;
}

.notifications-hero-text {
    color: rgb(100 116 139) !important;
}

.notifications-shell {
    background:
        radial-gradient(circle at top right, rgba(220, 38, 38, 0.04), transparent 28%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)) !important;
    box-shadow: 0 22px 50px -34px rgba(15, 23, 42, 0.16);
    border-color: var(--color-slate-100) !important;
    color: var(--color-ink-900);
}

.notifications-section-head {
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.94)),
        radial-gradient(circle at top right, rgba(220, 38, 38, 0.05), transparent 36%) !important;
    border-color: var(--color-slate-100) !important;
}

.notifications-summary-card,
.notifications-search,
.notifications-counter,
.notifications-empty-card,
.notifications-action-btn {
    background: var(--color-white) !important;
    border-color: var(--color-slate-100) !important;
    color: var(--color-ink-900);
}

.notifications-search input,
.notifications-search input::placeholder,
.notifications-counter,
.notifications-empty-card,
.notifications-empty-card p,
.notifications-empty-card span {
    color: var(--color-ink-500) !important;
}

.notifications-summary-card p,
.notifications-summary-card span,
.notifications-action-btn,
.notifications-tab {
    color: var(--color-ink-900) !important;
}

.notifications-tab span {
    background: var(--color-sand-50) !important;
    color: var(--color-ink-900) !important;
}

.notifications-empty {
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)),
        radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.04), transparent 42%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.notification-card {
    box-shadow: 0 14px 40px -28px rgba(15, 23, 42, 0.22);
}

.notification-card:hover {
    transform: translateY(-1px);
}

:global(.dark) .notifications-page::before {
    background:
        radial-gradient(circle at 15% 20%, rgba(220, 38, 38, 0.18), transparent 42%),
        radial-gradient(circle at 85% 10%, rgba(59, 130, 246, 0.16), transparent 36%);
}

:global(.dark) .notifications-page::after {
    background: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.24), transparent 58%);
}

:global(.dark) .notifications-page :deep(.panel) {
    border-color: rgba(71, 85, 105, 0.72);
    background: rgba(15, 23, 42, 0.88);
    box-shadow: 0 24px 60px -36px rgba(2, 6, 23, 0.7);
}

:global(.dark) .notifications-page .notifications-hero-surface {
    background:
        radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 34%),
        linear-gradient(180deg, rgba(10, 10, 10, 0.98), rgba(0, 0, 0, 0.96)) !important;
}

:global(.dark) .notifications-shell {
    background: rgba(2, 6, 23, 0.92) !important;
    border-color: rgba(51, 65, 85, 0.85) !important;
}

:global(.dark) .notifications-section-head {
    border-color: rgba(51, 65, 85, 0.85) !important;
    background:
        linear-gradient(180deg, rgba(10, 10, 10, 0.98), rgba(15, 23, 42, 0.94)),
        radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 36%) !important;
}

:global(.dark) .notifications-summary-card,
:global(.dark) .notifications-search,
:global(.dark) .notifications-counter,
:global(.dark) .notifications-empty-card,
:global(.dark) .notifications-action-btn {
    border-color: rgba(51, 65, 85, 0.85) !important;
    background: rgba(0, 0, 0, 0.88) !important;
    color: rgb(226 232 240) !important;
    box-shadow: 0 18px 40px -30px rgba(2, 6, 23, 0.35);
}

:global(.dark) .notifications-search input {
    color: rgb(241 245 249) !important;
}

:global(.dark) .notifications-search input::placeholder {
    color: rgb(148 163 184) !important;
}

:global(.dark) .notifications-empty {
    background:
        linear-gradient(180deg, rgba(10, 10, 10, 0.98), rgba(15, 23, 42, 0.94)) !important;
    border-color: rgba(71, 85, 105, 0.72) !important;
    color: rgb(148 163 184) !important;
}

:global(.dark) .notification-card {
    box-shadow: 0 22px 44px -32px rgba(2, 6, 23, 0.72);
}

:global(.dark) .notifications-page .notification-card,
:global(.dark) .notifications-page .notification-card[class*='bg-[linear-gradient'],
:global(.dark) .notifications-page .notification-card span[class*='bg-white'],
:global(.dark) .notifications-page .notification-card button[class*='bg-white'],
:global(.dark) .notifications-page .notification-card .bg-white\/95,
:global(.dark) .notifications-page .notification-card .bg-white\/90,
:global(.dark) .notifications-page .notification-card .bg-accent-50,
:global(.dark) .notifications-page .notification-card .bg-slate-100,
:global(.dark) .notifications-page .notifications-tab span {
    background: rgba(0, 0, 0, 0.88) !important;
}

:global(.dark) .notifications-page .notification-card,
:global(.dark) .notifications-page .notification-card .border-slate-200,
:global(.dark) .notifications-page .notification-card .border-accent-200,
:global(.dark) .notifications-page .notification-card .border-brand-200,
:global(.dark) .notifications-page .notification-card .border-brand-300,
:global(.dark) .notifications-page .notifications-tab,
:global(.dark) .notifications-page .notifications-tab span,
:global(.dark) .notifications-page button.border-slate-200,
:global(.dark) .notifications-page button.border-brand-300 {
    border-color: rgba(51, 65, 85, 0.85) !important;
}

:global(.dark) .notifications-page .notifications-hero-eyebrow {
    color: rgb(147 197 253) !important;
}

:global(.dark) .notifications-page .notifications-hero-title {
    color: rgb(255 255 255) !important;
}

:global(.dark) .notifications-page .notifications-hero-text,
:global(.dark) .notifications-page .notifications-counter,
:global(.dark) .notifications-page .notifications-empty-card p,
:global(.dark) .notifications-page .notifications-empty-card span {
    color: rgb(148 163 184) !important;
}

:global(.dark) .notifications-page .notifications-summary-card p,
:global(.dark) .notifications-page .notifications-summary-card span,
:global(.dark) .notifications-page .notifications-action-btn,
:global(.dark) .notifications-page .notifications-tab,
:global(.dark) .notifications-page .notifications-counter .font-semibold,
:global(.dark) .notifications-page h3,
:global(.dark) .notifications-page h4,
:global(.dark) .notifications-page .notification-card,
:global(.dark) .notifications-page .notification-card p,
:global(.dark) .notifications-page .notification-card span,
:global(.dark) .notifications-page .notification-card button,
:global(.dark) .notifications-page .text-ink-900,
:global(.dark) .notifications-page .text-ink-500 {
    color: rgb(241 245 249) !important;
}
</style>
