<template>
  <div ref="container" class="fixed inset-0 pointer-events-none z-50"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import animationData from '@/assets/lottie/Click Effect.json'

const container = ref(null)

function handleClick(e) {
  const el = document.createElement('div')
  el.style.position = 'absolute'
  el.style.left = e.clientX + 'px'
  el.style.top = e.clientY + 'px'
  el.style.transform = 'translate(-50%, -50%)'
  el.style.width = '80px'
  el.style.height = '80px'

  container.value.appendChild(el)

  const anim = lottie.loadAnimation({
    container: el,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData
  })

  anim.addEventListener('complete', () => {
    anim.destroy()
    el.remove()
  })
}

onMounted(() => {
  window.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClick)
})
</script>
