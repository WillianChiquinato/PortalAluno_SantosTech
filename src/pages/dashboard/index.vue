<template>
    <div v-if="isDashboardHydrating" class="space-y-6 overflow-x-hidden" aria-busy="true" aria-live="polite">
        <section class="panel overflow-hidden p-0">
            <div class="dashboard-skeleton-block h-51 w-full"></div>

            <div class="relative z-10 space-y-4 p-3 pt-4 sm:p-5">
                <div class="-mt-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div class="flex min-w-0 items-end gap-3 sm:gap-4">
                        <div
                            class="dashboard-skeleton-block h-20 w-20 rounded-2xl border-4 border-white sm:h-25 sm:w-25">
                        </div>

                        <div class="min-w-0 space-y-2">
                            <div class="dashboard-skeleton-block h-6 w-44 rounded-full sm:w-56"></div>
                            <div class="dashboard-skeleton-block h-4 w-40 rounded-full sm:w-64"></div>
                        </div>
                    </div>

                    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-nowrap">
                        <div class="dashboard-skeleton-block h-9 w-full rounded-full sm:w-32"></div>
                        <div class="dashboard-skeleton-block h-9 w-full rounded-full sm:w-32"></div>
                    </div>
                </div>

                <div class="dashboard-skeleton-block h-4 w-full max-w-xl rounded-full"></div>

                <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div v-for="card in 3" :key="`dashboard-stat-skeleton-${card}`" class="panel space-y-3 p-4">
                        <div class="dashboard-skeleton-block h-3 w-24 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-8 w-32 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-4 w-full rounded-full"></div>
                    </div>
                </section>

                <div class="space-y-2">
                    <div class="flex items-center justify-between gap-2">
                        <div class="dashboard-skeleton-block h-3 w-20 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-7 w-28 rounded-full"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        <div v-for="badge in 6" :key="`dashboard-badge-skeleton-${badge}`"
                            class="panel space-y-2 p-3 text-center">
                            <div class="dashboard-skeleton-block mx-auto h-9 w-9 rounded-full"></div>
                            <div class="dashboard-skeleton-block h-3 w-full rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
            <div class="space-y-3">
                <div class="flex items-center justify-between gap-3">
                    <div class="space-y-2">
                        <div class="dashboard-skeleton-block h-7 w-48 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-4 w-28 rounded-full"></div>
                    </div>

                    <div class="dashboard-skeleton-block h-7 w-24 rounded-full"></div>
                </div>

                <div v-for="task in 2" :key="`dashboard-task-skeleton-${task}`" class="panel space-y-3 p-5">
                    <div class="dashboard-skeleton-block h-5 w-48 rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-full rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-2/3 rounded-full"></div>
                </div>
            </div>

            <div class="panel flex flex-col gap-4 p-4 sm:p-5">
                <div class="space-y-2">
                    <div class="dashboard-skeleton-block h-6 w-40 rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-52 rounded-full"></div>
                </div>

                <div class="space-y-2">
                    <div class="dashboard-skeleton-block h-4 w-full rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-11/12 rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-10/12 rounded-full"></div>
                </div>

                <div class="panel space-y-3 bg-red-50 p-4">
                    <div class="dashboard-skeleton-block h-5 w-32 rounded-full"></div>
                    <div class="dashboard-skeleton-block h-4 w-48 rounded-full"></div>
                    <div class="dashboard-skeleton-block h-9 w-full rounded-full"></div>
                </div>
            </div>
        </section>

        <section class="space-y-3">
            <div class="panel space-y-4 p-4 sm:p-5">
                <div class="flex items-center justify-between gap-3">
                    <div class="space-y-2">
                        <div class="dashboard-skeleton-block h-3 w-24 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-6 w-56 rounded-full"></div>
                        <div class="dashboard-skeleton-block h-4 w-72 rounded-full"></div>
                    </div>

                    <div class="dashboard-skeleton-block h-10 w-36 rounded-full"></div>
                </div>
            </div>
        </section>
    </div>

    <div v-else class="space-y-6 overflow-x-hidden">
        <section class="panel overflow-hidden p-0">
            <div
                class="relative h-51 bg-linear-to-r from-brand-600 via-brand-500 to-accent-500 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_45%)]">
                <img :src="profile?.coverPictureUrl !== null && profile?.coverPictureUrl !== '' ? profile?.coverPictureUrl : backgroundDefault"
                    alt="Capa do perfil" class="h-full w-full object-cover brightness-75" />
                <button type="button" class="preview-btn preview-btn-cover" @click="openImagePreview('cover')">
                    <i class="pi pi-images"></i>
                    <span>Ver capa</span>
                </button>
                <div class="absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/20 blur-2xl"></div>
                <div
                    class="absolute left-4 top-3 z-10 box-border border-2 border-white/30 bg-loading/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-loading/90 backdrop-blur-sm sm:left-8 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.2em]">
                    Perfil do aluno
                </div>
            </div>

            <div class="relative z-10 space-y-4 p-3 pt-4 sm:p-5">
                <div class="-mt-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div class="flex min-w-0 items-end gap-3 sm:gap-4">
                        <div class="relative h-20 w-20 sm:h-25 sm:w-25">
                            <span class="profile-frame"></span>
                            <img :src="profile?.profilePictureUrl !== null && profile?.profilePictureUrl !== '' ? profile?.profilePictureUrl : profileDefault"
                                class="relative h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-md sm:h-25 sm:w-25" />
                            <button type="button" class="preview-btn preview-btn-profile"
                                @click="openImagePreview('profile')" aria-label="Abrir foto de perfil">
                                <i class="pi pi-search"></i>
                            </button>
                        </div>

                        <div class="min-w-0 space-y-1">
                            <h2 class="max-w-37.5 truncate text-base font-semibold sm:max-w-none sm:text-xl">{{
                                profile?.name ?? 'Nome não disponível' }}</h2>
                            <p class="max-w-37.5 truncate text-xs text-ink-500 sm:max-w-none sm:text-sm">{{
                                profile?.class?.name ?? 'Turma não disponível' }} • Nível {{ profile?.levelUser ??
                                    'Nível não disponível' }}</p>
                        </div>
                    </div>

                    <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-nowrap">
                        <button
                            class="btn-outline h-9 w-full cursor-pointer bg-red-50 px-2 xl:px-5 text-xs text-brand-600 sm:w-auto"
                            @click="openUploadCoverAndPicture">Editar
                            Fotos</button>
                        <button
                            class="btn-outline h-9 w-full cursor-pointer bg-red-50 px-2 xl:px-5 text-xs text-brand-600 sm:w-auto"
                            @click="openEditAttributes">Editar
                            Perfil</button>
                    </div>
                </div>

                <p class="text-xs text-ink-700 sm:text-sm">{{ profile?.bio ?? 'Bio não disponível' }}</p>

                <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
                </section>

                <div class="space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Medalhas (De todos os
                            cursos)</p>
                        <span class="chip shrink-0">{{ unlockedMedals ?? 0 }} desbloqueadas</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        <div v-for="(badge, index) in badgeSlots" :key="badge.name"
                            class="rounded-xl border p-1 text-center text-xs cursor-pointer" :class="[
                                badge.unlocked ? 'border-brand-200 bg-red-50 text-brand-600 medal-idle' : 'border-slate-200 bg-slate-50 text-ink-500',
                            ]" :style="badge.unlocked ? { animationDelay: `${(index % 6) * 0.22}s` } : undefined">
                            <div class="w-full flex justify-center items-center h-9">
                                <BaseLottie v-if="badge.unlocked" :animation-data="BadgeUnlocked" :loop="true"
                                    :autoplay="true" class="w-9 h-9" />
                                <BaseLottie v-else :animation-data="Locked" :loop="true" :autoplay="true"
                                    class="w-9 h-9" />
                            </div>
                            <p class="mt-1 truncate">{{ badge.name }}</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Nota por exercícios
                            (Todos os cursos)</p>
                        <span class="chip shrink-0">{{ exerciseCategoryGrades.length }} categorias</span>
                    </div>

                    <div v-if="exerciseCategoryGrades.length === 0"
                        class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-ink-500">
                        Nenhuma categoria de exercício respondida ainda.
                    </div>

                    <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        <div v-for="cat in exerciseCategoryGrades" :key="cat.categoryName"
                            class="relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-shadow hover:shadow-md"
                            :class="{
                                'border-emerald-200 bg-emerald-50': cat.categoryNotice === 'A',
                                'border-green-200 bg-green-50': cat.categoryNotice === 'B',
                                'border-yellow-200 bg-yellow-50': cat.categoryNotice === 'C',
                                'border-orange-200 bg-orange-50': cat.categoryNotice === 'D',
                                'border-red-200 bg-red-50': cat.categoryNotice === 'F',
                            }">
                            <div class="flex w-full flex-col items-center gap-2"
                                :class="{ 'blur-[2px] opacity-65': isCategoryInProgress(cat) }">
                                <span
                                    class="flex h-16 w-16 items-center justify-center rounded-full border text-3xl font-black leading-none"
                                    :class="{
                                        'border-emerald-500 text-emerald-600': cat.categoryNotice === 'A',
                                        'border-green-500 text-green-600': cat.categoryNotice === 'B',
                                        'border-yellow-500 text-yellow-700': cat.categoryNotice === 'C',
                                        'border-orange-500 text-orange-600': cat.categoryNotice === 'D',
                                        'border-red-500 text-red-600': cat.categoryNotice === 'F',
                                    }">{{ cat.categoryNotice }}</span>

                                <p class="w-full truncate text-xs font-semibold text-ink-800">{{ cat.categoryName }}</p>

                                <div class="w-full rounded-full bg-slate-200 h-1.5 overflow-hidden">
                                    <div class="h-1.5 rounded-full transition-all duration-500" :class="{
                                        'bg-emerald-500': cat.categoryNotice === 'A',
                                        'bg-green-500': cat.categoryNotice === 'B',
                                        'bg-yellow-400': cat.categoryNotice === 'C',
                                        'bg-orange-400': cat.categoryNotice === 'D',
                                        'bg-red-500': cat.categoryNotice === 'F',
                                    }"
                                        :style="{ width: cat.totalAnswered > 0 ? `${Math.round((cat.totalCorrect / cat.totalAnswered) * 100)}%` : '0%' }">
                                    </div>
                                </div>

                                <p class="text-[10px] text-ink-500">
                                    {{ cat.totalCorrect }}/{{ cat.totalAnswered }} acertos
                                </p>

                                <span
                                    class="rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-semibold text-ink-600">
                                    {{ resolveCategoryStatus(cat) }}
                                </span>

                                <p class="text-[10px] text-ink-500">
                                    Ultima resposta:
                                    {{ hasInvalidDate(cat.lastUpdatedAnswerAt) ? 'Sem registro' :
                                        formatDate(cat.lastUpdatedAnswerAt, 'pt-BR', {
                                            dateStyle: 'short', timeStyle:
                                                'short'
                                        })
                                    }}
                                </p>
                            </div>

                            <div v-if="isCategoryInProgress(cat)"
                                class="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 px-3 backdrop-blur-[1px]">
                                <p class="text-center text-[11px] font-semibold leading-snug text-amber-800">
                                    Alcance 10 respostas nessa categoria para desbloquear.
                                </p>
                            </div>
                        </div>
                    </div>

                    <RankingAvailable @click="openAvailableRanking" />
                </div>
            </div>
        </section>

        <section class=" grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
            <div class="space-y-1">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div class="flex items-center">
                        <h3 class="text-lg font-semibold leading-none sm:text-xl">
                            Tarefas diarias
                        </h3>

                        <div class="h-14 w-14 sm:h-20 sm:w-20">
                            <BaseLottie :animation-data="TaskList" :loop="true" :autoplay="true"
                                class="h-12 w-12 sm:h-16 sm:w-16" />
                        </div>
                    </div>

                    <span class="chip self-start sm:self-center">
                        {{ dailyTasksCards.length }} pendentes
                    </span>
                </div>
                <div v-if="dailyTasksCards.length" class="space-y-3">
                    <TaskCard v-for="task in dailyTasksCards" :key="task.id" :title="task.title" :due="task.due"
                        :points="task.points" :status="task.status" :disabled="task.disabled"
                        :featured="task.highlighted" :highlight-label="task.highlightLabel"
                        @select="openDailyTask(task)" />
                </div>
                <div v-else class="panel p-5">
                    <p class="text-sm font-semibold">Nenhuma tarefa diária disponível.</p>
                    <p class="text-xs text-ink-500 mt-1">Quando novas atividades forem liberadas, elas
                        aparecerão aqui.
                    </p>
                </div>
            </div>

            <div class="panel flex flex-col gap-4 p-4 sm:p-5">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">

                        <div class="w-10 h-10">
                            <BaseLottie :animation-data="warningStatus" :loop="true" :autoplay="true"
                                class="w-12 h-12" />
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">Resumo rapido</h3>
                            <p class="text-xs text-ink-500">
                                Seu ritmo sempre avançando...
                            </p>
                        </div>
                    </div>
                </div>

                <div class="max-w-xl space-y-3 text-sm leading-relaxed text-ink-500 text-justify">
                    <p>{{ messageMotivacional }}</p>
                </div>
                <div class="panel mt-2 flex flex-col gap-2 bg-red-50 p-4">
                    <p class="text-sm font-semibold">Ranking Global</p>
                    <p class="text-xs text-ink-500">Clique abaixo para ver o ranking completo.</p>
                    <button class="btn-primary mt-2 h-9 w-full px-4 text-xs text-ink-900 sm:w-auto cursor-pointer"
                        @click="openRanking">Ver
                        Ranking</button>
                </div>
            </div>
        </section>

        <section class="space-y-3">
            <div class="panel p-4 sm:p-5">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">Area do aluno (Todos os
                            Cursos)</p>
                        <h3 class="text-lg font-semibold">Respostas do usuario</h3>
                        <p class="mt-1 text-xs text-ink-500">Painel rapido para acompanhar respostas sem sair do
                            dashboard.</p>
                    </div>

                    <button type="button" class="relative btn-primary h-10 px-4 text-xs text-ink-900 cursor-pointer"
                        @click="toggleAnswersPanel">
                        {{ showAnswersPanel ? 'Fechar respostas' : 'Abrir respostas' }}
                        <span v-if="newAnswersCount > 0"
                            class="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-white bg-brand-600 px-1 text-[10px] font-semibold text-white">
                            {{ newAnswersCount }}
                        </span>
                    </button>
                </div>

                <p v-if="newAnswersCount > 0" class="mt-3 text-xs font-semibold text-brand-600">
                    Voce possui {{ newAnswersCount }} resposta(s) nova(s).
                </p>
            </div>

            <Transition enter-active-class="duration-300 ease-out transition-all"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="duration-200 ease-in transition-all" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
                <UserAnswersPanel v-if="showAnswersPanel" title="Respostas do usuario"
                    :answers="userAnswersPanelItems" />
            </Transition>
        </section>
    </div>

    <NewUploadCover @back="closeUploadCoverAndPicture" @save="saveCoverAndProfile"
        v-model:visible="showUploadCoverAndPicture" :name="'Editar fotos do perfil'" accept="image/*" />

    <CreatedEditModal :name="'Editar atributos do perfil'" @back="closeEditAttributes" @save="UpdateUserProfile"
        v-model:visible="showEditAttributes">
        <p class="text-sm text-ink-500">Atualize as informações básicas do seu perfil.</p>

        <div class="space-y-3">
            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Nome</label>
                <input v-model="profile!.name" type="text" class="input w-full" placeholder="Digite seu nome" />

            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Email</label>
                <input v-model="profile!.email" type="email" class="input w-full"
                    :class="isEmailValid(profile!.email) ? 'border-green-500' : 'border-red-500'"
                    placeholder="Digite seu email" />
                <p v-if="!isEmailValid(profile!.email)" class="text-xs text-red-500">Email inválido</p>
            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Senha</label>
                <input v-model="editPassword" :type="showPassword ? 'text' : 'password'" class="input w-full"
                    placeholder="Digite uma nova senha (opcional)" />

                <button type="button"
                    class="absolute right-4 top-8 text-ink-500 text-xl hover:text-ink-700 hover:scale-110"
                    @click="handleEyePassword">
                    <i :class="showPassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
                </button>
            </div>

            <div class="panel border-red-100/80 p-3">
                <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500">Bio</label>
                <textarea v-model="profile!.bio" class="input w-full" placeholder="Fale um pouco sobre você"
                    rows="4"></textarea>
            </div>

            <div class="flex items-center justify-end gap-2 pt-1">
                <button type="button" class="bg-red-50 text-ink-900 btn-outline h-9 px-4 text-xs cursor-pointer"
                    @click="closeEditAttributes">
                    Voltar
                </button>
                <button type="button" class="text-ink-900 btn-primary h-9 px-4 text-xs cursor-pointer"
                    @click="UpdateUserProfile" :disabled="!isEmailValid(profile!.email)">
                    Salvar alterações
                </button>
            </div>
        </div>
    </CreatedEditModal>

    <ExercisesCard :visible="showTaskQuizModal" :task="selectedTask" :daily-task="selectedDailyTask"
        :exercises="availableExercises" :loading="quizLoading" :questions="quizQuestions"
        :selected-answers="selectedAnswers" :selected-code-answers="selectedCodeAnswers"
        :current-question-index="currentQuestionIndex" :quiz-result="taskResult" @close="closeTaskQuiz"
        @start-quiz="startExerciseQuiz" @select-answer="selectAnswer($event.questionId, $event.optionId)"
        @update-code-answer="updateCodeAnswer($event.questionId, $event.answer)" @back-to-exercises="backToExercises"
        @back-to-exercises-and-refresh="backToExercises" @finish-quiz="finishExercise" />

    <Transition name="image-viewer-fade">
        <div v-if="showImageViewer" class="image-viewer-overlay" @click.self="closeImagePreview">
            <div class="image-viewer-content">
                <div class="image-viewer-header">
                    <p class="image-viewer-title">{{ imageViewerTitle }}</p>
                    <button type="button" class="image-viewer-close" @click="closeImagePreview"
                        aria-label="Fechar visualizador de imagem">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <img :src="imageViewerSrc" :alt="imageViewerTitle" class="image-viewer-image" />
            </div>
        </div>
    </Transition>

    <Transition name="image-viewer-fade">
        <div v-if="showGlobalRanking" class="image-viewer-overlay" @click.self="closeGlobalRanking">
            <div class="global-ranking-content">
                <div class="global-ranking-header">
                    <div>
                        <p class="global-ranking-title">Ranking Global por Pontos</p>
                        <p class="global-ranking-subtitle">Compare sua pontuação com o topo e a média da plataforma.</p>
                    </div>

                    <button type="button" class="image-viewer-close" @click="closeGlobalRanking"
                        aria-label="Fechar ranking global">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <div class="global-ranking-body">
                    <div v-if="!isGlobalRankingLoading && currentUserRankingEntry" class="global-ranking-compare">
                        <div v-for="card in pointRankingComparisonCards" :key="card.label"
                            class="global-ranking-compare-card">
                            <p class="global-ranking-compare-label">{{ card.label }}</p>
                            <p class="global-ranking-compare-value">{{ card.value }}</p>
                            <p class="global-ranking-compare-helper">{{ card.helper }}</p>
                        </div>
                    </div>

                    <p v-if="isGlobalRankingLoading" class="text-sm text-ink-500">Carregando ranking...</p>

                    <p v-else-if="globalRanking.length === 0" class="text-sm text-ink-500">
                        Nenhum aluno encontrado no ranking.
                    </p>

                    <div v-else class="space-y-2">
                        <div v-for="entry in globalRanking" :key="entry.userId" class="global-ranking-row"
                            :class="{ 'global-ranking-row-highlight': entry.isCurrentUser }">
                            <div class="global-ranking-position">#{{ entry.position }}</div>

                            <img :src="entry.avatarUrl" :alt="`Avatar de ${entry.name}`"
                                class="global-ranking-avatar" />

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-semibold text-ink-900">{{ entry.name }}</p>
                                <p class="text-xs text-ink-500">Aluno</p>
                            </div>

                            <div class="text-right">
                                <p class="text-sm font-semibold text-brand-600">{{ entry.totalPoints }} pts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <Transition name="image-viewer-fade">
        <div v-if="showGradeRanking" class="grade-ranking-overlay" @click.self="closeGradeRanking">
            <div class="grade-ranking-content">
                <div class="grade-ranking-header">
                    <div>
                        <p class="grade-ranking-title">Ranking por Nota</p>
                        <p class="grade-ranking-subtitle">
                            Desempenho por categoria
                            <template v-if="!isGradeRankingLoading"> · <strong>{{ categoryRankings.length }}</strong> {{
                                categoryRankings.length === 1 ? 'categoria' : 'categorias' }}</template>
                        </p>
                    </div>

                    <button type="button" class="grade-ranking-close" @click="closeGradeRanking"
                        aria-label="Fechar ranking por nota">
                        <i class="pi pi-times"></i>
                    </button>
                </div>

                <div class="grade-ranking-body">
                    <!-- loading -->
                    <div v-if="isGradeRankingLoading" class="grade-ranking-loading">
                        <i class="pi pi-spinner pi-spin"></i>
                        Carregando ranking por nota...
                    </div>

                    <template v-else-if="categoryRankings.length > 0">
                        <!-- summary cards -->
                        <div v-if="currentUserCategorySummary" class="grade-ranking-summary">
                            <article class="grade-ranking-summary-card grade-ranking-summary-card--best">
                                <p class="grade-ranking-summary-label">Melhor categoria</p>
                                <p class="grade-ranking-summary-value">{{
                                    currentUserCategorySummary.bestCategory.category }}</p>
                                <p class="grade-ranking-summary-sub">{{ currentUserCategorySummary.bestCategory.percent
                                }}% · #{{ currentUserCategorySummary.bestCategory.position }}º lugar</p>
                            </article>

                            <article class="grade-ranking-summary-card">
                                <p class="grade-ranking-summary-label">Média geral</p>
                                <p class="grade-ranking-summary-value">{{ currentUserCategorySummary.avgPercent }}%</p>
                                <p class="grade-ranking-summary-sub">{{ currentUserCategorySummary.categoriesCount }} {{
                                    currentUserCategorySummary.categoriesCount === 1 ? 'categoria respondida' :
                                        'categorias respondidas' }}</p>
                            </article>

                            <article class="grade-ranking-summary-card">
                                <p class="grade-ranking-summary-label">Top 1 em</p>
                                <p class="grade-ranking-summary-value">{{ currentUserCategorySummary.topOneCount }}</p>
                                <p class="grade-ranking-summary-sub">{{ currentUserCategorySummary.topOneCount === 1 ?
                                    'categoria' : 'categorias' }} lideradas</p>
                            </article>
                        </div>

                        <!-- category tabs -->
                        <div class="grade-ranking-tabs" role="tablist">
                            <button v-for="cat in categoryRankings" :key="cat.category" type="button" role="tab"
                                class="grade-ranking-tab"
                                :class="{ 'grade-ranking-tab--active': selectedGradeCategory === cat.category }"
                                :aria-selected="selectedGradeCategory === cat.category"
                                @click="selectedGradeCategory = cat.category">
                                {{ cat.category }}
                                <span class="grade-ranking-tab-badge">{{ cat.rankings.length }}</span>
                            </button>
                        </div>

                        <!-- ranked list for selected category -->
                        <div v-if="activeCategoryRankingList.length > 0" class="grade-ranking-list">
                            <div v-for="(entry, index) in activeCategoryRankingList"
                                :key="`grade-${selectedGradeCategory}-${entry.userId}`" class="grade-ranking-row"
                                :class="{
                                    'grade-ranking-row-highlight': currentUserCategorySummary?.userId === entry.userId,
                                    'grade-ranking-row-first': index === 0,
                                }">
                                <div class="grade-ranking-position">
                                    <span v-if="index === 0" class="grade-ranking-medal">🥇</span>
                                    <span v-else-if="index === 1" class="grade-ranking-medal">🥈</span>
                                    <span v-else-if="index === 2" class="grade-ranking-medal">🥉</span>
                                    <span v-else class="grade-ranking-position-num">{{ index + 1 }}º</span>
                                </div>

                                <img :src="entry.profilePictureUrl?.trim() || profileDefault"
                                    :alt="`Avatar de ${entry.name}`" class="grade-ranking-avatar" />

                                <div class="min-w-0 flex-1">
                                    <p class="truncate text-sm font-semibold text-slate-900">{{ entry.name }}</p>
                                    <p class="text-[11px] text-slate-500">
                                        {{ entry.totalAnswers }} {{ entry.totalAnswers === 1 ? 'resposta' : 'respostas'
                                        }}
                                    </p>
                                </div>

                                <div class="grade-ranking-score-block">
                                    <p class="grade-ranking-score">{{ Math.round(entry.percentAvailable) }}%</p>
                                    <div class="grade-ranking-bar-track">
                                        <div class="grade-ranking-bar-fill"
                                            :style="{ width: `${Math.min(entry.percentAvailable, 100)}%` }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p v-else class="grade-ranking-empty">Nenhum aluno nesta categoria ainda.</p>
                    </template>

                    <p v-else class="grade-ranking-empty">Nenhuma categoria encontrada no ranking por nota.</p>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Floating notification bell -->
    <button type="button"
        class="fixed right-6 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 text-ink-600 transition-all duration-200 hover:scale-105 hover:border-brand-300 hover:text-brand-600 hover:shadow-brand-100/60 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-brand-500/60 dark:hover:text-brand-400"
        aria-label="Abrir notificações" @click="showNotificationPanel = true">
        <i class="pi pi-bell text-base"></i>
        <span v-if="notificationUnreadCount > 0"
            class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-brand-600 px-1 text-[10px] font-bold text-white dark:border-slate-900">
            {{ notificationUnreadCount > 99 ? '99+' : notificationUnreadCount }}
        </span>
    </button>

    <NotificationPanel v-model:visible="showNotificationPanel" />
