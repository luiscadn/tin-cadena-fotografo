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
      <header className="pm-page-header border-b border-stone-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-shield-lock-fill text-amber-600"></i> Roles y Permisos
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Gestione los perfiles de seguridad, roles del sistema y asigne permisos detallados para controlar el acceso.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-amber bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg border-0 transition-all flex items-center gap-2"
        >
          <i className="bi bi-shield-plus"></i> Nuevo Rol
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
          Cargando roles y permisos del sistema...
        </div>
      ) : roles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8">
          <i className="bi bi-shield-check text-5xl text-stone-300 block mb-4"></i>
          <h3 className="text-lg font-bold text-stone-700">No hay roles registrados</h3>
          <p className="text-sm text-stone-500 mt-1">
            Comience creando un nuevo rol e instanciando sus permisos.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="table w-full text-stone-800">
              <thead>
                <tr className="bg-stone-50 text-stone-600 border-b border-stone-200">
                  <th className="font-extrabold text-sm py-4 w-20">ID</th>
                  <th className="font-extrabold text-sm py-4 w-60">Nombre del Rol</th>
                  <th className="font-extrabold text-sm py-4">Permisos Asociados</th>
                  <th className="font-extrabold text-sm py-4 text-right w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-stone-50/50 transition-colors align-top">
                    <td className="font-bold text-stone-500 text-xs pt-5">{role.id}</td>
                    <td className="pt-4">
                      <div className="font-extrabold text-stone-900 tracking-tight text-base mb-1">{role.name}</div>
                      <span className="text-[10px] text-stone-400 font-semibold uppercase">{role.name.startsWith('ROLE_') ? 'Definición Interna' : 'Rol Personalizado'}</span>
                    </td>
                    <td className="py-4">
                      {role.permissionNames && role.permissionNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-full">
                          {role.permissionNames.map((permName, idx) => (
                            <span 
                              key={idx} 
                              className="text-[10px] font-extrabold bg-stone-100 text-stone-650 border border-stone-200 px-2 py-0.5 rounded shadow-sm"
                            >
                              {permName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400 italic font-semibold">Sin permisos asignados</span>
                      )}
                    </td>
                    <td className="text-right pt-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(role)}
                          disabled={actionLoading}
                          className="btn btn-sm btn-ghost text-amber-600 hover:bg-amber-50 rounded-lg p-1.5 focus:outline-none"
                          title="Editar"
                        >
                          <i className="bi bi-pencil-square text-lg"></i>
                        </button>
                        {/* Protect core roles from deletion */}
                        {role.name !== 'ROLE_ADMIN' && role.name !== 'ROLE_PHOTOGRAPHER' && role.name !== 'ROLE_BUYER' ? (
                          <button
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            disabled={actionLoading}
                            className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 rounded-lg p-1.5 focus:outline-none"
                            title="Eliminar"
                          >
                            <i className="bi bi-trash-fill text-lg"></i>
                          </button>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center text-stone-300" title="Rol del Sistema Protegido">
                            <i className="bi bi-lock-fill text-sm"></i>
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white border border-stone-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 flex flex-col max-h-[85vh]">
            
            <header className="mb-5 flex justify-between items-center border-b border-stone-100 pb-3 flex-shrink-0">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-1.5">
                <i className="bi bi-shield-check text-amber-600"></i>
                {editingRole ? 'Configurar Rol' : 'Crear Nuevo Rol'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center justify-center text-stone-500 font-bold"
              >
                &times;
              </button>
            </header>

            {formError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-150 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 flex-shrink-0">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-stone-850 flex flex-col flex-1 overflow-hidden">
              <div className="flex-shrink-0">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nombre del Rol (Ej. ROLE_SUPERVISOR) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ROLE_SUPERVISOR"
                  className="w-full p-2.5 border border-stone-250 rounded-xl bg-stone-50/50 text-stone-900 outline-none focus:ring-2 focus:ring-amber-600 uppercase"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>

              {/* Scrollable list of checkboxes for permissions */}
              <div className="flex-1 overflow-y-auto min-h-[150px] border border-stone-150 rounded-xl p-3 bg-stone-50/30">
                <label className="block text-xs font-bold text-stone-700 mb-2.5 border-b border-stone-100 pb-1.5">
                  Asignar Permisos Detallados
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {permissions.map((perm) => {
                    const isChecked = selectedPermissionIds.includes(perm.id)
                    return (
                      <label 
                        key={perm.id} 
                        className={`flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-stone-50 transition-colors ${
                          isChecked ? 'border-amber-600/35 bg-amber-50/15' : 'border-stone-200 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-amber checkbox-sm rounded"
                          checked={isChecked}
                          onChange={() => handlePermissionToggle(perm.id)}
                        />
                        <span className="text-xs font-bold text-stone-700 truncate" title={perm.name}>
                          {perm.name}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-3 border-t border-stone-100 pt-4 mt-6 flex-shrink-0">
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
