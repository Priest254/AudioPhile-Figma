import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getAllProducts } from '@/lib/products'
import { Product } from '@/lib/products'
import AddToCart from '@/components/AddToCart'

type Props = {
  params: Promise<{ slug: string }>
}

function getImagePath(path: string): string {
  // Convert relative paths like "./assets/..." to absolute paths
  if (path.startsWith('./')) {
    return path.substring(1) // Remove the leading ./
  }
  if (path.startsWith('/')) {
    return path
  }
  return '/' + path
}

function ResponsiveImage({ 
  mobile, 
  tablet, 
  desktop, 
  alt, 
  className = '',
  priority = false 
}: {
  mobile: string
  tablet: string
  desktop: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const mobilePath = getImagePath(mobile)
  const tabletPath = getImagePath(tablet)
  const desktopPath = getImagePath(desktop)

  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" srcSet={desktopPath} />
      <source media="(min-width: 768px)" srcSet={tabletPath} />
      <img
        src={mobilePath}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const allProducts = getAllProducts()
  const relatedProducts = product.others
    .map(other => allProducts.find(p => p.slug === other.slug))
    .filter((p): p is Product => p !== undefined)

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-brand-900 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </Link>

        {/* Product Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <ResponsiveImage
              mobile={product.image.mobile}
              tablet={product.image.tablet}
              desktop={product.image.desktop}
              alt={product.name}
              className="w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {product.new && (
              <span className="text-orange-500 uppercase tracking-[0.3em] text-sm font-medium mb-4">
                New Product
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{product.name}</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            <p className="text-2xl font-bold text-gray-900 mb-8">
              KES {(product.price * 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            
            <AddToCart product={product} />
          </div>
        </div>

        {/* Features & Includes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 mb-16">
          {/* Features */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.features}
            </div>
          </div>

          {/* In the Box */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">In the Box</h2>
            <ul className="space-y-2">
              {product.includes.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="text-orange-500 font-semibold">{item.quantity}x</span>
                  <span className="text-gray-600">{item.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16">
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <ResponsiveImage
                mobile={product.gallery.first.mobile}
                tablet={product.gallery.first.tablet}
                desktop={product.gallery.first.desktop}
                alt={`${product.name} gallery image 1`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <ResponsiveImage
                mobile={product.gallery.second.mobile}
                tablet={product.gallery.second.tablet}
                desktop={product.gallery.second.desktop}
                alt={`${product.name} gallery image 2`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <ResponsiveImage
              mobile={product.gallery.third.mobile}
              tablet={product.gallery.third.tablet}
              desktop={product.gallery.third.desktop}
              alt={`${product.name} gallery image 3`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedProducts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/product/${related.slug}`}
                  className="group text-center"
                >
                  <div className="rounded-lg overflow-hidden bg-gray-100 mb-6">
                    <ResponsiveImage
                      mobile={related.categoryImage.mobile}
                      tablet={related.categoryImage.tablet}
                      desktop={related.categoryImage.desktop}
                      alt={related.name}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{related.name}</h3>
                  <Link
                    href={`/product/${related.slug}`}
                    className="inline-block px-6 py-3 bg-brand-900 text-white font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
                  >
                    See Product
                  </Link>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const products = getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}
