import { useRef } from 'react'
import { site } from '../content/site'
import { cn } from '../lib/cn'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { DepthScene } from '../components/depth/DepthScene'
import { Magnetic } from '../components/depth/Magnetic'
import { MaskedHeadline } from '../components/depth/MaskedHeadline'
import { PointerLayer } from '../components/depth/PointerLayer'
import { Reveal } from '../components/depth/Reveal'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Picture } from '../components/ui/Picture'
import { SectionLabel } from '../components/ui/SectionLabel'

// Each layer starts pushed out toward a corner (xPercent, yPercent, rotate)
// and converges on the CTA as the section scrolls into the centre.
const LAYERS = [
  { image: 'about-1', from: [-140, -90, -14], depth: 0.35, className: 'top-[8%] left-[4%] w-[30vw] md:top-[12%] md:left-[7%] md:w-[15vw] -rotate-6' },
  { image: 'work-2-detail', from: [150, -100, 12], depth: 0.55, className: 'top-[6%] right-[5%] w-[24vw] md:top-[10%] md:right-[9%] md:w-[12vw] rotate-3' },
  { image: 'work-1-detail', from: [-160, 110, 10], depth: 0.7, className: 'bottom-[6%] left-[8%] w-[22vw] md:bottom-[10%] md:left-[14%] md:w-[11vw] rotate-6' },
  { image: 'work-4-detail', from: [130, 120, -12], depth: 0.45, className: 'bottom-[4%] right-[4%] w-[30vw] md:bottom-[8%] md:right-[6%] md:w-[16vw] -rotate-3' },
] as const

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const { contact, email } = site

  useGSAP(
    () => {
      gsap.matchMedia().add({ mobile: MQ.mobile, motionOK: MQ.motionOK }, (context) => {
        const { mobile, motionOK } = context.conditions ?? {}
        if (!motionOK) return
        const factor = mobile ? 0.5 : 1

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'center center', scrub: true },
        })
        gsap.utils.toArray<HTMLElement>('[data-converge]').forEach((el) => {
          const [x, y, r] = (el.dataset.converge ?? '0,0,0').split(',').map(Number)
          tl.from(el, { xPercent: x * factor, yPercent: y * factor, rotate: r, scale: 0.8 }, 0)
          tl.from(el, { opacity: 0, duration: 0.5 }, 0)
        })
        tl.from('[data-contact-glow]', { scale: 0.5, opacity: 0 }, 0)
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden border-t border-line">
      <DepthScene className="relative flex min-h-[100svh] items-center py-36 md:min-h-[110svh]">
        <div
          data-contact-glow
          aria-hidden
          className="absolute top-1/2 left-1/2 -z-10 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(139_124_255/0.2),rgb(255_138_76/0.05)_60%,transparent)]"
        />

        {LAYERS.map((layer) => (
          <div
            key={layer.image}
            data-converge={layer.from.join(',')}
            aria-hidden
            className={cn('absolute -z-10 opacity-50 md:opacity-80', layer.className)}
          >
            <PointerLayer depth={layer.depth} strength={36}>
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10">
                <Picture name={layer.image} sizes="(min-width: 768px) 16vw, 30vw" className="h-full w-full object-cover" />
              </div>
            </PointerLayer>
          </div>
        ))}

        <Container className="relative text-center">
          <SectionLabel className="mb-8">(04) — {contact.label}</SectionLabel>
          <PointerLayer depth={1} strength={12}>
            <MaskedHeadline
              id="contact-title"
              lines={contact.headline}
              className="mx-auto max-w-[14ch] text-[clamp(2.75rem,8vw,8rem)] leading-[0.92] tracking-[-0.045em]"
            />
          </PointerLayer>
          <Reveal>
            <p className="mx-auto mt-8 max-w-[44ch] leading-relaxed text-bone-400 md:text-lg">{contact.intro}</p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-col items-center gap-6">
            <Magnetic>
              <Button href={`mailto:${email}`}>{contact.cta}</Button>
            </Magnetic>
            <a
              href={`mailto:${email}`}
              className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 font-display text-xl tracking-[-0.02em] transition-[background-size] duration-500 ease-expo-out hover:bg-[length:100%_1px] md:text-2xl"
            >
              {email}
            </a>
          </Reveal>
        </Container>
      </DepthScene>
    </section>
  )
}
