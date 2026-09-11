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

  const typeStyles = {
    success: {
      border: 'border-emerald-800/60',
      badge: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    },
    error: {
      border: 'border-rose-800/60',
      badge: 'bg-rose-950/60 text-rose-400 border border-rose-800/50',
      button: 'bg-rose-600 hover:bg-rose-500 text-white',
    },
    warning: {
      border: 'border-amber-800/60',
      badge: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
      button: 'bg-amber-600 hover:bg-amber-500 text-white',
    },
    info: {
      border: 'border-zinc-700',
      badge: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      button: 'bg-white hover:bg-zinc-200 text-zinc-950',
    },
  }

  const current = typeStyles[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-zinc-900 border ${current.border} rounded-2xl shadow-2xl max-w-md w-full p-6 text-zinc-100`}>
        <h2 className="text-lg font-bold text-white tracking-tight mb-2">{title}</h2>
        <div className="text-sm text-zinc-400 mb-6 leading-relaxed">{message}</div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-md ${current.button}`}
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  )
}
