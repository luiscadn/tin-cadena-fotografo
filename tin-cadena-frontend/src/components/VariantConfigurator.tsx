// src/components/VariantConfigurator.tsx

import { useState, useMemo } from 'react'
import { useCart } from '../hooks'
import type { Photo, CartItem } from '../types'

interface VariantConfiguratorProps {
  photo: Photo
  onVariantChange?: (material: 'TruLife® Acrylic' | 'ChromaLuxe® Metal', size: 'Classic' | 'Statement' | 'Collector') => void
}

export const VariantConfigurator = ({
  photo,
  onVariantChange,
}: VariantConfiguratorProps) => {
  const { add } = useCart()

  const [material, setMaterial] = useState<'TruLife® Acrylic' | 'ChromaLuxe® Metal'>(
    'TruLife® Acrylic',
  )
  const [size, setSize] = useState<'Classic' | 'Statement' | 'Collector'>('Classic')
  const [quantity, setQuantity] = useState<number>(1)
  const [addedMessage, setAddedMessage] = useState<boolean>(false)

  // Calculations:
  // TruLife® Acrylic: +20% (1.20)
  // ChromaLuxe® Metal: +10% (1.10)
  // Classic: x1.0
  // Statement: x1.5
  // Collector: x2.0
  const finalPrice = useMemo(() => {
    const sizeMultiplier = size === 'Classic' ? 1.0 : size === 'Statement' ? 1.5 : 2.0
    const materialAddon = material === 'TruLife® Acrylic' ? 0.20 : 0.10
    const total = photo.price * sizeMultiplier * (1 + materialAddon)
    return Math.round(total * 100) / 100
  }, [photo.price, material, size])

  const handleMaterialSelect = (selected: 'TruLife® Acrylic' | 'ChromaLuxe® Metal') => {
    setMaterial(selected)
    onVariantChange?.(selected, size)
  }

  const handleSizeSelect = (selected: 'Classic' | 'Statement' | 'Collector') => {
    setSize(selected)
    onVariantChange?.(material, selected)
  }

  const handleAddToCart = () => {
    const key = `${photo.id}-${material}-${size}`
    const item: CartItem = {
      key,
      id: photo.id,
      name: `${photo.title} (${size} / ${material})`,
      quantity,
      price: finalPrice,
      basePrice: photo.price,
      material,
      size,
      image: photo.image,
    }

    add(item)
    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 3000)
  }

  const isSold = photo.status === 'SOLD'

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xl text-stone-800">
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-widest text-stone-400 font-bold mb-1">
          Configurador de Acabados
        </h3>
        <p className="text-sm text-stone-500">
          Personalice el soporte de su obra de arte fine-art.
        </p>
      </div>

      {/* Selector de Material */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Soporte / Material
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isSold}
            onClick={() => handleMaterialSelect('TruLife® Acrylic')}
            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
              material === 'TruLife® Acrylic'
                ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            } ${isSold ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-bold text-stone-900 text-sm">TruLife® Acrylic</span>
            <span className="text-xs text-stone-500 mt-1">Acrílico antireflejo (+20%)</span>
          </button>

          <button
            type="button"
            disabled={isSold}
            onClick={() => handleMaterialSelect('ChromaLuxe® Metal')}
            className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
              material === 'ChromaLuxe® Metal'
                ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
            } ${isSold ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-bold text-stone-900 text-sm">ChromaLuxe® Metal</span>
            <span className="text-xs text-stone-500 mt-1">Aluminio sublimado (+10%)</span>
          </button>
        </div>
      </div>

      {/* Selector de Tamaño */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-stone-700 mb-2">
          Dimensiones de Impresión
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['Classic', 'Statement', 'Collector'] as const).map((s) => {
            const multiplierStr = s === 'Classic' ? 'x1.0' : s === 'Statement' ? 'x1.5' : 'x2.0'
            return (
              <button
                key={s}
                type="button"
                disabled={isSold}
                onClick={() => handleSizeSelect(s)}
                className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition-all ${
                  size === s
                    ? 'border-amber-600 bg-amber-600 text-white shadow-md'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                } ${isSold ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div>{s}</div>
                <div className={`text-[10px] ${size === s ? 'text-amber-100' : 'text-stone-400'} mt-0.5`}>
                  {multiplierStr}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cantidad y Precios */}
      <div className="border-t border-stone-100 pt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs text-stone-400 block font-semibold">VALOR TOTAL</span>
            <span className="text-3xl font-extrabold text-stone-900">
              ${(finalPrice * quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden h-10">
            <button
              type="button"
              disabled={quantity <= 1 || isSold}
              onClick={() => setQuantity((q) => q - 1)}
              className="px-3 bg-stone-50 hover:bg-stone-100 text-stone-600 font-bold h-full transition-colors disabled:opacity-50"
            >
              -
            </button>
            <span className="px-4 text-sm font-semibold text-stone-800">{quantity}</span>
            <button
              type="button"
              disabled={isSold}
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 bg-stone-50 hover:bg-stone-100 text-stone-600 font-bold h-full transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={isSold}
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold text-center flex justify-center items-center gap-2 shadow-lg transition-all ${
            isSold
              ? 'bg-stone-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 active:scale-[0.98]'
          }`}
        >
          {isSold ? (
            <>
              <i className="bi bi-x-circle-fill"></i>
              Agotado (Sold Out)
            </>
          ) : (
            <>
              <i className="bi bi-bag-plus"></i>
              Añadir a la Colección
            </>
          )}
        </button>

        {addedMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg text-center flex items-center justify-center gap-2 animate-pulse">
            <i className="bi bi-check-circle-fill"></i>
            ¡Obra configurada añadida a su carrito!
          </div>
        )}
      </div>
    </div>
  )
}
