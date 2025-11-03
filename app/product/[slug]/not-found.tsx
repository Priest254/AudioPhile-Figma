import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for. It may have been removed or doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-brand-900 text-white rounded-md hover:bg-opacity-90 transition-colors font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
