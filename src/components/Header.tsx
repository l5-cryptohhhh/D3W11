import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { SportFiltro } from '../types'
import { IconSearch } from './Icon'
import { ThemeToggle } from './ThemeToggle'

// three.js è ~600kB: caricato solo lato client, fuori dal bundle iniziale.
const Hero3D = lazy(() => import('./Hero3D').then((m) => ({ default: m.Hero3D })))

const FILTRI: { label: string; sport: SportFiltro }[] = [
  { label: 'Tutti', sport: '' },
  { label: 'Calcio', sport: 'Soccer' },
  { label: 'Basket', sport: 'Basketball' },
  { label: 'Football', sport: 'American Football' },
]

interface Props {
  sportAttivo: SportFiltro
  tema: 'light' | 'dark'
  onCerca: (query: string) => void
  onSportChange: (sport: SportFiltro) => void
  onToggleTema: () => void
}

export function Header({ sportAttivo, tema, onCerca, onSportChange, onToggleTema }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [scorso, setScorso] = useState(false)

  const cerca = () => onCerca(inputRef.current?.value ?? '')

  useEffect(() => {
    const onScroll = () => setScorso(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scorciatoia "/" per portare il focus sulla ricerca, come in molti tool da tastiera.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const inCampoTesto = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (e.key === '/' && !inCampoTesto) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={`site-header${scorso ? ' is-scorso' : ''}`}>
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>
      <ThemeToggle tema={tema} onToggle={onToggleTema} />

      <div className="header-inner">
        <h1 className="logo">SportsHub</h1>
        <p className="subtitle">Cerca una squadra, scopri prossime partite e ultimi risultati.</p>

        <div className="search-bar">
          <IconSearch className="search-icona" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Cerca una squadra… (premi /)"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter') cerca()
            }}
          />
          <button type="button" className="btn-cerca" onClick={cerca}>
            Cerca
          </button>
        </div>

        <div className="sport-filtri" role="group" aria-label="Filtra per sport">
          {FILTRI.map((f) => (
            <button
              key={f.sport}
              type="button"
              className={`filtro${f.sport === sportAttivo ? ' is-attivo' : ''}`}
              onClick={() => onSportChange(f.sport)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
