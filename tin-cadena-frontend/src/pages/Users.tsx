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
      <header className="pm-page-header border-b border-stone-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-people-fill text-amber-600"></i> Gestión de Usuarios
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Administra las cuentas de usuario de la plataforma y sus respectivos roles de acceso.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-amber bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg border-0 transition-all flex items-center gap-2"
        >
          <i className="bi bi-person-plus-fill"></i> Nuevo Usuario
        </button>
      </header>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold flex items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-amber-700">
          <span className="loading loading-spinner loading-lg mr-2"></span>
          Cargando cuentas de usuario...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8">
          <i className="bi bi-people text-5xl text-stone-300 block mb-4"></i>
          <h3 className="text-lg font-bold text-stone-700">No hay usuarios registrados</h3>
          <p className="text-sm text-stone-500 mt-1">
            Comience creando un nuevo usuario administrativo o cliente comprador.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="table w-full text-stone-800">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="font-extrabold text-sm py-4">ID</th>
                  <th className="font-extrabold text-sm py-4">Nombre Completo</th>
                  <th className="font-extrabold text-sm py-4">Usuario</th>
                  <th className="font-extrabold text-sm py-4">Email</th>
                  <th className="font-extrabold text-sm py-4">Rol Asignado</th>
                  <th className="font-extrabold text-sm py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="font-bold text-stone-500 text-xs">{user.id}</td>
                    <td>
                      <div className="font-extrabold text-stone-900">{user.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-ghost font-semibold text-xs py-2 px-2.5">{user.username}</span>
                    </td>
                    <td className="text-sm font-medium text-stone-600">{user.email}</td>
                    <td>
                      <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        user.roleName === 'ROLE_ADMIN' 
                          ? 'bg-red-50 text-red-600 border border-red-200' 
                          : user.roleName === 'ROLE_PHOTOGRAPHER'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {user.roleName.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-ghost text-amber-600 hover:bg-amber-50 rounded-lg p-1.5 focus:outline-none"
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square text-lg"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 rounded-lg p-1.5 focus:outline-none"
                          title="Eliminar"
                        >
                          <i className="bi bi-trash-fill text-lg"></i>
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            
            <header className="mb-5 flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-1.5">
                <i className={`bi ${editingUser ? 'bi-pencil-square text-amber-600' : 'bi-person-plus-fill text-amber-600'}`}></i>
                {editingUser ? 'Editar Cuenta' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 font-bold"
              >
                &times;
              </button>
            </header>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-150 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-stone-850">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  placeholder="Ej. juanperez"
                  className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600 disabled:opacity-60"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ej. juan@correo.com"
                  className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contraseña {editingUser && '(Dejar vacío para conservar actual)'} *
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder="********"
                  className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rol Inicial *
                  </label>
                  <select
                    className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600"
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

              <div className="flex gap-3 border-t border-stone-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-stone-250 hover:bg-stone-50 rounded-xl text-stone-700 font-bold transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
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
