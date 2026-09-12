// src/components/PublicNavbar.tsx

import { Link } from 'react-router-dom'

interface PublicNavbarProps {
  isAuthenticated: boolean
  username?: string
  cartCount: number
}

export const PublicNavbar = ({
  isAuthenticated,
  username,
  cartCount,
}: PublicNavbarProps) => {
  return (
    <header className="relative z-10 w-full px-6 sm:px-8 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-[2px]">
      {/* Monogram + brand */}
      <Link to="/" className="flex items-center gap-3">
        <div className="border border-white/80 px-2 py-1 text-[11px] font-mono tracking-widest uppercase text-white">
          TC
        </div>
        <span className="font-serif text-lg tracking-widest uppercase text-white font-light">
          Tin Cadena
        </span>
      </Link>

      {/* Editorial center navigation */}
      <nav className="hidden md:flex items-center space-x-10 text-[11px] font-medium tracking-[0.25em] uppercase text-stone-200">
        <a href="#galeria" className="hover:text-white transition-colors">
          Colecciones
        </a>
        <a href="#room-view" className="hover:text-white transition-colors">
          Room View
        </a>
        <Link to="/checkout" className="hover:text-white transition-colors">
          Adquisiciones
        </Link>
      </nav>

      {/* Account / cart */}
      <div className="flex items-center space-x-6 text-[11px] font-medium tracking-widest uppercase text-stone-200">
        <Link
          to={isAuthenticated ? '/dashboard' : '/login'}
          className="hover:text-white transition-colors"
        >
          {isAuthenticated ? (username ?? 'Mi Panel') : 'Ingresar'}
        </Link>
        <Link
          to="/checkout"
          className="relative hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>Bolsa</span>
          <span className="font-mono text-[10px] text-stone-400">[{cartCount}]</span>
        </Link>
      </div>
    </header>
  )
}
