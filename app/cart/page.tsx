'use client'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

function getImagePath(path: string): string {
  if (path.startsWith('./')) {
    return path.substring(1)
  }
  if (path.startsWith('/')) {
    return path
  }
  return '/' + path
}

function ResponsiveImage({ 
  categoryImage, 
  name 
}: {
  categoryImage: { mobile: string; tablet: string; desktop: string }
  name: string
}) {
  const mobilePath = getImagePath(categoryImage.mobile)
  const tabletPath = getImagePath(categoryImage.tablet)
  const desktopPath = getImagePath(categoryImage.desktop)

  return (
    <picture className="w-full h-full">
      <source media="(min-width: 1024px)" srcSet={desktopPath} />
      <source media="(min-width: 768px)" srcSet={tabletPath} />
      <img
        src={mobilePath}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Start shopping to add items!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-brand-900 text-white font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors rounded"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const shipping = 2000
  const taxes = Math.round(subtotal * 0.16)
  const total = subtotal + shipping + taxes

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              // Try to get category image - if not available, use placeholder
              const itemImage = item.image || '/assets/cart/image-xx99-mark-two-headphones.jpg'
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Product Image - Placeholder since we don't have image in cart item */}
                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          href={item.slug ? `/product/${item.slug}` : '#'}
                          className="text-xl font-semibold text-gray-900 hover:text-brand-900 transition-colors mb-2 block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-lg font-bold text-brand-900">
                          KES {((item.price * item.quantity) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500 mt-1">
                            KES {(item.price / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} each
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 transition-colors p-2"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 sticky top-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Cart Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    KES {(subtotal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">
                    KES {(shipping / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-base text-gray-700">
                  <span>Taxes</span>
                  <span className="font-medium">
                    KES {(taxes / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-900 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    KES {(total / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full px-6 py-3 bg-brand-900 text-white font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors text-center rounded"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full px-6 py-3 mt-3 text-center text-gray-700 hover:text-brand-900 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
