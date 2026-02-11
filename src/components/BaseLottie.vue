<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'

interface Props {
  animationData: any
  loop?: boolean
  autoplay?: boolean
}

const props = defineProps<Props>()

const container = ref<HTMLDivElement | null>(null)
let animation: AnimationItem | null = null

function loadAnimation() {
  if (!container.value || !props.animationData) return

  animation = lottie.loadAnimation({
    container: container.value,
    renderer: 'svg',
    loop: props.loop ?? false,
    autoplay: props.autoplay ?? true,
    animationData: props.animationData
  })

  animation.setSpeed(1.2)
}

onMounted(() => {
  if (process.server) return
  loadAnimation()
})

onBeforeUnmount(() => {
  animation?.destroy()
})

watch(
  () => props.animationData,
  () => {
    animation?.destroy()
    loadAnimation()
  }
)
</script>