</template>

<script setup lang="ts">
import BaseLottie from '@/components/BaseLottie.vue'
import StatCard from '@/components/StatCard.vue'
import TaskCard from '@/components/TaskCard.vue'
import NotificationPanel from '@/components/NotificationPanel.vue'
import warningStatus from '@/assets/lottie/Warning Status.json'
import TaskList from '~/assets/lottie/TaskList.json'
import BadgeUnlocked from '~/assets/lottie/Badges.json'
import Locked from '~/assets/lottie/lockBadge.json'

import { getUserIdFromSession } from '~/composables/useLoadingConfigurations';
import { useNotifications } from '~/composables/useNotifications'
import profileDefault from '@/assets/Images-Default/profile-default.png'
import backgroundDefault from '@/assets/Images-Default/background-default.png'
import { getLoggedUser } from '~/composables/useAuth'
import type { IClassRoom, IClassRoomExercise } from '~/infra/interfaces/services/class'
import { UserRole, type IUserProfileData } from '~/infra/interfaces/services/user'
import { useUserStore } from '~/infra/store/userStore'
import type { IBadge } from '~/infra/interfaces/services/badge'
import type { ICurrentModuleUser } from '~/infra/interfaces/services/phase'
import NewUploadCover from '~/components/Modals/newUploadCover.vue'
import CreatedEditModal from '~/components/Modals/CreatedEditModal.vue'
import ExercisesCard from '~/components/ExercisesCard.vue'
import UserAnswersPanel, { type UserAnswerItem } from '~/components/UserAnswersPanel.vue'

