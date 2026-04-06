<template>
    <div class="login-page">
        <div class="hero-panel" :style="{ backgroundImage: `linear-gradient(145deg, rgba(15,10,10,0.88), rgba(60,15,15,0.75)), url(${bgSantosGames})` }">
            <div class="hero-panel__content">
                <div class="hero-panel__brand">
                    <p class="hero-panel__eyebrow">Portal Santos Tech</p>
                </div>

                <p class="hero-panel__lead">Aulas, materiais e trilhas em um unico lugar.</p>

                <div class="login-card">
                        <div class="login-card__header">
                            <p class="login-card__eyebrow">{{ showPasswordPage ? 'Recuperacao' : 'Bem-vindo' }}</p>
                            <h2>{{ showPasswordPage ? (showSentPage ? 'Email enviado' : 'Recuperar senha') : 'Entrar no portal' }}</h2>
                            <p v-if="!showPasswordPage">
                                Continue de onde parou usando sua conta.
                            </p>
                            <p v-else-if="!showSentPage">
                                Informe seu email para receber as orientacoes de recuperacao.
                            </p>
                            <p v-else>
                                Enviamos as orientacoes para <strong>{{ emailLogin }}</strong>.
                            </p>
                        </div>

                        <template v-if="!showPasswordPage">
                            <div class="login-socials">
                                <button type="button" class="social-btn" :disabled="!isProviderEnabled('google')"
                                    @click="startOAuth('google')">
                                    <span class="social-btn__icon social-btn__icon--google" aria-hidden="true">
                                        <svg viewBox="0 0 256 262" class="social-btn__svg social-btn__svg--google">
                                            <path fill="#4285F4"
                                                d="M255.68 133.45c0-10.95-.98-21.46-2.8-31.55H130v59.7h70.35c-3.03 16.32-12.23 30.14-26.07 39.38v32.72h42.16c24.67-22.72 39.24-56.24 39.24-100.25Z" />
                                            <path fill="#34A853"
                                                d="M130 261.1c35.44 0 65.18-11.75 86.9-31.82l-42.16-32.72c-11.75 7.87-26.77 12.53-44.74 12.53-34.36 0-63.48-23.22-73.88-54.44H12.54v34.02A131.16 131.16 0 0 0 130 261.1Z" />
                                            <path fill="#FBBC05"
                                                d="M56.12 154.65A78.9 78.9 0 0 1 52 128c0-9.24 1.6-18.18 4.12-26.65V67.33H12.54A131.18 131.18 0 0 0 0 128c0 21.1 5.06 41.1 12.54 60.67l43.58-34.02Z" />
                                            <path fill="#EA4335"
                                                d="M130 50.91c19.3 0 36.64 6.64 50.29 19.67l37.74-37.74C195.15 11.34 165.41 0 130 0 78.9 0 34.97 29.57 12.54 67.33l43.58 34.02C66.52 74.13 95.64 50.91 130 50.91Z" />
                                        </svg>
                                    </span>
                                    Entrar com Google
                                </button>
                                <button type="button" class="social-btn" :disabled="!isProviderEnabled('github')"
                                    @click="startOAuth('github')">
                                    <span class="social-btn__icon social-btn__icon--github" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" class="social-btn__svg social-btn__svg--github">
                                            <path
                                                d="M12 .5C5.65.5.5 5.65.5 12.01c0 5.08 3.29 9.39 7.85 10.91.57.1.78-.25.78-.56 0-.28-.01-1.19-.02-2.16-3.19.69-3.86-1.35-3.86-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.41.35.77 1.04.77 2.09 0 1.51-.01 2.72-.01 3.09 0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                                        </svg>
                                    </span>
                                    Entrar com GitHub
                                </button>
                            </div>

                            <div class="login-divider">
                                <span>ou entre com email</span>
                            </div>

                            <form class="login-form" @submit.prevent="loadUserData">
                                <label>
                                    <span>Email</span>
                                    <input v-model="emailLogin" type="email" autocomplete="email"
                                        placeholder="aluno@santos-tech.com" />
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
                                    <input v-model="emailLogin" type="email" autocomplete="email"
                                        placeholder="aluno@santos-tech.com" />
                                </label>
                                <button type="submit" class="primary-btn" :disabled="!emailLogin">
                                    Enviar orientacoes
                                </button>
                                <button type="button" class="secondary-btn" @click="goHome">
                                    Voltar para login
                                </button>
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
                                <button type="button" class="secondary-btn" @click="goHome">
                                    Voltar para login
                                </button>
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
                <p class="info-section__eyebrow">Por que escolher a Santos Tech?</p>
                <h2 class="info-section__title">Tudo o que voce precisa para evoluir</h2>

                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-book"></i>
                        </div>
                        <h3>Trilhas estruturadas</h3>
                        <p>Conteudos organizados em trilhas de aprendizado progressivas, do basico ao avancado.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-video"></i>
                        </div>
                        <h3>Videoaulas exclusivas</h3>
                        <p>Aulas gravadas por profissionais do mercado, disponiveis para assistir a qualquer momento.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-folder"></i>
                        </div>
                        <h3>Materiais de apoio</h3>
                        <p>PDFs, exercicios e recursos complementares para fixar o conhecimento adquirido.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-chart-line"></i>
                        </div>
                        <h3>Acompanhe seu progresso</h3>
                        <p>Dashboard completo com estatisticas, conquistas e indicadores de evolucao.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-bolt"></i>
                        </div>
                        <h3>Exercicios praticos</h3>
                        <p>Atividades interativas para aplicar o que voce aprendeu e testar seus conhecimentos.</p>
                    </div>

                    <div class="info-card">
                        <div class="info-card__icon">
                            <i class="pi pi-shield"></i>
                        </div>
                        <h3>Acesso seguro</h3>
                        <p>Plataforma protegida com autenticacao moderna e seus dados sempre em seguranca.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="stats-section">
            <div class="stats-section__inner">
                <div class="stat-item">
                    <span class="stat-item__number">100+</span>
                    <span class="stat-item__label">Aulas disponiveis</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item__number">50+</span>
                    <span class="stat-item__label">Materiais de apoio</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item__number">10+</span>
                    <span class="stat-item__label">Trilhas completas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-item__number">24/7</span>
                    <span class="stat-item__label">Acesso a plataforma</span>
                </div>
            </div>
        </section>

        <footer class="login-footer">
            <div class="login-footer__inner">
                <p class="login-footer__brand">Santos Tech</p>
                <p class="login-footer__copy">&copy; {{ new Date().getFullYear() }} Santos Tech. Todos os direitos reservados.</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { setLoggedUser } from '~/composables/useAuth'
