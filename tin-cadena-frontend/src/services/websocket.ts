import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { WS_URL } from '@utils/constants'
import { tokenUtils } from '@utils/jwt'

let stompClient: Client | null = null

export const socketService = {
  connect: (): Client => {
    const token = tokenUtils.getToken()

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,

      onConnect: () => {
        console.warn('WebSocket connected')
      },

      onDisconnect: () => {
        console.warn('WebSocket disconnected')
      },

      onStompError: (error) => {
        console.error('WebSocket connection error:', error)
      },
    })

    stompClient.activate()
    return stompClient
  },

  disconnect: (): void => {
    if (stompClient) {
      stompClient.deactivate()
      stompClient = null
    }
  },

  getSocket: (): Client | null => stompClient,
}