import type { Esito, EventApi, EventItem, Team, TeamApi } from './types'

export function mappaSquadra(api: TeamApi): Team {
  return {
    id: api.idTeam,
    nome: api.strTeam,
    logo: api.strBadge ?? '',
    lega: api.strLeague ?? '',
    paese: api.strCountry ?? '',
    sport: api.strSport ?? '',
  }
}

export function mappaEvento(api: EventApi): EventItem {
  return {
    id: api.idEvent,
    data: api.dateEvent ?? '',
    ora: api.strTime ?? '',
    casa: api.strHomeTeam,
    trasferta: api.strAwayTeam,
    punteggioCasa: api.intHomeScore,
    punteggioTrasferta: api.intAwayScore,
    lega: api.strLeague ?? '',
    luogo: api.strVenue ?? '',
  }
}

// Restituisce gg/mm/aaaa, o un fallback se la data manca.
export function dataFormattata(ev: EventItem): string {
  if (!ev.data) return 'Data da definire'
  const parti = ev.data.split('-')
  if (parti.length !== 3) return ev.data
  const [anno, mese, giorno] = parti
  return `${giorno}/${mese}/${anno}`
}

// true solo quando esistono entrambi i punteggi (partita giocata).
export function haPunteggio(ev: EventItem): boolean {
  const c = ev.punteggioCasa
  const t = ev.punteggioTrasferta
  return c !== null && c !== '' && t !== null && t !== ''
}

// Stringa "2 – 0" oppure null se non ancora giocata.
export function punteggio(ev: EventItem): string | null {
  return haPunteggio(ev) ? `${ev.punteggioCasa} – ${ev.punteggioTrasferta}` : null
}

// Timestamp per l'ordinamento; eventi senza data vanno in fondo.
export function timestamp(ev: EventItem): number {
  return ev.data ? new Date(ev.data).getTime() : Number.MAX_SAFE_INTEGER
}

// Esito della partita dal punto di vista di nomeSquadra.
export function esitoEvento(ev: EventItem, nomeSquadra: string | undefined): Esito {
  if (!haPunteggio(ev) || !nomeSquadra) return null
  const casa = Number(ev.punteggioCasa)
  const trasferta = Number(ev.punteggioTrasferta)

  let mio: number
  let altro: number
  if (ev.casa === nomeSquadra) {
    mio = casa
    altro = trasferta
  } else if (ev.trasferta === nomeSquadra) {
    mio = trasferta
    altro = casa
  } else {
    return null
  }

  if (mio > altro) return 'vinta'
  if (mio < altro) return 'persa'
  return 'pari'
}

// Classe del badge in base all'esito: verde/rosso/giallo, grigio se ignoto.
export function classeBadge(esito: Esito): string {
  if (esito === 'vinta') return 'badge-vinta'
  if (esito === 'persa') return 'badge-persa'
  if (esito === 'pari') return 'badge-pari'
  return 'badge-neutro'
}
