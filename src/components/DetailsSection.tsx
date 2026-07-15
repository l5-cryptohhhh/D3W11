import { useEffect, useRef } from 'react'
import type { EventItem, Team } from '../types'
import { EventRow } from './EventRow'
import { SkeletonRows } from './Skeleton'

interface Props {
  loading: boolean
  errore: string | null
  dettagli: { squadra: Team; prossimi: EventItem[]; ultimi: EventItem[] } | null
  onEventoClick: (ev: EventItem) => void
}

function Colonna({
  titolo,
  eventi,
  testoVuoto,
  nomeSquadra,
  onEventoClick,
}: {
  titolo: string
  eventi: EventItem[]
  testoVuoto: string
  nomeSquadra: string
  onEventoClick: (ev: EventItem) => void
}) {
  return (
    <div className="colonna-eventi">
      <h3 className="colonna-titolo">{titolo}</h3>
      {eventi.length === 0 ? (
        <p className="messaggio-vuoto">{testoVuoto}</p>
      ) : (
        eventi.map((ev) => <EventRow key={ev.id} ev={ev} nomeSquadra={nomeSquadra} onClick={onEventoClick} />)
      )}
    </div>
  )
}

export function DetailsSection({ loading, errore, dettagli, onEventoClick }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (loading || errore || dettagli) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading, errore, dettagli])

  if (!loading && !errore && !dettagli) return null

  return (
    <section ref={ref}>
      {loading && (
        <div className="dettagli-card">
          <div className="skel skel-line" style={{ width: '38%', height: '1.4rem', marginBottom: 20 }} />
          <div className="dettagli-colonne">
            <SkeletonRows />
            <SkeletonRows />
          </div>
        </div>
      )}
      {errore && (
        <div className="alert-errore" role="alert">
          {errore}
        </div>
      )}
      {dettagli && (
        <div className="dettagli-card">
          <h2 className="dettagli-titolo">{dettagli.squadra.nome}</h2>
          <div className="dettagli-colonne">
            <Colonna
              titolo="Prossimi eventi"
              eventi={dettagli.prossimi}
              testoVuoto="Nessun evento in programma."
              nomeSquadra={dettagli.squadra.nome}
              onEventoClick={onEventoClick}
            />
            <Colonna
              titolo="Ultimi risultati"
              eventi={dettagli.ultimi}
              testoVuoto="Nessun risultato recente."
              nomeSquadra={dettagli.squadra.nome}
              onEventoClick={onEventoClick}
            />
          </div>
        </div>
      )}
    </section>
  )
}
