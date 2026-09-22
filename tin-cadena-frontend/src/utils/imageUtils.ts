// src/utils/imageUtils.ts

/**
 * Resolves an image path taking into account Vite's BASE_URL
 * and external URLs (e.g. Unsplash or CDN).
 */
export const getPhotoUrl = (path?: string): string => {
  if (!path) {
    return 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop&q=80'
  }

  // If it's already an absolute HTTP/HTTPS URL or data URI, return as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path
  }

  // Normalize path starting slash
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`

  return `${normalizedBase}${normalizedPath}`
}
