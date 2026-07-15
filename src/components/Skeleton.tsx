export function SkeletonCard() {
  return (
    <article className="card card-skeleton" aria-hidden="true">
      <div className="skel skel-logo" />
      <div className="skel skel-line" style={{ width: '70%' }} />
      <div className="skel skel-line" style={{ width: '45%' }} />
      <div className="skel skel-btn" />
    </article>
  )
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div className="colonna-eventi" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skel skel-row" />
      ))}
    </div>
  )
}
