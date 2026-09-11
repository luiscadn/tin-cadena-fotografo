import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import ConfirmModal from '../components/ConfirmModal'
import AlertModal from '../components/AlertModal'

interface UserDto {
  id: number
  name: string
  username: string
  email: string
  roleName: string
}

interface RoleDto {
  id: number
  name: string
}

export const Users = () => {
  const [users, setUsers] = useState<UserDto[]>([])
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    userId: 0,
    userName: ''
  })
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })
  
  // Modal & Form state
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roleId: ''
  })
  const [formError, setFormError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [usersRes, rolesRes] = await Promise.all([
        api.get<UserDto[]>('/users'),
        api.get<RoleDto[]>('/roles')
      ])
      setUsers(usersRes.data)
      setRoles(rolesRes.data)
    } catch (err) {
      console.error('Error fetching users/roles:', err)
      setError('No se pudieron cargar los datos de administración.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      roleId: roles.length > 0 ? roles[0].id.toString() : ''
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleOpenEditModal = (user: UserDto) => {
    setEditingUser(user)
    
    // Find corresponding role ID from the role list matching the user's roleName
    const matchingRole = roles.find(r => r.name === user.roleName)
    
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      password: '', // Password empty on edit unless user wants to change it
      roleId: matchingRole ? matchingRole.id.toString() : ''
    })
    setFormError(null)
    setShowModal(true)
  }

  const handleDeleteUser = async (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      userId: id,
      userName: name
    })
  }

  const confirmDeleteUser = async () => {
    try {
      setActionLoading(true)
      await api.delete(`/users/${confirmModal.userId}`)
      setUsers(prev => prev.filter(u => u.id !== confirmModal.userId))
      setConfirmModal({ isOpen: false, userId: 0, userName: '' })
    } catch (err) {
      console.error('Error deleting user:', err)
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No fue posible eliminar el usuario.',
        type: 'error'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Form validations
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim()) {
      setFormError('Los campos Nombre, Usuario y Email son obligatorios.')
      return
    }
    
    if (!editingUser && !formData.password) {
      setFormError('La contraseña es obligatoria para nuevos usuarios.')
      return
    }

    try {
      setActionLoading(true)
      if (editingUser) {
        // Edit User
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined // Only update password if filled
        }
        const res = await api.put<UserDto>(`/users/${editingUser.id}`, payload)
        
        // Update user state locally
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...res.data, roleName: editingUser.roleName } : u))
      } else {
        // Create User
        const payload = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          roleId: Number(formData.roleId)
        }
        const res = await api.post<UserDto>('/users', payload)
        setUsers(prev => [...prev, res.data])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Error saving user:', err)
      const axiosError = err as { response?: { data?: { message?: string } } }
      setFormError(axiosError.response?.data?.message || 'Error al guardar los datos del usuario. Inténtelo de nuevo.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-people-fill text-zinc-400"></i> Gestión de Usuarios
          </h1>
          <p className="pm-page-subtitle">
            Administración centralizada de identidades, credenciales y privilegios de acceso.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="pm-btn pm-btn-primary text-sm"
        >
          <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
        </button>
      </header>

      {error && (
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-24 text-zinc-400 text-sm">
          <span className="loading loading-spinner loading-md mr-3 text-white"></span>
          Cargando cuentas de usuario...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <i className="bi bi-people text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="text-base font-semibold text-zinc-200">No hay usuarios registrados</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Comience creando un nuevo usuario administrativo o cliente comprador.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto w-full">
            <table className="table w-full text-zinc-200 border-collapse">
              <thead>
                <tr className="bg-zinc-950/60 text-zinc-400 border-b border-zinc-800/80 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-left w-16">ID</th>
                  <th className="py-3.5 px-4 text-left">Nombre Completo</th>
                  <th className="py-3.5 px-4 text-left">Usuario</th>
                  <th className="py-3.5 px-4 text-left">Email</th>
                  <th className="py-3.5 px-4 text-center">Rol Asignado</th>
                  <th className="py-3.5 px-4 text-center w-28">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-zinc-500">{user.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-100 text-sm">{user.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                        {user.username}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-400">{user.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        user.roleName === 'ROLE_ADMIN' 
                          ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50' 
                          : user.roleName === 'ROLE_PHOTOGRAPHER'
                          ? 'bg-purple-950/40 text-purple-400 border border-purple-800/50'
                          : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                      }`}>
                        {user.roleName.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          disabled={actionLoading}
                          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all"
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={actionLoading}
                          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-rose-800/60 hover:bg-rose-950/30 text-zinc-400 hover:text-rose-300 transition-all"
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Create/Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-zinc-100">
            
            <header className="mb-5 flex justify-between items-center border-b border-zinc-800/80 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <i className={`bi ${editingUser ? 'bi-pencil-square text-zinc-400' : 'bi-person-plus-fill text-zinc-400'}`}></i>
                {editingUser ? 'Editar Cuenta' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white font-bold transition-all"
              >
                &times;
              </button>
            </header>

            {formError && (
              <div className="p-3 mb-4 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill text-rose-400"></i>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-400 text-sm transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  placeholder="Ej. juanperez"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-400 text-sm transition-all disabled:opacity-50"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ej. juan@correo.com"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-400 text-sm transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Contraseña {editingUser && '[Dejar vacío para conservar actual]'} *
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder="********"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-400 text-sm transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Rol Inicial *
                  </label>
                  <select
                    className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 outline-none focus:border-zinc-400 text-sm transition-all"
                    value={formData.roleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name.replace('ROLE_', '')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3 border-t border-zinc-800/80 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-zinc-800 hover:bg-zinc-800/60 rounded-xl text-zinc-300 font-semibold transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
                >
                  {actionLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : editingUser ? (
                    'Guardar Cambios'
                  ) : (
                    'Crear Usuario'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Confirm Delete */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${confirmModal.userName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeleteUser}
        onCancel={() => setConfirmModal({ isOpen: false, userId: 0, userName: '' })}
      />

      {/* Modal - Alert */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
      />
    </SidebarLayout>
  )
}
