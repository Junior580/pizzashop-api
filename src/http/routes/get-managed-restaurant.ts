import Elysia from 'elysia'

import { db } from '../../db/connection'
import { auth } from '../authentication'

export const getManagedRestaurant = new Elysia()
  .use(auth)
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new Error('User is not a manager.')
    }

    const managedRestaurant = db.query.restaurants.findFirst({
      where(filds, { eq }) {
        return eq(filds.id, restaurantId)
      },
    })

    if (!managedRestaurant) {
      throw new Error('Restaurant not found.')
    }

    return managedRestaurant
  })
