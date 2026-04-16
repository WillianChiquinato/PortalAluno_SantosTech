<template>
  <LoadingScreen v-if="showLoginSplash" />

  <div v-else class="login-page">
    <div class="hero-panel" :style="{
      backgroundImage: `linear-gradient(145deg, rgba(15,10,10,0.88), rgba(60,15,15,0.75)), url(${bgSantosGames})`,
    }">
      <transition name="fade">
        <div v-if="showLottieEffect" class="lottie-footer">
          <BaseLottie :animation-data="EffectLogin" :loop="false" :autoplay="true" class="lottie-effect-footer"
            @complete="onLottieComplete" />
        </div>
      </transition>

      <div class="hero-panel__content">
        <div class="hero-panel__brand">
          <p class="hero-panel__eyebrow">Portal Santos Tech</p>
        </div>

        <p class="hero-panel__lead">Aulas, materiais e trilhas em um unico lugar.</p>

        <div class="login-card">
          <div class="login-card__header">
            <p class="login-card__eyebrow">{{ showPasswordPage ? 'Recuperacao' : 'Bem-vindo' }}</p>
            <h2>
              {{
                showPasswordPage
                  ? showSentPage
                    ? 'Email enviado'
                    : 'Recuperar senha'
                  : 'Entrar no portal'
              }}
            </h2>
            <p v-if="!showPasswordPage">Continue de onde parou usando sua conta.</p>
            <p v-else-if="!showSentPage">
              Informe seu email para receber as orientacoes de recuperacao.
            </p>
            <p v-else>
              Enviamos as orientacoes para <strong>{{ emailLogin }}</strong>.
            </p>
          </div>

          <template v-if="!showPasswordPage">
            <form class="login-form" @submit.prevent="loadUserData">
              <label>
                <span>Email</span>
                <input v-model="emailLogin" type="email" autocomplete="email" placeholder="aluno@santos-tech.com" />
              </label>
              <label>
                <span>Senha</span>
                <input v-model="passwordLogin" type="password" autocomplete="current-password"
                  placeholder="Digite sua senha" />
              </label>
              <button type="submit" class="primary-btn" :disabled="isFormInvalid || isSubmitting">
                <span v-if="!isSubmitting">Entrar no portal</span>
                <span v-else>Validando acesso...</span>
              </button>
            </form>

            <div class="login-support">
              <span>Esqueceu sua senha?</span>
              <button type="button" @click="handlePassword">Recuperar acesso</button>
            </div>
          </template>

          <template v-else-if="!showSentPage">
            <form class="login-form" @submit.prevent="handlePassword">
              <label>
                <span>Email</span>
                <input v-model="emailLogin" type="email" autocomplete="email" placeholder="aluno@santos-tech.com" />
              </label>
              <button type="submit" class="primary-btn" :disabled="!emailLogin">
                Enviar orientacoes
              </button>
              <button type="button" class="secondary-btn" @click="goHome">Voltar para login</button>
            </form>
          </template>

          <template v-else>
            <div class="login-success">
              <div class="login-success__icon">
                <i class="pi pi-check"></i>
              </div>
              <p class="login-success__text">
                Verifique sua caixa de entrada e siga as orientacoes para redefinir a senha.
              </p>
              <button type="button" class="secondary-btn" @click="goHome">Voltar para login</button>
            </div>
          </template>
        </div>
      </div>

      <button class="scroll-indicator" @click="scrollToInfo" aria-label="Ver mais informacoes">
        <i class="pi pi-chevron-down"></i>
      </button>
    </div>

    <section ref="infoSectionRef" class="info-section">
      <div class="info-section__inner">
        <div class="info-header">
          <div class="info-header__copy">
            <p class="info-section__eyebrow">Por que escolher a Santos Tech?</p>
            <h2 class="info-section__title">
              Uma experiencia de estudo feita para manter ritmo e clareza
            </h2>
            <p class="info-section__description">
              Reunimos trilhas objetivas, materiais de apoio e acompanhamento continuo para voce
              sair do interesse inicial e chegar em execucao pratica com menos atrito.
            </p>
          </div>

          <div class="info-header__spotlight">
            <p class="info-header__spotlight-label">Portal sempre ativo</p>
            <strong>{{ visibleCourses.length || 'Novas' }}</strong>
            <span>{{
              visibleCourses.length ? 'turmas em destaque agora' : 'turmas chegando ao portal'
            }}</span>
            <p>
              Explore a vitrine abaixo para conhecer as trilhas abertas no momento e descobrir a
              jornada que mais combina com o seu momento.
            </p>
          </div>
        </div>

        <div class="info-grid">
          <article v-for="feature in featureHighlights" :key="feature.title" class="info-card"
            :class="{ 'info-card--accent': feature.accent }">
            <div class="info-card__icon">
              <i :class="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </article>
        </div>

        <section class="course-showcase">
          <div class="course-showcase__intro">
            <div>
              <p class="course-showcase__eyebrow">Cursos disponiveis</p>
              <h3 class="course-showcase__title">Escolha sua proxima trilha</h3>
              <p class="course-showcase__description">
                Esta vitrine puxa os cursos publicados no portal para deixar claro, logo na entrada,
                o que ja esta disponivel para estudo.
              </p>
            </div>

            <div class="course-showcase__summary">
              <span class="course-showcase__summary-value">{{ landingStats[0].value }}</span>
              <span class="course-showcase__summary-label">{{ landingStats[0].label }}</span>
            </div>
          </div>

          <div v-if="coursesLoading" class="course-empty course-empty--loading">
            <p class="course-empty__title">Carregando cursos disponiveis...</p>
            <p class="course-empty__text">
              Estamos montando a vitrine inicial do portal para voce.
            </p>
          </div>

          <div v-else-if="visibleCourses.length" class="course-showcase__grid">
            <article v-for="course in visibleCourses" :key="course.id" class="course-card">
              <div class="course-card__top">
                <span class="course-card__tag">{{ formatCourseBadge(course) }}</span>
                <span class="course-card__availability">{{
                  formatCourseAvailability(course)
                }}</span>
              </div>

              <h4>{{ normalizeText(course.name, 'Curso em atualizacao') }}</h4>
              <p class="course-card__description">{{ formatCourseDescription(course) }}</p>

              <div class="course-card__meta">
                <span class="course-card__chip">{{
                  formatCourseLevel(course.levelDifficulty)
                }}</span>
                <span class="course-card__chip">{{ formatCourseDuration(course.duration) }}</span>
              </div>

              <p class="course-card__focus">{{ formatCourseFocus(course.paidFocus) }}</p>
            </article>
          </div>

          <div v-else class="course-empty">
            <p class="course-empty__title">A vitrine de cursos ainda nao apareceu por aqui.</p>
            <p class="course-empty__text">
              Assim que o endpoint publico estiver acessivel neste ambiente, os cursos publicados
              vao preencher esta area automaticamente.
            </p>
          </div>
        </section>
      </div>
    </section>

    <section class="stats-section">
      <div class="stats-section__inner">
        <article v-for="stat in landingStats" :key="stat.label" class="stat-item">
          <span class="stat-item__number">{{ stat.value }}</span>
          <span class="stat-item__label">{{ stat.label }}</span>
          <p class="stat-item__description">{{ stat.description }}</p>
        </article>
      </div>
    </section>

    <footer class="login-footer">
      <div class="login-footer__inner">
        <p class="login-footer__brand">Santos Tech</p>
        <p class="login-footer__copy">
          &copy; {{ new Date().getFullYear() }} Santos Tech. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import LoadingScreen from '~/components/UI/LoadingScreen.vue'