import { isEmailValid } from '#imports'
import type { DailyTaskGroupView, IDailyExercise, IDailyTaskGroup, IQuizQuestionOption, ISubmitExerciseAnswer, ExerciseCardTask, IExerciseCategoryGrade } from '~/infra/interfaces/services/exercise'
import type { IPointAwardResult, IPointCategoryRanking } from '~/infra/interfaces/services/point'
import { formatDate } from '~/utils/Format'
import { buildTaskQuestions, buildTaskQuestionsFromOptions, type ExerciseQuestionSource, type QuizQuestion } from '~/utils/taskQuestionBank'
import type { IAnswersByUserIdResponse, IAnswerByUser } from '~/infra/interfaces/services/answers'
import RankingAvailable from '~/components/RankingAvailable.vue'

const messageMotivacional = ref('')
const isDashboardHydrating = ref(true)

const showNotificationPanel = ref(false)
const { unreadCount: notificationUnreadCount } = useNotifications()

const showUploadCoverAndPicture = ref(false)
const showImageViewer = ref(false)
const imageViewerSrc = ref('')
const imageViewerTitle = ref('Visualizar imagem')

//Password.
const showPassword = ref(false)

function handleEyePassword() {
    showPassword.value = !showPassword.value;
}

//Edit user.
const showEditAttributes = ref(false)
const editPassword = ref('')

