import { useCallback, useState } from 'react'
import type { Team } from './types'

const CHIAVE_LS = 'sportshub_preferiti'

function caricaPreferitiLS(): Team[] {
  try {
    const grezzo = localStorage.getItem(CHIAVE_LS)
    return grezzo ? (JSON.parse(grezzo) as Team[]) : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [preferiti, setPreferiti] = useState<Team[]>(caricaPreferitiLS)

  const isPreferita = useCallback((id: string) => preferiti.some((p) => p.id === id), [preferiti])

  const toggle = useCallback((squadra: Team) => {
    setPreferiti((prev) => {
      const next = prev.some((p) => p.id === squadra.id)
        ? prev.filter((p) => p.id !== squadra.id)
        : [...prev, squadra]
      localStorage.setItem(CHIAVE_LS, JSON.stringify(next))
      return next
    })
  }, [])

  return { preferiti, isPreferita, toggle }
}
