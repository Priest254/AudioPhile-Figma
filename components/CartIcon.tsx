'use client'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'

export default function CartIcon() {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-brand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 rounded"
      aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
