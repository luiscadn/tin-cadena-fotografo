// src/pages/Checkout.tsx

import { useState } from 'react'
import { useCart, useAuth } from '../hooks'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import AlertModal from '../components/AlertModal'

interface BuyerDTO {
  id: number
  userId: number
  address?: string
  phone?: string
}

interface UserDTO {
  id: number
  username: string
}

interface SaleResult {
  saleId: number
  photoTitle: string
}

export const Checkout = () => {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Checkout success state
  const [success, setSuccess] = useState(false)
  const [createdSales, setCreatedSales] = useState<SaleResult[]>([])
  const [downloadLoading, setDownloadLoading] = useState<Record<number, boolean>>({})
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  const handleDownloadCertificate = async (saleId: number) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [saleId]: true }))
      
      const response = await api.get(`/v1/sales/${saleId}/certificate`, {
        responseType: 'blob',
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `certificado_autenticidad_${saleId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error downloading certificate:', err)
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'No fue posible descargar el certificado en este momento.',
        type: 'error'
      })
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [saleId]: false }))
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      setError('Debe iniciar sesión para realizar la compra.')
      return
    }

    try {
      setCheckoutLoading(true)
      setError(null)

      // 1. Resolve current user ID
      const usersRes = await api.get<UserDTO[]>('/users')
      const currentUserObj = usersRes.data.find(
        (u) => u.username === user.username
      )

      if (!currentUserObj) {
        throw new Error('No se pudo verificar el perfil del usuario.')
      }

      const userId = currentUserObj.id

      // 2. Resolve buyer ID (or create profile if missing)
      const buyersRes = await api.get<BuyerDTO[]>('/v1/buyers')
      let currentBuyer = buyersRes.data.find(
        (b) => b.userId === userId
      )

      if (!currentBuyer) {
        // Create buyer profile
        const createBuyerRes = await api.post<BuyerDTO>('/v1/buyers', {
          userId,
          address: 'Dirección de Galería',
          phone: '555-0100',
        })
        currentBuyer = createBuyerRes.data
      }

      const buyerId = currentBuyer.id
      const salesCreated: SaleResult[] = []

      // 3. Process each cart item as a sale (photograph status is set to SOLD)
      for (const item of items) {
        try {
          const saleRes = await api.post<{ id: number }>('/v1/sales', {
            buyerId,
            photographId: item.id,
            totalAmount: item.price,
          })
          
          salesCreated.push({
            saleId: saleRes.data.id,
            photoTitle: item.name,
          })

          // Download certificate automatically right away
          await handleDownloadCertificate(saleRes.data.id)
        } catch (itemErr) {
          const axiosErr = itemErr as { response?: { data?: { message?: string } }; message?: string }
          console.error(`Error processing item ${item.name}:`, axiosErr)
          // Check if already sold
          const msg = axiosErr.response?.data?.message || axiosErr.message || ''
          throw new Error(`La obra "${item.name}" ya ha sido vendida o no está disponible. (${msg})`)
        }
      }

      // Success
      setCreatedSales(salesCreated)
      setSuccess(true)
      clear()
    } catch (err) {
      const error = err as Error
      console.error('Error during checkout process:', error)
      setError(error.message || 'Ocurrió un error al procesar el pago.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-850">
        <div className="max-w-xl w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            <i className="bi bi-patch-check-fill animate-bounce"></i>
          </div>

          <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
            ¡Adquisición Completada!
          </h2>
          
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Su pago ha sido procesado de forma segura. Sus Certificados de Autenticidad Fine Art firmados digitalmente han sido generados.
          </p>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-8 text-left space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-2">
              Certificados Descargados
            </h3>
            {createdSales.map((sale) => (
              <div key={sale.saleId} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-700 truncate max-w-[280px]">
                  {sale.photoTitle}
                </span>
                
                <button
                  type="button"
                  onClick={() => handleDownloadCertificate(sale.saleId)}
                  disabled={downloadLoading[sale.saleId]}
                  className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 disabled:opacity-50"
                >
                  {downloadLoading[sale.saleId] ? (
                    'Descargando...'
                  ) : (
                    <>
                      <i className="bi bi-arrow-down-circle"></i> Descargar de nuevo
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/explore')}
              className="flex-1 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg transition-colors"
            >
              Volver a la Galería
            </button>
            <button
              onClick={() => navigate('/purchases')}
              className="flex-1 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold rounded-xl transition-colors"
            >
              Ver Mis Adquisiciones
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-850">
        <div className="text-center bg-white border border-stone-200 rounded-2xl p-8 shadow-xl max-w-sm w-full">
          <i className="bi bi-cart-x text-5xl text-stone-300 block mb-4"></i>
          <h2 className="text-xl font-extrabold mb-2">Su Carrito está vacío</h2>
          <p className="text-sm text-stone-500 mb-6">
            Añada obras fotográficas fine-art a su colección para poder realizar el checkout.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className="w-full py-2.5 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-xl shadow"
          >
            Explorar Obras
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 text-stone-850 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-stone-900 tracking-tight mb-2">
          Adquisición de Colección
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          Por favor, verifique los detalles de sus obras de arte fine-art antes de despachar la orden.
        </p>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            {error}
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-4 mb-6 border-b border-stone-150 pb-6">
          <h3 className="font-bold text-stone-800 text-sm">Resumen de Adquisición</h3>
          
          {items.map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center py-3 border-b border-stone-100 last:border-b-0 text-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-12 rounded border border-stone-200 overflow-hidden bg-stone-50">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-stone-800 block leading-tight">{item.name}</span>
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">
                    {item.size} • {item.material}
                  </span>
                </div>
              </div>
              <span className="font-black text-stone-900 text-sm">
                ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-amber-50/40 border border-amber-900/10 p-5 rounded-2xl mb-8 flex justify-between items-center">
          <div>
            <span className="text-xs text-stone-450 block font-bold">MONTO TOTAL NETO</span>
            <span className="text-3xl font-black text-stone-900">
              ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold uppercase px-2 py-1 rounded border border-amber-250">
            USD
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/explore')}
            disabled={checkoutLoading}
            className="flex-1 py-3 border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            Continuar Explorando
          </button>
          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="flex-1 py-3 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {checkoutLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Procesando Orden...
              </>
            ) : (
              <>
                <i className="bi bi-wallet2"></i>
                Completar Compra Fine Art
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal - Alert */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal({ isOpen: false, title: '', message: '', type: 'error' })}
      />
    </div>
  )
}