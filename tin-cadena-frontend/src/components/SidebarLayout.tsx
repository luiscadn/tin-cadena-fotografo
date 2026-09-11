import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../hooks'
import ConfirmModal from './ConfirmModal'

interface SidebarLayoutProps {
  children: ReactNode
}

interface NavigationItem {
  label: string
  path: string
  icon: string
}

export const SidebarLayout = ({
  children,
}: SidebarLayoutProps) => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { items: cartItems } = useCart()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const roles = user?.roles ?? []

  const isAdmin = roles.includes('ROLE_ADMIN')
  const isPhotographer = roles.includes('ROLE_PHOTOGRAPHER')

  const generalItems: NavigationItem[] = [
    { label: 'Panel Principal', path: '/dashboard', icon: 'bi-house' },
    { label: 'Explorar Galería', path: '/explore', icon: 'bi-compass' },
    { label: 'Mis Favoritos', path: '/favorites', icon: 'bi-heart' },
    { label: 'Mis Compras', path: '/purchases', icon: 'bi-bag' },
    { label: `Carrito ${cartItemsCount > 0 ? `(${cartItemsCount})` : ''}`, path: '/checkout', icon: 'bi-cart2' },
  ]

  const operativeItems: NavigationItem[] = []
  
  if (isPhotographer || isAdmin) {
    operativeItems.push({ label: 'Gestión de Obras', path: '/photographs', icon: 'bi-camera' })
  }
  
  if (isAdmin) {
    operativeItems.push({ label: 'Usuarios', path: '/users', icon: 'bi-people' })
    operativeItems.push({ label: 'Roles', path: '/roles', icon: 'bi-shield-lock' })
  }

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    setShowLogoutModal(false)
    await logout()
    navigate('/login')
  }

  const NavItem = ({ item }: { item: NavigationItem }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-white/10 text-white font-semibold border border-white/15 shadow-sm'
            : 'text-zinc-400 font-medium hover:bg-white/5 hover:text-zinc-200'
        }`
      }
    >
      <i className={`bi ${item.icon} text-base`}></i>
      {item.label}
    </NavLink>
  )

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col bg-[#0d0d12] text-zinc-300 border-r border-white/5 shadow-2xl z-10 sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <i className="bi bi-camera2 text-2xl text-white"></i>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.18em] text-white" style={{ fontFamily: "'Cinzel', serif" }}>
              TIN CADENA
            </span>
            <span className="text-[8px] tracking-[0.2em] uppercase text-zinc-400 font-semibold">
              Fine Art · Miami
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          
          {/* General Block */}
          <nav className="flex flex-col gap-1">
            <h3 className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Colección & Galería</h3>
            {generalItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Operative Block */}
          {operativeItems.length > 0 && (
            <nav className="flex flex-col gap-1">
              <h3 className="px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Gestión & Catálogo</h3>
              {operativeItems.map((item) => (
                <NavItem key={item.path} item={item} />
              ))}
            </nav>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0a0a0e]">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all font-medium text-xs tracking-wider uppercase"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden relative">
        <div className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>

      {/* Modal - Confirm Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas salir de la aplicación?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
        isDangerous={false}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  )
}