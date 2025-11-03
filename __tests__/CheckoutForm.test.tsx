import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CheckoutForm from '../components/CheckoutForm'

const cart = [
  { id: 'p1', name: 'Product 1', price: 10000, quantity: 1 }
]

describe('CheckoutForm', () => {
  it('shows validation errors when submitting empty form', async () => {
    render(<CheckoutForm cart={cart} />)
    const button = screen.getByRole('button', { name: /pay/i })
    fireEvent.click(button)
    await waitFor(() => {
      expect(screen.getByText(/Enter your full name/i)).toBeInTheDocument()
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument()
    })
  })
})
