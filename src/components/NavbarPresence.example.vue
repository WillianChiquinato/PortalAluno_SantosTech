<!--
  Exemplo: Integração da presença em um navbar/header
  Mostra badge com status de conexão WS e contagem de usuários online
-->

<template>
  <header class="navbar">
    <div class="navbar-brand">
      Portal Aluno
    </div>

    <div class="navbar-content">
      <!-- Seu menu normal aqui -->
    </div>

    <!-- Badge de presença (lado direito) -->
    <div class="navbar-presence">
      <button
        class="presence-badge"
        :class="{ connected: isConnected, disconnected: !isConnected }"
        @click="showPresencePanel = !showPresencePanel"
        :title="`${onlineCount} usuários online`"
      >
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </button>

      <!-- Painel flutuante com lista de usuários online -->
      <div v-if="showPresencePanel" class="presence-panel">
        <div class="panel-header">
          <h3>Usuários Online</h3>
          <button @click="showPresencePanel = false" class="close-btn">✕</button>
        </div>

        <div class="panel-body">
          <ul v-if="onlineUsers.length > 0" class="users-list">
            <li v-for="user in onlineUsers" :key="user.userId" class="user-item">
              <div class="user-avatar">{{ getInitial(user.userId) }}</div>
              <div class="user-info">
                <div class="user-id">{{ user.userId }}</div>
                <div class="last-seen">{{ relativeTime(user.lastSeenAt) }}</div>
              </div>
              <div class="online-indicator">●</div>
            </li>
          </ul>
          <div v-else class="empty">Nenhum usuário online</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePresence } from '~/composables/usePresence'

const { presenceMap, isConnected } = usePresence()
const showPresencePanel = ref(false)

const onlineUsers = computed(() => {
  return Array.from(presenceMap.value.values())
    .filter(u => u.isOnline)
    .sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime())
    .slice(0, 10) // Mostrar top 10
})

const onlineCount = computed(() => onlineUsers.value.length)

const statusText = computed(() => {
  if (!isConnected.value) return 'Offline'
  return `${onlineCount.value} online`
})

function getInitial(userId: string): string {
  return userId.charAt(0).toUpperCase()
}

function relativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60_000)

    if (diffMins < 1) return 'agora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`
    return `${Math.floor(diffMins / 1440)}d`
  } catch {
    return '?'
  }
}
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 600;
  font-family: 'Segoe UI', sans-serif;
}

.navbar-content {
  flex: 1;
  margin: 0 2rem;
}

.navbar-presence {
  position: relative;
}

.presence-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.connected {
    .status-dot {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }
  }

  &.disconnected {
    .status-dot {
      background: #ef4444;
      box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
    }
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.status-text {
  font-size: 0.875rem;
}

.presence-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-height: 400px;
  overflow-y: auto;
  color: #1f2937;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.5rem 0.5rem 0 0;

  h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
  }
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #1f2937;
  }
}

.panel-body {
  padding: 0.5rem 0;
}

.users-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-id {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-seen {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.online-indicator {
  color: #10b981;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
