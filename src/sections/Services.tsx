import { Box, Film, PanelsTopLeft, Sparkles, type LucideIcon } from 'lucide-react'
import { site } from '../content/site'
import { MaskedHeadline } from '../components/depth/MaskedHeadline'
import { Reveal } from '../components/depth/Reveal'
import { ScrollLayer } from '../components/depth/ScrollLayer'
import { TiltCard } from '../components/depth/TiltCard'
import { Container } from '../components/ui/Container'
import { SectionLabel } from '../components/ui/SectionLabel'

const ICONS: Record<string, LucideIcon> = { brand: Sparkles, web: PanelsTopLeft, motion: Film, '3d': Box }

// Each column scrolls at a slightly different speed — a staggered skyline
// that settles as the grid passes through the viewport.
const COLUMN_SPEEDS = [0, 0.07, 0.025, 0.1]

/*
 * Layers: ambient glow (scroll -0.2, slowest) → cards (per-column speeds)
 *         → inside each card, content at translateZ 16–50px (tilt depth).
 * Nesting: ScrollLayer (GSAP y) > Reveal (GSAP entrance) > TiltCard (Motion).
 */
export function Services() {
  const { services } = site

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden border-t border-line py-24 md:py-36"
    >
      <ScrollLayer speed={-0.2} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-1/2 size-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_124_255/0.12),transparent)]" />
      </ScrollLayer>

      <Container>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel className="mb-6">(02) — {services.label}</SectionLabel>
            <MaskedHeadline id="services-title" lines={services.headline} />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="max-w-[40ch] leading-relaxed text-bone-400 md:text-lg">{services.intro}</p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 md:mt-24 lg:gap-5 xl:grid-cols-4">
          {services.items.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <li key={item.title}>
                <ScrollLayer speed={COLUMN_SPEEDS[index % COLUMN_SPEEDS.length]} className="h-full">
                  <Reveal delay={index * 0.08} className="h-full">
                    <TiltCard className="flex min-h-[420px] flex-col rounded-3xl border border-line bg-gradient-to-b from-ink-800 to-ink-900 p-7 transition-colors duration-500 hover:border-line-strong md:p-8">
                      <Icon
                        aria-hidden
                        strokeWidth={0.75}
                        className="absolute top-20 right-6 size-36 text-white/[0.035]"
                      />
                      <div className="flex items-start justify-between [transform:translateZ(50px)]">
                        <span className="grid size-14 place-items-center rounded-2xl bg-iris-400/10 text-iris-300 ring-1 ring-iris-400/30">
                          <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                        </span>
                        <span className="font-mono text-xs tracking-[0.12em] text-bone-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 className="mt-auto pt-20 font-display text-2xl font-medium tracking-[-0.03em] [transform:translateZ(36px)] md:text-[1.75rem]">
                        {item.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-bone-400 [transform:translateZ(24px)]">{item.body}</p>
                      <ul className="mt-6 flex flex-wrap gap-2 [transform:translateZ(16px)]" aria-label={`${item.title} capabilities`}>
                        {item.tags.map((tag) => (
                          <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-bone-400">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </TiltCard>
                  </Reveal>
                </ScrollLayer>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
