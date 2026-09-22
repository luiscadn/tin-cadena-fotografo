// src/pages/Checkout.tsx

import { useState } from 'react'
import { useCart, useAuth } from '../hooks'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import AlertModal from '../components/AlertModal'
import { SidebarLayout } from '../components/SidebarLayout'
import { getPhotoUrl } from '../utils/imageUtils'

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
  const { items, total, clear, remove } = useCart()
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

      // 2. Resolve buyer ID — or create profile if missing
      const buyersRes = await api.get<BuyerDTO[]>('/v1/buyers')
      let currentBuyer = buyersRes.data.find(
        (b) => b.userId === userId
      )

      if (!currentBuyer) {
        const createBuyerRes = await api.post<BuyerDTO>('/v1/buyers', {
          userId,
          address: 'Dirección de Galería',
          phone: '555-0100',
        })
        currentBuyer = createBuyerRes.data
      }

      const buyerId = currentBuyer.id
      const salesCreated: SaleResult[] = []

      // 3. Process each cart item as a sale
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

          // Download certificate automatically
          await handleDownloadCertificate(saleRes.data.id)
        } catch (itemErr) {
          const axiosErr = itemErr as { response?: { data?: { message?: string } }; message?: string }
          console.error(`Error processing item ${item.name}:`, axiosErr)
          const msg = axiosErr.response?.data?.message || axiosErr.message || ''
          throw new Error(`La obra "${item.name}" ya ha sido vendida o no está disponible. [${msg}]`)
        }
      }

      // Success
      setCreatedSales(salesCreated)
      setSuccess(true)
      clear()
    } catch (err) {
      const errObj = err as Error
      console.error('Error during checkout process:', errObj)
      setError(errObj.message || 'Ocurrió un error al procesar el pago.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <SidebarLayout>
      {/* Header */}
      <header className="pm-page-header border-b border-zinc-800/80 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="pm-page-title flex items-center gap-2.5">
            <i className="bi bi-cart2 text-zinc-400"></i> Mi Carrito de Compras
          </h1>
          <p className="pm-page-subtitle">
            Gestione y formalice la adquisición de obras fotográficas exclusivas de Alvaro Cadena.
          </p>
        </div>
        {items.length > 0 && !success && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-rose-400 py-2 px-3.5 rounded-xl border border-zinc-800 hover:border-rose-900/50 bg-zinc-900/50 transition-all self-start md:self-auto"
          >
            <i className="bi bi-trash3"></i>
            Vaciar Carrito
          </button>
        )}
      </header>

      {/* Error Alert */}
      {error && (
        <div className="p-4 mb-6 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-2xl text-sm font-medium flex items-center gap-2.5">
          <i className="bi bi-exclamation-octagon-fill text-rose-400"></i>
          {error}
        </div>
      )}

      {/* State 1: Success after Purchase */}
      {success ? (
        <div className="max-w-2xl mx-auto py-10">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl text-center backdrop-blur-md">
            <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner">
              <i className="bi bi-patch-check-fill"></i>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              ¡Adquisición Fine-Art Completada!
            </h2>
            
            <p className="text-sm text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Su adquisición ha sido formalizada en el registro de la galería. Se han emitido y firmado digitalmente los Certificados de Autenticidad correspondientes a su colección.
            </p>

            <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 mb-8 text-left space-y-3">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/80 pb-3 flex items-center gap-2">
                <i className="bi bi-file-earmark-check text-zinc-400"></i>
                Certificados de Autenticidad Generados
              </h3>
              {createdSales.map((sale) => (
                <div key={sale.saleId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-2 border-b border-zinc-900 last:border-b-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <i className="bi bi-file-earmark-pdf-fill text-rose-400 text-lg flex-shrink-0"></i>
                    <span className="font-medium text-zinc-200 text-sm truncate">
                      {sale.photoTitle}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleDownloadCertificate(sale.saleId)}
                    disabled={downloadLoading[sale.saleId]}
                    className="border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all self-end sm:self-auto disabled:opacity-50"
                  >
                    {downloadLoading[sale.saleId] ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Descargando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-down-circle"></i> Descargar PDF
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/purchases')}
                className="flex-1 py-3 px-5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <i className="bi bi-bag-check"></i> Ver Mis Adquisiciones
              </button>
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="flex-1 py-3 px-5 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <i className="bi bi-compass"></i> Continuar Explorando
              </button>
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        /* State 2: Empty Cart — identical UX/UI to Purchases */
        <div className="text-center py-24 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
          <i className="bi bi-cart-x text-5xl text-zinc-600 block mb-4"></i>
          <h3 className="text-base font-semibold text-zinc-200">Su carrito está vacío</h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-md mx-auto leading-relaxed">
            Explore nuestra galería fine-art para añadir obras fotográficas exclusivas de edición limitada a su colección personal.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <i className="bi bi-compass"></i>
              Explorar Galería
            </button>
          </div>
        </div>
      ) : (
        /* State 3: Items in Cart & Checkout Overview */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Obras Seleccionadas [{items.length}]
              </h2>
              <span className="text-xs text-zinc-500">
                Edición de Coleccionista
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item.key}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-zinc-700/80 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Photo Thumbnail */}
                  <div className="w-16 h-20 rounded-xl overflow-hidden border border-zinc-800 shadow-md bg-zinc-950 flex-shrink-0">
                    <img
                      src={getPhotoUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="font-semibold text-zinc-100 text-base leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                        {item.size}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                        {item.material}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        Cant: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Remove Button */}
                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/80">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">PRECIO</span>
                    <span className="font-semibold text-white text-lg block">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="mt-0 sm:mt-2 text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition-all text-xs flex items-center gap-1"
                    title="Eliminar de la lista"
                  >
                    <i className="bi bi-trash3 text-sm"></i>
                    <span className="text-[11px] font-medium sm:hidden">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Order Summary */}
          <div className="lg:col-span-1 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 shadow-xl space-y-5 sticky top-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 border-b border-zinc-800/80 pb-3 flex items-center gap-2">
              <i className="bi bi-receipt text-zinc-400"></i>
              Resumen de la Orden
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-400">
                <span>Subtotal obras [{items.length}]</span>
                <span className="font-medium text-zinc-200">
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-zinc-400">
                <span>Certificado de Autenticidad</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <i className="bi bi-check2"></i> Incluido
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>Logística Fine-Art Miami</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <i className="bi bi-check2"></i> Incluido
                </span>
              </div>

              <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-baseline">
                <span className="text-zinc-300 font-semibold text-sm">Total Neto</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white block">
                    ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                    USD · Impuestos Incluidos
                  </span>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
              <i className="bi bi-shield-check text-emerald-400 text-base flex-shrink-0 mt-0.5"></i>
              <span>
                Firma autoral y certificado respaldado directamente por el artista Alvaro Cadena.
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Formalizando Adquisición...
                  </>
                ) : (
                  <>
                    <i className="bi bi-bag-check-fill"></i>
                    Formalizar Adquisición Fine Art
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/explore')}
                disabled={checkoutLoading}
                className="w-full py-2.5 px-4 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs rounded-xl transition-colors text-center disabled:opacity-50"
              >
                Continuar Explorando
              </button>
            </div>
          </div>
        </div>
      )}

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