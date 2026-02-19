<template>
    <article
        class="panel group flex h-full flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-md">
        <div class="relative flex h-28 items-center justify-center border-b border-red-100/80 bg-sand-100">
            <span class="text-4xl" aria-hidden="true">📄</span>

            <div class="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                <span
                    class="rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {{ visibilityLabel }}
                </span>

                <span class="rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-white">
                    {{ normalizedFileType }}
                </span>
            </div>
        </div>

        <div class="flex flex-1 flex-col gap-3 p-4">
            <div class="space-y-2">
                <h3 class="line-clamp-2 text-base font-semibold leading-snug text-ink-900">{{ title }}</h3>
                <p class="line-clamp-3 text-sm text-ink-500">{{ description }}</p>
            </div>

            <div class="mt-auto flex items-center justify-between gap-3">
                <span class="chip !px-2.5 !py-1 !text-[11px]">{{ uploadedAtLabel }}</span>

                <a :href="resolvedFileUrl" target="_blank" rel="noopener noreferrer"
                    class="btn-outline h-9 px-4 text-xs" :aria-label="`Abrir material ${title}`">
                    Abrir material
                </a>
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
const props = defineProps<{
    title: string
    description: string
    fileUrl: string
    fileType: string | number
    visibility: number
    uploadedAt: string
}>()

const visibilityLabel = computed(() => {
    switch (props.visibility) {
        case 1:
            return 'Público'
        case 2:
            return 'Alunos'
        default:
            return 'Privado'
    }
})

const normalizedFileType = computed(() => {
    const type = String(props.fileType || '').trim()
    return type ? type.toUpperCase() : 'ARQUIVO'
})

const uploadedAtLabel = computed(() => {
    const date = new Date(props.uploadedAt)

    if (Number.isNaN(date.getTime())) {
        return 'Data indisponível'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date)
})

const resolvedFileUrl = computed(() => {
    const rawUrl = String(props.fileUrl || '').trim()

    if (!rawUrl) {
        return '#'
    }

    if (/^https?:\/\//i.test(rawUrl)) {
        return rawUrl
    }

    const baseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim()

    if (!baseUrl) {
        return rawUrl
    }

    return `${baseUrl.replace(/\/$/, '')}/${rawUrl.replace(/^\//, '')}`
})
</script>