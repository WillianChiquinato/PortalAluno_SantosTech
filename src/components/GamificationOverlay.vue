<template>
    <div class="pointer-events-none fixed inset-0 z-[999]">

        <!-- XP Burst -->
        <transition name="fade-scale">
            <div v-if="showXPAnimation" class="absolute bottom-8 right-8 flex flex-col items-center">
                <BaseLottie path="/lottie/xp-burst.json" :loop="false" :autoplay="true" class="w-28 h-28" />
                <span class="mt-1 text-lg font-bold text-green-500">
                    +{{ xpGained }} XP
                </span>
            </div>
        </transition>

    </div>
</template>

<script setup lang="ts">
import BaseLottie from '@/components/BaseLottie.vue'
import { showXPAnimation, xpGained } from '@/composables/useGamification'
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
}
</style>