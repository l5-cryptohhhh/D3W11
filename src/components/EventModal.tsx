import { useEffect } from 'react'
import type { EventItem } from '../types'
import { dataFormattata, punteggio } from '../utils'
import { IconX } from './Icon'

interface Props {
  ev: EventItem | null
  onClose: () => void
}

function Riga({ etichetta, valore }: { etichetta: string; valore: string }) {
  return (
    <div className="modal-riga">
      <span className="modal-etichetta">{etichetta}</span>
      <span className="modal-valore">{valore}</span>
    </div>
  )
}

export function EventModal({ ev, onClose }: Props) {
  useEffect(() => {
    if (!ev) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [ev, onClose])

  if (!ev) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-finestra"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-titolo">
            {ev.casa} vs {ev.trasferta}
          </h3>
          <button type="button" className="modal-chiudi" aria-label="Chiudi" onClick={onClose}>
            <IconX size={18} />
          </button>
        </div>
        <div className="modal-corpo">
          <Riga etichetta="Data" valore={dataFormattata(ev)} />
          {ev.ora && <Riga etichetta="Ora" valore={ev.ora} />}
          <Riga etichetta="Casa" valore={ev.casa} />
          <Riga etichetta="Trasferta" valore={ev.trasferta} />
          <Riga etichetta="Punteggio" valore={punteggio(ev) || 'Non ancora disputata'} />
          {ev.lega && <Riga etichetta="Competizione" valore={ev.lega} />}
          {ev.luogo && <Riga etichetta="Stadio" valore={ev.luogo} />}
        </div>
      </div>
    </div>
  )
}
