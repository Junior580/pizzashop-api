import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'

import { orders, products } from '.'

export const orderItems = pgTable('order_items', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),
  productId: text('product_id').references(() => products.id, {
    onDelete: 'set null',
  }),
  quantity: integer('quantity').default(1),
  priceInCents: integer('price_in_cents').notNull(),
})

export const orderItemsRelations = relations(orderItems, ({ one }) => {
  return {
    order: one(orders, {
      fields: [orderItems.orderId],
      references: [orders.id],
      relationName: 'order_item_order',
    }),
    product: one(products, {
      fields: [orderItems.productId],
      references: [products.id],
      relationName: 'order_item_product',
    }),
  }
})
