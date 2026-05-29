export default defineEventHandler((event) => {
  console.log('PING ROUTE HIT:', event.path)
  return { pong: true, path: event.path }
})
