// src/pages/Purchases.tsx

import { useState, useEffect } from 'react'
import api from '../services/api'
import { SidebarLayout } from '../components/SidebarLayout'
import AlertModal from '../components/AlertModal'
import { useAuth } from '../hooks'
import type { Photo } from '../types'

interface SaleDTO {
  id: number
  buyerId: number
  photographId: number
  saleDate: string
  totalAmount: number
}

interface BuyerDTO {
  id: number
  userId: number
}

interface UserDTO {
  id: number
  username: string
}

export const Purchases = () => {
  const { user } = useAuth()

  const [sales, setSales] = useState<SaleDTO[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Track loading per sale certificate download
  const [downloadLoading, setDownloadLoading] = useState<Record<number, boolean>>({})
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'warning' | 'info'
  })

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch all photos to map details
      const photosRes = await api.get<Photo[]>('/photographs')
      setPhotos(photosRes.data)

      // 1. Fetch current user from /api/users to find ID
      const usersRes = await api.get<UserDTO[]>('/users')
      const currentUserObj = usersRes.data.find(
        (u) => u.username === user.username
      )

      if (currentUserObj) {
        const userId = currentUserObj.id

        // 2. Fetch all buyers to resolve buyerId
        const buyersRes = await api.get<BuyerDTO[]>('/v1/buyers')
        const currentBuyer = buyersRes.data.find(
          (b) => b.userId === userId
        )

        if (currentBuyer) {
          const buyerId = currentBuyer.id
          
          // 3. Fetch sales and filter by buyerId
          const salesRes = await api.get<SaleDTO[]>('/v1/sales')
          const buyerSales = salesRes.data.filter(
            (s) => s.buyerId === buyerId
          )
          // Sort sales by date descending
          buyerSales.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
          setSales(buyerSales)
        }
      }
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setError('Ocurrió un error al cargar su historial de adquisiciones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleDownloadCertificate = async (saleId: number) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [saleId]: true }))
      
      // Perform Axios request with responseType: 'blob'
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
        message: 'No fue posible descargar el Certificado de Autenticidad en este momento.',
        type: 'error'
      })
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [saleId]: false }))
    }
  }

  const getPhotoDetails = (photoId: number): Photo | undefined => {
    return photos.find((p) => p.id === photoId)
  }

  return (
    <SidebarLayout>
      <header className="pm-page-header border-b border-stone-200 pb-4 mb-6">
        <div>
          <h1 className="pm-page-title text-stone-900 font-extrabold flex items-center gap-2">
            <i className="bi bi-bag-check-fill text-amber-700"></i> Mis Adquisiciones
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Historial de obras de arte adquiridas y descarga de certificados criptográficos de autenticidad.
          </p>
        </div>
      </header>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {loading && sales.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-amber-700">
          <span className="loading loading-spinner loading-lg mr-2"></span>
          Recuperando su colección personal...
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8 shadow-md">
          <i className="bi bi-bag-x text-5xl text-stone-300 block mb-4"></i>
          <h3 className="text-lg font-bold text-stone-700">Aún no tiene adquisiciones</h3>
          <p className="text-sm text-stone-500 mt-1">
            Explore nuestra galería fine-art para encontrar su próxima obra de arte única.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => {
            const photo = getPhotoDetails(sale.photographId)
            const isDownloading = downloadLoading[sale.id] || false
            
            return (
              <div
                key={sale.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Photo Thumbnail */}
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-stone-100 flex-shrink-0">
                    <img
                      src={photo?.image || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&auto=format&fit=crop&q=80'}
                      alt={photo?.title || 'Obra'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Metadata */}
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-lg leading-tight">
                      {photo?.title || 'Obra de arte (Eliminada)'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      Adquirido el {new Date(sale.saleDate).toLocaleDateString()}
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-250">
                      ID de Transacción: #{sale.id}
                    </div>
                  </div>
                </div>

                {/* Pricing & Download Certificate button */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                  <div className="mb-0 md:mb-3">
                    <span className="text-[10px] text-stone-400 block font-semibold text-left md:text-right">VALOR PAGADO</span>
                    <span className="font-black text-stone-900 text-xl block">
                      ${sale.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadCertificate(sale.id)}
                    disabled={isDownloading}
                    className="pm-btn pm-btn-success text-xs py-2 px-4 rounded-xl flex items-center gap-2 border-none bg-gradient-to-r from-stone-850 to-stone-950 text-white hover:from-amber-800 hover:to-amber-950 shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Descargando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                        Descargar Certificado
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
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
