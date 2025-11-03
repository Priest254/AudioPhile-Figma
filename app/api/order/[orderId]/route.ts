import { NextResponse } from 'next/server'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    if (!orderId) return NextResponse.json({ message: 'Missing orderId' }, { status: 400 })
    // Call Convex query function
    const result = await fetchQuery(api.functions.getOrderByOrderId.getOrderByOrderId, { orderId })
    if (!result) return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Fetch order error', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
