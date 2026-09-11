// src/store/cartSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartState, CartItem } from '../types'

const initialState: CartState = {
  items: [],
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.key === action.payload.key,
      )
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.key !== action.payload)
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ key: string; quantity: number }>,
    ) => {
      const item = state.items.find((i) => i.key === action.payload.key)
      if (item) {
        item.quantity = action.payload.quantity
      }
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions
export default cartSlice.reducer