import { setLoggedUser } from '~/composables/useAuth'
import { useLoadingConfigurations } from '~/composables/useLoadingConfigurations'
import type { IOAuthProvider } from '~/infra/interfaces/services/auth'
import type { ICourseAvailable } from '~/infra/interfaces/services/course'
import { useUserStore } from '~/infra/store/userStore'
import bgSantosGames from '~/assets/Images-Default/background-default.png'
import EffectLogin from "~/assets/lottie/EffectLogin.json";

interface LandingFeature {
  icon: string
  title: string
  description: string
  accent?: boolean
}

interface LandingStat {
  value: string
  label: string
  description: string
}

const showLottieEffect = ref(false);
function onLottieComplete() {
  showLottieEffect.value = false;
}

const {
  public: { apiBaseUrl },
} = useRuntimeConfig()

const { $httpClient } = useNuxtApp()
const { loadingPush, loadingPop } = useLoading()
const toast = useToastService()
const route = useRoute()
const router = useRouter()
const { loadConfigurations } = useLoadingConfigurations()
const userStore = useUserStore()

const showPasswordPage = ref(false)
const showSentPage = ref(false)
const isSubmitting = ref(false)
const showLoginSplash = ref(true)
const oauthProviders = ref<IOAuthProvider[]>([])
const availableCourses = ref<ICourseAvailable[]>([])
const coursesLoading = ref(true)
const infoSectionRef = ref<HTMLElement | null>(null)

