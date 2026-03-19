import { useRuntimeConfig } from '#imports'
import { ref, readonly, onUnmounted } from 'vue'
import { getLoggedUser, getToken, verifyToken } from './useAuth'

type PresenceServerMessage =
  | { type: 'presence:hello'; userId: string; isOnline: boolean; lastSeenAt: string }
  | { type: 'presence:update'; userId: string; isOnline: boolean; lastSeenAt: string }
  | { type: 'presence:reset' }
  | { type: 'presence:error'; message: string }
  | { type: 'ping' }

export type PresenceState = {
  userId: string
  isOnline: boolean
  lastSeenAt: string
}

type PresenceListener = (message: PresenceServerMessage) => void

const WS_PROTOCOL = 'portal-aluno-presence.v1'
const TICKET_PREFIX = 'presence-ticket.'
const HEARTBEAT_INTERVAL_MS = 25_000
const PRESENCE_STALE_AFTER_MS = 90_000
const RECONNECT_BASE_MS = 29_000
const RECONNECT_MAX_MS = 30_000
const IMMEDIATE_CLOSE_WINDOW_MS = 5_000
const IMMEDIATE_CLOSE_STRIKES_LIMIT = 4
const HTTP_ONLY_COOLDOWN_MS = 5 * 60_000

const presenceMap = ref<Map<string, PresenceState>>(new Map())
const connected = ref(false)

let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0
let shouldRun = false
let connectionId = 0
let openSocketInFlight: Promise<void> | null = null
let fallbackUntil = 0
let fallbackTimer: ReturnType<typeof setTimeout> | null = null
let immediateCloseStrikes = 0
let socketAttemptStartedAt = 0

const listeners = new Set<PresenceListener>()

function normalizePresenceKey(value: unknown): string {
  return String(value ?? '').trim().toLowerCase()
}

function getCurrentUserPresenceKeys(): string[] {
  const loggedUser = getLoggedUser()
  const keys = [
    normalizePresenceKey(loggedUser?.id),
    normalizePresenceKey(loggedUser?.email),
  ].filter(Boolean)

  return Array.from(new Set(keys))
}

function getPresenceLookupKeys(userId: string): string[] {
  const normalized = normalizePresenceKey(userId)
  const keys = [normalized]

  const currentUserKeys = getCurrentUserPresenceKeys()
  if (currentUserKeys.includes(normalized)) {
    keys.push(...currentUserKeys)
  }

  return Array.from(new Set(keys.filter(Boolean)))
}

function emit(message: PresenceServerMessage) {
  for (const listener of listeners) {
    listener(message)
  }
}

function isFreshPresence(isOnline: boolean, lastSeenAt: string) {
  if (!isOnline) return false

  const timestamp = Date.parse(lastSeenAt)
  if (!Number.isFinite(timestamp)) return false

  return Date.now() - timestamp <= PRESENCE_STALE_AFTER_MS
}

function applyPresenceMessage(message: Extract<PresenceServerMessage, { type: 'presence:hello' | 'presence:update' }>) {
  const next = new Map(presenceMap.value)
  const normalizedMessageUserId = normalizePresenceKey(message.userId)
  const state = {
    userId: message.userId,
    isOnline: isFreshPresence(message.isOnline, message.lastSeenAt),
    lastSeenAt: message.lastSeenAt,
  }

  for (const key of getPresenceLookupKeys(normalizedMessageUserId)) {
    next.set(key, state)
  }

  presenceMap.value = next
}

function notify(message: PresenceServerMessage) {
  if (message.type === 'presence:hello' || message.type === 'presence:update') {
    applyPresenceMessage(message)
  } else if (message.type === 'presence:reset') {
    presenceMap.value = new Map()
  }

  emit(message)
}

function pruneStalePresence() {
  const next = new Map(presenceMap.value)
  const expiredStates: PresenceServerMessage[] = []

  for (const [userId, state] of next.entries()) {
    if (!state.isOnline || isFreshPresence(state.isOnline, state.lastSeenAt)) {
      continue
    }

    const updatedState = {
      ...state,
      isOnline: false,
    }

    next.set(userId, updatedState)
    expiredStates.push({
      type: 'presence:update',
      userId,
      isOnline: false,
      lastSeenAt: state.lastSeenAt,
    })
  }

  if (expiredStates.length === 0) return

  presenceMap.value = next
  for (const message of expiredStates) {
    emit(message)
  }
}

