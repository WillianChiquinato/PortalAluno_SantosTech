// Proxy do auth service apenas para desenvolvimento local.
// Reescreve os cookies de resposta removendo Domain e Secure
// para que funcionem em localhost.
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404 })
  }

  const AUTH_PROD_URL = 'https://auth.santos-tech.com'
  const subPath = event.path.replace(/^\/dev-auth/, '') || '/'
  const targetUrl = `${AUTH_PROD_URL}${subPath}`
  const method = event.method

  const incoming = getRequestHeaders(event)
  const forwardHeaders: Record<string, string> = {}
  if (incoming['content-type']) forwardHeaders['content-type'] = incoming['content-type']
  if (incoming['cookie']) forwardHeaders['cookie'] = incoming['cookie']

  let body: Buffer | undefined
  if (!['GET', 'HEAD'].includes(method.toUpperCase())) {
    const raw = await readRawBody(event, false)
    if (raw) body = Buffer.from(raw as ArrayBuffer)
  }

  const upstream = await fetch(targetUrl, {
    method,
    headers: forwardHeaders,
    body,
    redirect: 'manual',
  })

  setResponseStatus(event, upstream.status)

  // Reescreve Set-Cookie removendo Domain (para ficar em localhost) e Secure
  const setCookies: string[] =
    typeof (upstream.headers as any).getSetCookie === 'function'
      ? (upstream.headers as any).getSetCookie()
      : upstream.headers.get('set-cookie')
        ? [upstream.headers.get('set-cookie')!]
        : []

  for (const cookie of setCookies) {
    const local = cookie
      .replace(/;\s*Domain=[^;,]*/gi, '')
      .replace(/;\s*Secure\b/gi, '')
    appendResponseHeader(event, 'set-cookie', local)
  }

  // Repassa demais headers
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (!['set-cookie', 'content-encoding', 'transfer-encoding', 'connection', 'content-length'].includes(lower)) {
      setHeader(event, key, value)
    }
  })

  return upstream.text()
})