const emailLogin = ref('')
const passwordLogin = ref('')
const isFormInvalid = computed(() => !emailLogin.value || !passwordLogin.value)

const featureHighlights: LandingFeature[] = [
  {
    icon: 'pi pi-sitemap',
    title: 'Trilhas com sequencia clara',
    description:
      'O aluno enxerga a proxima etapa sem se perder entre materiais soltos e acessa tudo em ordem de evolucao.',
    accent: true,
  },
  {
    icon: 'pi pi-video',
    title: 'Aulas aplicadas ao mercado',
    description:
      'Videoaulas objetivas, gravadas para ajudar a transformar teoria em repertorio tecnico utilizavel.',
  },
  {
    icon: 'pi pi-folder-open',
    title: 'Materiais para revisao rapida',
    description:
      'PDFs, exercicios e recursos de apoio para reforcar o conteudo e revisar no seu proprio ritmo.',
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Progresso sempre visivel',
    description:
      'O painel mostra o que ja foi concluido, o que falta e onde vale investir energia na proxima sessao.',
  },
  {
    icon: 'pi pi-bolt',
    title: 'Pratica desde cedo',
    description:
      'Os estudos nao ficam so na teoria: a proposta do portal e aproximar voce da aplicacao real.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Entrada simples e segura',
    description:
      'Voce pode acessar com email ou login social, com autenticacao centralizada para reduzir friccao.',
  },
]

const visibleCourses = computed(() =>
  availableCourses.value.filter(isDisplayableCourse).slice(0, 4),
)
const uniqueCourseLevels = computed(() => {
  const levels = new Set(
    visibleCourses.value.map((course) => formatCourseLevel(course.levelDifficulty)),
  )
  return levels.size || 1
})
const activeLoginOptions = computed(
  () => 1 + oauthProviders.value.filter((provider) => provider.enabled).length,
)
const landingStats = computed<LandingStat[]>(() => [
  {
    value: String(visibleCourses.value.length || 0),
    label: 'cursos publicados',
    description: visibleCourses.value.length
      ? 'Turmas que ja aparecem na vitrine inicial do portal.'
      : 'Aguardando publicacao de cursos neste ambiente.',
  },
  {
    value: String(uniqueCourseLevels.value),
    label: 'niveis em destaque',
    description: 'Percursos para diferentes momentos da jornada de aprendizado.',
  },
  {
    value: String(activeLoginOptions.value),
    label: 'formas de acesso',
    description: 'Entre por email e aproveite os logins sociais que estiverem habilitados.',
  },
  {
    value: '24/7',
    label: 'plataforma online',
    description: 'Aulas, materiais e progresso disponiveis a qualquer momento.',
  },
])

function isProviderEnabled(providerId: IOAuthProvider['id']) {
  return oauthProviders.value.some((provider) => provider.id === providerId && provider.enabled)
}

function goHome() {
  showPasswordPage.value = false
  showSentPage.value = false
}

