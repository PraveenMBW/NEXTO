import { site } from '../content/site'
import { cn } from '../lib/cn'
import { ExpandingMedia } from '../components/depth/ExpandingMedia'
import { MaskedHeadline } from '../components/depth/MaskedHeadline'
import { ParallaxImage } from '../components/depth/ParallaxImage'
import { Reveal } from '../components/depth/Reveal'
import { ScrollLayer } from '../components/depth/ScrollLayer'
import { Container } from '../components/ui/Container'
import { SectionLabel } from '../components/ui/SectionLabel'

function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Disciplines">
      {tags.map((tag) => (
        <li key={tag} className="rounded-full border border-line-strong px-3 py-1 text-xs text-bone-100/80">
          {tag}
        </li>
      ))}
    </ul>
  )
}

/*
 * 1. Lead project opens from an inset card to full-bleed (ExpandingMedia).
 * 2. Project rows: a main image and an overlapping detail image moving at
 *    different speeds (detail is nearer, so faster), each picture also
 *    drifting inside its own frame. Rows alternate sides.
 */
export function Portfolio() {
  const { work } = site

  return (
    <section id="work" aria-labelledby="work-title" className="relative border-t border-line pt-24 md:pt-36">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel className="mb-6">(03) — {work.label}</SectionLabel>
            <MaskedHeadline id="work-title" lines={work.headline} />
          </div>
          <Reveal>
            <SectionLabel>{work.range}</SectionLabel>
          </Reveal>
        </div>
      </Container>

      <div className="mt-14 md:mt-20">
        <ExpandingMedia name={work.lead.image} alt={`${work.lead.title} — featured project`}>
          <Container className="flex flex-col gap-5 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <div>
              <SectionLabel className="text-bone-100/70">Featured · {work.lead.year}</SectionLabel>
              <h3 className="mt-3 font-display text-headline font-medium">{work.lead.title}</h3>
              <p className="mt-3 max-w-[40ch] text-bone-100/80 md:text-lg">{work.lead.summary}</p>
            </div>
            <Tags tags={work.lead.tags} />
          </Container>
        </ExpandingMedia>
      </div>

      <Container className="py-24 md:py-40">
        <ul className="flex flex-col gap-32 md:gap-48">
          {work.projects.map((project, index) => {
            const flip = index % 2 === 1
            return (
              <li key={project.title} className="group grid items-center gap-y-20 md:grid-cols-12 md:gap-x-6">
                <div className={cn('relative md:col-span-8 md:row-start-1', flip && 'md:col-start-5')}>
                  <ParallaxImage
                    name={project.image}
                    alt={`${project.title} — project visual`}
                    sizes="(min-width: 768px) 62vw, 100vw"
                    className="aspect-[16/11] rounded-[20px]"
                    imgClassName="transition-[scale] duration-1000 ease-expo-out group-hover:scale-[1.04]"
                  />
                  <ScrollLayer
                    speed={0.16}
                    className={cn(
                      'absolute -bottom-12 z-10 w-[36%] md:-bottom-16 md:w-[32%]',
                      flip ? '-left-2 md:-left-12' : '-right-2 md:-right-12',
                    )}
                  >
                    <ParallaxImage
                      name={project.detail}
                      sizes="(min-width: 768px) 20vw, 36vw"
                      amount={5}
                      className="aspect-[4/5] rounded-2xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
                    />
                  </ScrollLayer>
                </div>

                <Reveal
                  className={cn(
                    'md:col-span-4 md:row-start-1',
                    flip ? 'md:col-start-1 md:pr-8' : 'md:col-start-9 md:pl-8',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <SectionLabel>{String(index + 1).padStart(2, '0')}</SectionLabel>
                    <SectionLabel>{project.year}</SectionLabel>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-medium tracking-[-0.035em] md:text-4xl lg:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-4 max-w-[34ch] leading-relaxed text-bone-400 md:text-lg">{project.summary}</p>
                  <div className="mt-6">
                    <Tags tags={project.tags} />
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
