import { NextResponse } from 'next/server'
import { Convex } from 'convex/server'

const CONVEX_URL = process.env.CONVEX_URL || ''
const convex = new Convex({ url: CONVEX_URL })

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    if (!orderId) return NextResponse.json({ message: 'Missing orderId' }, { status: 400 })
    // Call convex function 'getOrderByOrderId'
    const result = await convex.run('getOrderByOrderId', orderId)
    if (!result) return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Fetch order error', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
