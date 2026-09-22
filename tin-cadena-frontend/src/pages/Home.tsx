// src/pages/Home.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { PublicNavbar } from '../components/PublicNavbar'
import { ExhibitionGrid } from '../components/ExhibitionGrid'
import { RoomView } from '../components/RoomView'
import { useAuth, useCart } from '../hooks'
import { VAULT_COLLECTION, DEFAULT_CATEGORIES, type Category } from '../data/vaultCollection'
import { getPhotoUrl } from '../utils/imageUtils'
import type { Photo } from '../types'

export const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const { items: cartItems } = useCart()

  const [photos, setPhotos] = useState<Photo[]>(VAULT_COLLECTION)
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [photosRes, categoriesRes] = await Promise.all([
          api.get<Photo[]>('/photographs'),
          api.get<Category[]>('/v1/categories'),
        ])

        const fetchedPhotos = photosRes.data || []
        const fetchedCats = categoriesRes.data || []

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
        setPhotos(VAULT_COLLECTION)
        setCategories(DEFAULT_CATEGORIES)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicData()
  }, [])

  const heroPhoto = photos[0]

  return (
    <div className="min-h-screen bg-obsidian text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      {/* Hero Section — full-bleed fine art layout, nav floats on the artwork */}
      <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between border-b border-white/10">
        {/* Immersive artwork background */}
        <div className="absolute inset-0 z-0">
          <img
            src={getPhotoUrl(heroPhoto?.image)}
            alt={heroPhoto?.title || 'Obra de autor'}
            className="w-full h-full object-cover object-center brightness-[0.85] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
        </div>

        {/* Transparent floating navbar */}
        <PublicNavbar
          isAuthenticated={isAuthenticated}
          username={user?.username}
          cartCount={cartCount}
        />

        {/* Floating title block, anchored to the base of the artwork */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center pb-20 px-6 flex flex-col items-center">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-stone-300 font-mono mb-3">
            Serie Limitada · Miami
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-wide mb-6">
            Fotografía de Autor
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
            <a
              href="#galeria"
              className="text-xs uppercase tracking-[0.25em] text-white hover:text-stone-300 transition-colors pb-1 border-b border-white hover:border-stone-400"
            >
              Ver Catálogo y Formatos
            </a>

            <span className="hidden sm:inline-block text-stone-500 text-xs">/</span>

            <a
              href="#room-view"
              className="text-xs uppercase tracking-[0.25em] text-stone-300 hover:text-white transition-colors"
            >
              Probar en Habitación
            </a>
          </div>
        </div>

        {/* Curatorial / EXIF bar */}
        <div className="relative z-10 w-full px-6 sm:px-8 py-4 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center text-[10px] font-mono tracking-wider text-stone-400 text-center sm:text-left">
          <div>EDICIÓN LIMITADA · {heroPhoto?.edition ?? '—'} EJEMPLARES</div>
          <div className="hidden sm:block">TRULIFE® ACRYLIC · CHROMALUXE® METAL</div>
          <div>CERTIFICADO DE AUTENTICIDAD DIGITAL</div>
        </div>
      </section>

      {/* Exhibition Grid Section — shared source of truth with Explore.tsx */}
      <section id="galeria" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <ExhibitionGrid
          photos={photos}
          categories={categories}
          loading={loading}
          error={error}
          eyebrow="Archivo de Autor / Ediciones Limitadas"
          title="Obras Insignes & Vault Collection"
          subtitle="Una selección curada de las piezas más representativas de Alvaro Cadena, disponibles para adquisición directa bajo especificación de calidad museística."
        />
      </section>

      {/* Room View Feature Callout Section */}
      <section id="room-view" className="py-20 px-4 sm:px-8 border-t border-zinc-800/80 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Explanatory Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                <i className="bi bi-bounding-box text-white"></i>
                Simulación Espacial Fine-Art
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Simulador 3D de Interiores y Acabados de Museo
              </h2>

              <p className="text-zinc-400 text-sm leading-relaxed">
                Adquirir una obra de arte requiere certeza visual. La plataforma incorpora un simulador de escala que proyecta la fotografía en un entorno contemporáneo de arquitectura interior.
              </p>

              <div className="space-y-4 text-xs text-zinc-300">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                    <i className="bi bi-sun"></i>
                  </div>
                  <div>
                    <strong className="block text-zinc-100 font-semibold mb-0.5">TruLife® Acrylic</strong>
                    Acrílico antirreflejo de grado museístico con protección UV al 99% y shader de brillo especular activo.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                    <i className="bi bi-layers"></i>
                  </div>
                  <div>
                    <strong className="block text-zinc-100 font-semibold mb-0.5">ChromaLuxe® Metal</strong>
                    Sublimación de ultra alta definición sobre aluminio aeroespacial para un acabado satinado ultraligero y duradero.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-white flex-shrink-0">
                    <i className="bi bi-aspect-ratio"></i>
                  </div>
                  <div>
                    <strong className="block text-zinc-100 font-semibold mb-0.5">Escalas Reales</strong>
                    Formatos Classic [24x36"], Statement [40x60"] y Collector [48x72"] con cálculo dinámico de precio.
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Live Demonstration */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
              <RoomView
                imageUrl={photos[0]?.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop&q=80'}
                material="TruLife® Acrylic"
                size="Statement"
              />
              <div className="mt-3 text-center">
                <span className="text-[11px] text-zinc-500 font-medium">
                  Vista interactiva con reflejo de acrílico y proporción de muro contemporáneo
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-obsidian py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <i className="bi bi-camera2 text-xl text-white"></i>
            <div>
              <span className="text-xs font-bold tracking-[0.18em] text-white block">
                TIN CADENA · FINE ART PHOTOGRAPHY
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-0.5">
                Alvaro Cadena Studio · Miami, FL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500 font-medium">
            <a href="#galeria" className="hover:text-zinc-300 transition-colors">
              Catálogo
            </a>
            <a href="#room-view" className="hover:text-zinc-300 transition-colors">
              Simulador
            </a>
            <Link to="/login" className="hover:text-zinc-300 transition-colors">
              Acceso Privado
            </Link>
          </div>
        </div>

        {/* Discrete technical note — engineering credit, relocated out of the gallery narrative */}
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10">
          <details className="group">
            <summary className="cursor-pointer text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors list-none">
              Ficha de ingeniería — stack técnico de la plataforma
            </summary>
            <p className="mt-3 text-[10px] font-mono text-zinc-500 leading-relaxed max-w-3xl">
              Backend: Java 17 · Spring Boot 3.5 · Spring Security 6 Stateless · JWT · STOMP/SockJS · iText PDF.
              Frontend: React 19 · TypeScript · Vite · TailwindCSS · Redux Toolkit. Datos: PostgreSQL 16 ·
              Spring Data JPA · transacciones ACID. Seguridad: RBAC [ADMIN / PHOTOGRAPHER / BUYER] · BCrypt · CORS/CSRF.
            </p>
          </details>
        </div>
      </footer>
    </div>
  )
}
