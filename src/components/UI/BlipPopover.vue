<template>
    <Transition enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-2">
        <div v-if="show" class="absolute top-full z-50 mt-2
         w-[min(57vw,18rem)]
         left-1/3 sm:left-1/2 -translate-x-1/2">
            <div class=" flex justify-center">
                <div class="w-0 h-0
                 border-l-[8px] border-l-transparent
                 border-r-[8px] border-r-transparent
                 border-b-[8px] border-b-emerald-500" />
            </div>

            <div class="rounded-2xl bg-emerald-500 p-4 shadow-xl text-loading">
                <slot />
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean
}>()
</script>