const { $httpClient } = useNuxtApp();
const { loadingPush, loadingPop } = useLoading();
const toast = useToastService();
const userData = useUserStore()

const profile = ref<IUserProfileData | undefined>();
const userBadges = ref<IBadge[] | undefined>();
const badgeSlots = ref<(IBadge & { unlocked: boolean })[]>([]);
const unlockedMedals = computed(() => badgeSlots.value.filter((badge) => badge.unlocked).length)

const currentModule = ref<ICurrentModuleUser | null>(null);
const ranking = ref<{ position: number; points: number; pointsToNext: number } | null>(null);
const showGlobalRanking = ref(false)
const showGradeRanking = ref(false)
const isGlobalRankingLoading = ref(false)
const isGradeRankingLoading = ref(false)
const globalRanking = ref<Array<{
    position: number
    userId: number
    name: string
    totalPoints: number
    avatarUrl: string
    isCurrentUser: boolean
}>>([])
const categoryRankings = ref<IPointCategoryRanking[]>([])
const selectedGradeCategory = ref<string>('')

const activeCategoryRanking = computed(() =>
    categoryRankings.value.find((c) => c.category === selectedGradeCategory.value) ?? null
)
const activeCategoryRankingList = computed(() => {
    if (!activeCategoryRanking.value) return []
    return [...activeCategoryRanking.value.rankings].sort((a, b) => b.percentAvailable - a.percentAvailable)
})
const currentUserCategorySummary = computed(() => {
    const userId = getUserIdFromSession()?.userId
    if (!userId || !categoryRankings.value.length) return null

    const participated: Array<{ category: string; percent: number; totalAnswers: number; position: number }> = []

    for (const cat of categoryRankings.value) {
        const sorted = [...cat.rankings].sort((a, b) => b.percentAvailable - a.percentAvailable)
        const idx = sorted.findIndex((r) => r.userId === userId)
        if (idx === -1) continue
        participated.push({
            category: cat.category,
            percent: Math.round(sorted[idx].percentAvailable),
            totalAnswers: sorted[idx].totalAnswers,
            position: idx + 1,
        })
    }

    if (!participated.length) return null

    const avgPercent = Math.round(participated.reduce((s, c) => s + c.percent, 0) / participated.length)
    const bestCategory = participated.reduce((best, c) => (c.percent > best.percent ? c : best))
    const topOneCount = participated.filter((c) => c.position === 1).length

    return { userId, avgPercent, bestCategory, categoriesCount: participated.length, topOneCount }
})

const currentUserRankingEntry = computed(() => {
    return globalRanking.value.find((entry) => entry.isCurrentUser) ?? null
})
const topRankingEntry = computed(() => {
    return globalRanking.value.length > 0 ? globalRanking.value[0] : null
})
const averageRankingPoints = computed(() => {
    if (!globalRanking.value.length) {
        return 0
    }

    const totalPoints = globalRanking.value.reduce((sum, entry) => sum + entry.totalPoints, 0)
    return Math.round(totalPoints / globalRanking.value.length)
})
const pointRankingComparisonCards = computed<Array<{ label: string; value: string; helper: string }>>(() => {
    const currentUser = currentUserRankingEntry.value
    const topUser = topRankingEntry.value

    if (!currentUser || !topUser) {
        return []
    }

    const distanceToTop = Math.max(topUser.totalPoints - currentUser.totalPoints, 0)
    const averageDelta = currentUser.totalPoints - averageRankingPoints.value

    return [
        {
            label: 'Sua pontuação',
            value: `${currentUser.totalPoints} pts`,
            helper: `Posição atual: #${currentUser.position}`,
        },
        {
            label: 'Distância para o Top 1',
            value: `${distanceToTop} pts`,
            helper: distanceToTop === 0 ? 'Você está liderando o ranking.' : `Faltam ${distanceToTop} pts para assumir a liderança.`,
        },
        {
            label: 'Comparação com a média',
            value: `${averageDelta >= 0 ? '+' : ''}${averageDelta} pts`,
            helper: `Média global: ${averageRankingPoints.value} pts`,
        },
    ]
})
const rankingMessage = computed(() => {
    if (!ranking.value) return 'Ranking indisponível';

    if (ranking.value.position === 1) {
        return 'Você está no Top 1. Continue dominando!';
    }

    return `Você está Top ${ranking.value.position}. Ganhe +${ranking.value.pointsToNext} pontos para chegar ao Top ${ranking.value.position - 1}.`;
});

const stats = computed<Array<{
    label: string
    value: string
    helper: string
    status: 'success' | 'progress' | 'warning'
}>>(() => {
    const allExercises = tasks.value.flatMap(group => group.exercises);
    return [
        { label: 'Pontuação Geral', value: String(profile.value?.pointsQuantity ?? 0), helper: rankingMessage.value, status: 'success' },
        { label: `Módulo atual - (${currentModule.value?.totalPhases ?? 0} fases)`, value: currentModule.value?.name ?? 'Indisponível', helper: currentModule.value?.description ?? 'Módulo Indisponível', status: 'progress' },
        { label: 'Tarefas Diárias', value: `${tasks.value.length > 0 ? 'Liberado' : 'Sem tarefas disponíveis'}`, helper: `${tasks.value.length > 0 ? `Entregar até ${formatDate(getLatestTermAt(allExercises), 'pt-BR', { dateStyle: 'short' })}` : 'Aguardando tarefas disponíveis'}`, status: 'warning' },
    ]
})

const tasks = ref<IDailyTaskGroup[]>([]);
const classRoomSpotlight = ref<IClassRoom | null>(null)
const nowTick = ref(Date.now())
const countdownTimer = ref<ReturnType<typeof setInterval> | null>(null)

const showTaskQuizModal = ref(false)
const selectedDailyTask = ref<DailyTaskGroupView | null>(null)
const selectedTask = ref<ExerciseCardTask | null>(null)
const quizLoading = ref(false)
const quizQuestions = ref<QuizQuestion[]>([])
const selectedAnswers = ref<Record<number, number | null>>({})
const selectedCodeAnswers = ref<Record<number, string>>({})
const currentQuestionIndex = ref(0)
const taskResult = ref<{ correct: number; total: number; accuracy: number; gainedPoints: number } | null>(null)

const isCorrectAnswer = computed(() => {
    if (!currentQuestion.value) return false
    const selectedOptionId = selectedAnswers.value[currentQuestion.value.id]
    return selectedOptionId === currentQuestion.value.correctOptionId
})

const dailyTaskGroups = computed<DailyTaskGroupView[]>(() => {
    return tasks.value.map((group) => ({
        id: `${group.phaseId}-${group.id}`,
        name: group.name,
        exercises: [...group.exercises]
            .sort((a, b) => a.indexOrder - b.indexOrder)
            .map((exercise) => mapExerciseToTaskCard(exercise, group.phaseId)),
        title: group.name,
        due: formatDate(getNearestTermAt(group.exercises), 'pt-BR', { dateStyle: 'short' }),
        points: String(sumGroupPoints(group.exercises)),
        status: getGroupStatus(group.exercises),
        description: `${group.exercises.length} exercício(s) diário(s) disponíveis.`,
        termAt: getNearestTermAt(group.exercises),
        disabled: group.exercises.length > 0 && group.exercises.every((exercise) => exercise.isCompletedAnswer),
    }))
})

const dailyTasksCards = computed(() => {
    if (!classRoomSpotlight.value) {
        return dailyTaskGroups.value
    }

    return [mapClassRoomToSpotlight(classRoomSpotlight.value), ...dailyTaskGroups.value]
})

const availableExercises = computed(() => selectedDailyTask.value?.exercises ?? [])

const currentQuestion = computed(() => quizQuestions.value[currentQuestionIndex.value] ?? null)
const answeredCount = computed(() => {
    return quizQuestions.value.filter((question) => {
        if (question.typeExercise === 2) {
            return Boolean((selectedCodeAnswers.value[question.id] ?? '').trim())
        }

        const answer = selectedAnswers.value[question.id]
        return answer !== null && answer !== undefined
    }).length
})
const allQuestionsAnswered = computed(() => quizQuestions.value.length > 0 && answeredCount.value === quizQuestions.value.length)

const exerciseCategoryGrades = ref<IExerciseCategoryGrade[]>([])

const showAnswersPanel = ref(false)
const newAnswersCount = ref(0)
const userAnswersPreview = ref<IAnswersByUserIdResponse | null>(null)
const userAnswersPanelItems = computed<UserAnswerItem[]>(() => {
    const groups = userAnswersPreview.value?.exerciseGroups ?? []

    return groups
        .flatMap((group) => {
            const exerciseTitle = group.exercise.title
            return group.answers.map((answer) => mapAnswerToPanelItem(answer, exerciseTitle))
        })
        .sort((first, second) => {
            return new Date(second.answeredAt).getTime() - new Date(first.answeredAt).getTime()
        })
})

