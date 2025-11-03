'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

type AddToCartProps = {
  product: {
    id: number
    slug: string
    name: string
    price: number
  }
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart, cart } = useCart()
  const productId = `prod_${product.id}`
  const existingCartItem = cart.find(item => item.id === productId)
  
  const [quantity, setQuantity] = useState(existingCartItem?.quantity || 1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Sync quantity with cart if item already exists
  useEffect(() => {
    if (existingCartItem) {
      setQuantity(existingCartItem.quantity)
    } else {
      // Reset to 1 if item is not in cart
      setQuantity(1)
    }
  }, [existingCartItem?.quantity, cart])

  const handleAddToCart = () => {
    const wasInCart = !!existingCartItem
    const previousQuantity = existingCartItem?.quantity || 0
    
    addToCart({
      id: productId,
      name: product.name,
      price: product.price * 100, // Convert to cents
      slug: product.slug,
      quantity
    })
    
    // Show success message with updated quantity
    const message = wasInCart 
      ? `Updated quantity from ${previousQuantity} to ${quantity} ${product.name}${quantity > 1 ? 's' : ''} in cart!`
      : `Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`
    
    setSuccessMessage(message)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded">
          <button
            type="button"
            onClick={decreaseQuantity}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-6 py-2 font-semibold min-w-[60px] text-center">{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 px-6 py-3 bg-brand-900 text-white font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
        >
          Add to Cart
        </button>
      </div>
      
      {showSuccess && (
        <div 
          role="alert"
          aria-live="polite"
          className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm font-medium animate-fade-in"
        >
          ✓ {successMessage}
          <Link 
            href="/checkout" 
            className="ml-2 underline hover:no-underline"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  )
}
