<template>
    <Teleport to="body">
        <!-- Backdrop -->
        <Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="visible" class="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
                @click="emit('update:visible', false)" />
        </Transition>

        <!-- Side Panel -->
        <Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="translate-x-full"
            enter-to-class="translate-x-0" leave-active-class="transition-transform duration-200 ease-in"
            leave-from-class="translate-x-0" leave-to-class="translate-x-full">
            <div v-if="visible"
                class="fixed right-0 top-0 z-60 flex h-full w-full flex-col bg-white shadow-2xl sm:w-[440px] dark:bg-black dark:border-l dark:border-slate-800">

                <!-- Header -->
                <div
                    class="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10">
                            <i class="pi pi-bell text-brand-600 dark:text-brand-400"></i>
                        </div>
                        <div>
                            <h2 class="text-base font-semibold text-loading">Notificações</h2>
                            <p class="text-xs text-loading">
                                {{ unreadCount }} não {{ unreadCount === 1 ? 'lida' : 'lidas' }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button v-if="hasUnread"
                            class="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-brand-400 dark:hover:bg-slate-900"
                            :disabled="isLoading" @click="handleMarkAllAsRead">
                            Marcar todas
                        </button>
                        <button
                            class="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-ink-500 transition hover:border-slate-300 hover:text-ink-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                            @click="emit('update:visible', false)">
                            <i class="pi pi-times text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="flex gap-1 border-b border-slate-200 px-5 pt-3 dark:border-slate-800">
                    <button class="flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition"
                        :class="activeTab === 'inbox'
                            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                            : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white'" @click="activeTab = 'inbox'">
                        Caixa de entrada
                        <span class="rounded-full px-2 py-0.5 text-[11px]" :class="activeTab === 'inbox'
                            ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                            : 'bg-slate-100 text-ink-500 dark:bg-slate-800 dark:text-slate-400'">
                            {{ unreadNotifications.length }}
                        </span>
                    </button>
                    <button class="ml-3 flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition"
                        :class="activeTab === 'historico'
                            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                            : 'border-transparent text-ink-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white'"
                        @click="activeTab = 'historico'">
                        Histórico
                        <span class="rounded-full px-2 py-0.5 text-[11px]" :class="activeTab === 'historico'
                            ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                            : 'bg-slate-100 text-ink-500 dark:bg-slate-800 dark:text-slate-400'">
                            {{ readNotifications.length }}
                        </span>
                    </button>
                </div>

                <!-- Search -->
                <div class="border-b border-slate-200 px-5 py-3 dark:border-slate-800">
                    <label
                        class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                        <i class="pi pi-search text-sm text-ink-400 dark:text-slate-500"></i>
                        <input v-model.trim="searchQuery" type="text"
                            class="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Buscar notificações..." />
                        <button v-if="searchQuery"
                            class="text-ink-400 hover:text-ink-700 dark:text-slate-500 dark:hover:text-white"
                            @click="searchQuery = ''">
                            <i class="pi pi-times text-xs"></i>
                        </button>
                    </label>
                </div>

                <!-- Notification List -->
                <div class="flex-1 space-y-3 overflow-y-auto p-4">

                    <!-- Loading state -->
                    <div v-if="isLoading && notifications.length === 0"
                        class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10">
                            <i class="pi pi-spinner pi-spin text-brand-600"></i>
                        </div>
                        <p class="mt-3 text-sm font-semibold text-ink-900 dark:text-white">Carregando...</p>
                        <p class="mt-1 text-xs text-ink-500 dark:text-slate-400">Buscando suas notificações</p>
                    </div>

                    <!-- Empty: no notifications at all -->
                    <div v-else-if="notifications.length === 0"
                        class="flex flex-col items-center justify-center py-16 text-center">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <i class="pi pi-inbox text-slate-500 dark:text-slate-400"></i>
                        </div>
                        <p class="mt-3 text-sm font-semibold text-ink-900 dark:text-white">Nenhuma notificação</p>
                        <p class="mt-1 text-xs text-ink-500 dark:text-slate-400">Você está em dia!</p>
                    </div>

                    <!-- Empty: no results for current tab/search -->
                    <div v-else-if="activeNotifications.length === 0"
                        class="flex flex-col items-center justify-center py-16 text-center">
                        <div class="flex h-12 w-12 items-center justify-center rounded-full"
                            :class="searchQuery ? 'bg-slate-100 dark:bg-slate-800' : activeTab === 'inbox' ? 'bg-brand-500/10' : 'bg-slate-100 dark:bg-slate-800'">
                            <i
                                :class="searchQuery ? 'pi pi-search text-slate-500' : activeTab === 'inbox' ? 'pi pi-bell text-brand-600' : 'pi pi-history text-slate-500 dark:text-slate-400'"></i>
                        </div>
                        <p class="mt-3 text-sm font-semibold text-ink-900 dark:text-white">
                            {{ searchQuery ? 'Nenhum resultado' : activeTab === 'inbox' ? 'Tudo lido!' : 'Sem histórico'
                            }}
                        </p>
                        <p class="mt-1 text-xs text-ink-500 dark:text-slate-400">
                            {{ searchQuery
                                ? 'Tente outro termo de busca.'
                                : activeTab === 'inbox'
                                    ? 'Nenhuma notificação pendente.'
                                    : 'Notificações lidas aparecerão aqui.' }}
                        </p>
                    </div>

                    <!-- Notification cards -->
                    <article v-for="notification in activeNotifications" v-else :key="notification.id"
                        class="relative overflow-hidden rounded-2xl border p-4 transition duration-200"
                        :class="notification.isRead
                            ? 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-black dark:hover:border-slate-700'
                            : 'border-brand-200 bg-brand-50/60 shadow-sm hover:border-brand-300 dark:border-brand-500/40 dark:bg-slate-950 dark:hover:border-brand-400/60'">

                        <div class="absolute inset-y-0 left-0 w-1 rounded-r-full"
                            :class="notification.isRead ? 'bg-slate-200 dark:bg-slate-800' : 'bg-gradient-to-b from-brand-500 to-accent-500'">
                        </div>

                        <div class="pl-3">
                            <div class="flex flex-wrap items-center gap-1.5 mb-2">
                                <span class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                                    :class="notification.isRead
                                        ? 'bg-slate-100 text-text-loading dark:bg-slate-800 dark:text-slate-400'
                                        : 'bg-brand-500/12 text-loading dark:bg-brand-500/20 dark:text-brand-300'">
                                    {{ notification.isRead ? 'Lida' : 'Nova' }}
                                </span>
                                <span v-if="notification.templateName"
                                    class="rounded-full border border-accent-200 bg-accent-50 px-2 py-0.5 text-[10px] font-semibold text-accent-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                    {{ notification.templateName }}
                                </span>
                            </div>

                            <h4 class="text-sm font-semibold leading-snug text-loading">
                                {{ notification.title }}
                            </h4>
                            <p class="mt-1 line-clamp-3 text-xs leading-relaxed text-ink-600 dark:text-slate-400">
                                {{ notification.message }}
                            </p>

                            <div class="mt-2 flex flex-wrap gap-1.5 text-[10px] text-ink-400 dark:text-slate-500">
                                <span v-if="notification.courseName">{{ notification.courseName }}</span>
                                <span v-if="notification.courseName && notification.className">·</span>
                                <span v-if="notification.className">{{ notification.className }}</span>
                                <span :class="(notification.courseName || notification.className) ? 'ml-auto' : ''">
                                    {{ formatDate(notification.createdAt) }}
                                </span>
                            </div>

                            <div v-if="!notification.isRead" class="mt-3 flex justify-end">
                                <button
                                    class="rounded-full border border-brand-300 bg-white px-3 py-1.5 text-xs font-semibold text-loading shadow-sm transition hover:bg-brand-50 dark:border-brand-500/60 dark:bg-slate-900 dark:text-brand-400 dark:hover:bg-slate-800"
                                    @click="handleMarkAsRead(notification.id)">
                                    Marcar como lida
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <!-- Footer -->
                <div class="border-t border-slate-200 px-5 py-3 dark:border-slate-800">
                    <button
                        class="w-full rounded-full border border-slate-200 py-2 text-xs font-semibold text-ink-500 transition hover:border-slate-300 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
                        :disabled="isLoading" @click="handleRefresh">
                        {{ isLoading ? 'Atualizando...' : 'Atualizar notificações' }}
                    </button>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotifications } from '~/composables/useNotifications'
