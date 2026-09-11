import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import ConfirmModal from '../components/ConfirmModal'
import AlertModal from '../components/AlertModal'

interface PermissionDto {
  id: number
  name: string
}

interface RoleDto {
  id: number
  name: string
  permissionIds: number[]
  permissionNames: string[]
}

export const Roles = () => {
  const [roles, setRoles] = useState<RoleDto[]>([])
  const [permissions, setPermissions] = useState<PermissionDto[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    roleId: 0,
    roleName: ''
  })
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  // Modal & Form State
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleDto | null>(null)
  const [roleName, setRoleName] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [rolesRes, permissionsRes] = await Promise.all([
        api.get<RoleDto[]>('/roles'),
        api.get<PermissionDto[]>('/permissions')
      ])
      
      // Safety mapping: ensure permissionIds and permissionNames are always defined
      const mappedRoles = rolesRes.data.map(r => ({
        ...r,
        permissionIds: r.permissionIds || [],
        permissionNames: r.permissionNames || []
      }))
      
      setRoles(mappedRoles)
      setPermissions(permissionsRes.data)
    } catch (err) {
      console.error('Error fetching roles/permissions:', err)
      setError('No se pudieron cargar los datos de roles y permisos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  const handleOpenCreateModal = () => {
    setEditingRole(null)
    setRoleName('')
    setSelectedPermissionIds([])
    setFormError(null)
    setShowModal(true)
  }

  const handleOpenEditModal = (role: RoleDto) => {
    setEditingRole(role)
    setRoleName(role.name)
    setSelectedPermissionIds(role.permissionIds || [])
    setFormError(null)
    setShowModal(true)
  }

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleDeleteRole = async (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      roleId: id,
      roleName: name
    })
  }

  const confirmDeleteRole = async () => {
    try {
      setActionLoading(true)
      await api.delete(`/roles/${confirmModal.roleId}`)
      setRoles(prev => prev.filter(r => r.id !== confirmModal.roleId))
      setConfirmModal({ isOpen: false, roleId: 0, roleName: '' })
    } catch (err) {
      console.error('Error deleting role:', err)
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No fue posible eliminar el rol. Verifique si tiene usuarios asignados.',
        type: 'error'
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!roleName.trim()) {
      setFormError('El nombre del rol es requerido.')
      return
    }

    try {
      setActionLoading(true)
      const payload = {
        name: roleName.trim(),
        permissionIds: selectedPermissionIds
      }

      if (editingRole) {
        // Edit Role
        const res = await api.put<RoleDto>(`/roles/${editingRole.id}`, payload)
        
        // Ensure values from backend response or keep client states mapped
        const updatedRole: RoleDto = {
          ...res.data,
          permissionIds: res.data.permissionIds || selectedPermissionIds,
          permissionNames: res.data.permissionNames || permissions
            .filter(p => selectedPermissionIds.includes(p.id))
            .map(p => p.name)
        }
        
        setRoles(prev => prev.map(r => r.id === editingRole.id ? updatedRole : r))
      } else {
        // Create Role
        const res = await api.post<RoleDto>('/roles', payload)
        
        const newRole: RoleDto = {
          ...res.data,
          permissionIds: res.data.permissionIds || selectedPermissionIds,
          permissionNames: res.data.permissionNames || permissions
            .filter(p => selectedPermissionIds.includes(p.id))
            .map(p => p.name)
        }
        
        setRoles(prev => [...prev, newRole])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Error saving role:', err)
      const axiosError = err as { response?: { data?: { message?: string } } }
      setFormError(axiosError.response?.data?.message || 'Error al guardar los datos del rol. Inténtelo de nuevo.')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-shield-lock text-zinc-400"></i> Roles y Permisos
          </h1>
          <p className="pm-page-subtitle">
            Gestione los perfiles de seguridad, roles del sistema y asigne permisos detallados para controlar el acceso.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 text-xs"
        >
          <i className="bi bi-shield-plus"></i> Nuevo Rol
        </button>
      </header>

      {error && (
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20 text-zinc-400 text-sm">
          <span className="loading loading-spinner loading-md mr-3 text-white"></span>
          Cargando roles y permisos del sistema...
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <i className="bi bi-shield-check text-4xl text-zinc-600 block mb-3"></i>
          <h3 className="text-base font-semibold text-zinc-200">No hay roles registrados</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Comience creando un nuevo rol e instanciando sus permisos.
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 w-20">ID</th>
                  <th className="py-3.5 px-4 w-60">Nombre del Rol</th>
                  <th className="py-3.5 px-4">Permisos Asociados</th>
                  <th className="py-3.5 px-4 text-right w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-sm">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-zinc-800/40 transition-colors align-top">
                    <td className="font-mono text-zinc-500 text-xs py-4 px-4">#{role.id}</td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-zinc-100 text-sm mb-1">{role.name}</div>
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase">{role.name.startsWith('ROLE_') ? 'Definición Interna' : 'Rol Personalizado'}</span>
                    </td>
                    <td className="py-4 px-4">
                      {role.permissionNames && role.permissionNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-full">
                          {role.permissionNames.map((permName, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60 px-2 py-0.5 rounded shadow-sm"
                            >
                              {permName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Sin permisos asignados</span>
                      )}
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(role)}
                          disabled={actionLoading}
                          className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square text-sm"></i>
                        </button>
                        {/* Protect core roles from deletion */}
                        {role.name !== 'ROLE_ADMIN' && role.name !== 'ROLE_PHOTOGRAPHER' && role.name !== 'ROLE_BUYER' ? (
                          <button
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            disabled={actionLoading}
                            className="text-zinc-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
                            title="Eliminar"
                          >
                            <i className="bi bi-trash3 text-sm"></i>
                          </button>
                        ) : (
                          <div className="w-7 h-7 flex items-center justify-center text-zinc-600" title="Rol del Sistema Protegido">
                            <i className="bi bi-lock-fill text-xs"></i>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Create/Edit Role */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 flex flex-col max-h-[85vh] text-zinc-100">
            
            <header className="mb-5 flex justify-between items-center border-b border-zinc-800 pb-3 flex-shrink-0">
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                <i className="bi bi-shield-check text-zinc-400"></i>
                {editingRole ? 'Configurar Rol' : 'Crear Nuevo Rol'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 bg-zinc-800 hover:bg-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white text-xs font-bold transition-colors"
              >
                &times;
              </button>
            </header>

            {formError && (
              <div className="p-3 mb-4 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-medium flex items-center gap-2 flex-shrink-0">
                <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-1 overflow-hidden">
              <div className="flex-shrink-0">
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Nombre del Rol [Ej. ROLE_SUPERVISOR] *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ROLE_SUPERVISOR"
                  className="w-full p-2.5 border border-zinc-800 rounded-xl bg-zinc-950 text-zinc-100 outline-none focus:border-zinc-500 uppercase text-xs"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              {/* Scrollable list of checkboxes for permissions */}
              <div className="flex-1 overflow-y-auto min-h-[150px] border border-zinc-800 rounded-xl p-3 bg-zinc-950/60">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 border-b border-zinc-800 pb-1.5">
                  Asignar Permisos Detallados
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {permissions.map((perm) => {
                    const isChecked = selectedPermissionIds.includes(perm.id)
                    return (
                      <label 
                        key={perm.id} 
                        className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                          isChecked ? 'border-zinc-600 bg-zinc-800/80 text-white' : 'border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded bg-zinc-950 border-zinc-700 text-white"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(perm.id)}
                        />
                        <span className="text-xs font-medium truncate" title={perm.name}>
                          {perm.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 border-t border-zinc-800 pt-4 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-zinc-300 font-semibold transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : editingRole ? (
                    'Guardar Cambios'
                  ) : (
                    'Crear Rol'
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
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${confirmModal.roleName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        onConfirm={confirmDeleteRole}
        onCancel={() => setConfirmModal({ isOpen: false, roleId: 0, roleName: '' })}
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
