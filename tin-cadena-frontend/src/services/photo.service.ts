// src/services/photo.service.ts

import api from './api'
import { ENDPOINTS } from '../utils/constants'
import type { Photo } from '../types'

export const photoService = {
  getAll: async (): Promise<Photo[]> => {
    const response = await api.get<Photo[]>(ENDPOINTS.PHOTOS.BASE)
    return response.data
  },

  getById: async (id: number): Promise<Photo> => {
    const response = await api.get<Photo>(ENDPOINTS.PHOTOS.BY_ID(id))
    return response.data
  },

  create: async (photo: Omit<Photo, 'id'>): Promise<Photo> => {
    const response = await api.post<Photo>(ENDPOINTS.PHOTOS.BASE, photo)
    return response.data
  },

  update: async (id: number, photo: Partial<Photo>): Promise<Photo> => {
    const response = await api.put<Photo>(
      ENDPOINTS.PHOTOS.BY_ID(id),
      photo,
    )
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(ENDPOINTS.PHOTOS.BY_ID(id))
  },
}