<template>
    <div class="space-y-8">
        <section class="panel flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-center gap-5">
                <div class="h-20 w-20 rounded-full bg-sand-100"></div>
                <div class="space-y-1">
                    <h2 class="text-2xl font-semibold">Lucas Mendes</h2>
                    <p class="text-sm text-ink-500">Turma Front-end 2026.1</p>
                    <div class="flex flex-wrap gap-2">
                        <span class="chip">Nivel 4</span>
                        <span class="chip">Ranking #4</span>
                    </div>
                </div>
            </div>
            <button class="h-11 rounded-full border border-ink-900 px-5 text-sm font-semibold">Editar perfil</button>
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div class="panel space-y-4 p-6">
                <h3 class="text-lg font-semibold">Medalhas e certificados</h3>
                <div class="grid gap-3 sm:grid-cols-2">
                    <div class="panel p-4">
                        <p class="text-sm font-semibold">CSS Sprint</p>
                        <p class="text-xs text-ink-500">Concluido em 12/01</p>
                    </div>
                    <div class="panel p-4">
                        <p class="text-sm font-semibold">UI Forge</p>
                        <p class="text-xs text-ink-500">Concluido em 30/01</p>
                    </div>
                    <div class="panel p-4">
                        <p class="text-sm font-semibold">Rank Builder</p>
                        <p class="text-xs text-ink-500">Top 10 da turma</p>
                    </div>
                    <div class="panel p-4">
                        <p class="text-sm font-semibold">Desafio do modulo</p>
                        <p class="text-xs text-ink-500">Equipe vencedora</p>
                    </div>
                </div>
            </div>

            <div class="panel space-y-4 p-6">
                <h3 class="text-lg font-semibold">Relatorio geral</h3>
                <div class="space-y-4 text-sm text-ink-700">
                    <div class="flex items-center justify-between">
                        <span>Exercicios concluidos</span>
                        <span class="font-semibold">38/45</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Desafios semanais</span>
                        <span class="font-semibold">5/6</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Presenca nas aulas</span>
                        <span class="font-semibold">92%</span>
                    </div>
                </div>
                <div class="panel bg-sand-100 p-4">
                    <p class="text-sm font-semibold">Proximo marco</p>
                    <p class="text-xs text-ink-500">Final do modulo Front-end - Semana 6</p>
                </div>
            </div>
        </section>
    </div>
</template>