'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCart } from '@/contexts/CartContext'

const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/

const CheckoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name is too long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(phoneRegex, 'Please enter a valid phone number (7-20 digits)'),
  addressLine1: z.string().min(3, 'Address line 1 must be at least 3 characters').max(100, 'Address is too long'),
  addressLine2: z.string().max(100, 'Address is too long').optional().or(z.literal('')),
  city: z.string().min(1, 'Please enter your city').max(50, 'City name is too long'),
  postalCode: z.string().min(2, 'Postal code must be at least 2 characters').max(20, 'Postal code is too long'),
  country: z.string().min(2, 'Please enter your country').max(50, 'Country name is too long'),
  acceptTerms: z.boolean().refine(v => v === true, { message: 'You must accept the terms and conditions to continue' })
})

type CheckoutFormData = z.infer<typeof CheckoutSchema>

export default function CheckoutForm({ cart }: { cart: any[] }) {
  const { clearCart } = useCart()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false)
  const submitButtonRef = useRef<HTMLButtonElement>(null)

  // Listen for clearCart event after successful checkout
  useEffect(() => {
    const handleClearCart = () => {
      clearCart()
    }
    window.addEventListener('clearCart', handleClearCart)
    return () => window.removeEventListener('clearCart', handleClearCart)
  }, [clearCart])

  // Validate cart items
  const validCart = cart.filter(item => 
    item && 
    item.id && 
    item.name && 
    typeof item.price === 'number' && 
    item.price > 0 && 
    typeof item.quantity === 'number' && 
    item.quantity > 0
  )

  if (validCart.length === 0) {
    return (
      <div role="alert" className="p-4 border border-red-300 rounded bg-red-50">
        <p className="text-red-700">Your cart is empty. Please add items before checkout.</p>
      </div>
    )
  }

  const subtotal = validCart.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = 2000
  const taxes = Math.round(subtotal * 0.16)
  const total = subtotal + shipping + taxes

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    mode: 'onBlur'
  })

  async function onSubmit(data: CheckoutFormData) {
    // Prevent duplicate submissions
    if (isSubmittingLocal) {
      return
    }

    setSubmitError(null)
    setIsSubmittingLocal(true)

    try {
      const payload = {
        customer: {
          name: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim()
        },
        shipping: {
          addressLine1: data.addressLine1.trim(),
          addressLine2: data.addressLine2?.trim() || '',
          city: data.city.trim(),
          postalCode: data.postalCode.trim(),
          country: data.country.trim()
        },
        items: validCart,
        totals: { subtotal, shipping, taxes, total }
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json?.message || 'Checkout failed. Please try again.')
      }

      if (!json.orderId) {
        throw new Error('Order ID not received. Please contact support.')
      }

      // Clear cart after successful order
      clearCart()

      // Redirect to order confirmation
      window.location.href = `/order/${json.orderId}`
    } catch (err: any) {
      setSubmitError(err.message || 'Error processing order. Please try again.')
      setIsSubmittingLocal(false)
      // Focus submit button for accessibility
      submitButtonRef.current?.focus()
    }
  }

  const isProcessing = isSubmitting || isSubmittingLocal

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Checkout form" noValidate>
      {submitError && (
        <div role="alert" aria-live="polite" className="p-4 border border-red-300 rounded bg-red-50">
          <p className="text-sm text-red-700 font-medium">{submitError}</p>
        </div>
      )}

      <fieldset className="space-y-4" disabled={isProcessing}>
        <legend className="text-lg font-semibold mb-2">Contact Information</legend>
        
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium">
            Full Name <span className="text-red-600" aria-label="required">*</span>
          </label>
          <input
            id="fullName"
            {...register('fullName')}
            type="text"
            autoComplete="name"
            {...(errors.fullName && { 'aria-invalid': true })}
            aria-describedby={errors.fullName ? 'err-name' : undefined}
            aria-required="true"
            className={`w-full px-4 py-3 border rounded-md transition-colors ${
              errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
            } focus:outline-none focus:ring-2`}
          />
          {errors.fullName && (
            <p id="err-name" role="alert" className="text-sm text-red-600 mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address <span className="text-red-600" aria-label="required">*</span>
          </label>
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            {...(errors.email && { 'aria-invalid': true })}
            aria-describedby={errors.email ? 'err-email' : undefined}
            aria-required="true"
            className={`w-full px-4 py-3 border rounded-md transition-colors ${
              errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
            } focus:outline-none focus:ring-2`}
          />
          {errors.email && (
            <p id="err-email" role="alert" className="text-sm text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number <span className="text-red-600" aria-label="required">*</span>
          </label>
          <input
            id="phone"
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            {...(errors.phone && { 'aria-invalid': true })}
            aria-describedby={errors.phone ? 'err-phone' : undefined}
            aria-required="true"
            className={`w-full px-4 py-3 border rounded-md transition-colors ${
              errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
            } focus:outline-none focus:ring-2`}
          />
          {errors.phone && (
            <p id="err-phone" role="alert" className="text-sm text-red-600 mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4" disabled={isProcessing}>
        <legend className="text-lg font-semibold mb-2">Shipping Address</legend>
        
        <div className="space-y-2">
          <label htmlFor="addressLine1" className="block text-sm font-medium">
            Address Line 1 <span className="text-red-600" aria-label="required">*</span>
          </label>
          <input
            id="addressLine1"
            {...register('addressLine1')}
            type="text"
            autoComplete="address-line1"
            {...(errors.addressLine1 && { 'aria-invalid': true })}
            aria-describedby={errors.addressLine1 ? 'err-address1' : undefined}
            aria-required="true"
            className={`w-full px-4 py-3 border rounded-md transition-colors ${
              errors.addressLine1 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
            } focus:outline-none focus:ring-2`}
          />
          {errors.addressLine1 && (
            <p id="err-address1" role="alert" className="text-sm text-red-600 mt-1">
              {errors.addressLine1.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="addressLine2" className="block text-sm font-medium">
            Address Line 2 <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            id="addressLine2"
            {...register('addressLine2')}
            type="text"
            autoComplete="address-line2"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-brand-900 focus:ring-brand-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium">
              City <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="city"
              {...register('city')}
              type="text"
              autoComplete="address-level2"
              {...(errors.city && { 'aria-invalid': true })}
              aria-describedby={errors.city ? 'err-city' : undefined}
              aria-required="true"
              className={`w-full px-4 py-3 border rounded-md transition-colors ${
                errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
              } focus:outline-none focus:ring-2`}
            />
            {errors.city && (
              <p id="err-city" role="alert" className="text-sm text-red-600 mt-1">
                {errors.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="postalCode" className="block text-sm font-medium">
              Postal Code <span className="text-red-600" aria-label="required">*</span>
            </label>
            <input
              id="postalCode"
              {...register('postalCode')}
              type="text"
              autoComplete="postal-code"
              {...(errors.postalCode && { 'aria-invalid': true })}
              aria-describedby={errors.postalCode ? 'err-postal' : undefined}
              aria-required="true"
              className={`w-full px-4 py-3 border rounded-md transition-colors ${
                errors.postalCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
              } focus:outline-none focus:ring-2`}
            />
            {errors.postalCode && (
              <p id="err-postal" role="alert" className="text-sm text-red-600 mt-1">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-medium">
            Country <span className="text-red-600" aria-label="required">*</span>
          </label>
          <input
            id="country"
            {...register('country')}
            type="text"
            autoComplete="country-name"
            {...(errors.country && { 'aria-invalid': true })}
            aria-describedby={errors.country ? 'err-country' : undefined}
            aria-required="true"
            className={`w-full px-4 py-3 border rounded-md transition-colors ${
              errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-brand-900 focus:ring-brand-900'
            } focus:outline-none focus:ring-2`}
          />
          {errors.country && (
            <p id="err-country" role="alert" className="text-sm text-red-600 mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            {...(errors.acceptTerms && { 'aria-invalid': true })}
            aria-describedby={errors.acceptTerms ? 'err-terms' : undefined}
            className="mt-1 mr-3 w-4 h-4 text-brand-900 border-gray-300 rounded focus:ring-brand-900"
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-brand-900 underline hover:no-underline" target="_blank" rel="noopener noreferrer">
              terms and conditions
            </a>{' '}
            <span className="text-red-600" aria-label="required">*</span>
          </span>
        </label>
        {errors.acceptTerms && (
          <p id="err-terms" role="alert" className="text-sm text-red-600 ml-7">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      <button
        ref={submitButtonRef}
        disabled={isProcessing}
        type="submit"
        {...(isProcessing && { 'aria-busy': true })}
        className="w-full py-4 px-6 rounded-md bg-brand-900 text-white font-semibold text-lg transition-all hover:bg-opacity-90 focus:outline-none focus:ring-4 focus:ring-brand-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <span className="mr-2">Processing...</span>
          </span>
        ) : (
          `Pay KES ${(total / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        )}
      </button>
    </form>
  )
}
