import jwt from '@elysiajs/jwt'
import Elysia, { type Static, t } from 'elysia'

import { env } from '../env'

const jwtPayloadSchema = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayloadSchema,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt: { verify, sign }, cookie: { auth } }) => {
    return {
      getCurrentUser: async () => {
        const payload = await verify(auth.value)

        if (!payload) {
          throw new Error()
        }

        return payload
      },
      signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
        const token = await sign(payload)

        auth.set({
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
          value: token,
        })
      },
      signOut: () => {
        auth.remove()
      },
    }
  })
