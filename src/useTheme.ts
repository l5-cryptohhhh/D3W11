import { useCallback, useEffect, useState } from 'react'

type Tema = 'light' | 'dark'

const CHIAVE_LS = 'sportshub_tema'

function temaIniziale(): Tema {
  const salvato = localStorage.getItem(CHIAVE_LS)
  if (salvato === 'light' || salvato === 'dark') return salvato
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [tema, setTema] = useState<Tema>(temaIniziale)

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    localStorage.setItem(CHIAVE_LS, tema)
  }, [tema])

  const toggle = useCallback(() => setTema((t) => (t === 'dark' ? 'light' : 'dark')), [])

  return { tema, toggle }
}
