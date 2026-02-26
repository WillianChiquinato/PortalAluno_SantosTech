<template>
    <div class="login-full">
        <div class="login-bg"></div>
        <div v-if="!showPasswordPage" class="login-panel">
            <!-- Lottie effect in footer, only when showLottieEffect is true -->
            <transition name="fade">
                <div v-if="showLottieEffect" class="lottie-footer">
                    <BaseLottie :animation-data="EffectLogin" :loop="false" :autoplay="true"
                        class="lottie-effect-footer" @complete="onLottieComplete" />
                </div>
            </transition>
            <div class="login-header">
                <div class="flex">
                    <img :src="logoColorida" alt="Logo Santos tech" class="w-12 mb-1" />
                    <span class="w-fit ml-2 mt-2 text-xl font-semibold text-black">Santos Tech</span>
                </div>
                <h2 class="w-fit text-brand-600">Entrar</h2>
                <p>Acesso exclusivo para alunos matriculados.</p>
            </div>
            <form class="login-form" @submit.prevent="LoadUserData">
                <label>
                    <span>Email</span>
                    <input v-model="emailLogin" type="email" autocomplete="email" placeholder="aluno@santosgames.com" />
                </label>
                <label>
                    <span>Senha</span>
                    <input v-model="passwordLogin" type="password" autocomplete="current-password"
                        placeholder="********" />
                </label>
                <button type="submit" :disabled="isFormInvalid || isSubmitting">
                    <span v-if="!isSubmitting">Iniciar missão</span>
                    <span v-else>Carregando...</span>
                </button>
            </form>

            <p class="login-support">Esqueceu a senha? Faça a recuperação <button @click="handlePassword"
                    class="text-brand-600 cursor-pointer"><u>Aqui</u></button></p>

            <div class="login-courses">
                <CoursesCardResume v-for="course in coursesAvailable" :key="course.id" :course="course" />
            </div>
        </div>
        <div v-else class="login-panel">
            <template v-if="!showSentPage">
                <div class="login-header">
                    <h2 class="w-fit text-brand-600">Recuperar senha</h2>
                    <p>Insira seu email para receber as instruções de recuperação de senha.</p>
                </div>
                <form class="login-form mt-7" @submit.prevent="handlePassword">
                    <label>
                        <span>Email</span>
                        <input v-model="emailLogin" type="email" autocomplete="email"
                            placeholder="aluno@santosgames.com" />
                    </label>
                    <button type="submit" :disabled="!emailLogin">
                        <span>Enviar instruções</span>
                    </button>
                    <div class="flex justify-center w-full">
                        <button @click="showPasswordPage = false" type="button"
                            class="mx-auto px-6 py-2 rounded-md bg-slate-100 text-brand-600 font-semibold text-base shadow-sm hover:bg-slate-200 transition">
                            <span>Voltar</span>
                        </button>
                    </div>
                </form>
            </template>
            <template v-else>
                <div class="flex flex-col items-center justify-center min-h-[320px] py-12">
                    <div class="mb-6">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="40" cy="40" r="40" fill="#22c55e" />
                            <path d="M28 42L37 51L54 34" stroke="#fff" stroke-width="5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-brand-600 mb-2">E-mail enviado!</h2>
                    <p class="text-center text-ink-700 mb-6">As instruções para recuperação de senha foram enviadas para
                        <strong>{{ emailLogin }}</strong>. Verifique sua caixa de entrada.
                    </p>
                    <button @click="goHome" type="button"
                        class="login-back-btn px-6 py-2 rounded-md bg-slate-100 text-brand-600 font-semibold text-base shadow-sm hover:bg-slate-200 transition">
                        Voltar para Home
                    </button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import CoursesCardResume from "~/components/CoursesCardResume.vue";
import { useLoadingConfigurations } from "~/composables/useLoadingConfigurations";
import type { ICourseAvailable } from "~/infra/interfaces/services/course";
import { useUserStore } from "~/infra/store/userStore";

import EffectLogin from "~/assets/lottie/EffectLogin.json";
import logoColorida from "~/assets/LogoColorida.png";

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const route = useRoute();
const router = useRouter();
const { loadConfigurations } = useLoadingConfigurations();

const showPasswordPage = ref(false);
const showSentPage = ref(false);

const isSubmitting = ref(false);
const coursesAvailable = ref<ICourseAvailable[]>([]);

const emailLogin = ref("");
const passwordLogin = ref("");
const isFormInvalid = computed(() => !emailLogin.value || !passwordLogin.value);

// Controle do efeito Lottie no footer
const showLottieEffect = ref(false);
function onLottieComplete() {
    showLottieEffect.value = false;
}

function handlePassword() {
    // Se já está na tela de recuperação, envia instruções e mostra tela de sucesso
    if (showPasswordPage.value) {
        showSentPage.value = true;
    } else {
        showPasswordPage.value = true;
    }
}

function goHome() {
    showPasswordPage.value = false;
    showSentPage.value = false;
}

