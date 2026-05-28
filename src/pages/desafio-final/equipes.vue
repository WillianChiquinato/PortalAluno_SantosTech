<template>
    <div class="space-y-6 overflow-x-hidden">
        <section class="panel relative overflow-hidden p-0">
            <div
                class="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-6 py-6 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                <div class="absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>

                <div class="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div class="space-y-3 text-tag-100">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-tag-100/80">
                            Encerramento do módulo
                        </p>

                        <div>
                            <h1 class="text-2xl font-semibold">Escolha seu clã para entrar na arena</h1>
                            <p class="mt-2 max-w-2xl text-sm text-tag-100/85">
                                Antes de acessar o desafio final, você precisa estar em um clã. Veja os grupos já
                                inscritos ou cadastre a sua equipe.
                            </p>
                        </div>
                    </div>

                    <div
                        class="flex items-center gap-4 self-start rounded-2xl border border-white/25 bg-white/10 p-4 text-tag-100 backdrop-blur-sm">
                        <div
                            class="grid h-18 w-18 place-items-center rounded-2xl border border-white/30 bg-white/10 shadow-sm">
                            <span class="text-4xl leading-none">⚔️</span>
                        </div>

                        <div>
                            <span class="chip !border-white/30 !bg-white/15 !text-tag-100">Clã obrigatório</span>
                            <p class="mt-3 text-sm font-semibold">Prepare sua entrada</p>
                            <p class="text-xs text-tag-100/75">Escolha um clã ou registre a sua equipe para seguir</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section class="panel overflow-hidden border-brand-100/80 bg-white p-0">
                <div class="border-b border-brand-100/80 bg-gradient-to-r from-white to-brand-50/60 px-6 py-5">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                                Desafio final
                            </p>

                            <h2 class="mt-2 text-2xl font-semibold text-ink-900">
                                Clãs disponíveis
                            </h2>

                            <p class="mt-1 text-sm text-ink-500">
                                Confira quem já está inscrito no desafio final antes de cadastrar sua equipe.
                            </p>
                        </div>

                        <div
                            class="hidden h-16 w-16 place-items-center rounded-2xl border border-brand-100 bg-brand-50 lg:grid">
                            <span class="text-3xl text-brand-500">🏴‍☠️</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-4 p-5">
                    <div v-if="isLoadingTeams" class="rounded-2xl border border-brand-100 bg-brand-50/60 p-6 text-center">
                        <p class="text-sm font-medium text-ink-900">Carregando clãs...</p>
                        <p class="mt-2 text-sm text-ink-500">Buscando os times já cadastrados para sua turma.</p>
                    </div>

                    <div v-else-if="availableTeams.length === 0"
                        class="rounded-2xl border border-dashed border-brand-100 bg-brand-50/50 p-6 text-center">
                        <p class="text-sm font-medium text-ink-900">Nenhum clã cadastrado ainda</p>
                        <p class="mt-2 text-sm text-ink-500">
                            Seja o primeiro a registrar um clã para liberar o desafio final da turma.
                        </p>
                    </div>

                    <div v-for="team in availableTeams" :key="team.clanName"
                        class="rounded-2xl border border-brand-100/80 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40">
                        <div class="flex items-start gap-4">
                            <div class="grid h-16 w-16 place-items-center rounded-2xl border border-brand-100 text-2xl"
                                :style="{ backgroundColor: `${team.clanColor}22`, color: team.clanColor }">
                                ⛵
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h3 class="text-base font-semibold text-ink-900">
                                        {{ team.clanName }}
                                    </h3>
                                </div>

                                <p class="mt-1 text-sm font-medium" :style="{ color: team.clanColor }">
                                    {{ team.boatName }}
                                </p>

                                <p class="mt-2 text-sm text-ink-500">
                                    {{ team.clanDescription || 'Clã inscrito no desafio final.' }}
                                </p>

                                <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                                    <span class="rounded-xl border border-brand-100 bg-brand-50/70 px-2 py-1">
                                        👥 {{ team.members.length }} membro(s)
                                    </span>

                                    <span class="rounded-xl border border-brand-100 bg-brand-50/70 px-2 py-1">
                                        🎨 {{ team.clanColor }}
                                    </span>
                                </div>

                                <div class="mt-4 flex flex-wrap gap-2">
                                    <span v-for="member in team.members" :key="member.userId"
                                        class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-ink-700">
                                        {{ member.userName }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="panel border-brand-100/80 bg-white p-6 sm:p-7">
                <div class="flex h-full flex-col justify-between gap-8">
                    <div>
                        <div
                            class="grid h-18 w-18 place-items-center rounded-2xl border border-brand-100 bg-brand-50 text-4xl text-brand-500">
                            <i class="pi pi-flag text-3xl"></i>
                        </div>

                        <h2 class="mt-6 text-2xl font-semibold text-ink-900">
                            Monte seu clã
                        </h2>

                        <p class="mt-3 text-sm leading-relaxed text-ink-500">
                            Cadastre seu clã para liberar o acesso ao desafio final. O seu usuário será incluído
                            automaticamente na equipe.
                        </p>

                        <div class="mt-6 space-y-3">
                            <div class="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/55 p-3">
                                <span
                                    class="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg text-brand-500">⚓</span>

                                <div>
                                    <p class="text-sm font-medium text-ink-900">Barco exclusivo</p>
                                    <p class="text-xs text-ink-500">Personalize sua identidade visual</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/55 p-3">
                                <span
                                    class="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg text-brand-500">🏆</span>

                                <div>
                                    <p class="text-sm font-medium text-ink-900">Competição em tempo real</p>
                                    <p class="text-xs text-ink-500">Dispute pontos e avance no ranking</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/55 p-3">
                                <span
                                    class="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg text-brand-500">🔥</span>

                                <div>
                                    <p class="text-sm font-medium text-ink-900">Eventos sequenciais</p>
                                    <p class="text-xs text-ink-500">Missões especiais durante o desafio</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="space-y-4 rounded-2xl border border-brand-100 bg-gradient-to-b from-white to-brand-50/50 p-4 sm:p-5">
                        <div class="space-y-2">
                            <p class="text-sm font-semibold text-ink-900">Cadastro rápido</p>
                            <p class="text-sm text-ink-500">
                                Abra o modal para definir nome, barco, descrição e a cor do seu clã.
                            </p>
                        </div>

                        <button type="button" class="btn-primary h-11 w-full cursor-pointer"
                            @click="openTeamRegistrationModal">
                            Cadastrar meu clã
                        </button>
                    </div>
                </div>
            </section>
        </div>

        <Teleport to="body">
            <Transition name="modal-fade">
                <div v-if="showTeamRegistrationModal" class="cover-mask" @click.self="closeTeamRegistrationModal">
                    <div class="cover-modal panel w-[min(92vw,580px)] border-brand-100/80 bg-white">
                        <div class="flex items-center justify-between border-b border-brand-100/80 px-6 py-4">
                            <div>
                                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-400">
                                    Desafio final
                                </p>
                                <h3 class="mt-1 text-base font-semibold text-ink-900">Cadastrar clã</h3>
                            </div>

                            <button type="button" class="chip h-8 w-8 cursor-pointer justify-center p-0"
                                :disabled="isSubmittingTeam" aria-label="Fechar modal"
                                @click="closeTeamRegistrationModal">
                                <i class="pi pi-times text-sm"></i>
                            </button>
                        </div>

                        <form class="space-y-4 bg-gradient-to-b from-white to-brand-50/30 px-6 py-5"
                            @submit.prevent="submitTeamRegistration">
                            <p class="text-sm text-ink-700">
                                Preencha os dados do seu clã. Seu usuário será incluído automaticamente na equipe.
                            </p>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-ink-900" for="team-name-modal">
                                    Nome do clã
                                </label>

                                <input id="team-name-modal" v-model.trim="teamForm.name" type="text" maxlength="60"
                                    class="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-300"
                                    placeholder="Ex.: Byte Raiders" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-ink-900" for="boat-name-modal">
                                    Nome do barco
                                </label>

                                <input id="boat-name-modal" v-model.trim="teamForm.boatName" type="text" maxlength="60"
                                    class="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-300"
                                    placeholder="Ex.: Red Kraken" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-ink-900" for="team-description-modal">
                                    Descrição
                                </label>

                                <textarea id="team-description-modal" v-model.trim="teamForm.description" rows="4"
                                    maxlength="180"
                                    class="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-300"
                                    placeholder="Resumo curto da proposta do seu clã."></textarea>
                            </div>

                            <div class="space-y-3">
                                <div class="flex items-center justify-between gap-3">
                                    <label class="block text-sm font-medium text-ink-900" for="team-member-search">
                                        Membros do time
                                    </label>

                                    <span class="text-xs text-ink-500">
                                        {{ selectedMemberIds.length }} selecionado(s)
                                    </span>
                                </div>

                                <input id="team-member-search" v-model.trim="memberSearch" type="text"
                                    class="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-brand-300"
                                    placeholder="Buscar integrante por nome ou e-mail" />

                                <div
                                    class="max-h-64 space-y-2 overflow-y-auto rounded-2xl border border-brand-100 bg-white p-2">
                                    <div v-if="isLoadingMembers"
                                        class="rounded-xl bg-brand-50 px-4 py-3 text-sm text-ink-500">
                                        Carregando participantes...
                                    </div>

                                    <div v-else-if="filteredMemberOptions.length === 0"
                                        class="rounded-xl bg-brand-50 px-4 py-3 text-sm text-ink-500">
                                        Nenhum participante encontrado para o filtro informado.
                                    </div>

                                    <button v-for="member in filteredMemberOptions" :key="member.id" type="button"
                                        class="flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition"
                                        :class="isMemberSelected(member.id)
                                            ? 'border-brand-200 bg-brand-50'
                                            : 'border-transparent bg-white hover:border-brand-100 hover:bg-brand-50/60'"
                                        @click="toggleMemberSelection(member.id)">
                                        <div
                                            class="grid h-10 w-10 place-items-center rounded-full border border-brand-100 bg-white text-sm font-semibold text-brand-500">
                                            {{ member.name.charAt(0).toUpperCase() }}
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <p class="truncate text-sm font-medium text-ink-900">
                                                {{ member.name }}
                                                <span v-if="member.id === currentUserId"
                                                    class="text-xs text-brand-500">(você)</span>
                                            </p>
                                            <p class="truncate text-xs text-ink-500">{{ member.email }}</p>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <span v-if="member.id === currentUserId"
                                                class="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-500">
                                                obrigatório
                                            </span>
                                            <i class="pi"
                                                :class="isMemberSelected(member.id) ? 'pi-check-circle text-brand-500' : 'pi-circle text-slate-300'"></i>
                                        </div>
                                    </button>
                                </div>

                                <p class="text-xs text-ink-500">
                                    Seu usuário entra automaticamente no clã. Selecione aqui os demais membros que devem
                                    ser enviados em `userIds`.
                                </p>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-ink-900" for="team-color-modal">
                                    Cor do clã
                                </label>

                                <div
                                    class="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white px-4 py-3">
                                    <input id="team-color-modal" v-model="teamForm.clanColor" type="color"
                                        class="h-10 w-12 cursor-pointer rounded border-0 bg-transparent p-0" />
                                    <span class="text-sm font-medium text-ink-700">{{ teamForm.clanColor }}</span>
                                    <span
                                        class="ml-auto inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs text-ink-500">
                                        Prévia do clã
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button type="button" class="btn-outline h-11 cursor-pointer px-5"
                                    :disabled="isSubmittingTeam" @click="closeTeamRegistrationModal">
                                    Cancelar
                                </button>
                                <button type="submit" class="btn-primary h-11 px-5" :loading="isSubmittingTeam">
                                    Cadastrar clã
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import { getUserIdFromSession } from '~/composables/useLoadingConfigurations'
import type { IClass } from '~/infra/interfaces/services/class'
import type { IFinalChallengerTeams, IJoinTeamPayload } from '~/infra/interfaces/services/finalChallenge'
import type { IUser } from '~/infra/interfaces/services/user'

definePageMeta({
    layout: 'default',
})

useHead({
    title: 'Clãs do Desafio Final',
})

const { $httpClient } = useNuxtApp()
const toast = useToastService()

const teams = ref<IFinalChallengerTeams[]>([])
const currentClassroom = ref<IClass | null>(null)
const isSubmittingTeam = ref(false)
const isLoadingTeams = ref(true)
const isLoadingMembers = ref(false)
const showTeamRegistrationModal = ref(false)
const memberOptions = ref<IUser[]>([])
const memberSearch = ref('')
const selectedMemberIds = ref<number[]>([])
const teamForm = ref({
    name: '',
    description: '',
    boatName: '',
    clanColor: '#ef4444',
})

const hasCurrentUserTeam = computed(() => {
    return teams.value.some((team) => team.members.some((member) => member.isCurrentUser))
})

const currentUserId = computed(() => getUserIdFromSession()?.userId ?? null)

const availableTeams = computed(() => {
    return teams.value.filter((team, index, source) => {
        return source.findIndex((candidate) => candidate.clanName === team.clanName) === index
    })
})

const filteredMemberOptions = computed(() => {
    const query = memberSearch.value.trim().toLowerCase()

    return memberOptions.value
        .filter((member) => {
            if (!query) {
                return true
            }

            return member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
        })
        .sort((firstMember, secondMember) => {
            if (firstMember.id === currentUserId.value) {
                return -1
            }

            if (secondMember.id === currentUserId.value) {
                return 1
            }

            return firstMember.name.localeCompare(secondMember.name)
        })
})

function ensureCurrentUserSelected() {
    if (!currentUserId.value) {
        return
    }

    if (!selectedMemberIds.value.includes(currentUserId.value)) {
        selectedMemberIds.value = [currentUserId.value, ...selectedMemberIds.value]
    }
}

function resetTeamForm() {
    teamForm.value = {
        name: '',
        description: '',
        boatName: '',
        clanColor: '#ef4444',
    }
    memberSearch.value = ''
    selectedMemberIds.value = currentUserId.value ? [currentUserId.value] : []
}

async function openTeamRegistrationModal() {
    if (hasCurrentUserTeam.value) {
        navigateTo('/desafio-final')
        return
    }

    await fetchAvailableMembers()
    ensureCurrentUserSelected()
    showTeamRegistrationModal.value = true
}

function closeTeamRegistrationModal() {
    if (isSubmittingTeam.value) {
        return
    }

    showTeamRegistrationModal.value = false
}

function isMemberSelected(memberId: number) {
    return selectedMemberIds.value.includes(memberId)
}

function toggleMemberSelection(memberId: number) {
    if (memberId === currentUserId.value) {
        return
    }

    if (selectedMemberIds.value.includes(memberId)) {
        selectedMemberIds.value = selectedMemberIds.value.filter((id) => id !== memberId)
        return
    }

    selectedMemberIds.value = [...selectedMemberIds.value, memberId]
}

async function fetchAvailableMembers() {
    if (memberOptions.value.length > 0) {
        ensureCurrentUserSelected()
        return
    }

    isLoadingMembers.value = true

    try {
        const response = await $httpClient.user.GetUsers()

        if (response.success && response.result) {
            memberOptions.value = response.result
            ensureCurrentUserSelected()
            return
        }

        memberOptions.value = []
        toast.error('Participantes indisponíveis', 'Não foi possível carregar a lista de usuários para o clã.', 4000)
    } catch (error) {
        console.error('Erro ao carregar usuários para seleção do clã:', error)
        memberOptions.value = []
        toast.error('Participantes indisponíveis', 'Ocorreu um erro ao carregar a lista de usuários.', 4000)
    } finally {
        isLoadingMembers.value = false
    }
}

async function fetchCurrentClassroom(): Promise<IClass | null> {
    const user = getUserIdFromSession()

    if (!user?.enrollmentId) {
        currentClassroom.value = null
        return null
    }

    try {
        const response = await $httpClient.class.GetClassOfFinalChallengeByEnrollmentId(user.enrollmentId)

        if (response.success && response.result) {
            currentClassroom.value = response.result
            return currentClassroom.value
        }

        currentClassroom.value = null
    } catch (error) {
        console.error('Erro ao buscar a turma atual do desafio final:', error)
        currentClassroom.value = null
    }

    return null
}

async function ensureFinalChallengeAccess() {
    const currentClass = await fetchCurrentClassroom()

    if (currentClass?.id && currentClass.currentModuleId) {
        return true
    }

    var responseAcess = await $httpClient.finalChallenge.FinalChallengeAccess(currentClass?.courseId ?? 0)
    
    if (responseAcess.result.hasAccess)
    {
        
    }
    await navigateTo('/trilha-aluno')
    return false
}

async function fetchTeamForPlayerRelationship() {
    isLoadingTeams.value = true

    try {
        const currentClass = currentClassroom.value ?? await fetchCurrentClassroom()

        if (!currentClass?.id || !currentClass?.currentModuleId) {
            teams.value = []
            return
        }

        const response = await $httpClient.finalChallenge.GetTeamForPlayerRelationship(
            currentClass.id,
            currentClass.currentModuleId,
        )

        if (response.success && response.result) {
            teams.value = Array.isArray(response.result) ? response.result : [response.result]
        } else {
            teams.value = []
        }

    } catch (error) {
        console.error('Erro ao buscar dados do time:', error)
        teams.value = []
        toast.error('Ocorreu um erro ao carregar os dados do time. Tente novamente mais tarde.')
    } finally {
        isLoadingTeams.value = false
    }
}

async function submitTeamRegistration() {
    const user = getUserIdFromSession()

    if (!user?.userId) {
        toast.error('Sessão inválida', 'Faça login novamente para cadastrar seu clã.', 4000)
        return
    }

    if (!currentClassroom.value?.id || !currentClassroom.value?.currentModuleId) {
        toast.error('Turma indisponível', 'Não foi possível identificar a turma do desafio final.', 4000)
        return
    }

    if (hasCurrentUserTeam.value) {
        await navigateTo('/desafio-final')
        return
    }

    if (!teamForm.value.name || !teamForm.value.boatName) {
        toast.warn('Campos obrigatórios', 'Informe o nome do clã e o nome do barco para continuar.', 3500)
        return
    }

    ensureCurrentUserSelected()

    const payload: IJoinTeamPayload = {
        classId: currentClassroom.value?.id ?? 0,
        moduleId: currentClassroom.value?.currentModuleId ?? 0,
        name: teamForm.value.name,
        description: teamForm.value.description || undefined,
        clanColor: teamForm.value.clanColor,
        boatName: teamForm.value.boatName,
        userIds: [...new Set(selectedMemberIds.value)],
    }

    isSubmittingTeam.value = true

    try {
        const response = await $httpClient.finalChallenge.JoinTeam(payload)

        if (!response.success) {
            toast.error('Cadastro não realizado', response.errors?.[0] ?? 'Não foi possível cadastrar o clã.', 4000)
            return
        }

        toast.success('Clã cadastrado', 'Seu clã foi registrado com sucesso no desafio final.', 3500)
        closeTeamRegistrationModal()
        resetTeamForm()
        await fetchTeamForPlayerRelationship()
        await navigateTo('/desafio-final')
    } catch (error) {
        console.error('Erro ao cadastrar clã no desafio final:', error)
        toast.error('Erro ao cadastrar', 'Ocorreu um erro ao registrar o clã. Tente novamente mais tarde.', 4000)
    } finally {
        isSubmittingTeam.value = false
    }
}

onBeforeMount(async () => {
    const user = getUserIdFromSession()

    if (!user?.userId) {
        toast.error('Sessão inválida', 'Faça login novamente para continuar.', 4000)
        await navigateTo('/')
        return
    }

    const hasAccess = await ensureFinalChallengeAccess()

    if (!hasAccess) {
        return
    }

    await Promise.all([
        fetchTeamForPlayerRelationship(),
        fetchAvailableMembers(),
    ])

    if (hasCurrentUserTeam.value) {
        await navigateTo('/desafio-final')
    }
})
</script>

<style scoped lang="scss">
.cover-mask {
    position: fixed;
    inset: 0;
    z-index: 3200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(15, 23, 42, 0.58) !important;
    backdrop-filter: blur(6px);
}

.cover-modal {
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    box-shadow: 0 28px 70px rgba(2, 6, 23, 0.28), 0 10px 24px rgba(24, 122, 191, 0.1) !important;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>