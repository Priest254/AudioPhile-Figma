import { mutation } from '../_generated/server'
import { v } from 'convex/values'

export const createOrder = mutation({
  args: {
    orderId: v.string(),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string()
    }),
    shipping: v.object({
      addressLine1: v.string(),
      addressLine2: v.optional(v.string()),
      city: v.string(),
      postalCode: v.string(),
      country: v.string()
    }),
    items: v.array(v.any()),
    totals: v.object({
      subtotal: v.number(),
      shipping: v.number(),
      taxes: v.number(),
      total: v.number()
    }),
    status: v.optional(v.string()),
    createdAt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const doc = {
      orderId: args.orderId,
      customer: args.customer,
      shipping: args.shipping,
      items: args.items,
      totals: args.totals,
      status: args.status || 'processing',
      createdAt: args.createdAt || new Date().toISOString()
    }
    return await ctx.db.insert('orders', doc)
  }
})
