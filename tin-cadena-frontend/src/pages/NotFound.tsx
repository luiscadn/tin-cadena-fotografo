// src/pages/NotFound.tsx

import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}