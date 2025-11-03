import { readFileSync } from 'fs'
import { join } from 'path'

export type Product = {
  id: number
  slug: string
  name: string
  image: {
    mobile: string
    tablet: string
    desktop: string
  }
  category: string
  categoryImage: {
    mobile: string
    tablet: string
    desktop: string
  }
  new: boolean
  price: number
  description: string
  features: string
  includes: Array<{
    quantity: number
    item: string
  }>
  gallery: {
    first: {
      mobile: string
      tablet: string
      desktop: string
    }
    second: {
      mobile: string
      tablet: string
      desktop: string
    }
    third: {
      mobile: string
      tablet: string
      desktop: string
    }
  }
  others: Array<{
    slug: string
    name: string
    image: {
      mobile: string
      tablet: string
      desktop: string
    }
  }>
}

function getDbData() {
  try {
    // Try to read from public/assets first (after move)
    const dbPath = join(process.cwd(), 'public', 'assets', 'db.json')
    const fileContents = readFileSync(dbPath, 'utf8')
    return JSON.parse(fileContents)
  } catch {
    // Fallback to original location if not found
    try {
      const dbPath = join(process.cwd(), 'assets', 'db.json')
      const fileContents = readFileSync(dbPath, 'utf8')
      return JSON.parse(fileContents)
    } catch {
      throw new Error('Could not find db.json. Please ensure assets folder is in public folder or at root.')
    }
  }
}

let cachedDbData: { data: Product[] } | null = null

function getDb() {
  if (!cachedDbData) {
    cachedDbData = getDbData() as { data: Product[] }
  }
  return cachedDbData
}

export function getAllProducts(): Product[] {
  return getDb().data as Product[]
}

export function getProductBySlug(slug: string): Product | undefined {
  return getDb().data.find((product: Product) => product.slug === slug) as Product | undefined
}

export function getFeaturedProducts(limit: number = 6): Product[] {
  return getDb().data.slice(0, limit) as Product[]
}
