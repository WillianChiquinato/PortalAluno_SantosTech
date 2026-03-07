<template>
    <section class="panel p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">Area do aluno</p>
                <h3 class="text-lg font-semibold">{{ title }}</h3>
                <p class="mt-1 text-sm text-ink-500">Acompanhe o historico de respostas sem sair da tela atual.</p>
            </div>

            <span class="chip">{{ filteredAnswers.length }} resposta(s)</span>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <article class="rounded-xl border border-red-100 bg-red-50/70 p-3">
                <p class="text-[11px] uppercase tracking-[0.14em] text-ink-500">Corretas</p>
                <p class="mt-1 text-xl font-semibold text-brand-600">{{ totalCorrect }}</p>
            </article>
            <article class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] uppercase tracking-[0.14em] text-ink-500">Incorretas</p>
                <p class="mt-1 text-xl font-semibold text-ink-900">{{ totalWrong }}</p>
            </article>
            <article class="rounded-xl border border-success-200/80 bg-success-200/20 p-3">
                <p class="text-[11px] uppercase tracking-[0.14em] text-ink-500">Pendentes</p>
                <p class="mt-1 text-xl font-semibold text-success-600">{{ totalPending }}</p>
            </article>
        </div>

        <div class="mt-4 flex flex-wrap gap-2">
            <button v-for="status in filters" :key="status"
                class="rounded-full border px-3 py-1 text-xs font-semibold transition hover:-translate-y-0.5" :class="selectedFilter === status
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-red-100 bg-white text-ink-700'" @click="selectedFilter = status">
                {{ status }}
            </button>
        </div>

        <div class="mt-4 space-y-3">
            <article v-for="answer in filteredAnswers" :key="answer.id"
                class="rounded-xl border border-red-100 bg-white p-3">
                <div class="flex flex-wrap items-start justify-between gap-2">
                    <p class="text-sm font-semibold text-ink-900">{{ answer.question }}</p>
                    <span class="chip" :class="statusClass(answer.status)">{{ answer.status }}</span>
                </div>

                <p class="mt-2 text-sm text-ink-700">{{ answer.answer }}</p>

                <div class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
                    <span>Respondido em {{ formatDate(answer.answeredAt) }}</span>
                    <span v-if="typeof answer.score === 'number'" class="font-semibold text-ink-700">Nota {{
                        answer.score }}</span>
                </div>
            </article>

            <article v-if="!filteredAnswers.length"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <p class="text-sm font-semibold text-ink-700">Nenhuma resposta para este filtro.</p>
                <p class="mt-1 text-xs text-ink-500">Troque o filtro para visualizar outras respostas.</p>
            </article>
        </div>
    </section>
</template>

<script setup lang="ts">
export type UserAnswerStatus = 'Todas' | 'Correta' | 'Incorreta' | 'Pendente'

export type UserAnswerItem = {
    id: number
    question: string
    answer: string
    status: Exclude<UserAnswerStatus, 'Todas'>
    answeredAt: string
    score?: number
}

const props = withDefaults(
    defineProps<{
        title?: string
        answers: UserAnswerItem[]
    }>(),
    {
        title: 'Respostas do aluno',
    },
)

const filters: UserAnswerStatus[] = ['Todas', 'Correta', 'Incorreta', 'Pendente']
const selectedFilter = ref<UserAnswerStatus>('Todas')

const filteredAnswers = computed(() => {
    if (selectedFilter.value === 'Todas') {
        return props.answers
    }

    return props.answers.filter((answer) => answer.status === selectedFilter.value)
})

const totalCorrect = computed(() => props.answers.filter((answer) => answer.status === 'Correta').length)
const totalWrong = computed(() => props.answers.filter((answer) => answer.status === 'Incorreta').length)
const totalPending = computed(() => props.answers.filter((answer) => answer.status === 'Pendente').length)

function formatDate(dateString: string): string {
    const parsed = new Date(dateString)

    if (Number.isNaN(parsed.getTime())) {
        return 'Data indisponivel'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed)
}

function statusClass(status: UserAnswerItem['status']) {
    if (status === 'Correta') {
        return '!border-brand-200 !bg-red-50 !text-brand-600'
    }

    if (status === 'Incorreta') {
        return '!border-slate-300 !bg-slate-100 !text-ink-700'
    }

    return '!border-success-200 !bg-success-200/20 !text-success-600'
}
</script>
