<template>
    <div
        class="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section class="space-y-6">
            <div class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Santos Games</p>
                <h1 class="text-3xl font-semibold">Portal do aluno com gamificacao real</h1>
                <p class="text-sm text-ink-500">
                    Acompanhe tarefas diarias, desafios semanais e evolucao por fases de cada modulo.
                </p>
            </div>
            <div class="space-y-3">
                <div class="panel p-4">
                    <p class="text-sm font-semibold">Desafios por modulo</p>
                    <p class="text-xs text-ink-500">Ranking, medalhas e feedback continuo do professor.</p>
                </div>
                <div class="panel p-4">
                    <p class="text-sm font-semibold">Trilhas inteligentes</p>
                    <p class="text-xs text-ink-500">Fluxo principal + lower path para reforco guiado.</p>
                </div>
                <div class="panel p-4">
                    <p class="text-sm font-semibold">Materiais extras</p>
                    <p class="text-xs text-ink-500">Docs, videos e exercicios centralizados.</p>
                </div>
            </div>
        </section>

        <section class="panel flex flex-col gap-5 p-6">
            <div class="space-y-1">
                <h2 class="text-xl font-semibold">Entrar</h2>
                <p class="text-sm text-ink-500">Acesso exclusivo para alunos matriculados.</p>
            </div>

            <form class="space-y-4">
                <label class="flex flex-col gap-2 text-sm font-medium">
                    Email
                    <input class="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                        placeholder="aluno@santosgames.com" />
                </label>
                <label class="flex flex-col gap-2 text-sm font-medium">
                    Senha
                    <input type="password" class="h-11 rounded-xl border border-slate-200 px-3 text-sm"
                        placeholder="********" />
                </label>
                <button class="h-11 rounded-xl bg-ink-900 text-sm font-semibold text-white">Entrar</button>
            </form>

            <p class="text-xs text-ink-500">Esqueceu a senha? Fale com o suporte da turma.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})
</script>