function mapAnswerStatus(isCorrect: boolean | null | undefined): UserAnswerItem['status'] {
    if (isCorrect === true) {
        return 'Correta'
    }

    if (isCorrect === false) {
        return 'Incorreta'
    }

    return 'Pendente'
}

function mapAnswerContent(answerText: string | null, selectedOption: string): string {
    const normalizedText = answerText?.trim()

    if (normalizedText) {
        return normalizedText
    }

    if (selectedOption.trim()) {
        return `Opcao selecionada: ${selectedOption}`
    }

    return 'Resposta enviada.'
}

function mapAnswerToPanelItem(answer: IAnswerByUser, exerciseTitle: string): UserAnswerItem {
    return {
        id: answer.id,
        question: `${exerciseTitle} - Questao #${answer.questionId}`,
        answer: mapAnswerContent(answer.answerText, answer.selectedOption),
        status: mapAnswerStatus(answer.isCorrect),
        answeredAt: answer.answeredAt,
    }
}

function resolveCategoryStatus(category: IExerciseCategoryGrade): string {
    const rawStatus = (category.status ?? '').trim().toLowerCase()

    if (rawStatus === 'em progresso' || rawStatus === 'em_progresso' || rawStatus === 'inprogress') {
        return 'Em progresso'
    }

    if (rawStatus === 'desbloqueado') {
        return 'Desbloqueado'
    }

    if (rawStatus === 'nao iniciado' || rawStatus === 'não iniciado' || rawStatus === 'nao_iniciado' || rawStatus === 'not started') {
        return 'Não Iniciado'
    }

    return category.totalAnswered > 0 ? 'Desbloqueado' : 'Não Iniciado'
}

function isCategoryInProgress(category: IExerciseCategoryGrade): boolean {
    return resolveCategoryStatus(category) === 'Em progresso'
}

async function toggleAnswersPanel() {
    showAnswersPanel.value = !showAnswersPanel.value

    // Quando o usuario abre o painel, consideramos que visualizou novas respostas.
    if (showAnswersPanel.value) {
        newAnswersCount.value = 0
        await UpdateLastSeenAnswers();
    }
}

async function UpdateLastSeenAnswers() {
    try {
        await $httpClient.user.UpdateLastSeen();
    } catch (error) {
        console.error('Erro ao atualizar última visualização de respostas:', error)
    }
}

function getTaskStatus(termAt: string): string {
    const dueDate = new Date(termAt)
    const now = new Date()

    const dueStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (dueStart.getTime() < nowStart.getTime()) return 'Atrasada'
    if (dueStart.getTime() === nowStart.getTime()) return 'Vence hoje'

    return 'Em aberto'
}

function hasInvalidDate(dateValue: string): boolean {
    if (!dateValue) return true

    if (dateValue.startsWith('0001-01-01')) {
        return true
    }

    return Number.isNaN(new Date(dateValue).getTime())
}

function toTodayDeadline(targetLimited: number | string | null | undefined): Date | null {
    if (targetLimited === null || targetLimited === undefined) {
        return null
    }

    let hours = 0
    let minutes = 0
    let seconds = 0

    if (typeof targetLimited === 'number') {
        if (!Number.isFinite(targetLimited) || targetLimited < 0) {
            return null
        }

        hours = Math.floor(targetLimited)
        const minuteValue = (targetLimited - hours) * 60
        minutes = Math.floor(minuteValue)
        seconds = Math.round((minuteValue - minutes) * 60)
    } else {
        const normalized = targetLimited.trim()

        if (!normalized) {
            return null
        }

        // Aceita formatos completos de data/hora vindos da API.
        const parsedDate = new Date(normalized)
        if (!Number.isNaN(parsedDate.getTime()) && (normalized.includes('T') || normalized.includes('-') || normalized.includes('/'))) {
            return parsedDate
        }

        if (normalized.includes(':')) {
            const [h, m = '0', s = '0'] = normalized.split(':')
            hours = Number(h)
            minutes = Number(m)
            seconds = Number(s)
        } else {
            const numericValue = Number(normalized)

            if (!Number.isFinite(numericValue) || numericValue < 0) {
                return null
            }

            hours = Math.floor(numericValue)
            const minuteValue = (numericValue - hours) * 60
            minutes = Math.floor(minuteValue)
            seconds = Math.round((minuteValue - minutes) * 60)
        }
    }

    if ([hours, minutes, seconds].some((value) => Number.isNaN(value) || value < 0)) {
        return null
    }

    const now = new Date(nowTick.value)
    const deadline = new Date(now)
    deadline.setHours(hours, minutes, seconds, 0)

    return deadline
}

function formatCountdown(remainingMs: number): string {
    const safeMs = Math.max(0, remainingMs)
    const totalSeconds = Math.floor(safeMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, '0'))
        .join(':')
}

function buildTargetLimitedCountdown(targetLimited: number | string | null | undefined) {
    const deadline = toTodayDeadline(targetLimited)

    if (!deadline) {
        return null
    }

    const remainingMs = deadline.getTime() - nowTick.value
    const expired = remainingMs <= 0

    return {
        deadline,
        expired,
        dueText: expired ? 'Tempo encerrado' : `Termina hoje em ${formatCountdown(remainingMs)}`,
        status: expired ? 'Atrasada' : 'Vence hoje',
    }
}

function getNearestCountdown(targetLimits: Array<number | string | null | undefined>) {
    const countdowns = targetLimits
        .map((value) => buildTargetLimitedCountdown(value))
        .filter((countdown): countdown is NonNullable<ReturnType<typeof buildTargetLimitedCountdown>> => countdown !== null)

    if (!countdowns.length) {
        return null
    }

    return countdowns.sort((first, second) => first.deadline.getTime() - second.deadline.getTime())[0]
}

function sumGroupPoints(exercises: IDailyExercise[]): number {
    return exercises.reduce((acc, exercise) => acc + exercise.pointsRedeem, 0)
}

function getNearestTermAt(exercises: IDailyExercise[]): string {
    if (!exercises.length) return new Date().toISOString()

    return exercises.reduce((nearest, exercise) => {
        return new Date(exercise.termAt).getTime() < new Date(nearest).getTime() ? exercise.termAt : nearest
    }, exercises[0].termAt)
}

function getLatestTermAt(exercises: IDailyExercise[]): string {
    if (!exercises.length) return new Date().toISOString()

    return exercises.reduce((latest, exercise) => {
        return new Date(exercise.termAt).getTime() > new Date(latest).getTime() ? exercise.termAt : latest
    }, exercises[0].termAt)
}

function getGroupStatus(exercises: IDailyExercise[]): string {
    if (!exercises.length) return 'Em aberto'

    if (exercises.every((exercise) => exercise.isCompletedAnswer)) return 'Concluída'

    const statuses = exercises.map((exercise) => getTaskStatus(exercise.termAt))

    if (statuses.includes('Atrasada')) return 'Atrasada'
    if (statuses.includes('Vence hoje')) return 'Vence hoje'
    return 'Em aberto'
}

function mapExerciseToTaskCard(exercise: IDailyExercise, phaseId?: number): ExerciseCardTask {
    return {
        id: exercise.id,
        title: exercise.title,
        due: formatDate(exercise.termAt, 'pt-BR', { dateStyle: 'short' }),
        points: String(exercise.pointsRedeem),
        status: getTaskStatus(exercise.termAt),
        description: exercise.description,
        termAt: exercise.termAt,
        isCompletedAnswer: exercise.isCompletedAnswer,
        source: {
            id: exercise.id,
            phaseId,
            title: exercise.title,
            description: exercise.description,
            videoUrl: exercise.videoUrl,
            pointsRedeem: exercise.pointsRedeem,
            typeExercise: exercise.typeExercise,
            difficulty: exercise.difficulty,
        },
    }
}

function mapClassRoomExerciseToTaskCard(
    exercise: IClassRoomExercise,
    roomTargetLimited?: number | string | null,
): ExerciseCardTask {
    const countdown = buildTargetLimitedCountdown(exercise.targetLimited ?? roomTargetLimited)

    const due = countdown
        ? countdown.dueText
        : hasInvalidDate(exercise.termAt)
            ? 'Sem prazo definido'
            : formatDate(exercise.termAt, 'pt-BR', { dateStyle: 'short' })

    const status = exercise.isCompletedAnswer
        ? 'Concluída'
        : countdown?.status ?? 'Em aberto'

    return {
        id: exercise.id,
        title: exercise.title,
        due,
        points: String(exercise.pointsRedeem),
        status,
        description: exercise.description,
        termAt: countdown?.deadline.toISOString() ?? (hasInvalidDate(exercise.termAt) ? new Date().toISOString() : exercise.termAt),
        isCompletedAnswer: exercise.isCompletedAnswer,
        source: {
            id: exercise.id,
            title: exercise.title,
            description: exercise.description,
            videoUrl: exercise.videoUrl,
            pointsRedeem: exercise.pointsRedeem,
            typeExercise: exercise.typeExercise,
            difficulty: exercise.difficulty,
        },
    }
}

