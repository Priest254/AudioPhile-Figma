import React from 'react'

type Order = {
  orderId: string
  customer: any
  shipping: any
  items: any[]
  totals: any
  status: string
  createdAt: string
}

async function fetchOrder(orderId: string): Promise<Order | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/order/${orderId}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params
  const order = await fetchOrder(orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find an order with that ID. Please check your order ID and try again.</p>
            <a href="/" className="inline-block px-6 py-3 bg-brand-900 text-white rounded-md hover:bg-opacity-90 transition-colors font-medium">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 lg:p-12">
          <div className="text-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-gray-600">Thank you for your order</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Order ID</p>
                  <p className="font-semibold text-gray-900 font-mono">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Order Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Shipping Address</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="font-medium">{order.shipping.addressLine1}</p>
                {order.shipping.addressLine2 && <p>{order.shipping.addressLine2}</p>}
                <p>
                  {order.shipping.city}, {order.shipping.postalCode}
                </p>
                <p>{order.shipping.country}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Order Items</h2>
              <div className="space-y-4 mb-6">
                {order.items.map((it: any) => {
                  const itemTotal = (it.price * it.quantity) / 100
                  return (
                    <div key={it.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{it.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Quantity: {it.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          KES {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    KES {(order.totals.subtotal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    KES {(order.totals.shipping / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Taxes</span>
                  <span className="font-medium">
                    KES {(order.totals.taxes / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-gray-900">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    KES {(order.totals.total / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-4">A confirmation email has been sent to your email address.</p>
            <a href="/" className="inline-block px-6 py-3 bg-brand-900 text-white rounded-md hover:bg-opacity-90 transition-colors font-medium">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
