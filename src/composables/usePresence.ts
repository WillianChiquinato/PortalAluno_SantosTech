import { ref, readonly, onUnmounted } from 'vue'
import { getToken, verifyToken } from './useAuth'

// ── Types ──────────────────────────────────────────────

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

// ── Constants ──────────────────────────────────────────

const WS_PROTOCOL = 'portal-aluno-presence.v1'
const TICKET_PREFIX = 'presence-ticket.'
const HEARTBEAT_INTERVAL_MS = 25_000
const RECONNECT_BASE_MS = 2_000
const RECONNECT_MAX_MS = 30_000

// ── Singleton state (shared across all component instances) ─

const presenceMap = ref<Map<string, PresenceState>>(new Map())
const connected = ref(false)

let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0
let shouldRun = false
let connectionId = 0

const listeners = new Set<PresenceListener>()

// ── Internal helpers ───────────────────────────────────

function notify(msg: PresenceServerMessage) {
  if (msg.type === 'presence:hello' || msg.type === 'presence:update') {
    const next = new Map(presenceMap.value)
    next.set(msg.userId, {
      userId: msg.userId,
      isOnline: msg.isOnline,
      lastSeenAt: msg.lastSeenAt,
    })
    presenceMap.value = next
  }

  if (msg.type === 'presence:reset') {
    presenceMap.value = new Map()
  }

  for (const fn of listeners) {
    fn(msg)
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

function buildTicketUrl(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string
  const apiUrl = new URL(apiBase, window.location.origin)
  const basePath = apiUrl.pathname.replace(/\/$/, '')
  const apiPath = basePath.endsWith('/api') ? basePath : `${basePath}/api`
  return `${apiUrl.origin}${apiPath}/presence/socket-ticket`
}

async function fetchTicket(): Promise<string> {
  const token = getToken()
  if (!token) throw new Error('No auth token')

  const res = await fetch(buildTicketUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Ticket request failed: ${res.status}`)
  }

  const data = await res.json()
  return data.ticket as string
}

function sendWsHeartbeat() {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'presence:heartbeat' }))
  }
}

function scheduleReconnect() {
  if (reconnectTimer !== null) clearTimeout(reconnectTimer)
  if (!shouldRun || !verifyToken()) return

  const delay = Math.min(RECONNECT_BASE_MS * 2 ** reconnectAttempt, RECONNECT_MAX_MS)
  reconnectAttempt++

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

  if (!shouldRun || myId !== connectionId) return

  const ws = new WebSocket(buildWsUrl(), [
    WS_PROTOCOL,
    `${TICKET_PREFIX}${ticket}`,
  ])

  socket = ws

  ws.addEventListener('open', () => {
    if (socket !== ws) return

    connected.value = true
    reconnectAttempt = 0

    // Clear old presence data on reconnect
    presenceMap.value = new Map()

    // Start WS-only heartbeat
    if (heartbeatTimer !== null) clearInterval(heartbeatTimer)
    heartbeatTimer = setInterval(sendWsHeartbeat, HEARTBEAT_INTERVAL_MS)
  })

  ws.addEventListener('message', (event) => {
    if (socket !== ws) return

    try {
      const msg = JSON.parse(event.data as string) as PresenceServerMessage
      notify(msg)
    } catch {
      // ignore malformed
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
    if (socket === ws) ws.close()
  })
}

// ── Public API ─────────────────────────────────────────

export function connectPresence() {
  if (shouldRun) return

  shouldRun = true
  reconnectAttempt = 0
  void openSocket()
}

export function disconnectPresence() {
  shouldRun = false
  connectionId++
  clearTimers()

  if (socket) {
    const ws = socket
    socket = null
    ws.close()
  }

  connected.value = false
  presenceMap.value = new Map()
}

export function getPresenceSnapshot(): PresenceState[] {
  return Array.from(presenceMap.value.values())
}

export function isUserOnline(userId: string): boolean {
  return presenceMap.value.get(userId)?.isOnline ?? false
}

export function getUserLastSeen(userId: string): string | null {
  return presenceMap.value.get(userId)?.lastSeenAt ?? null
}

/**
 * Composable for reactive presence state in components.
 * Automatically subscribes/unsubscribes on mount/unmount.
 */
export function usePresence() {
  const onPresenceUpdate = (listener: PresenceListener) => {
    listeners.add(listener)
    onUnmounted(() => listeners.delete(listener))
  }

  return {
    /** Reactive map of userId → PresenceState */
    presenceMap: readonly(presenceMap),
    /** Whether the WebSocket is currently connected */
    isConnected: readonly(connected),
    /** Check if a specific user is online */
    isUserOnline,
    /** Get a user's last seen timestamp */
    getUserLastSeen,
    /** Get a snapshot array of all presence states */
    getPresenceSnapshot,
    /** Register a listener (auto-cleaned on unmount) */
    onPresenceUpdate,
    /** Connect (idempotent) */
    connect: connectPresence,
    /** Disconnect */
    disconnect: disconnectPresence,
  }
}
