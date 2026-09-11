import { Link } from 'react-router-dom'
import { SidebarLayout } from '../components/SidebarLayout'
import { useAuth } from '../hooks'

interface ActionCard {
  title: string
  description: string
  icon: string
  path: string
  buttonLabel: string
}

export const Dashboard = () => {
  const { user } = useAuth()
  const roles = user?.roles ?? []

  const isAdmin = roles.includes('ROLE_ADMIN')
  const isPhotographer = roles.includes('ROLE_PHOTOGRAPHER')
  const isBuyer = roles.includes('ROLE_BUYER')

  // Generate dynamic welcome message based on role
  const getWelcomeMessage = () => {
    if (isAdmin) return `Bienvenido, Administrador ${user?.username || ''}`
    if (isPhotographer) return `Bienvenido, Maestro ${user?.username || ''}`
    if (isBuyer) return `Hola, Coleccionista ${user?.username || ''}`
    return `Bienvenido, ${user?.username || ''}`
  }
  
  // Generate description based on role
  const getRoleDescription = () => {
    if (isAdmin) return 'Panel de control centralizado para la administración de la plataforma.'
    if (isPhotographer) return 'Gestiona tu portafolio artístico y supervisa el rendimiento de tus obras.'
    if (isBuyer) return 'Descubre, adquiere y colecciona piezas fotográficas exclusivas.'
    return 'Panel de control personal.'
  }

  const actionCards: ActionCard[] = []

  if (isAdmin) {
    actionCards.push(
      { title: 'Gestión de Obras', description: 'Administra todo el catálogo de la galería.', icon: 'bi-images', path: '/photographs', buttonLabel: 'Ver Obras' },
      { title: 'Usuarios', description: 'Gestiona las cuentas de la plataforma.', icon: 'bi-people', path: '/users', buttonLabel: 'Ver Usuarios' },
      { title: 'Roles y Permisos', description: 'Control de acceso al sistema.', icon: 'bi-shield-check', path: '/roles', buttonLabel: 'Gestionar Roles' }
    )
  } else if (isPhotographer) {
    actionCards.push(
      { title: 'Catálogo de Arte', description: 'Publica y edita tus obras fotográficas.', icon: 'bi-camera', path: '/photographs', buttonLabel: 'Gestionar Catálogo' },
      { title: 'Ventas y Rendimiento', description: 'Monitorea las adquisiciones de tus piezas.', icon: 'bi-graph-up-arrow', path: '/sales', buttonLabel: 'Ver Ventas' },
      { title: 'Mi Perfil', description: 'Actualiza tu biografía y detalles artísticos.', icon: 'bi-person-badge', path: '/profile', buttonLabel: 'Editar Perfil' }
    )
  } else if (isBuyer) {
    actionCards.push(
      { title: 'Explorar Galería', description: 'Descubre nuevas obras para tu colección.', icon: 'bi-compass', path: '/explore', buttonLabel: 'Ir a Explorar Galería' },
      { title: 'Lista de Deseos', description: 'Revisa las obras que has marcado como favoritas.', icon: 'bi-heart', path: '/favorites', buttonLabel: 'Ver Favoritos' },
      { title: 'Mis Adquisiciones', description: 'Accede a tus certificados de autenticidad y compras.', icon: 'bi-bag-check', path: '/purchases', buttonLabel: 'Ver Compras' }
    )
  } else {
    actionCards.push(
      { title: 'Mi Perfil', description: 'Gestiona tu información personal.', icon: 'bi-person-badge', path: '/profile', buttonLabel: 'Editar Perfil' }
    )
  }

  return (
    <SidebarLayout>
      {/* Welcome Header */}
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-8">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-house-door text-zinc-400"></i> {getWelcomeMessage()}
          </h1>
          <p className="pm-page-subtitle">
            {getRoleDescription()}
          </p>
        </div>
      </header>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actionCards.map((card, index) => (
          <div
            key={index}
            className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-lg hover:border-zinc-700/80 transition-all flex flex-col h-full backdrop-blur-sm"
          >
            <div className="w-12 h-12 bg-zinc-800/80 border border-zinc-700/60 text-white rounded-xl flex items-center justify-center text-xl mb-5 shadow-inner">
              <i className={`bi ${card.icon}`}></i>
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-2">{card.title}</h3>
            <p className="text-zinc-400 text-xs mb-6 flex-grow leading-relaxed">{card.description}</p>
            <Link 
              to={card.path}
              className="mt-auto block w-full text-center py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-all shadow-sm active:scale-95"
            >
              {card.buttonLabel}
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-2xl p-8 text-center backdrop-blur-sm">
        <i className="bi bi-clock-history text-3xl text-zinc-600 mb-3 block"></i>
        <h4 className="text-sm font-semibold text-zinc-300">Actividad Reciente</h4>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          Su historial de adquisiciones y actividad artística aparecerá reflejado aquí.
        </p>
      </div>
    </SidebarLayout>
  )
}