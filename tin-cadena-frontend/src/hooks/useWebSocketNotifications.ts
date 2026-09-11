// src/hooks/useWebSocketNotifications.ts

import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import { useFavorites } from './useFavorites'
import { useAuth } from './useAuth'
import SockJS from 'sockjs-client'
import { WS_URL } from '../utils/constants'

export const useWebSocketNotifications = (
  onShowToast: (message: string) => void
) => {
  const { items: favoriteItems } = useFavorites()
  const { isAuthenticated } = useAuth()
  
  const favoriteItemsRef = useRef(favoriteItems)
  const onShowToastRef = useRef(onShowToast)

  useEffect(() => {
    favoriteItemsRef.current = favoriteItems
  }, [favoriteItems])

  useEffect(() => {
    onShowToastRef.current = onShowToast
  }, [onShowToast])

  useEffect(() => {
    if (!isAuthenticated) return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.warn('STOMP WebSocket connected successfully')
        client.subscribe('/topic/wishlist', (message) => {
          console.warn('Received wishlist message:', message.body)
          const text = message.body
          
          // Regex to match photograph ID
          const match = text.match(/ID\s+(\d+)/i)
          if (match && match[1]) {
            const photoId = parseInt(match[1], 10)
            const favPhoto = favoriteItemsRef.current.find((item) => item.id === photoId)
            
            if (favPhoto) {
              onShowToastRef.current(
                `🚨 ¡Atención! Tu obra favorita "${favPhoto.title}" ha sido vendida y ahora está Sold Out.`
              )
            }
          }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP broker error:', frame.headers['message'])
      },
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [isAuthenticated])
}
