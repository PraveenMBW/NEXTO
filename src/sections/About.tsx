import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { DepthScene } from '../components/depth/DepthScene'
import { PointerLayer } from '../components/depth/PointerLayer'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { SectionLabel } from '../components/ui/SectionLabel'

/*
 * Desktop (motion OK): the stage pins for one viewport per chapter. Chapters
 * are stacked; each transition lifts the old text away, wipes the next image
 * up over the previous one (clip-path) while it settles from a zoom, and
 * brings in the new text and stat card. Snaps to chapters.
 *
 * Mobile / tablet / reduced motion: no pin — chapters flow vertically
 * (pure CSS via `lg:motion-safe:`), with a simple reveal when motion is OK.
 *
 * Layers: outlined backdrop word (pointer 0.15, scroll drift)
 *         chapter image (pointer 0.4)  ·  stat card (pointer 1)
 */
export function About() {
  const ref = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const { about } = site
  const total = about.chapters.length
  const pad = (n: number) => String(n).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(`${MQ.desktop} and ${MQ.motionOK}`, () => {
        const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]')
        const parts = (chapter: HTMLElement) => ({
          text: chapter.querySelectorAll('[data-ch-text] > *'),
          media: chapter.querySelector('[data-ch-media]'),
          img: chapter.querySelector('[data-ch-img]'),
          stat: chapter.querySelector('[data-ch-stat]'),
        })

        chapters.slice(1).forEach((chapter) => {
          const { text, media, stat } = parts(chapter)
          gsap.set(media, { clipPath: 'inset(100% 0% 0% 0%)' })
          gsap.set(text, { opacity: 0, y: 40 })
          gsap.set(stat, { opacity: 0, y: 70 })
        })

        let current = 0
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: '[data-about-stage]',
            start: 'top top',
            end: () => `+=${(total - 1) * window.innerHeight}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 'labels',
              duration: { min: 0.25, max: 0.7 },
              ease: 'power1.inOut',
              delay: 0.08,
              inertia: false,
            },
            onUpdate: (self) => {
              const index = Math.round(self.progress * (total - 1))
              if (index !== current && counterRef.current) {
                current = index
                counterRef.current.textContent = pad(index + 1)
              }
            },
          },
        })

        tl.addLabel('chapter-0', 0)
        for (let i = 1; i < total; i++) {
          const prev = parts(chapters[i - 1])
          const next = parts(chapters[i])
          const at = i - 1
          tl.to(prev.text, { opacity: 0, y: -40, stagger: 0.04, duration: 0.4 }, at)
            .to(prev.stat, { opacity: 0, y: -70, duration: 0.4 }, at)
            .to(prev.img, { scale: 1.12, duration: 1 }, at)
            .to(next.media, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8 }, at + 0.1)
            .fromTo(next.img, { scale: 1.3 }, { scale: 1, duration: 0.9 }, at + 0.1)
            .to(next.text, { opacity: 1, y: 0, stagger: 0.05, duration: 0.45 }, at + 0.45)
            .to(next.stat, { opacity: 1, y: 0, duration: 0.5 }, at + 0.5)
            .addLabel(`chapter-${i}`, at + 1)
        }
        tl.fromTo('[data-about-progress]', { scaleX: 1 / total }, { scaleX: 1, ease: 'none', duration: total - 1 }, 0)
        tl.fromTo('[data-about-backdrop]', { xPercent: 0 }, { xPercent: -22, ease: 'none', duration: total - 1 }, 0)
      })

      mm.add(`(max-width: 1023px) and ${MQ.motionOK}`, () => {
        gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((chapter) => {
          gsap.from(chapter.querySelectorAll('[data-ch-text] > *, [data-ch-media]'), {
            opacity: 0,
            y: 36,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: chapter, start: 'top 80%', once: true },
          })
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="relative border-t border-line">
      <DepthScene data-about-stage className="relative overflow-hidden lg:motion-safe:h-svh">
        {/* Backdrop — outlined word, furthest layer */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <PointerLayer depth={0.15} strength={40}>
            <span
              data-about-backdrop
              className="block whitespace-nowrap font-display text-[38vw] leading-none font-semibold tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.06)] lg:text-[28vw]"
            >
              {about.backdrop} {about.backdrop}
            </span>
          </PointerLayer>
        </div>

        <Container className="relative flex h-full flex-col py-24 md:py-32 lg:motion-safe:py-0 lg:motion-safe:pt-28 lg:motion-safe:pb-14">
          <div className="flex items-center justify-between">
            <SectionLabel>(01) — {about.label}</SectionLabel>
            <div aria-hidden className="hidden items-center gap-4 lg:motion-safe:flex">
              <span className="font-mono text-xs tracking-[0.12em] text-bone-100">
                <span ref={counterRef}>01</span>
                <span className="text-bone-400"> / {pad(total)}</span>
              </span>
              <span className="relative h-px w-28 overflow-hidden bg-line-strong">
                <span data-about-progress className="absolute inset-0 origin-left bg-bone-100" />
              </span>
            </div>
          </div>
          <h2 id="about-title" className="sr-only">
            About Nexto Digital
          </h2>

          <div className="relative mt-6 flex-1 lg:motion-safe:mt-8">
            {about.chapters.map((chapter, index) => (
              <article
                key={chapter.kicker}
                data-chapter
                className="grid items-center gap-10 py-12 md:grid-cols-12 md:gap-6 lg:motion-safe:absolute lg:motion-safe:inset-0 lg:motion-safe:py-0"
              >
                <div data-ch-text className="relative z-10 md:col-span-6 lg:col-span-5">
                  <SectionLabel>
                    {pad(index + 1)} — {chapter.kicker}
                  </SectionLabel>
                  <h3 className="mt-5 font-display text-[clamp(2rem,4.2vw,4.25rem)] leading-[1] font-medium tracking-[-0.035em]">
                    {chapter.title}
                  </h3>
                  <p className="mt-6 max-w-[42ch] leading-relaxed text-bone-400 md:text-lg">{chapter.body}</p>
                </div>

                <div className="relative md:col-span-6 lg:col-span-6 lg:col-start-7 lg:flex lg:justify-end">
                  <PointerLayer depth={0.4} strength={24} tilt={2}>
                    <div
                      data-ch-media
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-ink-800 lg:h-[min(64svh,640px)] lg:w-auto"
                    >
                      <Picture
                        data-ch-img
                        name={chapter.image}
                        sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  </PointerLayer>

                  <PointerLayer
                    depth={1}
                    strength={28}
                    className="absolute -bottom-8 left-4 z-10 md:-left-8 lg:bottom-10 lg:left-auto lg:right-[calc(min(64svh,640px)*0.8-2.5rem)]"
                  >
                    <div
                      data-ch-stat
                      className="rounded-2xl border border-line-strong bg-ink-900/80 px-6 py-5 shadow-2xl shadow-black/40 backdrop-blur-md"
                    >
                      <p className="font-display text-4xl font-medium tracking-[-0.04em] md:text-5xl">
                        {chapter.stat.value}
                      </p>
                      <p className="mt-1.5 max-w-[22ch] font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-bone-400">
                        {chapter.stat.label}
                      </p>
                    </div>
                  </PointerLayer>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </DepthScene>
    </section>
  )
}
