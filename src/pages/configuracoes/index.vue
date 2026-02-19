<template>
    <div class="space-y-6">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 p-5 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Preferências</p>
                        <h2 class="text-2xl font-semibold text-white">Configurações</h2>
                        <p class="mt-1 text-sm text-white/80">Personalize notificações e experiência na plataforma.</p>
                    </div>

                    <span
                        class="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                        {{ toggles.length }} ajustes
                    </span>
                </div>
            </div>
        </section>

        <section class="panel p-5 space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">Notificações e foco</h3>
                <span class="chip">Conta do aluno</span>
            </div>

            <div class="grid gap-3">
                <SettingToggle v-for="toggle in toggles" :key="toggle.title" v-bind="toggle" />
            </div>
        </section>

        <section class="panel flex flex-col gap-4 p-6">
            <h3 class="text-lg font-semibold">Seguranca</h3>
            <p class="text-sm text-ink-500">Atualize dados sensíveis e mantenha sua conta protegida.</p>
            <div class="flex flex-wrap items-center gap-3">
                <button class="btn-outline h-10 px-4 text-sm cursor-pointer">Alterar senha</button>
                <button class="btn-primary h-10 px-4 text-sm cursor-pointer">Confirmar email</button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import SettingToggle from '@/components/SettingToggle.vue'

type SettingItem = {
    title: string
    description: string
    enabled: boolean
    variant?: 'default' | 'theme-lottie'
}

const toggles: SettingItem[] = [
    {
        title: 'Notificações de tarefas',
        description: 'Receber alertas de prazos no email e no celular.',
        enabled: true,
    },
    {
        title: 'Resumo semanal',
        description: 'Enviar resumo de progresso toda sexta-feira.',
        enabled: false,
    },
    {
        title: 'Tematização',
        description: 'Personalizar a aparência da plataforma com temas claros ou escuros.',
        enabled: false,
        variant: 'theme-lottie',
    },
]
</script>