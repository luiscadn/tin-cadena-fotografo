// src/hooks/useCart.ts

import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'
import {
  addToCart,
  clearCart,
  removeFromCart,
  updateQuantity,
} from '../store/cartSlice'
import type { CartItem } from '../types'

export const useCart = () => {
  const dispatch = useAppDispatch()

  const {
    items,
    total,
  } = useAppSelector((state) => state.cart)

  const add = (item: CartItem) => {
    dispatch(addToCart(item))
  }

  const remove = (key: string) => {
    dispatch(removeFromCart(key))
  }

  const updateQty = (
    key: string,
    quantity: number,
  ) => {
    dispatch(updateQuantity({
      key,
      quantity,
    }))
  }

  const clear = () => {
    dispatch(clearCart())
  }

  return {
    items,
    total,
    add,
    remove,
    updateQty,
    clear,
  }
}