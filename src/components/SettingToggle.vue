<template>
  <button type="button"
    class="w-full rounded-2xl border border-red-100/80 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer"
    @click="toggleEnabled">
    <div class="flex items-center justify-between gap-4">
      <div class="space-y-1">
        <p class="text-sm font-semibold text-ink-900">{{ title }}</p>
        <p class="text-xs text-ink-500">{{ description }}</p>
      </div>

      <div v-if="variant !== 'theme-lottie'" class="h-7 w-12 rounded-full border p-1 transition"
        :class="isEnabled ? 'border-brand-200 bg-red-50' : 'border-slate-200 bg-sand-100'">
        <div class="h-5 w-5 rounded-full transition-all duration-200"
          :class="isEnabled ? 'translate-x-5 bg-brand-500 shadow-sm' : 'bg-white'" />
      </div>

      <div v-else class="h-9 w-16 overflow-hidden rounded-full border border-brand-200 bg-red-50 p-0.5">
        <div ref="lottieContainer" class="h-full w-full"></div>
      </div>
    </div>

    <div class="mt-3 h-px w-full bg-slate-100"></div>
    <p class="mt-2 text-[11px] font-semibold uppercase tracking-wide"
      :class="isEnabled ? 'text-brand-600' : 'text-ink-500'">
      {{ isEnabled ? 'Ativado' : 'Desativado' }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'
import toggleAnimation from '@/assets/lottie/Toogle.json'

const props = withDefaults(defineProps<{
  title: string
  description: string
  enabled: boolean
  variant?: 'default' | 'theme-lottie'
}>(), {
  variant: 'default',
})

const emit = defineEmits<{
  (event: 'change', value: boolean): void
  (event: 'update:enabled', value: boolean): void
}>()

const isEnabled = ref(props.enabled)
const lottieContainer = ref<HTMLDivElement | null>(null)
const isLottieAnimating = ref(false)
const isLottieReady = ref(false)

let animation: AnimationItem | null = null
let lottieTargetFrame = 0
let unlockAnimationTimer: ReturnType<typeof setTimeout> | null = null

function getAnimationFrames() {
  if (!animation) {
    return { halfFrame: 0, lastFrame: 0 }
  }

  const totalFrames = Math.max(2, Math.floor(animation.getDuration(true)))
  const lastFrame = totalFrames
  const halfFrame = Math.floor(lastFrame / 2)

  return { halfFrame, lastFrame }
}

function clearUnlockAnimationTimer() {
  if (!unlockAnimationTimer) {
    return
  }

  clearTimeout(unlockAnimationTimer)
  unlockAnimationTimer = null
}

function finalizeAnimationFrame() {
  if (!animation) {
    return
  }

  animation.stop()
  animation.goToAndStop(lottieTargetFrame, true)
  isLottieAnimating.value = false
  clearUnlockAnimationTimer()
}

function syncAnimationToState(animate = false) {
  if (!animation || !isLottieReady.value) {
    return
  }

  const { halfFrame, lastFrame } = getAnimationFrames()
  const targetFrame = isEnabled.value ? halfFrame : lastFrame

  if (!animate) {
    isLottieAnimating.value = false
    lottieTargetFrame = targetFrame
    animation.goToAndStop(targetFrame, true)
    return
  }

  if (isLottieAnimating.value) {
    return
  }

  const startFrame = isEnabled.value ? 0 : halfFrame

  isLottieAnimating.value = true
  lottieTargetFrame = targetFrame
  animation.stop()
  animation.goToAndStop(startFrame, true)
  animation.playSegments([startFrame, targetFrame], true)

  clearUnlockAnimationTimer()
  unlockAnimationTimer = setTimeout(() => {
    finalizeAnimationFrame()
  }, 900)
}

function loadThemeAnimation() {
  if (!lottieContainer.value || props.variant !== 'theme-lottie') {
    return
  }

  animation?.destroy()
  clearUnlockAnimationTimer()
  isLottieReady.value = false
  isLottieAnimating.value = false
  animation = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: toggleAnimation,
  })

  animation.setSpeed(1.25)
  animation.addEventListener('complete', () => {
    if (!animation || !isLottieAnimating.value) {
      return
    }

    finalizeAnimationFrame()
  })

  animation.addEventListener('DOMLoaded', () => {
    isLottieReady.value = true
    isLottieAnimating.value = false
    animation?.goToAndStop(0, true)
  })
}

function toggleEnabled() {
  if (props.variant === 'theme-lottie' && (!isLottieReady.value || isLottieAnimating.value)) {
    return
  }

  isEnabled.value = !isEnabled.value
  emit('update:enabled', isEnabled.value)
  emit('change', isEnabled.value)

  if (props.variant === 'theme-lottie') {
    syncAnimationToState(true)
  }
}

watch(
  () => props.enabled,
  (newValue) => {
    if (newValue === isEnabled.value) {
      return
    }

    isEnabled.value = newValue
    if (props.variant === 'theme-lottie') {
      syncAnimationToState(true)
    }
  },
)

watch(
  () => props.variant,
  (newValue) => {
    if (newValue === 'theme-lottie') {
      loadThemeAnimation()
      return
    }

    animation?.destroy()
    animation = null
  },
)

onMounted(() => {
  if (props.variant === 'theme-lottie') {
    loadThemeAnimation()
  }
})

onBeforeUnmount(() => {
  clearUnlockAnimationTimer()
  isLottieReady.value = false
  isLottieAnimating.value = false
  animation?.destroy()
  animation = null
})
</script>
