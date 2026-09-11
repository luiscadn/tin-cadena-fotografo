import { useEffect, useRef } from 'react'
import { socketService } from '@services/websocket'
import type { Client } from '@stomp/stompjs'

export const useWebSocket = (
  topic: string,
  callback: (message: unknown) => void,
) => {
  const callbackRef = useRef(callback)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const client = socketService.connect()
    clientRef.current = client

    client.onConnect = () => {
      client.subscribe(topic, (message) => {
        try {
          const parsed = JSON.parse(message.body)
          callbackRef.current(parsed)
        } catch {
          callbackRef.current(message.body)
        }
      })
    }

    return () => {
      socketService.disconnect()
    }
  }, [topic])
}