import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
import { auth } from './authentication'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, redirect, jwt: { sign }, cookie: { auth } }) => {
    const { code, redirect: redirectLink } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error()
    }

    if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
      throw new Error()
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    const token = await sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    auth.set({
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      value: token,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    redirect(redirectLink)
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
