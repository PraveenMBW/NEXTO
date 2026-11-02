import { Container } from '../components/ui/Container'
import { SectionLabel } from '../components/ui/SectionLabel'

// TEMPORARY — gives the page real scroll length and anchor targets while the
// remaining sections are built one phase at a time. Delete when all are done.
export function UpcomingSection({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <section id={id} className="flex min-h-[90svh] items-center border-t border-line">
      <Container>
        <SectionLabel>
          ({index}) — {title}
        </SectionLabel>
        <p className="mt-4 font-display text-headline font-medium text-bone-400/40">
          {title} — next phase
        </p>
      </Container>
    </section>
  )
}
