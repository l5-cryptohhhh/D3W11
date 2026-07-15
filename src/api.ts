import type { EventApi, EventItem, SportFiltro, Team, TeamApi } from './types'
import { mappaEvento, mappaSquadra } from './utils'

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

// Ricerca squadre. Lo sport (se passato) viene aggiunto all'URL come &s=...
// e applicato anche lato client, perché l'endpoint non sempre lo filtra.
export async function cercaSquadre(query: string, sport: SportFiltro = ''): Promise<Team[]> {
  let url = `${BASE_URL}/searchteams.php?t=${encodeURIComponent(query)}`
  if (sport) url += `&s=${encodeURIComponent(sport)}`

  const risposta = await fetch(url)
  if (!risposta.ok) throw new Error(`La ricerca non è andata a buon fine (${risposta.status}).`)

  const dati: { teams: TeamApi[] | null } = await risposta.json()
  if (!dati.teams) return []

  let squadre = dati.teams.map(mappaSquadra)
  if (sport) squadre = squadre.filter((s) => s.sport === sport)
  return squadre
}

// Prossimi eventi di una squadra (chiave "events").
export async function prossimiEventi(idTeam: string): Promise<EventItem[]> {
  const risposta = await fetch(`${BASE_URL}/eventsnext.php?id=${idTeam}`)
  if (!risposta.ok) throw new Error(`Impossibile caricare i prossimi eventi (${risposta.status}).`)

  const dati: { events: EventApi[] | null } = await risposta.json()
  return (dati.events ?? []).map(mappaEvento)
}

// Ultimi risultati di una squadra (chiave "results").
export async function ultimiRisultati(idTeam: string): Promise<EventItem[]> {
  const risposta = await fetch(`${BASE_URL}/eventslast.php?id=${idTeam}`)
  if (!risposta.ok) throw new Error(`Impossibile caricare gli ultimi risultati (${risposta.status}).`)

  const dati: { results: EventApi[] | null } = await risposta.json()
  return (dati.results ?? []).map(mappaEvento)
}

// Carica prossimi + ultimi IN PARALLELO con Promise.all.
export async function caricaDettagli(idTeam: string): Promise<{ prossimi: EventItem[]; ultimi: EventItem[] }> {
  const [prossimi, ultimi] = await Promise.all([prossimiEventi(idTeam), ultimiRisultati(idTeam)])
  return { prossimi, ultimi }
}
