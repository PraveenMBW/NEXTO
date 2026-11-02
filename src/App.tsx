import { Nav } from './components/ui/Nav'
import { CapabilitiesProvider } from './providers/CapabilitiesProvider'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Hero } from './sections/Hero'
import { Portfolio } from './sections/Portfolio'
import { Services } from './sections/Services'

export default function App() {
  return (
    <CapabilitiesProvider>
      <SmoothScrollProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-bone-100 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Contact />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </CapabilitiesProvider>
  )
}
