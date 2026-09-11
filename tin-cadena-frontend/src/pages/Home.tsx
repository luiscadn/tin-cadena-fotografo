// src/pages/Home.tsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { RoomView } from '../components/RoomView'
import { VariantConfigurator } from '../components/VariantConfigurator'
import { useAuth, useCart } from '../hooks'
import type { Photo } from '../types'

interface Category {
  id: number
  name: string
}

export const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const { items: cartItems } = useCart()

  const [photos, setPhotos] = useState<Photo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<number | ''>('')

  // Modal State for Preview & Room Simulator
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>('TruLife® Acrylic')
  const [selectedSize, setSelectedSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')

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
        setPhotos(photosRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        console.error('Error fetching public gallery:', err)
        setError('No fue posible cargar el catálogo público en este momento.')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicData()
  }, [])

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCat === '' || p.categoryId === selectedCat
    return matchesSearch && matchesCat
  })

  const handleOpenPhoto = (photo: Photo) => {
    setSelectedPhoto(photo)
    setSelectedMaterial('TruLife® Acrylic')
    setSelectedSize('Classic')
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-white selection:text-black">
      {/* Sticky Glassmorphic Navbar */}
      <nav className="sticky top-0 z-40 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white text-lg group-hover:border-zinc-500 transition-colors">
              <i className="bi bi-camera2"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-[0.2em] text-white">
                TIN CADENA
              </span>
              <span className="text-[8px] tracking-[0.22em] uppercase text-zinc-400 font-semibold">
                Fine Art Photography · Miami
              </span>
            </div>
          </Link>

          {/* Quick Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
            <a href="#galeria" className="hover:text-white transition-colors">
              Galería de Obras
            </a>
            <a href="#room-view" className="hover:text-white transition-colors">
              Simulador Room View
            </a>
            <a href="#arquitectura" className="hover:text-white transition-colors">
              Arquitectura de Software
            </a>
          </div>

          {/* User / Cart Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/checkout"
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              title="Carrito de compras"
            >
              <i className="bi bi-cart2 text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-zinc-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <i className="bi bi-speedometer2"></i>
                <span>Mi Panel [{user?.username}]</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm active:scale-95 hidden sm:inline-flex"
                >
                  Registro
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32 border-b border-zinc-800/80 bg-gradient-to-b from-[#0e0e14] via-[#09090b] to-[#09090b]">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Galería Fine-Art & Portafolio de Arquitectura
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Fotografía de Autor en <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500">
              Edición Limitada
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Obras exclusivas capturadas por el fotógrafo <strong>Alvaro Cadena</strong> en Miami.
            Impresiones de grado museístico en <strong>TruLife® Acrylic</strong> y <strong>ChromaLuxe® Metal</strong> con certificado digital de autenticidad emitido en tiempo real.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#galeria"
              className="px-6 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="bi bi-images"></i>
              Explorar Catálogo Abierto
            </a>

            <a
              href="#room-view"
              className="px-5 py-3 border border-zinc-800 hover:bg-zinc-800/80 text-zinc-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <i className="bi bi-eye"></i>
              Simulador Room View
            </a>

            <a
              href="#arquitectura"
              className="px-5 py-3 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 text-zinc-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <i className="bi bi-diagram-3"></i>
              Ficha de Ingeniería
            </a>
          </div>
        </div>
      </section>

      {/* Public Exhibition Gallery Section */}
      <section id="galeria" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6 mb-8">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
              Catálogo Abierto
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Exposición de Obras Fotográficas
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Consulte las piezas de edición limitada disponibles. Puede previsualizarlas en escala con el simulador interactivo antes de iniciar sesión.
            </p>
          </div>

          <div className="text-xs font-semibold text-zinc-400 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl self-start md:self-auto">
            {filteredPhotos.length} obras exhibidas
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800/80 backdrop-blur-sm shadow-lg">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-800 rounded-xl text-xs bg-zinc-950 text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
              placeholder="Buscar por título, temática o descripción..."
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCat('')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCat === ''
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat.id
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl text-sm font-medium flex items-center gap-2.5">
            <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-zinc-400 text-sm">
            <span className="loading loading-spinner loading-md mr-3 text-white"></span>
            Cargando piezas de la galería...
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
            <i className="bi bi-camera text-4xl text-zinc-600 block mb-3"></i>
            <h3 className="text-base font-semibold text-zinc-200">No se encontraron obras</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Pruebe ajustando el criterio de búsqueda o seleccionando otra categoría.
            </p>
          </div>
        ) : (
          /* Artworks Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => {
              const isSold = photo.status === 'SOLD'

              return (
                <div
                  key={photo.id}
                  onClick={() => handleOpenPhoto(photo)}
                  className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-zinc-600/80 transition-all cursor-pointer flex flex-col backdrop-blur-sm"
                >
                  {/* Image Container with Zoom Effect */}
                  <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                    <img
                      src={photo.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop&q=80'}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isSold ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-900/90 text-zinc-400 border border-zinc-700/60 backdrop-blur-md">
                          Adquirida
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 backdrop-blur-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Disponible
                        </span>
                      )}
                    </div>

                    {/* Edition Tag */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/60 text-zinc-300 border border-white/10 backdrop-blur-md">
                        Edición: {photo.edition || 1}
                      </span>
                    </div>

                    {/* Quick Action Overlay */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-3 py-1.5 bg-white text-zinc-950 font-semibold text-xs rounded-xl shadow-lg flex items-center gap-1.5">
                        <i className="bi bi-eye"></i> Simular
                      </span>
                    </div>
                  </div>

                  {/* Artwork Metadata */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-baseline gap-2 mb-1.5">
                      <h3 className="font-semibold text-zinc-100 text-base leading-snug group-hover:text-white transition-colors truncate">
                        {photo.title}
                      </h3>
                      <span className="font-bold text-white text-base flex-shrink-0">
                        ${photo.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                      {photo.description || 'Fotografía de edición de autor capturada en Miami.'}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <i className="bi bi-person text-zinc-400"></i> Alvaro Cadena
                      </span>
                      <span className="text-zinc-400 font-medium">
                        TruLife® / ChromaLuxe®
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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

      {/* Software Architecture & Engineering Showcase Section */}
      <section id="arquitectura" className="py-20 px-4 sm:px-8 border-t border-zinc-800/80">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-4">
              <i className="bi bi-code-slash text-white"></i>
              Portafolio Técnico
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Arquitectura de Software & Stack Tecnológico
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
              Diseño integral desacoplado bajo principios de Domain-Driven Design, seguridad sin estado [stateless], concurrencia transaccional y comunicación bidireccional en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Backend */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white text-lg mb-4 shadow-inner">
                <i className="bi bi-hdd-rack"></i>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Backend Enterprise
              </h3>
              <ul className="text-xs text-zinc-400 space-y-2 flex-1">
                <li>• Java 17 LTS</li>
                <li>• Spring Boot 3.5</li>
                <li>• Spring Security 6 Stateless</li>
                <li>• JWT Tokens con Claims</li>
                <li>• STOMP WebSockets / SockJS</li>
                <li>• iText PDF Generator [Certificados]</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                tin-cadena-backend
              </div>
            </div>

            {/* Card 2: Frontend */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white text-lg mb-4 shadow-inner">
                <i className="bi bi-window"></i>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Frontend SPA
              </h3>
              <ul className="text-xs text-zinc-400 space-y-2 flex-1">
                <li>• React 19 + TypeScript</li>
                <li>• Vite Build Engine</li>
                <li>• TailwindCSS + DaisyUI</li>
                <li>• Redux Toolkit [Cart & Auth]</li>
                <li>• Plus Jakarta Sans Typography</li>
                <li>• Responsive Glassmorphism</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                tin-cadena-frontend
              </div>
            </div>

            {/* Card 3: Database */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white text-lg mb-4 shadow-inner">
                <i className="bi bi-database"></i>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Persistencia & Datos
              </h3>
              <ul className="text-xs text-zinc-400 space-y-2 flex-1">
                <li>• PostgreSQL 16 RDBMS</li>
                <li>• Spring Data JPA / Hibernate</li>
                <li>• Transacciones ACID</li>
                <li>• Índices y Claves Foráneas</li>
                <li>• Control de Ediciones Limitadas</li>
                <li>• Auditoría de Compras y Ventas</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                schema: photo_market
              </div>
            </div>

            {/* Card 4: Security & RBAC */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-lg flex flex-col backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white text-lg mb-4 shadow-inner">
                <i className="bi bi-shield-check"></i>
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                Seguridad & Roles
              </h3>
              <ul className="text-xs text-zinc-400 space-y-2 flex-1">
                <li>• ROLE_ADMIN [Gestión global]</li>
                <li>• ROLE_PHOTOGRAPHER [Obras]</li>
                <li>• ROLE_BUYER [Adquisiciones]</li>
                <li>• Catálogo Público GET Abierto</li>
                <li>• BCrypt Password Hashing</li>
                <li>• CORS & CSRF Hardening</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                RBAC Fine-Grained
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 px-6">
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
            <a href="#arquitectura" className="hover:text-zinc-300 transition-colors">
              Arquitectura
            </a>
            <Link to="/login" className="hover:text-zinc-300 transition-colors">
              Acceso Privado
            </Link>
          </div>

          <div className="text-[10px] text-zinc-600 font-medium text-center sm:text-right">
            Plataforma de Ingeniería de Software para Portafolio Profesional
          </div>
        </div>
      </footer>

      {/* Artwork Modal Preview with Room View & Variant Configurator */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col text-zinc-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4 mb-6 flex-shrink-0">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Inspección Fine-Art & Simulador
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedPhoto.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto pr-1">
              {/* Left Column: Room View Simulation */}
              <div>
                <RoomView
                  imageUrl={selectedPhoto.image}
                  material={selectedMaterial}
                  size={selectedSize}
                />
                
                <div className="mt-4 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200 block mb-1 font-semibold">
                    Certificado de Autenticidad Incluido:
                  </strong>
                  Cada adquisición genera un certificado en formato PDF emitido por Alvaro Cadena con identificador único de transacción.
                </div>
              </div>

              {/* Right Column: Configurator & Order Form */}
              <div className="flex flex-col justify-between">
                <VariantConfigurator
                  photo={selectedPhoto}
                  onVariantChange={(m, s) => {
                    setSelectedMaterial(m)
                    setSelectedSize(s)
                  }}
                />

                {!isAuthenticated && (
                  <div className="mt-4 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between gap-3">
                    <span>Para concretar la compra y registrar el certificado a su nombre:</span>
                    <Link
                      to="/login"
                      className="px-3 py-1.5 bg-white text-zinc-950 font-semibold rounded-lg text-xs hover:bg-zinc-200 whitespace-nowrap"
                    >
                      Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
