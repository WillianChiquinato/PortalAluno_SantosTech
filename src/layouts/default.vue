<template>
    <div class="relative min-h-screen bg-sand-50 text-ink-900">
        <div class="pointer-events-none fixed inset-0 -z-10">
            <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-200/70 blur-3xl"></div>
            <div class="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-accent-200/70 blur-3xl"></div>
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(220,38,38,0.08),_transparent_60%)]">
            </div>
        </div>

        <div class="flex min-h-screen">
            <SidebarNav class="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex" />

            <div class="flex min-h-screen flex-1 flex-col lg:pl-72">
                <main class="flex-1 px-5 pb-24 pt-6 lg:px-10">
                    <slot />
                </main>
            </div>
        </div>

        <SidebarNav mode="mobile" class="lg:hidden" />

        <!-- 🔥 Overlay Global -->
        <GamificationOverlay />
    </div>
</template>

<script setup lang="ts">
import SidebarNav from '@/components/SidebarNav.vue'
import GamificationOverlay from '@/components/GamificationOverlay.vue'
</script>