function clearTimers() {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }

  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}

function clearFallbackTimer() {
  if (fallbackTimer !== null) {
    clearTimeout(fallbackTimer)
    fallbackTimer = null
  }
}

function isHttpOnlyFallbackActive(now = Date.now()) {
  return fallbackUntil > now
}

function resetFallbackState() {
  fallbackUntil = 0
  immediateCloseStrikes = 0
  clearFallbackTimer()
}

function scheduleFallbackExit() {
  clearFallbackTimer()
  if (!shouldRun || !isHttpOnlyFallbackActive()) return

  fallbackTimer = setTimeout(() => {
    fallbackTimer = null
    if (!isHttpOnlyFallbackActive()) {
      resetFallbackState()
    }
    if (!shouldRun) return
    void openSocket()
  }, Math.max(0, fallbackUntil - Date.now()))
}

function enterHttpOnlyFallback() {
  fallbackUntil = Date.now() + HTTP_ONLY_COOLDOWN_MS
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  scheduleFallbackExit()
}

function buildWsUrl(): string {
  const { public: { apiBaseUrl, presenceWsUrl, wsUrl } } = useRuntimeConfig()
  const explicit = (
    presenceWsUrl
    || wsUrl
  )?.trim()

  if (explicit) return explicit

  if (!import.meta.client) {
    return ''
  }

  const apiBase = apiBaseUrl.trim()
  const url = new URL(apiBase, window.location.origin)
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const basePath = url.pathname.endsWith('/api')
    ? url.pathname.slice(0, -4)
    : url.pathname
  const wsPath = `${basePath}/ws/presence`.replace(/\/{2,}/g, '/')
  return `${protocol}//${url.host}${wsPath}`
}

function buildPresenceApiUrl(path: string): string {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  if (!import.meta.client) {
    return ''
  }

  const apiBase = apiBaseUrl.trim()
  const apiUrl = new URL(apiBase, window.location.origin)
  const basePath = apiUrl.pathname.replace(/\/$/, '')
  const apiPath = basePath.endsWith('/api') ? basePath : `${basePath}/api`
  return `${apiUrl.origin}${apiPath}${path}`
}

function buildTicketUrl(): string {
  return buildPresenceApiUrl('/presence/socket-ticket')
}

function buildHeartbeatUrl(): string {
  return buildPresenceApiUrl('/presence/heartbeat')
}

async function postPresenceRequest(url: string): Promise<Record<string, unknown>> {
  if (!url) {
    throw new Error('Presence URL is not configured')
  }

  const token = getToken()
  if (!token) throw new Error('No auth token')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: '{}',
  })

  if (!response.ok) {
    throw new Error(`Presence request failed: ${response.status}`)
  }

  return await response.json() as Record<string, unknown>
}

async function fetchTicket(): Promise<string> {
  const data = await postPresenceRequest(buildTicketUrl())
  return String(data.ticket ?? '')
}

async function sendHeartbeat(): Promise<string | null> {
  try {
    const data = await postPresenceRequest(buildHeartbeatUrl())
    return String((data as { lastSeenAt?: string }).lastSeenAt ?? '')
  } catch {
    return null
  }
}

function markCurrentUserOnline(lastSeenAt = new Date().toISOString()) {
  const loggedUser = getLoggedUser()
  const userId = normalizePresenceKey(loggedUser?.id)
  const email = normalizePresenceKey(loggedUser?.email)
  const primaryKey = userId || email
  if (!primaryKey) return

  notify({
    type: 'presence:update',
    userId: primaryKey,
    isOnline: true,
    lastSeenAt,
  })
}

function hasOpenSocket() {
  return socket?.readyState === WebSocket.OPEN
}

function isSocketConnecting() {
  return socket?.readyState === WebSocket.CONNECTING
}

function sendWsHeartbeat() {
  if (!hasOpenSocket()) return

  try {
    socket!.send(JSON.stringify({ type: 'presence:heartbeat' }))
  } catch {
    // Ignore send errors
  }
}

function runHeartbeatCycle() {
  pruneStalePresence()

  if (hasOpenSocket()) {
    sendWsHeartbeat()
    return
  }

  void sendHeartbeat().then((lastSeenAt) => {
    if (lastSeenAt) {
      markCurrentUserOnline(lastSeenAt)
    }
  })
}

