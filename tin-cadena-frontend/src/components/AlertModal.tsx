import { ReactNode } from 'react'

interface AlertModalProps {
  isOpen: boolean
  title: string
  message: string | ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose: () => void
  closeText?: string
}

export default function AlertModal({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  closeText = 'Cerrar',
}: AlertModalProps) {
  if (!isOpen) return null

  const colorClasses = {
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-800',
    info: 'bg-blue-100 border-blue-400 text-blue-800',
  }

  const buttonClasses = {
    success: 'bg-green-500 hover:bg-green-600',
    error: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-500 hover:bg-blue-600',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`rounded-lg shadow-lg max-w-sm mx-4 p-6 border-l-4 ${colorClasses[type]}`}>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="mb-6 opacity-90">{message}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-white rounded-lg transition ${buttonClasses[type]}`}
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  )
}