import { useLoadingConfigurations } from '~/composables/useLoadingConfigurations'
import type { IOAuthProvider } from '~/infra/interfaces/services/auth'
import { useUserStore } from '~/infra/store/userStore'
import bgSantosGames from '~/assets/Images-Default/background-default.png'

const { public: { apiBaseUrl } } = useRuntimeConfig()
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
const oauthProviders = ref<IOAuthProvider[]>([])
const infoSectionRef = ref<HTMLElement | null>(null)

const emailLogin = ref('')
const passwordLogin = ref('')
const isFormInvalid = computed(() => !emailLogin.value || !passwordLogin.value)

function isProviderEnabled(providerId: IOAuthProvider['id']) {
    return oauthProviders.value.some(provider => provider.id === providerId && provider.enabled)
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

function startOAuth(provider: IOAuthProvider['id']) {
    if (!isProviderEnabled(provider)) {
        toast.error('Provedor indisponivel', 'Esse provedor ainda nao foi configurado.', 3500)
        return
    }

    window.location.href = `${apiBaseUrl}/api/Auth/oauth/${provider}/start`
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

        await navigateTo('/dashboard')
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
    const oauthError = Array.isArray(route.query.message) ? route.query.message[0] : route.query.message

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

    await fetchOAuthProviders()
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

.login-socials {
    display: grid;
    gap: 0.85rem;
    margin-top: 1.5rem;
}

.social-btn,
.primary-btn,
.secondary-btn {
    width: 100%;
    min-height: 3.4rem;
    border-radius: 1rem;
    border: none;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
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

.login-divider {
    position: relative;
    margin: 1.5rem 0 1rem;
    text-align: center;
}

.login-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.18);
}

.login-divider span {
    position: relative;
    background: rgba(40, 15, 15, 0.92);
    padding: 0 0.9rem;
    color: rgba(226, 232, 240, 0.75);
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
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
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
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
    transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
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

.info-section__title {
    margin: 0;
    max-width: 12ch;
    color: #1f2937;
    font-size: clamp(2.1rem, 4vw, 3.4rem);
    line-height: 1;
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

.stats-section {
    background: #140909;
    padding: 0 2rem 3rem;
}

.stats-section__inner {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
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

    .info-grid,
    .stats-section__inner {
        grid-template-columns: 1fr;
    }

    .login-footer__inner {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