import { useToastService } from '~/composables/useToast'

const props = defineProps<{
    visible: boolean
}>()

const emit = defineEmits<{
    'update:visible': [value: boolean]
}>()

const toast = useToastService()
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

const unreadNotifications = computed(() => notifications.value.filter((n) => !n.isRead))
const readNotifications = computed(() => notifications.value.filter((n) => n.isRead))

const activeBaseNotifications = computed(() =>
    activeTab.value === 'inbox' ? unreadNotifications.value : readNotifications.value,
)

const activeNotifications = computed(() => {
    const query = searchQuery.value.toLowerCase()
    if (!query) return activeBaseNotifications.value
    return activeBaseNotifications.value.filter((n) => {
        const haystack = [n.title, n.message, n.templateName, n.courseName, n.className]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
        return haystack.includes(query)
    })
})

function formatDate(value: string) {
    return new Date(value).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

async function handleRefresh() {
    try {
        await refreshNotifications()
    } catch (error: any) {
        toast.error('Erro ao carregar notificações', error?.errors?.[0] ?? 'Tente novamente.')
    }
}

async function handleMarkAsRead(notificationId: number) {
    try {
        await markAsRead(notificationId)
    } catch (error: any) {
        toast.error('Erro ao atualizar notificação', error?.errors?.[0] ?? 'Tente novamente.')
    }
}

async function handleMarkAllAsRead() {
    try {
        await markAllAsRead()
        toast.success('Caixa atualizada', 'Todas as notificações foram marcadas como lidas.')
    } catch (error: any) {
        toast.error('Erro ao atualizar notificações', error?.errors?.[0] ?? 'Tente novamente.')
    }
}

watch(
    () => props.visible,
    (visible) => {
        if (visible && !isInitialized.value) {
            handleRefresh()
        }
        if (!visible) {
            searchQuery.value = ''
        }
    },
)
</script>
