import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { site } from '../../content/site'
import { cn } from '../../lib/cn'
import { useCapabilities } from '../../providers/CapabilitiesProvider'
import { useLenis } from '../../providers/SmoothScrollProvider'
import { Button } from './Button'
import { Container } from './Container'
import { Logo } from './Logo'
import { SmoothLink } from './SmoothLink'

const EASE = [0.16, 1, 0.3, 1] as const

export function Nav() {
  const { scrollY } = useScroll()
  const lenis = useLenis()
  const { reducedMotion } = useCapabilities()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Only flips booleans, so React re-renders on direction change — not per frame.
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(current > previous && current > 160)
    setScrolled(current > 24)
  })

  // Lock page scroll while the mobile menu is open; close it with Escape.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    lenis?.stop()
    root.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      root.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, lenis])

  const close = () => setOpen(false)

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500',
          scrolled && !open
            ? 'border-line bg-ink-950/70 backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: EASE }}
      >
        <Container className="flex h-16 items-center justify-between md:h-20">
          <SmoothLink href="#top" aria-label={`${site.name} ${site.suffix} — back to top`} onClick={close}>
            <Logo />
          </SmoothLink>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => (
              <SmoothLink
                key={item.href}
                href={item.href}
                className="text-sm text-bone-400 transition-colors duration-300 hover:text-bone-100"
              >
                {item.label}
              </SmoothLink>
            ))}
            <Button href={site.hero.primaryCta.href} size="sm">
              {site.hero.primaryCta.label}
            </Button>
          </nav>

          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-bone-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950 pt-24 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
          >
            <Container className="flex flex-1 flex-col justify-between pb-10">
              <nav aria-label="Mobile">
                <ul className="flex flex-col gap-2">
                  {site.nav.map((item, index) => (
                    <li key={item.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: reducedMotion ? 0 : '100%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.05 + index * 0.05 }}
                      >
                        <SmoothLink
                          href={item.href}
                          onClick={close}
                          className="block py-1 font-display text-5xl font-medium tracking-[-0.04em]"
                        >
                          {item.label}
                        </SmoothLink>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex flex-col gap-6">
                <a href={`mailto:${site.email}`} className="text-bone-400">
                  {site.email}
                </a>
                <Button href={site.hero.primaryCta.href} onClick={close} className="self-start">
                  {site.hero.primaryCta.label}
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