function mapClassRoomToSpotlight(room: IClassRoom): DailyTaskGroupView {
    const roomCountdown = getNearestCountdown([room.targetLimited, ...room.exercises.map((exercise) => exercise.targetLimited)])

    const mappedExercises = [...room.exercises]
        .sort((a, b) => a.indexOrder - b.indexOrder)
        .map((exercise) => mapClassRoomExerciseToTaskCard(exercise, room.targetLimited))

    const isCompleted = mappedExercises.length > 0 && mappedExercises.every((exercise) => exercise.isCompletedAnswer)
    const isExpired = !isCompleted && Boolean(roomCountdown?.expired)

    const due = roomCountdown?.dueText ?? 'Sem prazo definido'
    const status = isCompleted ? 'Concluída' : isExpired ? 'Atrasada' : roomCountdown?.status ?? 'Destaque'

    return {
        id: `class-room-${room.id}`,
        name: room.name,
        title: room.name,
        due,
        points: String(mappedExercises.reduce((total, exercise) => total + Number(exercise.points), 0)),
        status,
        description: `Atividades da ${room.className} com ${mappedExercises.length} exercício(s).`,
        termAt: roomCountdown?.deadline.toISOString() ?? new Date().toISOString(),
        disabled: mappedExercises.length === 0 || isCompleted || isExpired,
        exercises: mappedExercises,
        highlighted: true,
        highlightLabel: roomCountdown ? 'Tempo restante' : 'Nova sala',
    }
}

function resolveClassId(): number | null {
    const profileClassId = profile.value?.class?.id
    if (profileClassId && profileClassId > 0) {
        return profileClassId
    }

    return null
}

async function fetchClassRoomSpotlight() {
    try {
        const classId = resolveClassId()

        if (!classId) {
            classRoomSpotlight.value = null
            return
        }

        const response = await $httpClient.class.GetClassRoomsByClassId(classId)
        const rooms = response.result ?? []

        if (!response.success || rooms.length === 0) {
            classRoomSpotlight.value = null
            return
        }

        classRoomSpotlight.value = rooms[0]
    } catch (error) {
        console.error('Erro ao carregar container destaque da sala:', error)
        classRoomSpotlight.value = null
    }
}

function resetQuizState() {
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}

    for (const question of quizQuestions.value) {
        selectedAnswers.value[question.id] = null

        if (question.typeExercise === 2) {
            selectedCodeAnswers.value[question.id] = ''
        }
    }

    taskResult.value = null
}

function openDailyTask(task: DailyTaskGroupView) {
    if (task.disabled) return

    selectedDailyTask.value = task
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    taskResult.value = null
    currentQuestionIndex.value = 0
    showTaskQuizModal.value = true
}

async function startExerciseQuiz(task: ExerciseCardTask) {
    if (task.isCompletedAnswer) return

    selectedTask.value = task
    quizLoading.value = true

    try {
        const response = await $httpClient.exercise.GetQuizQuestionsForExercise(task.id)
        const options = (response.result ?? []) as IQuizQuestionOption[]

        if (response.success && options.length) {
            quizQuestions.value = buildTaskQuestionsFromOptions(task.source, options)
        } else {
            quizQuestions.value = buildTaskQuestions(task.source)
        }

        resetQuizState()
    } catch (error) {
        console.error('Erro ao carregar questões do exercício:', error)
        toast.error('Erro', 'Não foi possível carregar as questões. Tente novamente mais tarde.', 3500)
        quizQuestions.value = buildTaskQuestions(task.source)
        resetQuizState()
    } finally {
        quizLoading.value = false
    }
}

function backToExercises() {
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null
}

function closeTaskQuiz() {
    showTaskQuizModal.value = false
    selectedDailyTask.value = null
    selectedTask.value = null
    quizLoading.value = false
    quizQuestions.value = []
    selectedAnswers.value = {}
    selectedCodeAnswers.value = {}
    currentQuestionIndex.value = 0
    taskResult.value = null
}

function selectAnswer(questionId: number, optionId: number) {
    selectedAnswers.value[questionId] = optionId
}

function resolveSubmittedOption(question: QuizQuestion) {
    if (question.typeExercise === 2) {
        return -1
    }

    const selectedOptionId = selectedAnswers.value[question.id]
    if (selectedOptionId === null || selectedOptionId === undefined) {
        return -1
    }

    const selectedOption = question.options.find((option) => option.id === selectedOptionId)
    return selectedOption?.optionId ?? selectedOptionId
}

function updateCodeAnswer(questionId: number, answer: string) {
    selectedCodeAnswers.value[questionId] = answer
}

function markExerciseCompletedLocally(exerciseId: number) {
    for (const group of tasks.value) {
        const targetExercise = group.exercises.find((exercise) => exercise.id === exerciseId)

        if (targetExercise) {
            targetExercise.isCompletedAnswer = true
            break
        }
    }

    if (!selectedDailyTask.value) return

    const selectedExercise = selectedDailyTask.value.exercises.find((exercise) => exercise.id === exerciseId)
    if (selectedExercise) {
        selectedExercise.isCompletedAnswer = true
    }

    const allExercisesCompleted = selectedDailyTask.value.exercises.length > 0
        && selectedDailyTask.value.exercises.every((exercise) => exercise.isCompletedAnswer)

    if (allExercisesCompleted) {
        selectedDailyTask.value.disabled = true
        selectedDailyTask.value.status = 'Concluída'
    }

    if (selectedTask.value?.id === exerciseId) {
        selectedTask.value.isCompletedAnswer = true
    }
}

async function finishExercise() {
    if (!selectedTask.value) return

    if (!allQuestionsAnswered.value) {
        toast.warn('Responda todas as questões', 'Preencha todas as respostas antes de finalizar o exercício.', 3000)
        return
    }

    const objectiveQuestions = quizQuestions.value.filter((question) => question.typeExercise !== 2)
    const correct = objectiveQuestions.reduce((acc, question) => {
        return acc + (selectedAnswers.value[question.id] === question.correctOptionId ? 1 : 0)
    }, 0)

    const total = objectiveQuestions.length
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    const gainedPoints = Math.round((selectedTask.value!.source.pointsRedeem * accuracy) / 100)
    const finishedExerciseId = selectedTask.value.id

    taskResult.value = {
        correct,
        total,
        accuracy,
        gainedPoints,
    }

    var payloadSubmitExercise: ISubmitExerciseAnswer[] = quizQuestions.value.map((question) => ({
        exerciseId: selectedTask.value!.source.id,
        questionId: question.id,
        phaseId: selectedTask.value?.source.phaseId ?? 0,
        submissionData: {
            selectedOption: resolveSubmittedOption(question),
            answerText: question.typeExercise === 2 ? (selectedCodeAnswers.value[question.id] ?? '').trim() : undefined,
            isCorrect: question.typeExercise === 2 ? false : selectedAnswers.value[question.id] === question.correctOptionId,
            pointsEarned: question.typeExercise === 2
                ? 0
                : (selectedAnswers.value[question.id] === question.correctOptionId
                    ? Math.round((selectedTask.value!.source.pointsRedeem * accuracy) / 100)
                    : 0),
            submittedAt: new Date(),
        },
    }))

    try {
        var responseAnswer = await $httpClient.exercise.SubmitExerciseAnswers(payloadSubmitExercise);

        if (responseAnswer.success) {
            toast.info('Exercicio Enviado com Sucesso')

            if (payloadSubmitExercise[0]?.submissionData.selectedOption !== -1) {
                var payloadUserPoints = {
                    exerciseId: selectedTask.value.source.id,
                }

                var pointsResponse = await $httpClient.point.AddPointsForUser(payloadUserPoints)
                const awardResult = pointsResponse.result as IPointAwardResult | undefined

                if (!pointsResponse.success || !awardResult) {
                    toast.error('Erro', pointsResponse.errors?.[0] ?? 'Nao foi possivel contabilizar os pontos do exercicio.', 3500)
                } else {
                    if (taskResult.value) {
                        taskResult.value.gainedPoints = awardResult.pointsAwarded
                    }

                    if (awardResult.alreadyAwarded) {
                        toast.info('Pontos ja contabilizados', awardResult.message, 3500)
                    } else if (awardResult.pointsAwarded > 0) {
                        toast.success('Parabens!', awardResult.message, 3500)

                        if (profile.value) {
                            profile.value.pointsQuantity = (profile.value.pointsQuantity ?? 0) + awardResult.pointsAwarded
                        }

                        if (ranking.value) {
                            ranking.value.points += awardResult.pointsAwarded
                        }
                    } else {
                        toast.info('Pontuacao atualizada', awardResult.message, 3500)
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro ao resgatar pontos do exercício:', error)
        toast.error('Erro', 'Não foi possível resgatar os pontos do exercício. Tente novamente mais tarde.', 3500)
    } finally {
        markExerciseCompletedLocally(finishedExerciseId)
    }
}

type UploadProfileImagesPayload = {
    coverFile: File | null
    profileFile: File | null
}

function openUploadCoverAndPicture() {
    showUploadCoverAndPicture.value = true;
}

function openImagePreview(type: 'cover' | 'profile') {
    const coverUrl = profile.value?.coverPictureUrl?.trim()
    const profileUrl = profile.value?.profilePictureUrl?.trim()

    if (type === 'cover') {
        imageViewerSrc.value = coverUrl ? coverUrl : backgroundDefault
        imageViewerTitle.value = 'Capa do perfil'
    } else {
        imageViewerSrc.value = profileUrl ? profileUrl : profileDefault
        imageViewerTitle.value = 'Foto de perfil'
    }

    showImageViewer.value = true
}

function closeImagePreview() {
    showImageViewer.value = false
}

function closeGlobalRanking() {
    showGlobalRanking.value = false
}

function closeGradeRanking() {
    showGradeRanking.value = false
}

async function openRanking() {
    showGlobalRanking.value = true
    isGlobalRankingLoading.value = true

    try {
        const currentUserId = getUserIdFromSession()
        const rankingResponse = await $httpClient.point.GetRanking()

        const rankingList = rankingResponse.result ?? []

        globalRanking.value = rankingList
            .slice()
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((entry, index) => {
                return {
                    position: index + 1,
                    userId: entry.userId,
                    name: entry.name?.trim() ? entry.name : `Aluno ${entry.userId}`,
                    totalPoints: entry.totalPoints,
                    avatarUrl: entry.profilePictureUrl?.trim() ? entry.profilePictureUrl : profileDefault,
                    isCurrentUser: currentUserId?.userId === entry.userId,
                }
            })
    } catch (error) {
        console.error('Erro ao carregar ranking global:', error)
        globalRanking.value = []
        toast.error('Erro', 'Não foi possível carregar o ranking global. Tente novamente mais tarde.', 4000)
    } finally {
        isGlobalRankingLoading.value = false
    }
}

async function openAvailableRanking() {
    showGradeRanking.value = true
    isGradeRankingLoading.value = true

    try {
        const rankingResponse = await $httpClient.point.GetAvailableRankingPerCategory()
        categoryRankings.value = rankingResponse.result ?? []
        console.log("Result: ", categoryRankings.value);


        if (categoryRankings.value.length > 0) {
            selectedGradeCategory.value = categoryRankings.value[0].category
        }
        isGradeRankingLoading.value = false
    } catch (error) {
        console.error('Erro ao carregar ranking por nota:', error)
        categoryRankings.value = []
        toast.error('Erro', 'Não foi possível carregar o ranking por nota. Tente novamente mais tarde.', 4000)
    } finally {
        isGradeRankingLoading.value = false
    }
}

function closeUploadCoverAndPicture() {
    showUploadCoverAndPicture.value = false;
}

function openEditAttributes() {
    editPassword.value = ''
    showEditAttributes.value = true;
}

function closeEditAttributes() {
    editPassword.value = ''
    showEditAttributes.value = false;
}

async function UpdateUserProfile() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para atualizar seu perfil.', 4000)
            loadingPop();
            return;
        }

        var payloadUpdateUser = {
            name: profile.value?.name ?? '',
            bio: profile.value?.bio ?? '',
            email: profile.value?.email ?? '',
            password: editPassword.value.trim(),
            profilePictureUrl: profile.value?.profilePictureUrl ?? '',
            coverPictureUrl: profile.value?.coverPictureUrl ?? '',
            updatedAt: new Date(),
        }

        var response = await $httpClient.user.UpdateProfile(payloadUpdateUser);

        if (response.result == null) {
            toast.error('Erro', 'Não foi possível atualizar os dados do perfil. Tente novamente mais tarde.', 4000)
            return;
        }

        closeEditAttributes();
        editPassword.value = ''
        toast.success('Perfil atualizado', 'Seus dados do perfil foram atualizados com sucesso.', 3000);
    } catch (error) {
        console.error('Erro ao atualizar perfil do usuário:', error)
        toast.error('Erro', 'Não foi possível atualizar os dados do perfil. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(String(reader.result ?? ''))
        }

        reader.onerror = () => {
            reject(new Error('Falha ao converter arquivo para base64.'))
        }

        reader.readAsDataURL(file)
    })
}

