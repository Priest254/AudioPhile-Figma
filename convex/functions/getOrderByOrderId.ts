import { query } from 'convex/server'

export default query(async ({ db }, orderId: string) => {
  const orders = await db.query('orders').collect()
  const order = orders.find((o: any) => o.orderId === orderId)
  return order || null
})
