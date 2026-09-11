// src/store/favoritesSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Photo } from '../types'

interface FavoritesState {
  items: Photo[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Photo>) => {
      const exists = state.items.some((item) => item.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearFavorites: (state) => {
      state.items = []
    },
  },
})

export const { addToFavorites, removeFromFavorites, clearFavorites } =
  favoritesSlice.actions
export default favoritesSlice.reducer