function scrollToInfo() {
  infoSectionRef.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

async function fetchOAuthProviders() {
  try {
    const response = await $httpClient.auth.GetProviders()
    oauthProviders.value = response.result ?? []
  } catch (error) {
    console.error('Erro ao carregar provedores OAuth:', error)
    oauthProviders.value = []
  }
}

async function fetchAvailableCourses() {
  coursesLoading.value = true

  try {
    const response = await $httpClient.course.GetCoursesAvailables()
    availableCourses.value = response.success ? (response.result ?? []) : []
  } catch (error) {
    console.warn('Erro ao carregar cursos disponiveis para a home:', error)
    availableCourses.value = []
  } finally {
    coursesLoading.value = false
  }
}

function startOAuth(provider: IOAuthProvider['id']) {
  if (!isProviderEnabled(provider)) {
    toast.error('Provedor indisponivel', 'Esse provedor ainda nao foi configurado.', 3500)
    return
  }

  window.location.href = `${apiBaseUrl}/api/Auth/oauth/${provider}/start`
}

function normalizeText(value: string | null | undefined, fallback = '') {
  const normalized = String(value ?? '').trim()

  if (!normalized || normalized.toLowerCase() === '<null>') {
    return fallback
  }

  return normalized
}

function isDisplayableCourse(course: ICourseAvailable) {
  const normalizedName = normalizeText(course.name).toLowerCase()

  return Boolean(normalizedName) && !['teste', 'nao'].includes(normalizedName)
}

function formatCourseBadge(course: ICourseAvailable) {
  return course.isPaid ? 'Premium' : 'Disponivel agora'
}

function formatCourseAvailability(course: ICourseAvailable) {
  if (course.isPaid && Number(course.price) > 0) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(course.price))
  }

  return 'Inscricoes abertas'
}

function formatCourseLevel(level: string | null | undefined) {
  const normalized = normalizeText(level, 'Trilha guiada')
    .replace(/[_-]+/g, ' / ')
    .replace(/\s*\/\s*/g, ' / ')

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

function formatCourseDuration(duration: number) {
  const numericDuration = Number(duration)

  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    return 'Carga flexivel'
  }

  return `${new Intl.NumberFormat('pt-BR').format(numericDuration)}h de conteudo`
}

function formatCourseDescription(course: ICourseAvailable) {
  return normalizeText(
    course.description,
    'Trilha estruturada para desenvolver repertorio, pratica e seguranca no proximo passo da sua jornada.',
  )
}

function formatCourseFocus(focus: string | null | undefined) {
  return normalizeText(
    focus,
    'Conteudo organizado para estudar com clareza, constancia e evolucao pratica dentro do portal.',
  )
}

async function handlePassword() {
  if (showPasswordPage.value) {
    await sendPasswordRecoveryEmail()
    return
  }

  showPasswordPage.value = true
}

async function sendPasswordRecoveryEmail() {
  if (!emailLogin.value) {
    toast.error('Email obrigatorio', 'Informe seu email para recuperar o acesso.', 3000)
    return
  }

  loadingPush()

  try {
    const response = await $httpClient.user.SendPasswordRecoveryEmail(emailLogin.value)
    if (!response.success) {
      toast.error('Falha no envio', 'Nao foi possivel enviar o email de recuperacao.', 3500)
      return
    }

    showSentPage.value = true
    toast.success('Email enviado', 'As orientacoes de recuperacao foram encaminhadas.', 3000)
  } catch (error) {
    console.error('Erro ao enviar email de recuperacao:', error)
    toast.error('Erro no servidor', 'Nao foi possivel processar sua solicitacao.', 3500)
  } finally {
    loadingPop()
  }
}

