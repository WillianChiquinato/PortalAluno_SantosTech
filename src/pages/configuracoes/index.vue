<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-semibold">Configuracoes</h2>
            <p class="text-sm text-ink-500">Personalize notificacoes e experiencia na plataforma.</p>
        </div>

        <section class="grid gap-4">
            <SettingToggle v-for="toggle in toggles" :key="toggle.title" v-bind="toggle" />
        </section>

        <section class="panel flex flex-col gap-4 p-6">
            <h3 class="text-lg font-semibold">Seguranca</h3>
            <div class="flex flex-wrap items-center gap-3">
                <button class="h-10 rounded-full border border-ink-900 px-4 text-sm font-semibold">Alterar
                    senha</button>
                <button class="h-10 rounded-full bg-ink-900 px-4 text-sm font-semibold text-white">Confirmar
                    email</button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import SettingToggle from '@/components/SettingToggle.vue'

const toggles = [
    {
        title: 'Notificacoes de tarefas',
        description: 'Receber alertas de prazos no email e no celular.',
        enabled: true,
    },
    {
        title: 'Resumo semanal',
        description: 'Enviar resumo de progresso toda sexta-feira.',
        enabled: false,
    },
    {
        title: 'Modo foco',
        description: 'Ocultar ranking durante execucao de exercicios.',
        enabled: true,
    },
]
</script>