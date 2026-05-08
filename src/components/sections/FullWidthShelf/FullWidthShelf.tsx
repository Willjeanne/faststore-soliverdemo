'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './FullWidthShelf.module.scss'

// ─── Intelligent Search API types ────────────────────────────────────────────

interface ISProduct {
  productId: string
  productName: string
  linkText: string
  priceRange?: {
    sellingPrice?: { lowPrice?: number }
  }
  items: Array<{
    name: string
    images: Array<{ imageUrl: string }>
    sellers?: Array<{ commertialOffer?: { Price?: number } }>
  }>
}

interface ISResponse {
  products: ISProduct[]
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

function parseProducts(raw: ISProduct[]): ShelfProduct[] {
  return raw.map((p) => {
    const item = p.items[0]
    const price =
      item?.sellers?.[0]?.commertialOffer?.Price ??
      p.priceRange?.sellingPrice?.lowPrice ??
      0
    return {
      id: p.productId,
      name: p.productName.toUpperCase(),
      variant: item?.name ?? '',
      price,
      link: `/${p.linkText}/p`,
      image1: item?.images?.[0]?.imageUrl ?? '',
      image2: item?.images?.[1]?.imageUrl ?? null,
    }
  })
}

function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR')}€`
}

const VISIBLE = 4

// ─── Component ────────────────────────────────────────────────────────────────

export default function FullWidthShelf({
  title,
  categorySlug = 'clothes',
  count = 8,
}: FullWidthShelfProps) {
  const [products, setProducts] = useState<ShelfProduct[]>([])
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const facets = encodeURIComponent(JSON.stringify([['category-1', categorySlug]]))
    fetch(
      `/_v/api/intelligent-search/product_search/v3?selectedFacets=${facets}&page=1&count=${count}&sort=orders%3Adesc`
    )
      .then((r) => r.json())
      .then((data: ISResponse) => setProducts(parseProducts(data.products ?? [])))
      .catch(() => {})
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
