// src/pages/Explore.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import { ExhibitionGrid } from '../components/ExhibitionGrid'
import { VAULT_COLLECTION, DEFAULT_CATEGORIES, type Category } from '../data/vaultCollection'
import type { Photo } from '../types'

export const Explore = () => {
  const [photos, setPhotos] = useState<Photo[]>(VAULT_COLLECTION)
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [photoRes, catRes] = await Promise.all([
        api.get<Photo[]>('/photographs'),
        api.get<Category[]>('/v1/categories'),
      ])

      const fetchedPhotos = photoRes.data || []
      const fetchedCats = catRes.data || []

      // If backend has items, merge keeping Alvaro Cadena's vault collection prominent
      if (fetchedPhotos.length > 0) {
        const vaultTitles = new Set(VAULT_COLLECTION.map((p) => p.title.toLowerCase()))
        const additional = fetchedPhotos.filter(
          (p) => !vaultTitles.has(p.title.toLowerCase()),
        )
        setPhotos([...VAULT_COLLECTION, ...additional])
      } else {
        setPhotos(VAULT_COLLECTION)
      }

      if (fetchedCats.length > 0) {
        const catNames = new Set(fetchedCats.map((c) => c.name.toLowerCase()))
        const additionalCats = DEFAULT_CATEGORIES.filter(
          (c) => !catNames.has(c.name.toLowerCase()),
        )
        setCategories([...fetchedCats, ...additionalCats])
      } else {
        setCategories(DEFAULT_CATEGORIES)
      }
    } catch (err) {
      console.warn('Backend catalog offline or unavailable; presenting local vault collection:', err)
      // Graceful fallback to real fine art vault pieces
      setPhotos(VAULT_COLLECTION)
      setCategories(DEFAULT_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  return (
    <SidebarLayout>
      <ExhibitionGrid
        photos={photos}
        categories={categories}
        loading={loading}
        error={error}
        eyebrow="Archive / Private Collection"
        title="The Vault Collection"
        subtitle="Selección curada de impresiones fotográficas de autor de Alvaro Cadena, montadas bajo especificación museográfica sobre TruLife® Acrylic y soporte de aluminio aeroespacial."
      />
    </SidebarLayout>
  )
}
