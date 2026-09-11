// src/pages/NotFound.tsx

import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100 p-6">
      <div className="max-w-md w-full text-center bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <span className="font-mono text-5xl font-extrabold text-zinc-600 block mb-2">404</span>
        <h1 className="text-xl font-bold text-white mb-2">
          Página no encontrada
        </h1>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          La vista o recurso que intenta consultar no existe o ha sido trasladado dentro de la galería.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <i className="bi bi-house"></i>
          Volver al Inicio
        </button>
      </div>
    </div>
  )
}