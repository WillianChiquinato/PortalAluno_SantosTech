import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type {
  IFinalChallengeClan,
  IFinalChallengeFeedItem,
  IFinalChallengeSnapshot,
  IFinalChallengeTask,
} from '~/infra/interfaces/services/finalChallenge'

const mockNow = '2026-05-19T18:00:00.000Z'

const mockSnapshot: IFinalChallengeSnapshot = {
  event: {
    eventId: 14,
    title: 'Guerra dos Clas',
    moduleName: 'Modulo 05 - Front + IA',
    className: 'Turma Alpha 2026',
    status: 'active',
    startsAt: '2026-05-19T08:00:00.000Z',
    endsAt: '2026-05-26T22:00:00.000Z',
    serverTime: mockNow,
    refreshIntervalSeconds: 40,
    updateMode: 'polling',
  },
  summary: {
    totalClans: 4,
    totalParticipants: 28,
    totalChallenges: 8,
    validatedSubmissions: 17,
    currentUserClanRank: 2,
    currentUserClanScore: 840,
  },
  clans: [
    {
      clanId: 1,
      name: 'Mares de Codigo',
      motto: 'Compilar, navegar e dominar.',
      color: '#0f766e',
      boatName: 'TS Leviathan',
      membersCount: 7,
      solvedCount: 5,
      totalScore: 910,
      averageAiScore: 92,
      averageResolutionSeconds: 1180,
      progressPercent: 78,
      distanceToFinishPercent: 22,
      currentCheckpoint: 'Fortaleza do Boss',
      x: 76,
      y: 24,
      isCurrentUserClan: false,
      streak: 3,
    },
    {
      clanId: 2,
      name: 'Byte Raiders',
      motto: 'Velocidade com precisao.',
      color: '#b91c1c',
      boatName: 'Red Kraken',
      membersCount: 8,
      solvedCount: 5,
      totalScore: 840,
      averageAiScore: 89,
      averageResolutionSeconds: 1105,
      progressPercent: 73,
      distanceToFinishPercent: 27,
      currentCheckpoint: 'Canal das Provas',
      x: 68,
      y: 38,
      isCurrentUserClan: true,
      streak: 2,
    },
    {
      clanId: 3,
      name: 'Prompt Pirates',
      motto: 'Estrutura boa vence pressa.',
      color: '#1d4ed8',
      boatName: 'Azure Tide',
      membersCount: 6,
      solvedCount: 4,
      totalScore: 790,
      averageAiScore: 94,
      averageResolutionSeconds: 1340,
      progressPercent: 65,
      distanceToFinishPercent: 35,
      currentCheckpoint: 'Arrecife Neural',
      x: 58,
      y: 52,
      isCurrentUserClan: false,
      streak: 1,
    },
    {
      clanId: 4,
      name: 'Stack Storm',
      motto: 'Sem bug, sem perdao.',
      color: '#7c3aed',
      boatName: 'Stormbreaker',
      membersCount: 7,
      solvedCount: 3,
      totalScore: 640,
      averageAiScore: 84,
      averageResolutionSeconds: 1605,
      progressPercent: 49,
      distanceToFinishPercent: 51,
      currentCheckpoint: 'Ilha dos Testes',
      x: 46,
      y: 66,
      isCurrentUserClan: false,
      streak: 0,
    },
  ],
  tasks: [
    {
      challengeId: 101,
      title: 'API colaborativa com ranking em tempo real',
      category: 'Backend',
      briefing:
        'Construa uma API que consolide ranking, feed e estado do desafio em uma chamada. O foco aqui e modelagem limpa, regras de desempate e resposta consistente para atualizacao em tempo real.',
      difficulty: 'hard',
      status: 'validated',
      scoreWeight: 240,
      deadlineAt: '2026-05-21T23:59:00.000Z',
      bestSubmissionAt: '2026-05-19T14:32:00.000Z',
      aiScore: 94,
    },
    {
      challengeId: 102,
      title: 'Refatorar painel do professor com foco em UX',
      category: 'Frontend',
      briefing:
        'Redesenhe o painel do professor priorizando leitura de status, tomada de decisao rapida e navegacao clara entre grupos, pontuacao e pendencias.',
      difficulty: 'medium',
      status: 'submitted',
      scoreWeight: 170,
      deadlineAt: '2026-05-22T23:59:00.000Z',
      bestSubmissionAt: '2026-05-19T17:05:00.000Z',
      aiScore: 88,
    },
    {
      challengeId: 103,
      title: 'Pipeline de avaliacao por IA com explicabilidade',
      category: 'IA',
      briefing:
        'Monte um fluxo de avaliacao com IA que devolva score, justificativa e trilha de auditoria. A prioridade e explicar o porque de cada nota e permitir revisao humana.',
      difficulty: 'boss',
      status: 'open',
      scoreWeight: 320,
      deadlineAt: '2026-05-24T23:59:00.000Z',
      bestSubmissionAt: null,
      aiScore: null,
    },
    {
      challengeId: 104,
      title: 'Observabilidade de fila e retentativas',
      category: 'DevOps',
      briefing:
        'Projete monitoramento para fila de validacao com metricas, alertas e retentativas seguras. O desafio pede foco em falhas intermitentes, rastreabilidade e SLAs.',
      difficulty: 'medium',
      status: 'open',
      scoreWeight: 150,
      deadlineAt: '2026-05-25T23:59:00.000Z',
      bestSubmissionAt: null,
      aiScore: null,
    },
  ],
  feed: [
    {
      id: 'feed-1',
      clanId: 1,
      clanName: 'Mares de Codigo',
      type: 'lead-change',
      title: 'Virada no ranking',
      description: 'O cla assumiu a lideranca apos validar o desafio de backend.',
      happenedAt: '2026-05-19T17:42:00.000Z',
    },
    {
      id: 'feed-2',
      clanId: 2,
      clanName: 'Byte Raiders',
      type: 'validated',
      title: 'Validacao confirmada',
      description: 'A IA aprovou a entrega do painel do professor com score 88.',
      happenedAt: '2026-05-19T17:05:00.000Z',
    },
    {
      id: 'feed-3',
      clanId: 3,
      clanName: 'Prompt Pirates',
      type: 'bonus',
      title: 'Bonus de consistencia',
      description: 'Tres entregas consecutivas sem retrabalho renderam bonus.',
      happenedAt: '2026-05-19T16:18:00.000Z',
    },
    {
      id: 'feed-4',
      clanId: 4,
      clanName: 'Stack Storm',
      type: 'submission',
      title: 'Nova submissao enviada',
      description: 'O desafio de observabilidade entrou na fila de avaliacao.',
      happenedAt: '2026-05-19T15:51:00.000Z',
    },
  ],
}

