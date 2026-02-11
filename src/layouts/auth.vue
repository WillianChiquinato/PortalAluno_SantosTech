<template>
    <div class="min-h-screen bg-sand-50 text-ink-900">
        <div class="pointer-events-none fixed inset-0 -z-10">
            <div class="absolute -top-32 right-0 h-72 w-72 rounded-full bg-brand-200/70 blur-3xl"></div>
            <div class="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-accent-200/70 blur-3xl"></div>
        </div>

        <main class="px-6 py-10">
            <slot />
        </main>
    </div>
</template>
