import type { FetchOptions } from 'ofetch'
import ClientService from '~/infra/clientService'
import type { ApiResponse } from '~/infra/response/apiResponse'

export interface IJoinTeamPayload {
  classId: number
  moduleId: number
  name: string
  description?: string
  clanColor: string
  boatName: string
  userIds: number[]
}

export interface IFinalChallengerTeams {
  clanName: string
  clanDescription: string
  clanColor: string
  boatName: string
  members: {
    userId: number
    userName: string
    userEmail: string
    userAvatarUrl: string
    isCurrentUser: boolean
  }[]
}

export interface IFinalChallengeEventWindow {
  eventId: number
  title: string
  moduleName: string
  className: string
  status: 'scheduled' | 'active' | 'closed'
  startsAt: string
  endsAt: string
  serverTime: string
  refreshIntervalSeconds: number
  updateMode: 'polling' | 'signalr'
}

export interface IFinalChallengeClan {
  clanId: number
  name: string
  motto: string
  color: string
  boatName: string
  membersCount: number
  solvedCount: number
  totalScore: number
  averageAiScore: number
  averageResolutionSeconds: number
  progressPercent: number
  distanceToFinishPercent: number
  currentCheckpoint: string
  x: number
  y: number
  isCurrentUserClan: boolean
  streak: number
}

export interface IFinalChallengeTask {
  challengeId: number
  title: string
  category: string
  briefing?: string | null
  difficulty: 'easy' | 'medium' | 'hard' | 'boss'
  status: 'locked' | 'open' | 'submitted' | 'validated'
  scoreWeight: number
  deadlineAt: string
  bestSubmissionAt?: string | null
  aiScore?: number | null
}

export interface IFinalChallengeFeedItem {
  id: string
  clanId: number
  clanName: string
  type: 'submission' | 'validated' | 'bonus' | 'penalty' | 'lead-change'
  title: string
  description: string
  happenedAt: string
}

export interface IFinalChallengeSummary {
  totalClans: number
  totalParticipants: number
  totalChallenges: number
  validatedSubmissions: number
  currentUserClanRank: number
  currentUserClanScore: number
}

export interface IFinalChallengeSnapshot {
  event: IFinalChallengeEventWindow
  summary: IFinalChallengeSummary
  clans: IFinalChallengeClan[]
  tasks: IFinalChallengeTask[]
  feed: IFinalChallengeFeedItem[]
}

export interface ISubmitFinalChallengePayload {
  eventId: number
  challengeId: number
  answer: string
  attachments?: string[]
}

export interface ISubmitFinalChallengeResult {
  submissionId: number
  status: 'queued' | 'processing' | 'validated'
  message: string
}

export default class FinalChallengeService extends ClientService<any> {
  constructor() {
    super('FinalChallenge', 'api/FinalChallenge')
  }

  GetLiveSnapshot = async (
    eventId?: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IFinalChallengeSnapshot>> => {
    const query = typeof eventId === 'number' ? `?eventId=${eventId}` : ''

    return (await this.fetchInstance(`${this.address}/GetLiveSnapshot${query}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IFinalChallengeSnapshot>
  }

  GetLeaderboard = async (
    eventId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IFinalChallengeClan[]>> => {
    return (await this.fetchInstance(`${this.address}/GetLeaderboard?eventId=${eventId}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IFinalChallengeClan[]>
  }

  GetClanTasks = async (
    eventId: number,
    clanId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IFinalChallengeTask[]>> => {
    return (await this.fetchInstance(
      `${this.address}/GetClanTasks?eventId=${eventId}&clanId=${clanId}`,
      {
        method: 'GET',
        ...config,
      },
    )) as ApiResponse<IFinalChallengeTask[]>
  }

  GetActivityFeed = async (
    eventId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IFinalChallengeFeedItem[]>> => {
    return (await this.fetchInstance(`${this.address}/GetActivityFeed?eventId=${eventId}`, {
      method: 'GET',
      ...config,
    })) as ApiResponse<IFinalChallengeFeedItem[]>
  }

  SubmitAnswer = async (
    payload: ISubmitFinalChallengePayload,
    config: FetchOptions = {},
  ): Promise<ApiResponse<ISubmitFinalChallengeResult>> => {
    return (await this.fetchInstance(`${this.address}/SubmitAnswer`, {
      method: 'POST',
      body: payload,
      ...config,
    })) as ApiResponse<ISubmitFinalChallengeResult>
  }

  GetTeamForPlayerRelationship = async (
    classId: number,
    moduleId: number,
    config: FetchOptions = {},
  ): Promise<ApiResponse<IFinalChallengerTeams | IFinalChallengerTeams[]>> => {
    return (await this.fetchInstance(
      `${this.address}/GetTeamForPlayerRelationship?classId=${classId}&moduleId=${moduleId}`,
      {
        method: 'GET',
        ...config,
      },
    )) as ApiResponse<IFinalChallengerTeams | IFinalChallengerTeams[]>
  }

  JoinTeam = async (structureJoin: IJoinTeamPayload, config: FetchOptions = {}) => {
    return (await this.fetchInstance(`${this.address}/JoinTeam`, {
      method: 'POST',
      body: structureJoin,
      ...config,
    })) as ApiResponse<void>
  }
}