async function saveCoverAndProfile(payload: UploadProfileImagesPayload) {
    try {
        if (!profile.value) {
            await fetchUserProfile()
        }

        if (!profile.value) {
            toast.error('Erro', 'Não foi possível carregar os dados do perfil para salvar as imagens.', 4000)
            return
        }

        if (payload.coverFile) {
            profile.value.coverPictureUrl = await fileToDataUrl(payload.coverFile)
        }

        if (payload.profileFile) {
            profile.value.profilePictureUrl = await fileToDataUrl(payload.profileFile)
        }

        await UpdateUserProfile()
        closeUploadCoverAndPicture()
    } catch (error) {
        console.error('Erro ao salvar imagens do perfil:', error)
        toast.error('Erro', 'Não foi possível salvar as imagens de capa e perfil.', 4000)
    }
}

async function fetchRankingUser() {
    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar seu ranking.', 4000)
            await navigateTo('/')
            return null;
        }

        const response = await $httpClient.point.GetRanking();

        if (response.result != null) {
            const rankingList = response.result
                .slice()
                .sort((a, b) => b.totalPoints - a.totalPoints)
            const positionIndex = rankingList.findIndex(r => r.userId === userId.userId);

            if (positionIndex !== -1) {
                const userPosition = positionIndex + 1;
                const userPoints = rankingList[positionIndex].totalPoints;

                let pointsToNext = 0;

                // Se não for o primeiro colocado
                if (positionIndex > 0) {
                    const nextUserPoints = rankingList[positionIndex - 1].totalPoints;
                    pointsToNext = nextUserPoints - userPoints + 1;
                }

                return {
                    position: userPosition,
                    points: userPoints,
                    pointsToNext
                };
            } else {
                console.warn('Usuário não encontrado no ranking');
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error('Erro ao carregar ranking do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados do ranking. Tente novamente mais tarde.', 4000)
        return null;
    }
}

async function fetchUserProfile() {
    loadingPush();

    try {
        const userEnrollment = getUserIdFromSession();

        if (!userEnrollment) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar seu perfil.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.user.GetProfileData(userEnrollment.enrollmentId ?? 0);

        if (response.result != null) {
            profile.value = response.result;
            userBadges.value = response.result.studentBadges;
            await fetchBadgeData();
        }
    } catch (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados do perfil. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

async function fetchBadgeData() {
    try {
        const response = await $httpClient.badge.GetBadges();

        if (response.result != null) {
            const allBadges: IBadge[] = response.result;
            const userBadgeIds = new Set(userBadges.value?.map((badge) => badge.id));
            badgeSlots.value = allBadges.map((badge) => ({
                ...badge,
                unlocked: userBadgeIds.has(badge.id),
            })).sort((a, b) => {
                if (a.unlocked !== b.unlocked) {
                    return a.unlocked ? -1 : 1;
                }

                return a.name.localeCompare(b.name, 'pt-BR');
            });

            await currentStatsUser();
        }
    } catch (error) {
        console.error('Erro ao carregar badges do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados das badges. Tente novamente mais tarde.', 4000)
    }
}

async function currentStatsUser() {
    try {
        const user = getUserIdFromSession();

        if (!user) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar os dados da fase atual.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.phase.GetCurrentModuleUser(user.enrollmentId ?? 0);

        if (response.result != null) {
            currentModule.value = response.result;
            console.log('Fase atual do usuário:', response.result);
        }
    } catch (error) {
        console.error('Erro ao carregar fase atual do usuário:', error)
        toast.error('Erro', 'Não foi possível carregar os dados da fase atual. Tente novamente mais tarde.', 4000)
    }
}

async function randomDailyTasks() {
    loadingPush();

    try {
        const userId = getUserIdFromSession();

        if (!userId) {
            toast.error('Sessão inválida', 'Faça login novamente para carregar as tarefas diárias.', 4000)
            await navigateTo('/')
            return;
        }

        const response = await $httpClient.exercise.GetDailyTasksForPhase(currentModule.value?.id ?? 0);

        if (response.result != null) {
            tasks.value = response.result;
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas diárias:', error)
        toast.error('Erro', 'Não foi possível carregar as tarefas diárias. Tente novamente mais tarde.', 4000)
    } finally {
        loadingPop();
    }
}

async function getAImotivacionalMessage() {
    try {
        const response = await $httpClient.AI.GetMotivationalMessage();

        if (response.message != null) {
            messageMotivacional.value = response.message;
        }
    } catch (error) {
        console.error('Erro ao carregar mensagem motivacional:', error)
    }
}

async function fetchExerciseCategoryGrades() {
    try {
        const response = await $httpClient.exercise.GetExercisesAnsweredCategorieByUser();
        if (response.result != null) {
            exerciseCategoryGrades.value = response.result;
        }
    } catch (error) {
        console.error('Erro ao carregar notas por categoria:', error)
    }
}

async function getAnswersPreview() {
    try {
        const response = await $httpClient.answers.GetAnswersByUserId();

        if (response.result != null) {
            userAnswersPreview.value = response.result;
            newAnswersCount.value = response.result.unreadResponsesCount ?? 0
        }
    } catch (error) {
        console.error('Erro ao carregar prévia de respostas do usuário:', error)
    }
}

async function bootstrapDashboard() {
    const userId = getUserIdFromSession();

    if (userId == null) {
        return;
    }

    const answersPreviewPromise = getAnswersPreview();

    await fetchUserProfile();
    const [userRanking] = await Promise.all([
        fetchRankingUser(),
        fetchClassRoomSpotlight(),
        currentModule.value?.id ? randomDailyTasks() : Promise.resolve(),
        getAImotivacionalMessage(),
        fetchExerciseCategoryGrades(),
        answersPreviewPromise,
    ]);

    ranking.value = userRanking;

    if (!countdownTimer.value) {
        countdownTimer.value = setInterval(() => {
            nowTick.value = Date.now()
        }, 500)
    }
}

onMounted(async () => {
    try {
        await bootstrapDashboard();
    } finally {
        isDashboardHydrating.value = false;
    }
});

onBeforeUnmount(() => {
    if (!countdownTimer.value) return

    clearInterval(countdownTimer.value)
    countdownTimer.value = null
})
</script>

<style scoped lang="scss">
.dashboard-skeleton-block {
    position: relative;
    overflow: hidden;
    background: linear-gradient(90deg, rgba(148, 163, 184, 0.18), rgba(226, 232, 240, 0.28), rgba(148, 163, 184, 0.18));
    background-size: 200% 100%;
    animation: dashboard-skeleton-shimmer 1.4s ease-in-out infinite;
}

.profile-frame {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 1rem;
    padding: 3px;
    background: conic-gradient(from 0deg, #facc15, #d5428c, #7e55dc, #facc15 100%);
    background-size: 200% 200%;
    animation: gradient-move 4s linear infinite;
    display: block;
    pointer-events: none;
    -webkit-mask:
        linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask:
        linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    box-sizing: border-box;
}

.preview-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.45);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1;
    padding: 0.42rem 0.72rem;
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
    z-index: 11;
}

.preview-btn:hover {
    transform: translateY(-1px);
    background: rgba(15, 23, 42, 0.65);
}

.preview-btn-cover {
    position: absolute;
    right: 0.85rem;
    bottom: 0.85rem;
}

.preview-btn-profile {
    position: absolute;
    right: -0.35rem;
    bottom: -0.35rem;
    width: 2rem;
    height: 2rem;
    padding: 0;
}

.image-viewer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.72);
    backdrop-filter: blur(6px);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 1200;
}

