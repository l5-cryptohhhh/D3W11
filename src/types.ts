export interface Team {
  id: string
  nome: string
  logo: string
  lega: string
  paese: string
  sport: string
}

export interface EventItem {
  id: string
  data: string
  ora: string
  casa: string
  trasferta: string
  punteggioCasa: string | null
  punteggioTrasferta: string | null
  lega: string
  luogo: string
}

export type SportFiltro = '' | 'Soccer' | 'Basketball' | 'American Football'

export type Esito = 'vinta' | 'persa' | 'pari' | null

// ----- Forme grezze restituite da thesportsdb -----

export interface TeamApi {
  idTeam: string
  strTeam: string
  strBadge: string | null
  strLeague: string | null
  strCountry: string | null
  strSport: string | null
}

export interface EventApi {
  idEvent: string
  dateEvent: string | null
  strTime: string | null
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore: string | null
  intAwayScore: string | null
  strLeague: string | null
  strVenue: string | null
}
