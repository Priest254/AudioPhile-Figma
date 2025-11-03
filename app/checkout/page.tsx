'use client'
import CheckoutForm from '../../components/CheckoutForm'
import OrderSummary from '../../components/OrderSummary'
import React, { useState } from 'react'

export default function CheckoutPage() {
  const [cart] = useState([
    { id: 'prod_001', name: 'ZX9 Speaker', price: 450000, quantity: 1 },
    { id: 'prod_002', name: 'YX1 Earphones', price: 15000, quantity: 2 }
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order below</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <CheckoutForm cart={cart} />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
              <OrderSummary items={cart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
