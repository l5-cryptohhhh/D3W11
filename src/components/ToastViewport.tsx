import type { ToastMsg } from '../useToast'

export function ToastViewport({ toasts }: { toasts: ToastMsg[] }) {
  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.testo}
        </div>
      ))}
    </div>
  )
}
