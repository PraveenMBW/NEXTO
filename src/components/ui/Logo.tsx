import { site } from '../../content/site'

/** Wordmark with a three-layer mark that echoes the layered-depth idea. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <rect x="1" y="5" width="14" height="14" rx="3" fill="var(--color-iris-400)" opacity="0.35" />
        <rect x="5" y="5" width="14" height="14" rx="3" fill="var(--color-iris-400)" opacity="0.6" />
        <rect x="9" y="5" width="14" height="14" rx="3" fill="var(--color-bone-100)" />
      </svg>
      <span className="font-display text-lg font-semibold tracking-[-0.03em]">
        {site.name}
        <span className="ml-1.5 font-mono text-[0.6875rem] font-normal uppercase tracking-[0.14em] text-bone-400">
          {site.suffix}
        </span>
      </span>
    </span>
  )
}
