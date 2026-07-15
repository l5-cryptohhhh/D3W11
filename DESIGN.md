# Design

v2: modernized product surface. Same navy/gold brand identity as the reference app,
rebuilt as a proper token system with light/dark themes. Reinterpreted, not frozen.

## Color

OKLCH tokens in `src/App.css`, themed via `[data-theme="light"|"dark"]` (defaults to
`prefers-color-scheme`, overridable, persisted in localStorage).

```
--bg / --surface / --surface-2 / --border   neutral scale (page / card / secondary panel / hairlines)
--text / --text-soft                        primary / secondary text
--brand / --brand-2                         header gradient (navy)
--brand-on-surface                          brand-colored text ON --surface — navy in light, light-blue in dark
                                             (contrast fix: never render --brand text on --surface directly)
--accent / --accent-hover / --accent-border / --accent-ink   gold, "aggiungi ai preferiti" + draw badge
--danger-bg / --danger-ink / --danger-hover / --danger-border   "rimuovi" button, error banners
--success / --danger / --neutral-badge      win / loss / neutral score badges
--focus-ring                                 focus-visible outline color
```

Restrained strategy: neutrals carry the surface, navy is the one committed brand color
(header + accents), gold is the sole accent for the primary favorite action. No new
colors introduced beyond the reference palette — depth comes from tokens/elevation/dark
mode, not new hues.

## Typography

Single family: system-ui stack (`-apple-system, "Segoe UI", Roboto, ...`) — product
register permission, no font loading cost. Fixed rem scale unchanged from v1 (logo
2.1rem/800 down to body ~0.85rem).

## Layout

Unchanged from v1 (header band, 1100px container, flex-wrap card grid, two-column
details/aggregates). Header is now `position: sticky` with a scroll-triggered shadow
(`.is-scorso`).

## Components

- **Card**: radius bumped 12→14px, hover lift reduced (`-8px`→`-4px`, product register
  favors restraint over brand-surface flourish), shadow uses `--shadow-color` token.
- **Icons**: emoji (⭐📅⏮✓★🗑✕) replaced with a small inline SVG set (`Icon.tsx`,
  stroke-based, `currentColor`) — consistent icon vocabulary instead of platform-emoji
  rendering, one of the ui-ux-pro-max anti-patterns.
- **Skeleton loading**: `Skeleton.tsx` (`SkeletonGrid`, `SkeletonRows`) replaces the v1
  full-section spinner for search results and team details — product register calls
  for skeletons over mid-content spinners.
- **Toast**: bottom-right stack (`ToastViewport.tsx`), confirms favorite add/remove.
  New — v1 had no feedback beyond the button re-rendering.
- **Landing/empty state**: `ResultsSection` shows a dashed-border prompt with a search
  icon before the first search, instead of a blank section.
- **Theme toggle**: sun/moon icon button, top-right of header.
- **Hero3D**: ambient wireframe icosahedron + starfield behind the header text, plain
  three.js (`Hero3D.tsx`), lazy-loaded (code-split, ~520kB chunk) so it never blocks
  first paint. Decorative only — respects `prefers-reduced-motion` (renders one static
  frame, no rAF loop). Kept out of interactive components per product-register motion
  rules; it's the one deliberate brand flourish, not a pattern repeated elsewhere.

## Motion

Interactive transitions stay in the 150–250ms product range (buttons, rows, theme
toggle). Skeleton shimmer and toast slide-in are the only "decorative" motion, both
disabled under `prefers-reduced-motion` along with the Hero3D rotation.

## Accessibility

Carried over from v1 (focus-visible rings, aria-labels, role=alert/dialog, Escape to
close) plus: `--brand-on-surface` fixes a dark-mode contrast bug (navy-on-navy) caught
during review; skeleton/landing states use `aria-hidden`; toast region is
`aria-live="polite"`.
