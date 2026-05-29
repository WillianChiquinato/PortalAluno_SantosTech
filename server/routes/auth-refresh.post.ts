// Proxy do endpoint de refresh — funciona em dev e prod.
// Em dev reescreve os cookies para localhost; em prod repassa como está.
export default defineEventHandler(async (event) => {
  const AUTH_PROD_URL = 'https://auth.santos-tech.com'
  const incoming = getRequestHeaders(event)
  const forwardHeaders: Record<string, string> = {}
  if (incoming['cookie']) forwardHeaders['cookie'] = incoming['cookie']

  const upstream = await fetch(`${AUTH_PROD_URL}/auth/refresh`, {
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

  return null
})
