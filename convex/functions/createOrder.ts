import { mutation } from 'convex/server'

export default mutation(async ({ db }, order) => {
  const doc = {
    orderId: order.orderId,
    customer: order.customer,
    shipping: order.shipping,
    items: order.items,
    totals: order.totals,
    status: order.status || 'processing',
    createdAt: order.createdAt || new Date().toISOString()
  }
  return await db.insert('orders', doc)
})