function scheduleReconnect() {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
  }

  if (!shouldRun || !verifyToken()) return

  if (isHttpOnlyFallbackActive()) {
    scheduleFallbackExit()
    return
  }

  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS)
  reconnectAttempt += 1

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void openSocket()
  }, delay)
}

async function openSocket() {
  if (openSocketInFlight) {
    return openSocketInFlight
  }

  openSocketInFlight = openSocketInternal()

  try {
    await openSocketInFlight
  } finally {
    openSocketInFlight = null
  }
}

async function openSocketInternal() {
  if (!import.meta.client) return
  if (!shouldRun || !verifyToken()) return
  if (isHttpOnlyFallbackActive()) {
    scheduleFallbackExit()
    return
  }
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return

  const myId = ++connectionId

  let ticket: string
  try {
    ticket = await fetchTicket()
  } catch {
    scheduleReconnect()
    return
  }

  if (!ticket || !shouldRun || myId !== connectionId) return

  const wsUrl = buildWsUrl()
  if (!wsUrl) {
    scheduleReconnect()
    return
  }

  const ws = new WebSocket(wsUrl, [
    WS_PROTOCOL,
    `${TICKET_PREFIX}${ticket}`,
  ])

  socketAttemptStartedAt = Date.now()
  socket = ws

  ws.addEventListener('open', () => {
    if (socket !== ws) return

    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }

    connected.value = true
    reconnectAttempt = 0
    fallbackUntil = 0
    clearFallbackTimer()

    notify({ type: 'presence:reset' })
    markCurrentUserOnline()
    runHeartbeatCycle()
  })

  ws.addEventListener('message', (event) => {
    if (socket !== ws) return

    try {
      const message = JSON.parse(event.data as string) as PresenceServerMessage
      if (message.type === 'ping') {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'pong' }))
        }
        return
      }
      notify(message)
    } catch {
      // Ignore malformed payloads.
    }
  })

  ws.addEventListener('close', (event) => {
    if (socket === ws) {
      socket = null
      connected.value = false
    }

    const connectedForMs =
      socketAttemptStartedAt > 0 ? Date.now() - socketAttemptStartedAt : Number.POSITIVE_INFINITY
    socketAttemptStartedAt = 0

    if (connectedForMs < IMMEDIATE_CLOSE_WINDOW_MS) {
      immediateCloseStrikes += 1
    } else {
      immediateCloseStrikes = 0
    }

    if (immediateCloseStrikes >= IMMEDIATE_CLOSE_STRIKES_LIMIT) {
      enterHttpOnlyFallback()
      return
    }

    scheduleReconnect()
  })

  ws.addEventListener('error', () => {
    if (socket === ws) {
      ws.close()
    }
  })
}

export function connectPresence() {
  if (shouldRun) return

  shouldRun = true
  reconnectAttempt = 0

  if (heartbeatTimer === null) {
    heartbeatTimer = setInterval(runHeartbeatCycle, HEARTBEAT_INTERVAL_MS)
  }

  if (isHttpOnlyFallbackActive()) {
    runHeartbeatCycle()
  }
  void openSocket()
}

export function disconnectPresence() {
  shouldRun = false
  connectionId += 1
  socketAttemptStartedAt = 0
  resetFallbackState()
  clearTimers()

  if (socket) {
    const ws = socket
    socket = null
    ws.close()
  }

  connected.value = false
  notify({ type: 'presence:reset' })
}

export function getPresenceSnapshot(): PresenceState[] {
  pruneStalePresence()
  return Array.from(presenceMap.value.values())
}

export function isUserOnline(userId: string): boolean {
  pruneStalePresence()

  for (const key of getPresenceLookupKeys(userId)) {
    const state = presenceMap.value.get(key)
    if (state) {
      return state.isOnline
    }
  }

  return false
}

export function getUserLastSeen(userId: string): string | null {
  for (const key of getPresenceLookupKeys(userId)) {
    const state = presenceMap.value.get(key)
    if (state) {
      return state.lastSeenAt
    }
  }

  return null
}

export function usePresence() {
  const onPresenceUpdate = (listener: PresenceListener) => {
    listeners.add(listener)
    onUnmounted(() => listeners.delete(listener))
  }

  return {
    presenceMap: readonly(presenceMap),
    isConnected: readonly(connected),
    isUserOnline,
    getUserLastSeen,
    getPresenceSnapshot,
    onPresenceUpdate,
    connect: connectPresence,
    disconnect: disconnectPresence,
  }
}
