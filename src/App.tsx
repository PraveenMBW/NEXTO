import { Nav } from './components/ui/Nav'
import { CapabilitiesProvider } from './providers/CapabilitiesProvider'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { Hero } from './sections/Hero'
import { UpcomingSection } from './sections/UpcomingSection'

export default function App() {
  return (
    <CapabilitiesProvider>
      <SmoothScrollProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-bone-100 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <UpcomingSection id="about" index="01" title="About" />
          <UpcomingSection id="services" index="02" title="Services" />
          <UpcomingSection id="work" index="03" title="Work" />
          <UpcomingSection id="contact" index="04" title="Contact" />
        </main>
      </SmoothScrollProvider>
    </CapabilitiesProvider>
  )
}
