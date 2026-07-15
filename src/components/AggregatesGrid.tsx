import type { EventItem } from '../types'
import { dataFormattata } from '../utils'
import { EventRow } from './EventRow'
import { IconCalendar, IconHistory } from './Icon'

interface IncontroItem {
  ev: EventItem
  nome: string
}

interface Props {
  appuntamenti: EventItem[]
  incontri: IncontroItem[]
  onEventoClick: (ev: EventItem) => void
}

export function AggregatesGrid({ appuntamenti, incontri, onEventoClick }: Props) {
  return (
    <div className="aggregati-griglia">
      {appuntamenti.length > 0 && (
        <section>
          <h2 className="sezione-titolo sezione-secondaria">
            <IconCalendar className="titolo-icona" /> I tuoi prossimi appuntamenti
          </h2>
          <div className="appuntamenti">
            {appuntamenti.map((ev) => (
              <div key={ev.id} className="appuntamento-riga" onClick={() => onEventoClick(ev)}>
                <span className="appuntamento-data">{dataFormattata(ev)}</span>
                <span className="appuntamento-match">
                  {ev.casa} vs {ev.trasferta}
                </span>
                <span className="appuntamento-lega">{ev.lega}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {incontri.length > 0 && (
        <section>
          <h2 className="sezione-titolo sezione-secondaria">
            <IconHistory className="titolo-icona" /> Incontri precedenti
          </h2>
          <div className="incontri-card">
            {incontri.map(({ ev, nome }) => (
              <EventRow key={ev.id} ev={ev} nomeSquadra={nome} onClick={onEventoClick} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
