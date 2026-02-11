<template>
    <div class="mx-auto flex max-w-xl flex-col items-center gap-4 py-20 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Erro 404</p>
        <h1 class="text-3xl font-semibold">Pagina nao encontrada</h1>
        <p class="text-sm text-ink-500">A rota acessada nao existe ou foi movida.</p>
        <NuxtLink to="/" class="h-10 rounded-full bg-ink-900 px-4 text-sm font-semibold text-white">
            Voltar ao dashboard
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})
</script>
