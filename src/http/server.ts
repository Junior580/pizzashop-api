import { Elysia } from 'elysia'
import { env } from '../env'

const app = new Elysia().get('/', () => {
  return `🔥 ~ PROCESS.ENV: ${JSON.stringify(env.DATABASE_URL)}`
})

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
