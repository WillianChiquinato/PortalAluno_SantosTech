const HEARTBEAT_INTERVAL_MS = 30_000
const RECONNECT_DELAYS_MS = [1_500, 3_000, 5_000, 10_000]

let socket: WebSocket | null = null
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0
let activeToken: string | null = null
let activeSocketToken: string | null = null
let shouldReconnect = false
let hasWarnedMissingUrl = false

function clearHeartbeatTimer() {
  if (!heartbeatTimer) {
    return
  }

  clearInterval(heartbeatTimer)
  heartbeatTimer = null
}

function clearReconnectTimer() {
  if (!reconnectTimer) {
    return
  }

  clearTimeout(reconnectTimer)
  reconnectTimer = null
}

function closeSocket() {
  if (!socket) {
    return
  }

  const currentSocket = socket
  socket = null
  activeSocketToken = null

  if (
    currentSocket.readyState === WebSocket.OPEN ||
    currentSocket.readyState === WebSocket.CONNECTING
  ) {
    currentSocket.close()
  }
}

function resolvePresenceUrl(token: string) {
  const rawUrl = String(import.meta.env.VITE_PRESENCE_WS_URL || '').trim()

  if (!rawUrl) {
    if (!hasWarnedMissingUrl) {
      console.warn('Presence WS disabled: VITE_PRESENCE_WS_URL is not configured.')
      hasWarnedMissingUrl = true
    }

    return null
  }

  let url: URL

  try {
    url = new URL(rawUrl)
  } catch {
    console.warn('Presence WS disabled: VITE_PRESENCE_WS_URL is invalid.')
    return null
  }

  if (url.protocol === 'http:') {
    url.protocol = 'ws:'
  } else if (url.protocol === 'https:') {
    url.protocol = 'wss:'
  }

  url.searchParams.set('token', token)

  return url.toString()
}

function sendHeartbeat() {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return
  }

  socket.send(JSON.stringify({ type: 'presence:heartbeat' }))
}

function startHeartbeat() {
  clearHeartbeatTimer()
  sendHeartbeat()
  heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
}

function scheduleReconnect() {
  if (!import.meta.client || !shouldReconnect || !activeToken || reconnectTimer) {
    return
  }

  const delay = RECONNECT_DELAYS_MS[Math.min(reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)]
  reconnectAttempt += 1

  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null

    if (!activeToken || !shouldReconnect) {
      return
    }

    openPresenceSocket(activeToken)
  }, delay)
}

function openPresenceSocket(token: string) {
  const url = resolvePresenceUrl(token)
  if (!url) {
    return
  }

  closeSocket()

  const nextSocket = new WebSocket(url)
  socket = nextSocket
  activeSocketToken = token

  nextSocket.addEventListener('open', () => {
    if (socket !== nextSocket) {
      return
    }

    reconnectAttempt = 0
    startHeartbeat()
  })

  nextSocket.addEventListener('message', (event) => {
    try {
      const payload = JSON.parse(event.data as string) as { type?: string; message?: string }

      if (payload.type === 'presence:error' && payload.message) {
        console.warn('Presence WS error:', payload.message)
      }
    } catch {
      // Ignore non-JSON payloads from the presence endpoint.
    }
  })

  nextSocket.addEventListener('close', () => {
    if (socket !== nextSocket) {
      return
    }

    socket = null
    activeSocketToken = null

    clearHeartbeatTimer()
    scheduleReconnect()
  })

  nextSocket.addEventListener('error', () => {
    if (socket !== nextSocket) {
      return
    }

    console.warn('Presence WS connection failed.')
  })
}

export function connectPresence(token: string) {
  if (!import.meta.client) {
    return
  }

  const normalizedToken = token.trim()
  if (!normalizedToken) {
    disconnectPresence()
    return
  }

  activeToken = normalizedToken
  shouldReconnect = true
  clearReconnectTimer()

  if (
    socket &&
    activeSocketToken === normalizedToken &&
    (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
  ) {
    return
  }

  reconnectAttempt = 0
  openPresenceSocket(normalizedToken)
}

export function disconnectPresence() {
  shouldReconnect = false
  activeToken = null
  activeSocketToken = null
  reconnectAttempt = 0

  clearReconnectTimer()
  clearHeartbeatTimer()
  closeSocket()
}
