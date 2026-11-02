import { useRef } from 'react'
import { site } from '../content/site'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { Container } from '../components/ui/Container'
import { Logo } from '../components/ui/Logo'
import { SectionLabel } from '../components/ui/SectionLabel'
import { SmoothLink } from '../components/ui/SmoothLink'

const YEAR = new Date().getFullYear()

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { nav, contact, email, name, suffix } = site

  // The wordmark rises out of its mask as the page reaches the end.
  useGSAP(
    () => {
      gsap.matchMedia().add(MQ.motionOK, () => {
        gsap.from('[data-footer-word]', {
          yPercent: 55,
          ease: 'none',
          scrollTrigger: { trigger: '[data-footer-mask]', start: 'top bottom', end: 'bottom bottom', scrub: true },
        })
      })
    },
    { scope: ref },
  )

  const linkClass = 'text-bone-400 transition-colors duration-300 hover:text-bone-100'

  return (
    <footer ref={ref} className="relative border-t border-line pt-16 md:pt-24">
      <Container className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-[34ch] leading-relaxed text-bone-400">{site.hero.intro}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
          <SectionLabel className="mb-4">Sitemap</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <SmoothLink href={item.href} className={linkClass}>
                  {item.label}
                </SmoothLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <SectionLabel className="mb-4">Social</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} className={linkClass} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <SectionLabel className="mb-4">Contact</SectionLabel>
          <a href={`mailto:${email}`} className="text-bone-100 hover:text-iris-300">
            {email}
          </a>
          <p className="mt-2.5 text-bone-400">{contact.location}</p>
        </div>
      </Container>

      <div data-footer-mask aria-hidden className="mt-16 overflow-hidden md:mt-24">
        <p
          data-footer-word
          className="text-center font-display text-[25vw] leading-[0.78] font-semibold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgb(255_255_255/0.16)]"
        >
          {name}
        </p>
      </div>

      <Container className="flex flex-col gap-3 border-t border-line py-6 text-sm text-bone-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {YEAR} {name} {suffix}. All rights reserved.
        </p>
        <SmoothLink href="#top" className={linkClass}>
          Back to top ↑
        </SmoothLink>
      </Container>
    </footer>
  )
}