async function LoadUserData() {
    if (isFormInvalid.value || isSubmitting.value) {
        return;
    }

    isSubmitting.value = true;
    loadingPush();

    try {
        const loadUser = await $httpClient.user.Login(
            emailLogin.value,
            passwordLogin.value
        );

        if (!loadUser?.token) {
            return;
        }

        setToken(loadUser.token);
        setLoggedUser(loadUser.user);
        useUserStore().setUserId(loadUser.user.id);
        useUserStore().setUserEmail(loadUser.user.email);

        toast.success(
            "Bem-vindo!",
            "Login realizado com sucesso.",
            3000
        );

        // Disparar efeito Lottie no footer
        setTimeout(() => {
            showLottieEffect.value = true;
        }, 100);

        await loadConfigurations();

        emailLogin.value = "";
        passwordLogin.value = "";

        setTimeout(() => {
            navigateTo("/dashboard");
        }, 900);
    } catch (error) {
        const err = error as any;
        if (err && err.error === 'rate_limit_exceeded') {
            toast.error("Muitas tentativas", "Você excedeu o número de tentativas de login. Por favor, aguarde um momento antes de tentar novamente.", 4000);
            return;
        }
        toast.error("Erro no login", "Ocorreu um erro ao tentar fazer login. Verifique suas credenciais e tente novamente.", 3000);
        console.error("Erro ao fazer login:", error);
    } finally {
        loadingPop();
        setTimeout(() => {
            isSubmitting.value = false;
        }, 500);
    }
}

async function fetchLoadAvailableCourses() {
    loadingPush();

    try {
        const response = await $httpClient.course.GetCoursesAvailables()

        if (response.success) {
            coursesAvailable.value = response.result ?? [];
        }
    } catch (error) {
        console.error('Erro ao buscar cursos disponíveis:', error)
        toast.error('Não foi possível carregar os cursos disponíveis. Tente novamente mais tarde.')
        coursesAvailable.value = [];
    } finally {
        loadingPop()
    }
}

onMounted(async () => {
    if (route.query.auth !== 'required') {
        return;
    }

    toast.error('Acesso restrito', 'Você precisa estar logado para acessar esta página.', 3500);

    await router.replace({
        path: '/',
        query: {},
    });
});

onBeforeMount(async () => {
    await fetchLoadAvailableCourses();
})

definePageMeta({
    layout: 'auth',
})
</script>

<style scoped lang="scss">
/* Lottie effect footer */
.lottie-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    pointer-events: none;
    z-index: 100;
    height: 300px;
}

.lottie-effect-footer {
    width: 300px;
    height: 300px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.login-root {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(120deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Layout sem borda, imagem cobrindo tudo, login colado nas bordas */
.login-full {
    position: fixed;
    display: flex;
    inset: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8fafc;
}

.login-bg {
    width: 70vw;
    height: 100vh;
    background: url('/images-tes/background-default.png') center/cover no-repeat;
    filter: brightness(0.7) contrast(1.2) grayscale(0.2) blur(0.7px);
}

.login-panel {
    width: 30vw;
    min-width: 320px;
    max-width: 480px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    padding: 2rem 1.4rem 1rem 2rem;
    box-shadow: none;
    border-radius: 0;
    position: relative;
}

.login-header h2 {
    font-size: 1.7rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
}

.login-header p {
    font-size: 1rem;
    color: #64748b;
    margin-bottom: 1.5rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.login-form label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 1rem;
    font-weight: 500;
    color: #334155;
}

.login-form input {
    height: 2.7rem;
    border-radius: 0.8rem;
    border: 1.5px solid #b4b5b5;
    background: #f8fafc;
    padding: 0 1rem;
    font-size: 1rem;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
}

.login-form input:focus {
    border-color: #f87171;
    box-shadow: 0 0 0 2px #fca5a5aa;
}

.login-form button {
    height: 2.7rem;
    border-radius: 0.8rem;
    background: linear-gradient(90deg, #f87171 0%, #fbbf24 100%);
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.3s all;
    margin-top: 0.5rem;
    box-shadow: 0 2px 8px 0 rgba(252, 165, 165, 0.08);

    &:hover {
        background: linear-gradient(90deg, #f87171cc 0%, #fbbf24cc 100%);
        box-shadow: 0 4px 12px 0 rgba(252, 165, 165, 0.2);
        scale: 1.05;
    }
}

.login-form button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-support {
    text-align: center;
    font-size: 0.92rem;
    color: #64748b;
    margin: 1.2rem 0 0.5rem 0;
}

.login-courses {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    margin-top: 1.7rem;
}

.login-back-btn {
    height: 2.7rem;
    border-radius: 0.8rem;
    background: linear-gradient(90deg, #f87171 0%, #fbbf24 100%);
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: 0.3s all;

    &:hover {
        scale: 1.05;
        box-shadow: 0 4px 12px 0 rgba(252, 165, 165, 0.2);
    }
}

@media (max-width: 1250px) {
    .login-bg {
        width: 60vw;
    }

    .login-panel {
        width: 40vw;
    }
}

@media (max-width: 1000px) {
    .login-full {
        flex-direction: column;
    }

    .login-bg {
        width: 100vw;
        height: 40vh;
        min-height: 180px;
        flex: none;
    }

    .login-panel {
        width: 100vw;
        min-width: 0;
        max-width: 100vw;
        height: auto;
        min-height: 60vh;
    }

    .login-courses {
        grid-template-columns: 1fr;
        margin-top: 1.5rem;
        padding-bottom: 1.2rem;
    }
}
</style>