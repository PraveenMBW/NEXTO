import type { HeadlineSegment } from '../../content/site'

/**
 * Renders headline lines inside overflow masks. The inner span of each line
 * carries `data-line` so a GSAP timeline can slide it up from below the mask.
 * Accent segments use the serif italic.
 */
export function HeadlineLines({ lines }: { lines: readonly (readonly HeadlineSegment[])[] }) {
  return lines.map((line, lineIndex) => (
    <span key={lineIndex} className="-mb-[0.1em] block overflow-hidden pr-[0.12em] pb-[0.1em]">
      <span data-line className="block">
        {line.map((segment, index) =>
          segment.accent ? (
            <em key={index} className="font-serif font-normal tracking-[-0.02em] text-iris-300">
              {segment.text}
            </em>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
      </span>
    </span>
  ))
}
