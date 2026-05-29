// Seta access_token como cookie HttpOnly para localhost — dev only.
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 404 })
  }

  const { token } = await readBody<{ token: string }>(event)
  if (!token?.trim()) throw createError({ statusCode: 400, statusMessage: 'token obrigatório' })

  appendResponseHeader(
    event,
    'set-cookie',
    `access_token=${token.trim()}; Path=/; HttpOnly; SameSite=Lax`,
  )

  return { ok: true }
})