async function loadUserData() {
  if (isFormInvalid.value || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  loadingPush()

  try {
    const response = await $httpClient.user.Login(emailLogin.value, passwordLogin.value)
    if (!response?.user) {
      return
    }

    setLoggedUser(response.user)
    userStore.setUserId(response.user.id)
    userStore.setUserEmail(response.user.email)

    await loadConfigurations()

    toast.success('Bem-vindo', 'Login realizado com sucesso.', 3000)

    emailLogin.value = ''
    passwordLogin.value = ''

    setTimeout(() => {
      showLottieEffect.value = true;
    }, 70);

    setTimeout(async () => {
      await navigateTo('/user-courses')
    }, 600)
  } catch (error) {
    const err = error as { error?: string }

    if (err?.error === 'rate_limit_exceeded') {
      toast.error('Muitas tentativas', 'Aguarde um momento antes de tentar novamente.', 4000)
      return
    }

    toast.error('Erro no login', 'Verifique suas credenciais e tente novamente.', 3500)
    console.error('Erro ao fazer login:', error)
  } finally {
    loadingPop()
    isSubmitting.value = false
  }
}

onMounted(async () => {
  const authRequired = route.query.auth === 'required'
  const oauthError = Array.isArray(route.query.message)
    ? route.query.message[0]
    : route.query.message

  if (authRequired) {
    toast.error('Acesso restrito', 'Voce precisa estar logado para acessar essa pagina.', 3500)

    await router.replace({
      path: '/',
      query: {},
    })
  }

  if (oauthError) {
    toast.error('Acesso nao autorizado', oauthError, 4500)
  }

  await Promise.all([
    fetchOAuthProviders(),
    fetchAvailableCourses(),
    new Promise((resolve) => window.setTimeout(resolve, 900)),
  ])

  showLoginSplash.value = false
})

definePageMeta({
  layout: 'auth',
})
</script>

<style scoped lang="scss">
.login-page {
  width: 100%;
  min-height: 100svh;
}

.hero-panel {
  position: relative;
  overflow: hidden;
  min-height: 100svh;
  padding: 2rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: 9999;
}

.lottie-effect-footer {
  width: min(100vw, 360px);
  max-width: 100%;
  height: auto;
}

.hero-panel__content {
  position: relative;
  z-index: 1;
  width: min(100%, 29rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 100%;
}

.hero-panel__brand {
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero-panel__eyebrow,
.login-card__eyebrow {
  margin: 0 0 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.72rem;
  font-weight: 700;
}

.hero-panel__eyebrow {
  margin: 0;
  color: #fecaca;
}

.hero-panel__lead {
  max-width: 24rem;
  margin: 0 0 1.75rem;
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.6;
  font-size: 0.98rem;
}

.login-card {
  width: min(100%, 28rem);
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(30px) saturate(140%);
  -webkit-backdrop-filter: blur(30px) saturate(140%);
  padding: 2rem;
  border-radius: 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 28px 90px rgba(7, 12, 25, 0.42);
}

.login-card__eyebrow {
  color: #fca5a5;
}

.login-card__header h2 {
  margin: 0.2rem 0 0.75rem;
  font-size: 1.8rem;
  color: #fff;
}

.login-card__header p {
  margin: 0;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.7;
}

.social-btn,
.primary-btn,
.secondary-btn {
  width: 100%;
  min-height: 3.4rem;
  border-radius: 1rem;
  border: none;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  cursor: pointer;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.65);
  color: #0f172a;
}

.social-btn:hover:not(:disabled),
.primary-btn:hover:not(:disabled),
.secondary-btn:hover {
  transform: translateY(-1px);
}

.social-btn:disabled,
.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.social-btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.social-btn__icon--google {
  background: #fff;
  border: 1px solid #e5e7eb;
}

.social-btn__icon--github {
  background: #0f172a;
  color: #fff;
}

.social-btn__svg {
  width: 1rem;
  height: 1rem;
}

.social-btn__svg--github {
  fill: currentColor;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: #e2e8f0;
  font-weight: 600;
}

.login-form input {
  min-height: 3.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.92);
  padding: 0 1rem;
  font-size: 0.98rem;
  color: #0f172a;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.login-form input::placeholder {
  color: #94a3b8;
  opacity: 1;
}

.login-form input:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
  background: #fff;
}

