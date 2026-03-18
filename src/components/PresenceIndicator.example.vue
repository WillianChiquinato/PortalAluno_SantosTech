<!--
  Exemplo de componente usando o composable usePresence
  para exibir status de presença de usuários.
-->

<template>
  <div class="presence-indicator">
    <div class="status">
      <span v-if="isConnected" class="badge connected">
        <i class="pi pi-check-circle"></i> Presença conectado
      </span>
      <span v-else class="badge disconnected">
        <i class="pi pi-exclamation-circle"></i> Presença desconectado
      </span>
    </div>

    <div class="users-online">
      <h3>Usuários Online</h3>
      <ul v-if="onlineUsers.length > 0">
        <li v-for="user in onlineUsers" :key="user.userId" class="user-item">
          <span class="user-id">{{ user.userId }}</span>
          <span class="online-indicator">🟢</span>
          <span class="last-seen">{{ formatTime(user.lastSeenAt) }}</span>
        </li>
      </ul>
      <p v-else class="empty">Nenhum usuário online</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePresence } from '~/composables/usePresence'

const { presenceMap, isConnected } = usePresence()

const onlineUsers = computed(() => {
  return Array.from(presenceMap.value.values())
    .filter(u => u.isOnline)
    .sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime())
})

function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60_000)

    if (diffMins < 1) return 'agora'
    if (diffMins < 60) return `${diffMins}m atrás`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`
    return `${Math.floor(diffMins / 1440)}d atrás`
  } catch {
    return 'desconhecido'
  }
}
</script>

<style scoped>
.presence-indicator {
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

.status {
  display: flex;
  margin-bottom: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge.connected {
  background: #d1fae5;
  color: #065f46;
}

.badge.disconnected {
  background: #fee2e2;
  color: #991b1b;
}

.users-online h3 {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
}

.users-online ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.user-id {
  font-weight: 500;
  flex-shrink: 0;
}

.online-indicator {
  font-size: 0.5rem;
  flex-shrink: 0;
}

.last-seen {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-left: auto;
}

.empty {
  color: #9ca3af;
  font-size: 0.875rem;
  margin: 0;
  padding: 1rem 0;
  text-align: center;
}
</style>
