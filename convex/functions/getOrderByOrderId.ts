import { query } from '../_generated/server'
import { v } from 'convex/values'

export const getOrderByOrderId = query({
  args: {
    orderId: v.string()
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query('orders').collect()
    const order = orders.find((o: any) => o.orderId === args.orderId)
    return order || null
  }
})