.primary-btn {
  background: linear-gradient(135deg, #b91c1c, #dc2626);
  color: #fff;
  box-shadow: 0 22px 35px rgba(220, 38, 38, 0.28);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.login-support {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  color: rgba(226, 232, 240, 0.78);
  font-size: 0.92rem;
}

.login-support button {
  border: none;
  background: transparent;
  color: #fca5a5;
  cursor: pointer;
  font-weight: 700;
}

.login-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0 0.5rem;
}

.login-success__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #34d399, #22c55e);
  color: #fff;
  font-size: 1.8rem;
}

.login-success__text {
  max-width: 28rem;
  text-align: center;
  color: rgba(226, 232, 240, 0.82);
  line-height: 1.7;
}

.scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  z-index: 2;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(15, 10, 10, 0.52);
  color: #fff;
  backdrop-filter: blur(16px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.scroll-indicator:hover {
  transform: translateX(-50%) translateY(-2px);
  background: rgba(127, 29, 29, 0.54);
  border-color: rgba(252, 165, 165, 0.24);
}

.info-section {
  position: relative;
  background:
    radial-gradient(circle at top center, rgba(127, 29, 29, 0.14), transparent 30%),
    linear-gradient(180deg, #fff7f7 0%, #fff 100%);
  padding: 6rem 2rem 3rem;
}

.info-section__inner,
.stats-section__inner,
.login-footer__inner {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.info-section__eyebrow,
.stat-item__label,
.login-footer__brand {
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.info-section__eyebrow {
  margin: 0 0 0.75rem;
  color: #b91c1c;
  font-size: 0.78rem;
  font-weight: 700;
}

.info-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.info-header__copy {
  max-width: 48rem;
}

.info-section__title {
  margin: 0;
  max-width: 16ch;
  color: #1f2937;
  font-size: clamp(2.1rem, 4vw, 3.4rem);
  line-height: 0.95;
}

.info-section__description {
  margin: 1rem 0 0;
  max-width: 52rem;
  color: #4b5563;
  line-height: 1.75;
  font-size: 1rem;
}

.info-header__spotlight {
  min-width: 18rem;
  max-width: 20rem;
  padding: 1.4rem 1.5rem;
  border-radius: 1.7rem;
  background: linear-gradient(160deg, rgba(127, 29, 29, 0.92), rgba(31, 10, 10, 0.96));
  border: 1px solid rgba(252, 165, 165, 0.18);
  box-shadow: 0 26px 60px rgba(127, 29, 29, 0.18);
  color: #fff;
}

.info-header__spotlight-label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.74rem;
  color: rgba(254, 202, 202, 0.82);
}

.info-header__spotlight strong {
  display: block;
  margin-top: 0.6rem;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  color: #fff2f2;
}

.info-header__spotlight span {
  display: block;
  margin-top: 0.2rem;
  color: rgba(254, 226, 226, 0.82);
  font-weight: 600;
}

.info-header__spotlight p {
  margin: 0.85rem 0 0;
  color: rgba(255, 240, 240, 0.74);
  line-height: 1.7;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2.25rem;
}

.info-card {
  padding: 1.5rem;
  border-radius: 1.7rem;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(248, 113, 113, 0.12);
  box-shadow: 0 22px 50px rgba(15, 23, 42, 0.06);
}

.info-card--accent {
  background: linear-gradient(180deg, rgba(255, 250, 250, 0.98), rgba(255, 240, 240, 0.9));
  border-color: rgba(220, 38, 38, 0.16);
}

.info-card__icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #b91c1c;
  font-size: 1.1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.info-card h3 {
  margin: 1.1rem 0 0.65rem;
  color: #111827;
  font-size: 1.2rem;
}

.info-card p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
}

.course-showcase {
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 1.9rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 248, 248, 0.96));
  border: 1px solid rgba(248, 113, 113, 0.14);
  box-shadow: 0 24px 65px rgba(15, 23, 42, 0.07);
}

.course-showcase__intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
}

.course-showcase__eyebrow {
  margin: 0 0 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  font-weight: 700;
  color: #b91c1c;
}

