import type { SportFiltro, Team } from '../types'
import { IconSearch } from './Icon'
import { SkeletonGrid } from './Skeleton'
import { TeamCard } from './TeamCard'

interface Props {
  loading: boolean
  errore: string | null
  risultati: Team[] | null
  sportAttivo: SportFiltro
  isPreferita: (id: string) => boolean
  onApri: (squadra: Team) => void
  onAzione: (squadra: Team) => void
}

export function ResultsSection({ loading, errore, risultati, sportAttivo, isPreferita, onApri, onAzione }: Props) {
  if (loading) {
    return (
      <section>
        <h2 className="sezione-titolo">Squadre trovate</h2>
        <SkeletonGrid />
      </section>
    )
  }

  if (errore) {
    return (
      <section>
        <div className="alert-errore" role="alert">
          {errore}
        </div>
      </section>
    )
  }

  if (risultati === null) {
    return (
      <section>
        <div className="stato-landing">
          <IconSearch size={28} />
          <p>Cerca una squadra qui sopra per vedere prossimi eventi e ultimi risultati.</p>
        </div>
      </section>
    )
  }

  if (risultati.length === 0) {
    return (
      <section>
        <p className="messaggio-vuoto">
          {sportAttivo
            ? 'Nessuna squadra trovata. Prova col nome completo della squadra (es. «Los Angeles Lakers»).'
            : 'Nessuna squadra trovata.'}
        </p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="sezione-titolo">Squadre trovate</h2>
      <div className="grid">
        {risultati.map((s) => (
          <TeamCard
            key={s.id}
            squadra={s}
            stato={isPreferita(s.id) ? 'gia-preferito' : 'aggiungibile'}
            onApri={onApri}
            onAzione={onAzione}
          />
        ))}
      </div>
    </section>
  )
}
