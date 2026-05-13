'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './FullWidthShelf.module.scss'

// ─── VTEX Catalog Portal API types ───────────────────────────────────────────

interface VtexProduct {
  productId: string
  productName: string
  linkText: string
  items: Array<{
    name: string
    images: Array<{ imageUrl: string }>
    sellers: Array<{ commertialOffer: { Price: number } }>
  }>
}

// ─── Internal types ───────────────────────────────────────────────────────────

interface ShelfProduct {
  id: string
  name: string
  variant: string
  price: number
  link: string
  image1: string
  image2: string | null
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface FullWidthShelfProps {
  title?: string
  categorySlug?: string
  count?: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseProducts(raw: VtexProduct[]): ShelfProduct[] {
  return raw.map((p) => {
    const item = p.items[0]
    return {
      id: p.productId,
      name: p.productName.toUpperCase(),
      variant: item?.name ?? '',
      price: item?.sellers?.[0]?.commertialOffer?.Price ?? 0,
      link: `/${p.linkText}/p`,
      image1: item?.images?.[0]?.imageUrl ?? '',
      image2: item?.images?.[1]?.imageUrl ?? null,
    }
  })
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')}€`
}

// ─── Category tree resolution ─────────────────────────────────────────────────

interface CategoryNode {
  id: number
  name: string
  url: string
  hasChildren: boolean
  children: CategoryNode[]
}

// Returns the full category path required by the Catalog Portal API
// e.g. "2/5/" for "Pants & Skirts" (subcategory of Clothes)
// e.g. "10/"  for "Kids" (top-level)
function findInTree(nodes: CategoryNode[], slug: string, parentPath = ''): string | null {
  for (const node of nodes) {
    const currentPath = `${parentPath}${node.id}/`
    const urlSlug = node.url.split('/').pop()?.toLowerCase() ?? ''
    const nameSlug = node.name.toLowerCase()
    if (urlSlug === slug || nameSlug === slug) return currentPath
    if (node.children?.length) {
      const found = findInTree(node.children, slug, currentPath)
      if (found !== null) return found
    }
  }
  return null
}

async function resolveCategoryPath(slug: string): Promise<string | null> {
  try {
    const res = await fetch('/api/catalog_system/pub/category/tree/3')
    if (!res.ok) throw new Error(`Category tree fetch failed: ${res.status}`)
    const tree: CategoryNode[] = await res.json()
    const path = findInTree(tree, slug)
    if (!path) console.warn(`[FullWidthShelf] No category found for "${slug}"`)
    return path
  } catch (err) {
    console.error('[FullWidthShelf] resolveCategoryPath error:', err)
    return null
  }
}

const VISIBLE = 4

// ─── Component ────────────────────────────────────────────────────────────────

export default function FullWidthShelf({
  title,
  categorySlug = '',
  count = 8,
}: FullWidthShelfProps) {
  const [products, setProducts] = useState<ShelfProduct[]>([])
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!categorySlug) return
    const slug = categorySlug.toLowerCase().replace(/^\//, '')

    const load = async () => {
      const categoryPath = await resolveCategoryPath(slug)
      if (!categoryPath) return
      try {
        // categoryPath is e.g. "2/5/" → fq=C:/2/5/ (full path needed for subcategories)
        const res = await fetch(
          `/api/catalog_system/pub/products/search?fq=C%3A%2F${encodeURIComponent(categoryPath)}&_from=0&_to=${count - 1}&O=OrderByTopSaleDESC`
        )
        const data: VtexProduct[] = await res.json()
        if (Array.isArray(data)) setProducts(parseProducts(data))
      } catch (err) {
        console.error('[FullWidthShelf] Products fetch error:', err)
      }
    }

    load()
  }, [categorySlug, count])

  const maxIndex = Math.max(0, products.length - VISIBLE)

  const scrollToIndex = (nextIndex: number) => {
    if (!trackRef.current || products.length === 0) return
    const cardWidth = trackRef.current.scrollWidth / products.length
    trackRef.current.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' })
    setIndex(nextIndex)
  }

  if (products.length === 0) return null

  return (
    <section className={styles.shelf}>
      {title && (
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </header>
      )}

      <div className={styles.wrapper}>
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => scrollToIndex(Math.max(0, index - 1))}
          aria-label="Précédent"
          disabled={index === 0}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.track} ref={trackRef}>
          {products.map((p) => (
            <a key={p.id} href={p.link} className={styles.card} aria-label={p.name}>
              <div className={styles.imageWrapper}>
                <img src={p.image1} alt={p.name} className={styles.imageMain} loading="lazy" />
                {p.image2 && (
                  <img src={p.image2} alt={`${p.name} — vue 2`} className={styles.imageHover} loading="lazy" />
                )}
              </div>
              <div className={styles.info}>
                <p className={styles.name}>{p.name}</p>
                <p className={styles.variant}>{p.variant}</p>
                <p className={styles.price}>{formatPrice(p.price)}</p>
              </div>
            </a>
          ))}
        </div>

        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => scrollToIndex(Math.min(maxIndex, index + 1))}
          aria-label="Suivant"
          disabled={index >= maxIndex}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
