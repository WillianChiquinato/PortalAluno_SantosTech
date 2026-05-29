// Rotas internas do portal que precisam rodar no servidor Nitro.
export default defineEventHandler(async (event) => {
  const subPath = event.path.replace(/^\/portal-utils/, '')

  // POST /portal-utils/auth-refresh — proxy para o auth service (dev e prod)
  if (subPath === '/auth-refresh' && event.method === 'POST') {
    return handleAuthRefresh(event)
  }

  // POST /portal-utils/set-token — seta access_token como cookie (dev only)
  if (subPath === '/set-token' && event.method === 'POST') {
    if (process.env.NODE_ENV === 'production') throw createError({ statusCode: 404 })
    return handleSetToken(event)
  }

  throw createError({ statusCode: 404 })
})

async function handleAuthRefresh(event: any) {
  const AUTH_URL = 'https://auth.santos-tech.com'
  const incoming = getRequestHeaders(event)
  const forwardHeaders: Record<string, string> = {}
  if (incoming['cookie']) forwardHeaders['cookie'] = incoming['cookie']

  const upstream = await fetch(`${AUTH_URL}/auth/refresh`, {
    method: 'POST',
    headers: forwardHeaders,
    redirect: 'manual',
  })

  setResponseStatus(event, upstream.status)

  const isDev = process.env.NODE_ENV !== 'production'
  const setCookies: string[] =
    typeof (upstream.headers as any).getSetCookie === 'function'
      ? (upstream.headers as any).getSetCookie()
      : upstream.headers.get('set-cookie')
        ? [upstream.headers.get('set-cookie')!]
        : []

  for (const cookie of setCookies) {
    const rewritten = isDev
      ? cookie.replace(/;\s*Domain=[^;,]*/gi, '').replace(/;\s*Secure\b/gi, '')
      : cookie
    appendResponseHeader(event, 'set-cookie', rewritten)
  }

  return { ok: upstream.ok }
}

async function handleSetToken(event: any) {
  const { token } = await readBody<{ token: string }>(event)
  if (!token?.trim()) throw createError({ statusCode: 400, statusMessage: 'token obrigatório' })

  appendResponseHeader(
    event,
    'set-cookie',
    `access_token=${token.trim()}; Path=/; HttpOnly; SameSite=Lax`,
  )
  return { ok: true }
}
