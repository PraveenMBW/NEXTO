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
} as const
