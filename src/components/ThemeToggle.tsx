import { IconMoon, IconSun } from './Icon'

interface Props {
  tema: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ tema, onToggle }: Props) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={tema === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      title={tema === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
    >
      {tema === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  )
}