.image-viewer-content {
    width: min(920px, 100%);
    max-height: calc(100vh - 2rem);
    border-radius: 1rem;
    background: #fff;
    border: 1px solid #fee2e2;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.global-ranking-content {
    width: min(680px, 100%);
    max-height: calc(100vh - 2rem);
    border-radius: 1rem;
    background: #fff;
    border: 1px solid #fee2e2;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.global-ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #fee2e2;
    background: linear-gradient(90deg, #fff7f7 0%, #fff 70%);
}

.global-ranking-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
}

.global-ranking-subtitle {
    margin-top: 0.15rem;
    font-size: 0.95rem;
    color: #64748b;
}

.global-ranking-body {
    padding: 1rem;
    overflow-y: auto;
    max-height: calc(100vh - 10rem);
}

.global-ranking-compare {
    display: grid;
    gap: 0.65rem;
    margin-bottom: 0.95rem;
    grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
}

.global-ranking-compare-card {
    border: 1px solid #fecdd3;
    background: linear-gradient(160deg, #fff7f9 0%, #fff 85%);
    border-radius: 0.8rem;
    padding: 0.7rem;
}

.global-ranking-compare-label {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #9f1239;
}

.global-ranking-compare-value {
    margin: 0.2rem 0 0;
    font-size: 1rem;
    font-weight: 800;
    color: #be123c;
}

.global-ranking-compare-helper {
    margin: 0.2rem 0 0;
    font-size: 0.7rem;
    line-height: 1.3;
    color: #64748b;
}

.grade-ranking-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(160deg, rgba(15, 23, 42, 0.72), rgba(2, 6, 23, 0.82));
    backdrop-filter: blur(5px);
    display: grid;
    place-items: center;
    padding: 1rem;
    z-index: 1250;
}

.grade-ranking-content {
    width: min(760px, 100%);
    max-height: calc(100vh - 2rem);
    border-radius: 1rem;
    background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
    border: 1px solid #cbd5e1;
    box-shadow: 0 24px 54px rgba(15, 23, 42, 0.38);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.grade-ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.95rem 1rem;
    border-bottom: 1px solid #cbd5e1;
    background: linear-gradient(115deg, #e0f2fe 0%, #dbeafe 45%, #e2e8f0 100%);
}

.grade-ranking-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 800;
    color: #0f172a;
}

.grade-ranking-subtitle {
    margin-top: 0.12rem;
    font-size: 0.86rem;
    color: #475569;
}

.grade-ranking-close {
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    border: 1px solid #94a3b8;
    background: rgba(255, 255, 255, 0.84);
    color: #0f172a;
    cursor: pointer;
}

.grade-ranking-body {
    padding: 0.95rem;
    overflow-y: auto;
    max-height: calc(100vh - 10rem);
}

.grade-ranking-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 0;
    justify-content: center;
    font-size: 0.88rem;
    color: #64748b;
}

.grade-ranking-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.65rem;
    margin-bottom: 1rem;
}

.grade-ranking-summary-card {
    border: 1px solid #bfdbfe;
    border-radius: 0.85rem;
    padding: 0.72rem 0.85rem;
    background: rgba(255, 255, 255, 0.92);
}

.grade-ranking-summary-card--best {
    border-color: #6366f1;
    background: linear-gradient(145deg, #eef2ff, #e0e7ff);
}

.grade-ranking-summary-label {
    margin: 0;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #3b82f6;
}

.grade-ranking-summary-value {
    margin: 0.2rem 0 0;
    font-size: 1rem;
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.grade-ranking-summary-sub {
    margin: 0.15rem 0 0;
    font-size: 0.7rem;
    color: #64748b;
}

.grade-ranking-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.85rem;
}

.grade-ranking-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border: 1px solid #cbd5e1;
    border-radius: 999px;
    padding: 0.3rem 0.7rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.18s ease;
}

.grade-ranking-tab:hover {
    border-color: #93c5fd;
    background: #eff6ff;
    color: #1d4ed8;
}

.grade-ranking-tab--active {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #dbeafe, #eff6ff);
    color: #1d4ed8;
    font-weight: 700;
}

.grade-ranking-tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.15rem;
    height: 1.15rem;
    border-radius: 999px;
    background: #bfdbfe;
    color: #1d4ed8;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 0 0.25rem;
}

.grade-ranking-tab--active .grade-ranking-tab-badge {
    background: #3b82f6;
    color: #fff;
}

.grade-ranking-list {
    display: grid;
    gap: 0.45rem;
}

.grade-ranking-row {
    display: flex;
    align-items: center;
    gap: 0.72rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.8rem;
    padding: 0.55rem 0.7rem;
    background: rgba(248, 250, 252, 0.9);
    transition: border-color 0.15s ease;
}

.grade-ranking-row-first {
    border-color: #fbbf24;
    background: linear-gradient(95deg, #fffbeb, #fef9c3);
}

.grade-ranking-row-highlight {
    border-color: #60a5fa;
    background: linear-gradient(90deg, rgba(191, 219, 254, 0.55), rgba(224, 242, 254, 0.55));
}

.grade-ranking-position {
    min-width: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.grade-ranking-medal {
    font-size: 1.2rem;
    line-height: 1;
}

.grade-ranking-position-num {
    font-size: 0.74rem;
    font-weight: 700;
    color: #1e3a8a;
}

.grade-ranking-avatar {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 999px;
    border: 1px solid #93c5fd;
    object-fit: cover;
    background: #fff;
    flex-shrink: 0;
}

.grade-ranking-score-block {
    text-align: right;
    flex-shrink: 0;
    min-width: 3.5rem;
}

.grade-ranking-score {
    margin: 0;
    font-size: 0.92rem;
    font-weight: 800;
    color: #1e40af;
    line-height: 1;
}

.grade-ranking-bar-track {
    margin-top: 0.25rem;
    height: 3px;
    border-radius: 999px;
    background: #e0e7ff;
    overflow: hidden;
}

.grade-ranking-bar-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #60a5fa, #6366f1);
    transition: width 0.4s ease;
}

.grade-ranking-empty {
    padding: 1.25rem 0;
    text-align: center;
    font-size: 0.88rem;
    color: #94a3b8;
}

.global-ranking-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: 1px solid #fee2e2;
    border-radius: 0.85rem;
    padding: 0.55rem 0.65rem;
    background: #fff;
}

.global-ranking-row-highlight {
    border-color: #fb7185;
    background: #fff1f2;
}

.global-ranking-position {
    min-width: 2.2rem;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #be123c;
}

.global-ranking-avatar {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 999px;
    border: 1px solid #fecdd3;
    object-fit: cover;
    background: #fff;
}

.image-viewer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid #fee2e2;
    background: linear-gradient(90deg, #fff7f7 0%, #fff 70%);
}

.image-viewer-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
}

.image-viewer-close {
    width: 2rem;
    height: 2rem;
    border: 1px solid #fecaca;
    border-radius: 999px;
    background: #fff;
    color: #be123c;
    cursor: pointer;
}

.image-viewer-image {
    width: 100%;
    max-height: calc(100vh - 8rem);
    object-fit: contain;
    background: radial-gradient(circle at top, #fff8f1, #fff 55%);
}

.image-viewer-fade-enter-active,
.image-viewer-fade-leave-active {
    transition: opacity 0.2s ease;
}

.image-viewer-fade-enter-from,
.image-viewer-fade-leave-to {
    opacity: 0;
}

@keyframes gradient-move {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 120% 80%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes dashboard-skeleton-shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.medal-idle {
    animation: medalFloat 1.6s ease-in-out infinite;
    will-change: transform;
}

@keyframes medalFloat {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-3px);
    }
}

@keyframes ranking-pulse {

    0%,
    100% {
        box-shadow: 0 10px 24px rgba(244, 63, 94, 0.22);
    }

    50% {
        box-shadow: 0 14px 30px rgba(244, 63, 94, 0.34);
    }
}

@keyframes ranking-shine {
    0% {
        transform: translateX(-170%) rotate(24deg);
    }

    100% {
        transform: translateX(330%) rotate(24deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .dashboard-skeleton-block {
        animation: none;
    }

    .medal-idle {
        animation: none;
    }

    .ranking-cta,
    .ranking-cta__shine {
        animation: none;
    }
}
</style>
