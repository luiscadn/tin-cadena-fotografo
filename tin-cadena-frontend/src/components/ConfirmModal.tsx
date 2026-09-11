import { ReactNode } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-zinc-100">
        <h2 className="text-lg font-bold text-white tracking-tight mb-2">{title}</h2>
        <div className="text-sm text-zinc-400 mb-6 leading-relaxed">{message}</div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/60 rounded-xl text-zinc-300 font-semibold transition-all text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all text-sm ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
                : 'bg-white hover:bg-zinc-200 text-zinc-950 shadow-md'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
