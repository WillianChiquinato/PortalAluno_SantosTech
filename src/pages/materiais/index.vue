<template>
    <div class="space-y-6">
        <div>
            <h2 class="text-2xl font-semibold">Material adicional</h2>
            <p class="text-sm text-ink-500">Documentacoes extras e referencias do professor.</p>
        </div>

        <section class="panel overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-sand-100 text-left text-xs uppercase tracking-[0.2em] text-ink-500">
                    <tr>
                        <th class="px-6 py-4">Titulo</th>
                        <th class="px-6 py-4">Tipo</th>
                        <th class="px-6 py-4">Atualizado</th>
                        <th class="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="material in materials" :key="material.title" class="border-t border-slate-200/70">
                        <td class="px-6 py-4 font-medium">{{ material.title }}</td>
                        <td class="px-6 py-4 text-ink-500">{{ material.type }}</td>
                        <td class="px-6 py-4 text-ink-500">{{ material.updated }}</td>
                        <td class="px-6 py-4 text-right">
                            <button
                                class="h-9 rounded-full border border-ink-900 px-4 text-xs font-semibold">Baixar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script setup lang="ts">
const materials = [
    { title: 'Guia de CSS utilitario', type: 'PDF', updated: '10/02' },
    { title: 'Checklist de projeto final', type: 'DOC', updated: '08/02' },
    { title: 'Revisao de flexbox', type: 'PDF', updated: '05/02' },
    { title: 'Mapa mental de HTML', type: 'PNG', updated: '01/02' },
]
</script>