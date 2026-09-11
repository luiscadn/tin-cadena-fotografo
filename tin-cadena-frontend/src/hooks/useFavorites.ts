// src/hooks/useFavorites.ts

import { useAppDispatch } from './useAppDispatch'
import { useAppSelector } from './useAppSelector'
import {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
} from '../store/favoritesSlice'
import type { Photo } from '../types'

export const useFavorites = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.favorites.items)

  const add = (photo: Photo) => {
    dispatch(addToFavorites(photo))
  }

  const remove = (id: number) => {
    dispatch(removeFromFavorites(id))
  }

  const clear = () => {
    dispatch(clearFavorites())
  }

  const isFavorite = (id: number) => {
    return items.some((item) => item.id === id)
  }

  return {
    items,
    add,
    remove,
    clear,
    isFavorite,
  }
}
