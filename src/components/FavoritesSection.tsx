import type { Team } from '../types'
import { IconStarFilled } from './Icon'
import { TeamCard } from './TeamCard'

interface Props {
  preferiti: Team[]
  onApri: (squadra: Team) => void
  onAzione: (squadra: Team) => void
}

export function FavoritesSection({ preferiti, onApri, onAzione }: Props) {
  if (preferiti.length === 0) return null

  return (
    <section>
      <h2 className="sezione-titolo">
        <IconStarFilled className="titolo-icona stella" /> Le tue squadre preferite
      </h2>
      <div className="grid">
        {preferiti.map((s) => (
          <TeamCard key={s.id} squadra={s} stato="preferito" onApri={onApri} onAzione={onAzione} />
        ))}
      </div>
    </section>
  )
}
