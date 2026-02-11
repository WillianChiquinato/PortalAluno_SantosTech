<template>
  <header class="flex flex-col gap-4 border-b border-slate-200/70 bg-white/80 px-5 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between lg:px-10">
    <div class="space-y-1">
      <p class="text-sm text-ink-500">Bem vindo de volta</p>
      <h2 class="text-2xl font-semibold">Ola, Lucas. Pronto para a fase de hoje?</h2>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <div class="relative">
        <input
          class="h-10 w-64 rounded-full border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-brand-500"
          placeholder="Buscar cursos, exercicios, materiais"
        />
      </div>
      <button class="h-10 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
        Iniciar tarefa diaria
      </button>
    </div>
  </header>
</template>
