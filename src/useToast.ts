import { useCallback, useRef, useState } from 'react'

export interface ToastMsg {
  id: number
  testo: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([])
  const nextId = useRef(0)

  const show = useCallback((testo: string) => {
    const id = nextId.current++
    setToasts((prev) => [...prev, { id, testo }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2600)
  }, [])

  return { toasts, show }
}
