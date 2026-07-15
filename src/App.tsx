import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { cercaSquadre, caricaDettagli, prossimiEventi, ultimiRisultati } from './api'
import { AggregatesGrid } from './components/AggregatesGrid'
import { DetailsSection } from './components/DetailsSection'
import { EventModal } from './components/EventModal'
import { FavoritesSection } from './components/FavoritesSection'
import { Header } from './components/Header'
import { ResultsSection } from './components/ResultsSection'
import { ToastViewport } from './components/ToastViewport'
import type { EventItem, SportFiltro, Team } from './types'
import { haPunteggio, timestamp } from './utils'
import { useFavorites } from './useFavorites'
import { useTheme } from './useTheme'
import { useToast } from './useToast'

interface Dettagli {
  squadra: Team
  prossimi: EventItem[]
  ultimi: EventItem[]
}

interface Incontro {
  ev: EventItem
  nome: string
}

function App() {
  const { preferiti, isPreferita, toggle } = useFavorites()
  const { tema, toggle: toggleTema } = useTheme()
  const { toasts, show: mostraToast } = useToast()

  const [sportAttivo, setSportAttivo] = useState<SportFiltro>('')
  const [ultimaQuery, setUltimaQuery] = useState('')
  const [risultati, setRisultati] = useState<Team[] | null>(null)
  const [risultatiLoading, setRisultatiLoading] = useState(false)
  const [risultatiErrore, setRisultatiErrore] = useState<string | null>(null)

  const [dettagli, setDettagli] = useState<Dettagli | null>(null)
  const [dettagliLoading, setDettagliLoading] = useState(false)
  const [dettagliErrore, setDettagliErrore] = useState<string | null>(null)

  const [appuntamenti, setAppuntamenti] = useState<EventItem[]>([])
  const [incontri, setIncontri] = useState<Incontro[]>([])

  const [modalEvento, setModalEvento] = useState<EventItem | null>(null)

  const eseguiRicerca = useCallback(async (query: string, sport: SportFiltro) => {
    const testo = query.trim()
    setUltimaQuery(testo)
    if (testo === '') {
      setRisultati(null)
      setRisultatiErrore(null)
      return
    }
    setRisultatiLoading(true)
    setRisultatiErrore(null)
    try {
      const squadre = await cercaSquadre(testo, sport)
      setRisultati(squadre)
    } catch (err) {
      setRisultatiErrore(err instanceof Error ? err.message : String(err))
    } finally {
      setRisultatiLoading(false)
    }
  }, [])

  const onCerca = useCallback((query: string) => eseguiRicerca(query, sportAttivo), [eseguiRicerca, sportAttivo])

  const onSportChange = useCallback(
    (sport: SportFiltro) => {
      setSportAttivo(sport)
      if (ultimaQuery) eseguiRicerca(ultimaQuery, sport)
    },
    [eseguiRicerca, ultimaQuery],
  )

  const onAzionePreferiti = useCallback(
    (squadra: Team) => {
      const eraPreferita = isPreferita(squadra.id)
      toggle(squadra)
      mostraToast(eraPreferita ? `${squadra.nome} rimossa dai preferiti` : `${squadra.nome} aggiunta ai preferiti`)
    },
    [isPreferita, toggle, mostraToast],
  )

  const apriDettagli = useCallback(async (squadra: Team) => {
    setDettagli(null)
    setDettagliErrore(null)
    setDettagliLoading(true)
    try {
      const { prossimi, ultimi } = await caricaDettagli(squadra.id)
      setDettagli({ squadra, prossimi, ultimi })
    } catch (err) {
      setDettagliErrore(err instanceof Error ? err.message : String(err))
    } finally {
      setDettagliLoading(false)
    }
  }, [])

  // Appuntamenti aggregati (avvio + ogni modifica preferiti).
  useEffect(() => {
    if (preferiti.length === 0) {
      setAppuntamenti([])
      return
    }
    let attivo = true
    Promise.allSettled(preferiti.map((p) => prossimiEventi(p.id)))
      .then((esiti) => {
        if (!attivo) return
        const tutti = esiti
          .filter((e) => e.status === 'fulfilled')
          .flatMap((e) => e.value)
          .sort((a, b) => timestamp(a) - timestamp(b))
          .slice(0, 6)
        setAppuntamenti(tutti)
      })
      .catch(() => attivo && setAppuntamenti([]))
    return () => {
      attivo = false
    }
  }, [preferiti])

  // Incontri precedenti: ultimi risultati di TUTTE le preferite, dal più recente.
  useEffect(() => {
    if (preferiti.length === 0) {
      setIncontri([])
      return
    }
    let attivo = true
    Promise.allSettled(preferiti.map((p) => ultimiRisultati(p.id)))
      .then((esiti) => {
        if (!attivo) return
        const tutti: Incontro[] = []
        esiti.forEach((esito, i) => {
          if (esito.status !== 'fulfilled') return
          const nome = preferiti[i].nome
          for (const ev of esito.value) {
            if (haPunteggio(ev)) tutti.push({ ev, nome })
          }
        })
        tutti.sort((a, b) => timestamp(b.ev) - timestamp(a.ev))
        setIncontri(tutti.slice(0, 6))
      })
      .catch(() => attivo && setIncontri([]))
    return () => {
      attivo = false
    }
  }, [preferiti])

  return (
    <>
      <Header
        sportAttivo={sportAttivo}
        tema={tema}
        onCerca={onCerca}
        onSportChange={onSportChange}
        onToggleTema={toggleTema}
      />

      <main className="container">
        <FavoritesSection preferiti={preferiti} onApri={apriDettagli} onAzione={onAzionePreferiti} />

        <ResultsSection
          loading={risultatiLoading}
          errore={risultatiErrore}
          risultati={risultati}
          sportAttivo={sportAttivo}
          isPreferita={isPreferita}
          onApri={apriDettagli}
          onAzione={onAzionePreferiti}
        />

        <DetailsSection
          loading={dettagliLoading}
          errore={dettagliErrore}
          dettagli={dettagli}
          onEventoClick={setModalEvento}
        />

        <AggregatesGrid appuntamenti={appuntamenti} incontri={incontri} onEventoClick={setModalEvento} />
      </main>

      <EventModal ev={modalEvento} onClose={() => setModalEvento(null)} />
      <ToastViewport toasts={toasts} />
    </>
  )
}

export default App
