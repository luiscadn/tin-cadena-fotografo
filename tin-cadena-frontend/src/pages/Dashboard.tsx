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
      {/* Welcome Section */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-stone-200">
        <h1 className="text-3xl font-black text-[#2a2421] tracking-tight mb-2">
          {getWelcomeMessage()}
        </h1>
        <p className="text-stone-500 text-lg">
          {getRoleDescription()}
        </p>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actionCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="w-12 h-12 bg-[#2a2421] text-amber-500 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-inner">
              <i className={`bi ${card.icon}`}></i>
            </div>
            <h3 className="text-xl font-bold text-[#2a2421] mb-2">{card.title}</h3>
            <p className="text-stone-500 mb-6 flex-grow leading-relaxed">{card.description}</p>
            <Link 
              to={card.path}
              className="mt-auto block w-full text-center py-2.5 rounded-xl bg-stone-100 hover:bg-[#2a2421] text-[#2a2421] hover:text-white font-bold transition-colors duration-200"
            >
              {card.buttonLabel}
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-stone-50 border border-stone-200 border-dashed rounded-3xl p-10 text-center">
        <i className="bi bi-clock-history text-4xl text-stone-300 mb-3 block"></i>
        <h4 className="text-lg font-bold text-stone-600">Actividad Reciente</h4>
        <p className="text-stone-400 mt-1">Tu historial de navegación y acciones recientes aparecerá aquí.</p>
      </div>
    </SidebarLayout>
  )
}