.course-showcase__title {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
  color: #111827;
}

.course-showcase__description {
  margin: 0.8rem 0 0;
  max-width: 42rem;
  color: #4b5563;
  line-height: 1.7;
}

.course-showcase__summary {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 12rem;
  padding: 1rem 1.1rem;
  border-radius: 1.3rem;
  background: rgba(127, 29, 29, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.12);
}

.course-showcase__summary-value {
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  font-weight: 700;
  color: #991b1b;
}

.course-showcase__summary-label {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.74rem;
  font-weight: 700;
  color: #7f1d1d;
}

.course-showcase__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.course-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  min-height: 100%;
  padding: 1.3rem;
  border-radius: 1.5rem;
  background: #fff;
  border: 1px solid rgba(248, 113, 113, 0.12);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
}

.course-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.course-card__tag,
.course-card__chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.course-card__tag {
  padding: 0.45rem 0.75rem;
  background: rgba(254, 226, 226, 0.95);
  color: #b91c1c;
}

.course-card__availability {
  color: #7f1d1d;
  font-size: 0.82rem;
  font-weight: 700;
}

.course-card h4 {
  margin: 0;
  color: #111827;
  font-size: 1.1rem;
  line-height: 1.3;
}

.course-card__description {
  margin: 0;
  color: #4b5563;
  line-height: 1.65;
}

.course-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.course-card__chip {
  padding: 0.42rem 0.72rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
}

.course-card__focus {
  margin: auto 0 0;
  padding-top: 0.95rem;
  border-top: 1px solid rgba(226, 232, 240, 0.9);
  color: #1f2937;
  line-height: 1.65;
}

.course-empty {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed rgba(248, 113, 113, 0.28);
}

.course-empty--loading {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 247, 247, 0.92));
}

.course-empty__title {
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 700;
}

.course-empty__text {
  margin: 0.55rem 0 0;
  color: #4b5563;
  line-height: 1.7;
}

.stats-section {
  background: #140909;
  padding: 2rem 2rem 3rem;
}

.stats-section__inner {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  padding: 1.4rem 1.5rem;
  border-radius: 1.4rem;
  background: linear-gradient(180deg, rgba(127, 29, 29, 0.34), rgba(31, 10, 10, 0.9));
  border: 1px solid rgba(252, 165, 165, 0.12);
  color: #fff;
}

.stat-item__number {
  display: block;
  margin-bottom: 0.35rem;
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 700;
  color: #fecaca;
}

.stat-item__label {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  font-weight: 600;
}

.stat-item__description {
  margin: 0.65rem 0 0;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.65;
}

.login-footer {
  background: #140909;
  border-top: 1px solid rgba(252, 165, 165, 0.08);
  padding: 1.25rem 2rem 2rem;
}

.login-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.login-footer__brand {
  margin: 0;
  color: #fecaca;
  font-size: 0.78rem;
  font-weight: 700;
}

.login-footer__copy {
  margin: 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.92rem;
}

@media (max-width: 1024px) {

  .info-header,
  .course-showcase__intro {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-header__spotlight,
  .course-showcase__summary {
    min-width: 0;
    max-width: none;
    width: 100%;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-panel {
    padding: 1.35rem;
  }

  .login-card {
    padding: 1.35rem;
    border-radius: 1.5rem;
  }

  .hero-panel__brand {
    flex-direction: column;
    gap: 0;
  }

  .login-support {
    flex-direction: column;
    align-items: flex-start;
  }

  .scroll-indicator {
    bottom: 1rem;
    width: 2.9rem;
    height: 2.9rem;
  }

  .info-section,
  .stats-section,
  .login-footer {
    padding-left: 1.35rem;
    padding-right: 1.35rem;
  }

  .info-section {
    padding-top: 4rem;
  }

  .course-showcase {
    padding: 1.35rem;
  }

  .info-grid,
  .stats-section__inner,
  .course-showcase__grid {
    grid-template-columns: 1fr;
  }

  .login-footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-section__title {
    max-width: none;
  }
}
</style>
