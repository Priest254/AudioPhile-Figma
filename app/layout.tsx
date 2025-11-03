import Link from 'next/link'
import './globals.css'
import React from 'react'

export const metadata = { 
  title: 'Audiophile - Premium Audio Equipment',
  description: 'Shop premium headphones, speakers, and earphones at Audiophile. Experience exceptional sound quality and craftsmanship.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              <Link href="/" className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 rounded">
                <span className="text-2xl md:text-3xl font-bold text-brand-900">audiophile</span>
              </Link>
              <nav className="flex items-center space-x-6 md:space-x-8" aria-label="Main navigation">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-gray-700 hover:text-brand-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 rounded px-2 py-1"
                >
                  Home
                </Link>
                <Link 
                  href="/checkout" 
                  className="text-sm font-semibold text-brand-900 hover:text-brand-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 rounded px-2 py-1"
                >
                  Checkout
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-brand-900 text-white py-12 mt-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">audiophile</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Audiophile is your premier destination for high-quality audio equipment. 
                  We bring you the best in headphones, speakers, and earphones.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                  </li>
                  <li>
                    <Link href="/checkout" className="hover:text-white transition-colors">Checkout</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 uppercase tracking-wider text-sm">Contact</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  For any questions or support, please reach out to us through your order confirmation email.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>© {new Date().getFullYear()} Audiophile. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