function formatRelativeRank(rank: number) {
  if (rank === 1) {
    return 'Lider da semana'
  }

  return `${rank}o lugar`
}

export function useFinalChallenge(eventId?: number) {
  const { $httpClient } = useNuxtApp()
  const snapshot = ref<IFinalChallengeSnapshot | null>(null)
  const isLoading = ref(true)
  const isRefreshing = ref(false)
  let refreshTimer: ReturnType<typeof setInterval> | null = null

  const clans = computed<IFinalChallengeClan[]>(() => snapshot.value?.clans ?? [])
  const tasks = computed<IFinalChallengeTask[]>(() => snapshot.value?.tasks ?? [])
  const feed = computed<IFinalChallengeFeedItem[]>(() => snapshot.value?.feed ?? [])
  const currentClan = computed(() => clans.value.find((clan) => clan.isCurrentUserClan) ?? null)
  const leaderboard = computed(() =>
    [...clans.value].sort((left, right) => right.totalScore - left.totalScore),
  )

  const countdownLabel = computed(() => {
    if (!snapshot.value) {
      return '--'
    }

    const now = new Date(snapshot.value.event.serverTime).getTime()
    const end = new Date(snapshot.value.event.endsAt).getTime()
    const distance = Math.max(end - now, 0)
    const totalMinutes = Math.floor(distance / 60000)
    const days = Math.floor(totalMinutes / 1440)
    const hours = Math.floor((totalMinutes % 1440) / 60)
    const minutes = totalMinutes % 60

    return `${days}d ${hours}h ${minutes}m`
  })

  const summaryCards = computed(() => {
    if (!snapshot.value || !currentClan.value) {
      return []
    }

    return [
      {
        label: 'Posicao atual',
        value: formatRelativeRank(snapshot.value.summary.currentUserClanRank),
        helper: `Score ${currentClan.value.totalScore} pts`,
      },
      {
        label: 'Desafios validados',
        value: `${currentClan.value.solvedCount}/${snapshot.value.summary.totalChallenges}`,
        helper: `${snapshot.value.summary.validatedSubmissions} validacoes no evento`,
      },
      {
        label: 'Ritmo medio',
        value: `${Math.round(currentClan.value.averageResolutionSeconds / 60)} min`,
        helper: `Score IA medio ${currentClan.value.averageAiScore}`,
      },
    ]
  })

  async function loadSnapshot(options?: { silent?: boolean }) {
    const silent = options?.silent ?? false

    if (!silent) {
      isLoading.value = true
    } else {
      isRefreshing.value = true
    }

    try {
      const response = await $httpClient.finalChallenge.GetLiveSnapshot(eventId)

      if (!response?.success || !response.result) {
        throw new Error(response?.errors?.join(', ') || 'Snapshot vazio.')
      }

      snapshot.value = response.result
    } catch (error) {
      console.error('Erro ao carregar desafio final:', error)
    } finally {
      isLoading.value = false
      isRefreshing.value = false
    }
  }

  function startAutoRefresh() {
    const seconds = snapshot.value?.event.refreshIntervalSeconds ?? 40

    if (refreshTimer) {
      clearInterval(refreshTimer)
    }

    refreshTimer = setInterval(() => {
      loadSnapshot({ silent: true })
    }, seconds * 1000)
  }

  onMounted(async () => {
    await loadSnapshot()
    startAutoRefresh()
  })

  onBeforeUnmount(() => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
  })

  return {
    snapshot,
    clans,
    tasks,
    feed,
    leaderboard,
    currentClan,
    summaryCards,
    countdownLabel,
    isLoading,
    isRefreshing,
    loadSnapshot,
  }
}
