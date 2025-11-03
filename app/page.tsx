import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/products'

function getImagePath(path: string): string {
  if (path.startsWith('./')) {
    return path.substring(1)
  }
  if (path.startsWith('/')) {
    return path
  }
  return '/' + path
}

function ResponsiveProductImage({ 
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

export default function HomePage() {
  const featuredProducts = getFeaturedProducts(6)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-brand-900 text-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-gray-400 uppercase tracking-[0.3em] text-sm mb-4">New Product</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              XX99 Mark II Headphones
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.
            </p>
            <Link
              href="/product/xx99-mark-two-headphones"
              className="inline-block px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold uppercase tracking-wider transition-colors"
            >
              See Product
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of headphones, speakers, and earphones designed for the ultimate listening experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <ResponsiveProductImage 
                    categoryImage={product.categoryImage} 
                    name={product.name}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-brand-900 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-900 font-semibold text-lg">
                      KES {(product.price * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-brand-900 font-semibold text-sm uppercase tracking-wide">
                      View Product →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-900 rounded-lg p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Checkout?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Complete your order and experience premium audio quality delivered right to your door.
            </p>
            <Link
              href="/checkout"
              className="inline-block px-8 py-4 bg-white text-brand-900 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest materials and craftsmanship</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick and secure delivery worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Checkout</h3>
              <p className="text-gray-600">Your payment and data are always protected</p>
            </div>
          </div>
      </div>
    </section>
    </div>
  )
}
