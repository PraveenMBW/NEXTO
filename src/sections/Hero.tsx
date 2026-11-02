import { useRef } from 'react'
import { useMotionValue } from 'motion/react'
import { site } from '../content/site'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { DepthScene } from '../components/depth/DepthScene'
import { Magnetic } from '../components/depth/Magnetic'
import { PointerLayer } from '../components/depth/PointerLayer'
import { HeroVisual } from '../components/three/HeroVisual'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { SectionLabel } from '../components/ui/SectionLabel'

/*
 * Layers (back → front), each moving at its own pointer depth and scroll speed:
 *   bg       ambient light + grain     pointer 0.2   scroll: slowest
 *   visual   3D layered "N"            pointer 0.5   scroll: slower, recedes
 *   content  headline + CTA            pointer 1.0   scroll: fastest, fades
 *
 * Rule: GSAP owns the outer [data-hero-*] wrappers (scroll), Motion owns the
 * inner PointerLayers (pointer). They never write to the same element.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useMotionValue(0)
  const { hero } = site

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MQ.motionOK, () => {
        // Intro: ambient light first, then masked headline lines, then UI.
        gsap
          .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
          .from('[data-hero-bg]', { opacity: 0, duration: 2.4, ease: 'power2.out' }, 0)
          .from('[data-hero-visual]', { opacity: 0, scale: 0.94, duration: 2.2 }, 0.1)
          .from('[data-hero-line]', { yPercent: 115, stagger: 0.09 }, 0.25)
          .from('[data-hero-fade]', { opacity: 0, y: 18, stagger: 0.08, duration: 1.1 }, 0.7)

        // Scroll-out: layers separate at different speeds.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              onUpdate: (self) => progress.set(self.progress),
            },
          })
          .to('[data-hero-content]', { yPercent: -22 }, 0)
          .to('[data-hero-content]', { opacity: 0, duration: 0.6 }, 0.1)
          .to('[data-hero-visual]', { yPercent: 14, scale: 0.9 }, 0)
          .to('[data-hero-bg]', { yPercent: 24 }, 0)
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate h-[100svh] min-h-[620px] overflow-hidden"
    >
      <DepthScene className="absolute inset-0">
        {/* Background — ambient light */}
        <div data-hero-bg aria-hidden className="absolute -inset-[12%] -z-20">
          <PointerLayer depth={0.2} strength={30} className="absolute inset-0">
            <div className="absolute -top-[10%] right-[-5%] size-[78vmax] rounded-full bg-[radial-gradient(closest-side,rgb(139_124_255/0.24),rgb(139_124_255/0.06)_55%,transparent)]" />
            <div className="absolute bottom-[-25%] left-[-12%] size-[64vmax] rounded-full bg-[radial-gradient(closest-side,rgb(255_138_76/0.11),transparent)]" />
          </PointerLayer>
        </div>
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06]" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink-950 to-transparent"
        />

        {/* Mid-ground — 3D */}
        <div
          data-hero-visual
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-12 h-[42%] md:top-16 md:h-[52%] lg:top-0 lg:left-[34%] lg:h-full"
        >
          <HeroVisual progress={progress} />
        </div>

        {/* Foreground — content */}
        <div data-hero-content className="relative flex h-full flex-col justify-end pt-24 pb-8 md:pb-12">
          <Container>
            <SectionLabel data-hero-fade className="mb-6 md:mb-8">
              (00) — {hero.eyebrow}
            </SectionLabel>

            <PointerLayer depth={1} strength={16}>
              <h1 id="hero-title" className="font-display text-display font-medium">
                {hero.headline.map((line, lineIndex) => (
                  <span key={lineIndex} className="block overflow-hidden pr-[0.12em] pb-[0.1em] -mb-[0.1em]">
                    <span data-hero-line className="block">
                      {line.map((segment, index) =>
                        'accent' in segment && segment.accent ? (
                          <em
                            key={index}
                            className="font-serif font-normal tracking-[-0.02em] text-iris-300"
                          >
                            {segment.text}
                          </em>
                        ) : (
                          <span key={index}>{segment.text}</span>
                        ),
                      )}
                    </span>
                  </span>
                ))}
              </h1>
            </PointerLayer>

            <div className="mt-8 flex flex-col gap-7 md:mt-10 md:flex-row md:items-end md:justify-between">
              <p data-hero-fade className="max-w-[40ch] text-base leading-relaxed text-bone-400 md:text-lg">
                {hero.intro}
              </p>
              <div data-hero-fade className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
                </Magnetic>
                <Button href={hero.secondaryCta.href} variant="ghost">
                  {hero.secondaryCta.label}
                </Button>
              </div>
            </div>

            <div
              data-hero-fade
              className="mt-10 hidden items-center justify-between border-t border-line pt-5 sm:flex md:mt-14"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="relative h-8 w-px overflow-hidden bg-line-strong">
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-bone-100 motion-safe:animate-scroll-cue" />
                </span>
                <SectionLabel>Scroll to explore</SectionLabel>
              </div>
              <ul className="hidden gap-6 sm:flex" aria-label="Disciplines">
                {hero.disciplines.map((item) => (
                  <li key={item}>
                    <SectionLabel>{item}</SectionLabel>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </DepthScene>
    </section>
  )
}
