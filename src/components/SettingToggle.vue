<template>
  <button type="button"
    class="w-full rounded-2xl border border-red-100/80 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm cursor-pointer setting-toggle-btn"
    @click="toggleEnabled">
    <div class="flex items-center justify-between gap-4 setting-toggle-row">
      <div class="space-y-1 setting-toggle-info">
        <p class="text-sm font-semibold text-ink-900">{{ title }}</p>
        <p class="text-xs text-ink-500">{{ description }}</p>
      </div>

      <div v-if="variant === 'default'" class="h-7 w-12 rounded-full border p-1 transition setting-toggle-switch"
        :class="isEnabled ? 'border-brand-200 bg-red-50' : 'border-slate-200 bg-sand-100'">
        <div class="h-5 w-5 rounded-full transition-all duration-200"
          :class="isEnabled ? 'translate-x-5 bg-brand-500 shadow-sm' : 'bg-white'" />
      </div>

      <div v-else-if="variant === 'language'" class="setting-toggle-language">
        <select v-model="SelectedLanguage" @change="onChangeLanguage"
          class="h-9 w-45 border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200">
          <option value="pt-BR">PT</option>
          <option value="en-US">EN</option>
          <option value="es-ES">ES</option>
        </select>
      </div>

      <div v-else
        class="h-9 w-16 overflow-hidden rounded-full border border-brand-200 bg-red-50 p-0.5 setting-toggle-theme">
        <canvas ref="themeCanvas" class="h-full w-full pointer-events-none"></canvas>
      </div>
    </div>

    <div v-if="variant !== 'language'" class="mt-3 h-px w-full min-w-[100px] bg-slate-100 setting-toggle-divider"></div>
    <p v-if="variant !== 'language'"
      class="mt-2 text-[11px] font-semibold uppercase tracking-wide setting-toggle-status"
      :class="isEnabled ? 'text-brand-600' : 'text-ink-500'">
      {{ isEnabled ? 'Ativado' : 'Desativado' }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { DotLottie } from '@lottiefiles/dotlottie-web'
import toggleAnimation from '@/assets/lottie/Toogle.lottie'

const SelectedLanguage = ref('pt-BR')

const onChangeLanguage = () => {
  emit('changeLanguage', SelectedLanguage.value)
}

const props = withDefaults(defineProps<{
  title: string
  description: string
  enabled?: boolean
  selectedLanguage?: string
  variant?: 'default' | 'theme-lottie' | 'language'
}>(), {
  variant: 'default',
})

const emit = defineEmits<{
  (event: 'change', value: boolean): void
  (event: 'update:enabled', value: boolean): void
  (event: 'changeLanguage', value: string): void
}>()

const isEnabled = ref(props.enabled ?? false)
const themeCanvas = ref<HTMLCanvasElement | null>(null)
const isLottieReady = ref(false)
const isThemeTransitioning = ref(false)

let animation: DotLottie | null = null
let pendingThemeSync: boolean | null = null
let themeApplyTimer: ReturnType<typeof setTimeout> | null = null

const THEME_CLASS_NAME = 'dark'
const THEME_STORAGE_KEY = 'portal-theme'
const THEME_APPLY_DELAY_MS = 0

function normalizeEnabled(value: boolean | undefined) {
  return value ?? false
}

function clearThemeApplyTimer() {
  if (!themeApplyTimer) {
    return
  }

  clearTimeout(themeApplyTimer)
  themeApplyTimer = null
}

function setDocumentTheme(enabled: boolean) {
  if (!import.meta.client) {
    return
  }

  document.documentElement.classList.toggle(THEME_CLASS_NAME, enabled)
  localStorage.setItem(THEME_STORAGE_KEY, enabled ? 'dark' : 'light')
}

function scheduleThemeApply(enabled: boolean) {
  clearThemeApplyTimer()
  themeApplyTimer = setTimeout(() => {
    setDocumentTheme(enabled)
    themeApplyTimer = null
  }, THEME_APPLY_DELAY_MS)
}

function getTargetIdleState(enabled: boolean) {
  return enabled ? 'Night Idle' : 'Day Idle'
}

function forceThemeIdleState(enabled: boolean) {
  if (!animation || !isLottieReady.value) {
    return false
  }

  const targetIdleState = getTargetIdleState(enabled)
  animation.stateMachineSetBooleanInput('toggle', enabled)
  animation.stateMachineOverrideState(targetIdleState, true)

  requestAnimationFrame(() => {
    if (!animation || !isLottieReady.value) {
      return
    }

    animation.stateMachineSetBooleanInput('toggle', enabled)
    animation.stateMachineOverrideState(targetIdleState, true)
  })

  scheduleThemeApply(enabled)
  return true
}

function applyThemeState(enabled: boolean, animate: boolean) {
  if (!animation || !isLottieReady.value) {
    return false
  }

  const targetIdleState = getTargetIdleState(enabled)
  const currentState = animation.stateMachineGetCurrentState()

  if (currentState === targetIdleState) {
    animation.stateMachineSetBooleanInput('toggle', enabled)
    return true
  }

  if (!animate) {
    return forceThemeIdleState(enabled)
  }

  animation.stateMachineFireEvent('transition')
  scheduleThemeApply(enabled)
  isThemeTransitioning.value = true
  return true
}

function requestThemeSync(enabled: boolean, animate: boolean) {
  if (isThemeTransitioning.value && animate) {
    pendingThemeSync = enabled
    return
  }

  const applied = applyThemeState(enabled, animate)
  if (!applied) {
    pendingThemeSync = enabled
  }
}

async function loadThemeAnimation() {
  if (!themeCanvas.value || props.variant !== 'theme-lottie') {
    return
  }

  if (animation) {
    animation.destroy()
    animation = null
  }

  const { DotLottie } = await import('@lottiefiles/dotlottie-web')

  isLottieReady.value = false

  animation = new DotLottie({
    canvas: themeCanvas.value,
    src: toggleAnimation,
    autoplay: false,
    loop: false,
    stateMachineId: 'StateMachine1',
    renderConfig: {
      autoResize: true,
      freezeOnOffscreen: false,
    },
  })

  animation.addEventListener('load', () => {
    if (!animation) {
      return
    }

    animation.stateMachineLoad('StateMachine1')
    animation.stateMachineStart()
    isLottieReady.value = true
    isThemeTransitioning.value = false
    const enabledFromConfig = normalizeEnabled(props.enabled)
    isEnabled.value = enabledFromConfig
    requestThemeSync(enabledFromConfig, false)
  })

  animation.addEventListener('stateMachineStateEntered', ({ state }) => {
    if (state === 'Day Idle' || state === 'Night Idle') {
      isThemeTransitioning.value = false

      if (pendingThemeSync !== null) {
        const nextEnabled = pendingThemeSync
        pendingThemeSync = null
        requestThemeSync(nextEnabled, true)
      }
      return
    }

    if (state === 'Day to Night' || state === 'Night to Day') {
      isThemeTransitioning.value = true
      scheduleThemeApply(state === 'Day to Night')
    }
  })

  animation.addEventListener('loadError', () => {
    isLottieReady.value = false
    isThemeTransitioning.value = false
  })
}

function toggleEnabled() {
  if (props.variant === 'theme-lottie' && (!isLottieReady.value || !animation || isThemeTransitioning.value)) {
    return
  }

  isEnabled.value = !isEnabled.value
  emit('update:enabled', isEnabled.value)
  emit('change', isEnabled.value)

  if (props.variant === 'theme-lottie') {
    requestThemeSync(isEnabled.value, true)
  }
}

watch(
  () => props.enabled,
  (newValue) => {
    const normalized = normalizeEnabled(newValue)

    if (normalized === isEnabled.value) {
      return
    }

    isEnabled.value = normalized
    if (props.variant === 'theme-lottie') {
      requestThemeSync(isEnabled.value, true)
    }
  },
)

watch(
  () => props.variant,
  (newValue) => {
    if (newValue === 'theme-lottie') {
      void loadThemeAnimation()
      return
    }

    isLottieReady.value = false
    isThemeTransitioning.value = false
    pendingThemeSync = null
    if (animation) {
      animation.destroy()
      animation = null
    }
  },
)

onMounted(() => {
  isEnabled.value = normalizeEnabled(props.enabled)

  if (props.variant === 'language' && props.selectedLanguage) {
    SelectedLanguage.value = props.selectedLanguage
  }

  if (props.variant === 'theme-lottie') {
    void loadThemeAnimation()
  }
})

watch(
  () => props.selectedLanguage,
  (newValue) => {
    if (props.variant !== 'language' || !newValue || newValue === SelectedLanguage.value) {
      return
    }

    SelectedLanguage.value = newValue
  },
)

onBeforeUnmount(() => {
  clearThemeApplyTimer()
  isLottieReady.value = false
  isThemeTransitioning.value = false
  pendingThemeSync = null
  if (animation) {
    animation.destroy()
    animation = null
  }
})

</script>

<style scoped>
.setting-toggle-btn {
  min-width: 0;
}

.setting-toggle-row {
  flex-wrap: wrap;
  gap: 1rem;
}

.setting-toggle-info {
  min-width: 0;
  flex: 1 1 60%;
}

.setting-toggle-switch,
.setting-toggle-theme,
.setting-toggle-language {
  flex-shrink: 0;
}

.setting-toggle-divider {
  margin-top: 0.75rem;
}

.setting-toggle-status {
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .setting-toggle-btn {
    padding: 1rem 0.5rem;
    border-radius: 1rem;
  }

  .setting-toggle-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .setting-toggle-info {
    width: 100%;
    flex: 1 1 100%;
  }

  .setting-toggle-switch,
  .setting-toggle-language {
    margin-top: 0.5rem;
    width: 100%;
    max-width: 50px;
  }

  .setting-toggle-theme {
    width: 100%;
    max-width: 60px;
  }

  .setting-toggle-divider {
    margin-top: 0.5rem;
  }

  .setting-toggle-status {
    margin-top: 0.25rem;
  }
}
</style>
