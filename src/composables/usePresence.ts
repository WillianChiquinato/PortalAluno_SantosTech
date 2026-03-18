import { ref, readonly, onUnmounted } from 'vue'
import { getLoggedUser, getToken, verifyToken } from './useAuth'

type PresenceServerMessage =
  | { type: 'presence:hello'; userId: string; isOnline: boolean; lastSeenAt: string }
  | { type: 'presence:update'; userId: string; isOnline: boolean; lastSeenAt: string }
  | { type: 'presence:reset' }
  | { type: 'presence:error'; message: string }

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
const RECONNECT_BASE_MS = 2_000
const RECONNECT_MAX_MS = 30_000

const presenceMap = ref<Map<string, PresenceState>>(new Map())
const connected = ref(false)

let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0
let shouldRun = false
let connectionId = 0
let apiHeartbeatInFlight = false

const listeners = new Set<PresenceListener>()

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
  next.set(message.userId, {
    userId: message.userId,
    isOnline: isFreshPresence(message.isOnline, message.lastSeenAt),
    lastSeenAt: message.lastSeenAt,
  })
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

function buildWsUrl(): string {
  const explicit = (
    (import.meta.env.VITE_PRESENCE_WS_URL as string | undefined)
    ?? (import.meta.env.VITE_WS_URL as string | undefined)
  )?.trim()

  if (explicit) return explicit

  const apiBase = import.meta.env.VITE_API_BASE_URL as string
  const url = new URL(apiBase, window.location.origin)
  const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
  const basePath = url.pathname.endsWith('/api')
    ? url.pathname.slice(0, -4)
    : url.pathname
  const wsPath = `${basePath}/ws/presence`.replace(/\/{2,}/g, '/')
  return `${protocol}//${url.host}${wsPath}`
}

function buildPresenceApiUrl(path: string): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string
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

function updateCurrentUserFromHeartbeat(lastSeenAt: string) {
  const loggedUser = getLoggedUser()
  const userId = String(loggedUser?.id ?? '').trim()
  if (!userId) return

  notify({
    type: 'presence:update',
    userId,
    isOnline: true,
    lastSeenAt,
  })
}

function sendWsHeartbeat() {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'presence:heartbeat' }))
  }
}

async function sendApiHeartbeat() {
  if (!shouldRun || !verifyToken() || apiHeartbeatInFlight) return

  apiHeartbeatInFlight = true
  try {
    const data = await postPresenceRequest(buildHeartbeatUrl())
    const lastSeenAt = typeof data.lastSeenAt === 'string'
      ? data.lastSeenAt
      : new Date().toISOString()

    updateCurrentUserFromHeartbeat(lastSeenAt)
  } catch {
    // Keep presence best-effort when HTTP heartbeat fails.
  } finally {
    apiHeartbeatInFlight = false
  }
}

function runHeartbeatCycle() {
  pruneStalePresence()
  sendWsHeartbeat()
  void sendApiHeartbeat()
}

function scheduleReconnect() {
  if (reconnectTimer !== null) {
    clearTimeout(reconnectTimer)
  }

  if (!shouldRun || !verifyToken()) return

  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS)
  reconnectAttempt += 1

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void openSocket()
  }, delay)
}

async function openSocket() {
  if (!shouldRun || !verifyToken()) return
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

  const ws = new WebSocket(buildWsUrl(), [
    WS_PROTOCOL,
    `${TICKET_PREFIX}${ticket}`,
  ])

  socket = ws

  ws.addEventListener('open', () => {
    if (socket !== ws) return

    connected.value = true
    reconnectAttempt = 0

    notify({ type: 'presence:reset' })
    runHeartbeatCycle()
  })

  ws.addEventListener('message', (event) => {
    if (socket !== ws) return

    try {
      const message = JSON.parse(event.data as string) as PresenceServerMessage
      notify(message)
    } catch {
      // Ignore malformed payloads.
    }
  })

  ws.addEventListener('close', () => {
    if (socket === ws) {
      socket = null
      connected.value = false
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

  runHeartbeatCycle()
  void openSocket()
}

export function disconnectPresence() {
  shouldRun = false
  connectionId += 1
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
  return presenceMap.value.get(userId)?.isOnline ?? false
}

export function getUserLastSeen(userId: string): string | null {
  return presenceMap.value.get(userId)?.lastSeenAt ?? null
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
