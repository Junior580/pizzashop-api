import { Elysia } from 'elysia'

import { authenticateFromLink } from './routes/authenticate-from-link'
import { auth } from './routes/authentication'
import { registerRestaurant } from './routes/register-restaurant'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia()
  .use(auth)
  .use(registerRestaurant)
  .use(sendAuthLink)
  .use(authenticateFromLink)

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})
