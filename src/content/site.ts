/**
 * All site copy lives here. Values marked PLACEHOLDER are stand-ins until the
 * final Nexto Digital copy and assets are supplied.
 */

export type HeadlineSegment = { text: string; accent?: boolean }

export const site = {
  name: 'Nexto',
  suffix: 'Digital',
  email: 'hello@nexto.digital', // PLACEHOLDER

  nav: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Design & technology studio', // PLACEHOLDER
    // Each inner array is one masked line; `accent` renders in the serif italic.
    headline: [
      [{ text: 'We design' }],
      [{ text: 'digital worlds' }],
      [{ text: 'with ' }, { text: 'depth', accent: true }, { text: '.' }],
    ] satisfies HeadlineSegment[][],
    intro:
      'Nexto Digital is an independent studio crafting immersive brands, websites and motion for companies that want to be felt, not just seen.', // PLACEHOLDER
    primaryCta: { label: 'Start a project', href: '#contact' },
    secondaryCta: { label: 'View our work', href: '#work' },
    disciplines: ['Brand', 'Web', 'Motion', '3D'],
  },

  // Everything below is PLACEHOLDER copy and artwork until real content arrives.
  about: {
    label: 'About',
    backdrop: 'Depth',
    chapters: [
      {
        kicker: 'Who we are',
        title: 'A studio at the meeting point of design and engineering.',
        body: 'We are designers, developers and motion artists working as one team — so ideas never get lost between the sketch and the shipped product.',
        stat: { value: '2016', label: 'Founded' },
        image: 'about-1',
      },
      {
        kicker: 'How we think',
        title: 'Every interface is a space. We design it with depth.',
        body: 'Layers, light and movement guide attention. We use them with restraint, so every effect earns its place and the story stays clear.',
        stat: { value: '3', label: 'Layers: strategy, design, technology' },
        image: 'about-2',
      },
      {
        kicker: 'What we deliver',
        title: 'Brands, websites and motion that feel inevitable.',
        body: 'From first workshop to launch and beyond, we build digital experiences that perform beautifully on every screen.',
        stat: { value: '140+', label: 'Projects shipped' },
        image: 'about-3',
      },
    ],
  },

  services: {
    label: 'Services',
    headline: [[{ text: 'What we' }], [{ text: 'build', accent: true }, { text: ' together.' }]] satisfies HeadlineSegment[][],
    intro: 'Four disciplines, one team. Most projects combine several — we shape the mix around what your product actually needs.',
    items: [
      {
        icon: 'brand',
        title: 'Brand Identity',
        body: 'Positioning, visual identity and design systems that scale from favicon to billboard.',
        tags: ['Strategy', 'Identity', 'Systems'],
      },
      {
        icon: 'web',
        title: 'Web Experiences',
        body: 'Fast, accessible marketing sites and product interfaces, engineered in React.',
        tags: ['UX / UI', 'Development', 'CMS'],
      },
      {
        icon: 'motion',
        title: 'Motion Design',
        body: 'Interaction, product animation and brand films that give interfaces a pulse.',
        tags: ['Interaction', 'Product', 'Film'],
      },
      {
        icon: '3d',
        title: '3D & Immersive',
        body: 'Real-time 3D, WebGL and spatial experiences — used where depth adds meaning.',
        tags: ['WebGL', 'Three.js', 'Spatial'],
      },
    ],
  },

  work: {
    label: 'Selected work',
    headline: [[{ text: 'Work with' }], [{ text: 'depth', accent: true }, { text: '.' }]] satisfies HeadlineSegment[][],
    range: '2022 — 2026',
    lead: {
      title: 'Orbit',
      summary: 'Launch experience for a spatial-computing platform.',
      tags: ['3D', 'Web', 'Launch'],
      year: '2026',
      image: 'work-lead',
      detail: 'work-3-detail',
    },
    projects: [
      {
        title: 'Aurora Bank',
        summary: 'Digital banking, rebuilt around calm.',
        tags: ['Brand', 'Product'],
        year: '2025',
        image: 'work-1',
        detail: 'work-1-detail',
      },
      {
        title: 'Lumen Atelier',
        summary: 'An identity and e-commerce home for a lighting house.',
        tags: ['Identity', 'Commerce'],
        year: '2025',
        image: 'work-2',
        detail: 'work-2-detail',
      },
      {
        title: 'Northwind Mobility',
        summary: 'Fleet intelligence, visualised in real time.',
        tags: ['Data', 'Web App'],
        year: '2024',
        image: 'work-3',
        detail: 'work-3-detail',
      },
      {
        title: 'Halcyon Health',
        summary: 'A gentler way to manage long-term care.',
        tags: ['UX', 'Motion'],
        year: '2023',
        image: 'work-4',
        detail: 'work-4-detail',
      },
    ],
  },

  contact: {
    label: 'Contact',
    headline: [[{ text: "Let's build" }], [{ text: 'something with ' }, { text: 'depth', accent: true }, { text: '.' }]] satisfies HeadlineSegment[][],
    intro: 'Tell us about your product, your timeline and what success looks like. We reply within two working days.',
    cta: 'Start a project',
    location: 'Remote-first · Working worldwide',
    socials: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'Dribbble', href: '#' },
      { label: 'Behance', href: '#' },
    ],
  },
} as const

/** Generated sizes for each artwork in /public/images (large, small). */
export const IMAGE_SIZES: Record<string, [number, number, number]> = {
  // name: [large width, small width, aspect (h / w)]
  'about-1': [1000, 600, 1.25],
  'about-2': [1000, 600, 1.25],
  'about-3': [1000, 600, 1.25],
  'work-lead': [2400, 1200, 0.5625],
  'work-1': [1600, 800, 0.6875],
  'work-2': [1600, 800, 0.6875],
  'work-3': [1600, 800, 0.6875],
  'work-4': [1600, 800, 0.6875],
  'work-1-detail': [800, 480, 1.25],
  'work-2-detail': [800, 480, 1.25],
  'work-3-detail': [800, 480, 1.25],
  'work-4-detail': [800, 480, 1.25],
}
