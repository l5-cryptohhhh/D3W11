import { useState } from 'react'
import type { Team } from '../types'
import { IconCheck, IconStar, IconTrash } from './Icon'

type Stato = 'preferito' | 'aggiungibile' | 'gia-preferito'

interface Props {
  squadra: Team
  stato: Stato
  onApri: (squadra: Team) => void
  onAzione: (squadra: Team) => void
}

function Logo({ squadra }: { squadra: Team }) {
  const [errore, setErrore] = useState(false)

  if (!squadra.logo || errore) {
    return (
      <div className="card-logo">
        <div className="logo-placeholder">—</div>
      </div>
    )
  }

  return (
    <div className="card-logo">
      <img src={squadra.logo} alt={`Stemma ${squadra.nome}`} loading="lazy" onError={() => setErrore(true)} />
    </div>
  )
}

export function TeamCard({ squadra, stato, onApri, onAzione }: Props) {
  return (
    <article className="card">
      <div
        className="card-body"
        role="button"
        tabIndex={0}
        aria-label={`Apri dettagli ${squadra.nome}`}
        onClick={() => onApri(squadra)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onApri(squadra)
          }
        }}
      >
        <Logo squadra={squadra} />
        <h3 className="card-nome">{squadra.nome}</h3>
        <p className="card-lega">{squadra.lega || '—'}</p>
        <p className="card-paese">{squadra.paese || '—'}</p>
      </div>

      {stato === 'preferito' && (
        <button type="button" className="btn-rimuovi" onClick={() => onAzione(squadra)}>
          <IconTrash size={16} /> Rimuovi
        </button>
      )}
      {stato === 'gia-preferito' && (
        <button type="button" className="btn-gia" disabled>
          <IconCheck size={16} /> Già nei preferiti
        </button>
      )}
      {stato === 'aggiungibile' && (
        <button type="button" className="btn-aggiungi" onClick={() => onAzione(squadra)}>
          <IconStar size={16} /> Aggiungi ai preferiti
        </button>
      )}
    </article>
  )
}
