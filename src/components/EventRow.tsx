import type { EventItem } from '../types'
import { classeBadge, dataFormattata, esitoEvento, punteggio } from '../utils'

interface Props {
  ev: EventItem
  nomeSquadra?: string
  onClick: (ev: EventItem) => void
}

export function EventRow({ ev, nomeSquadra, onClick }: Props) {
  const score = punteggio(ev)

  return (
    <div className="evento-riga" onClick={() => onClick(ev)}>
      <span className="evento-data">{dataFormattata(ev)}</span>
      <div className="evento-centro">
        <span className="evento-match">
          {ev.casa} vs {ev.trasferta}
        </span>
        {score && <span className={`badge-score ${classeBadge(esitoEvento(ev, nomeSquadra))}`}>{score}</span>}
      </div>
    </div>
  )
}
