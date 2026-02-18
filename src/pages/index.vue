<template>
    <div
        class="mx-auto grid max-w-6xl gap-6 rounded-3xl border border-red-100/80 bg-white/85 p-4 shadow-sm backdrop-blur md:p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <section class="panel relative overflow-hidden p-6 lg:p-8">
            <div class="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-200/80 blur-2xl">
            </div>
            <div
                class="pointer-events-none absolute -bottom-14 left-8 h-32 w-32 rounded-full bg-accent-200/80 blur-2xl">
            </div>

            <div class="relative flex h-full flex-col gap-6">
                <span class="chip w-fit border-brand-200 bg-red-50 text-brand-600">Jornada do Desenvolvedor</span>

                <div class="space-y-3">
                    <h1 class="text-2xl font-semibold leading-tight md:text-3xl">
                        Entre no Reino do Código e continue sua evolução.
                    </h1>
                    <p class="max-w-xl text-sm text-ink-700 md:text-base">
                        Complete missões, ganhe XP e desbloqueie novas fases em cada trilha do portal.
                    </p>
                </div>

                <div class="grid gap-3 sm:grid-cols-2">
                    <article class="rounded-2xl border border-red-100 bg-white/95 p-4">
                        <p class="text-xs uppercase tracking-wide text-ink-500">Classe atual</p>
                        <p class="mt-1 text-lg font-semibold">Desenvolvedor em Formação</p>
                        <p class="mt-2 text-xs text-ink-500">Iniciante → Aprendiz → Programador</p>
                    </article>

                    <article class="rounded-2xl border border-red-100 bg-white/95 p-4">
                        <p class="text-xs uppercase tracking-wide text-ink-500">Progresso da jornada</p>
                        <div class="mt-2 h-2 rounded-full bg-red-100">
                            <div class="h-2 w-2/3 rounded-full bg-brand-500"></div>
                        </div>
                        <p class="mt-2 text-xs text-ink-500">XP da semana: +420</p>
                    </article>
                </div>

                <div class="grid gap-2 text-sm text-ink-700">
                    <div class="flex items-center gap-2 rounded-xl bg-red-50/70 px-3 py-2">
                        <i class="pi pi-code text-brand-500"></i>
                        <span>Reinos disponíveis: Games, Front-End, Back-End e Mobile</span>
                    </div>
                    <div class="flex items-center gap-2 rounded-xl bg-red-50/70 px-3 py-2">
                        <i class="pi pi-bolt text-brand-500"></i>
                        <span>Tasks diárias e desafios semanais para manter consistência</span>
                    </div>
                    <div class="flex items-center gap-2 rounded-xl bg-red-50/70 px-3 py-2">
                        <i class="pi pi-trophy text-brand-500"></i>
                        <span>Medalhas, títulos e recompensas exclusivas ao evoluir</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="panel flex flex-col justify-center gap-6 p-6 lg:p-8">
            <div class="space-y-2">
                <h2 class="text-2xl font-semibold">Entrar</h2>
                <p class="text-sm text-ink-500">Acesso exclusivo para alunos matriculados.</p>
            </div>

            <form class="space-y-4" @submit.prevent="LoadUserData">
                <label class="flex flex-col gap-2 text-sm font-medium">
                    Email
                    <input v-model="emailLogin" type="email" autocomplete="email"
                        class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                        placeholder="aluno@santosgames.com" />
                </label>
                <label class="flex flex-col gap-2 text-sm font-medium">
                    Senha
                    <input v-model="passwordLogin" type="password" autocomplete="current-password"
                        class="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                        placeholder="********" />
                </label>
                <button type="submit" :disabled="isFormInvalid"
                    class="h-11 w-full rounded-xl bg-brand-500 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
                    <span>Iniciar missão</span>
                </button>
            </form>

            <p class="text-xs text-ink-500">Esqueceu a senha? Fale com o suporte da turma.</p>

            <div class="rounded-2xl border border-red-100 bg-red-50/70 p-3 text-xs text-ink-700">
                No Mundo do Código, errar faz parte da evolução: continue praticando no modo treino e avance de nível.
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "~/infra/store/userStore";

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const route = useRoute();
const router = useRouter();

const emailLogin = ref("");
const passwordLogin = ref("");
const isFormInvalid = computed(
    () => !emailLogin.value || !passwordLogin.value
);

async function LoadUserData() {
    if (isFormInvalid.value) {
        return;
    }

    console.log("Loading...");
    loadingPush();

    try {
        const loadUser = await $httpClient.user.Login(
            emailLogin.value,
            passwordLogin.value
        );

        if (!loadUser || !loadUser.token) {
            return;
        }

        setToken(loadUser.token);
        setLoggedUser(loadUser.user);
        useUserStore().setUserId(loadUser.user.id);

        toast.success(
            "Bem-vindo de volta!",
            "Login realizado com sucesso.",
            3000
        );

        emailLogin.value = "";
        passwordLogin.value = "";

        setTimeout(() => {
            navigateTo("/dashboard");
        }, 1000);
    }
    catch (error) {
        toast.error("Erro", "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.", 4000);
        console.error("Login error:", error);
    }
    finally {
        loadingPop();
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

definePageMeta({
    layout: 'auth',
})
</script>