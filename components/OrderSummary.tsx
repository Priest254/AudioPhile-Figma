export default function OrderSummary({ items }: { items: any[] }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = 2000
  const taxes = Math.round(subtotal * 0.16)
  const total = subtotal + shipping + taxes

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map(i => {
          const itemTotal = (i.price * i.quantity) / 100
          return (
            <div key={i.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-200 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm md:text-base">{i.name}</p>
                <p className="text-sm text-gray-500 mt-1">Quantity: {i.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900 text-sm md:text-base">
                  KES {itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-3">
        <div className="flex justify-between text-sm md:text-base text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">KES {(subtotal / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base text-gray-700">
          <span>Shipping</span>
          <span className="font-medium">KES {(shipping / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm md:text-base text-gray-700">
          <span>Taxes</span>
          <span className="font-medium">KES {(taxes / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="pt-4 border-t-2 border-gray-900">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-xl font-bold text-gray-900">
            KES {(total / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  )
}
