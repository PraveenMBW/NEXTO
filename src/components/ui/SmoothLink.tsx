import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useScrollTo } from '../../hooks/useScrollTo'

type SmoothLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** An anchor that routes in-page (#hash) links through Lenis. */
export function SmoothLink({ href, onClick, ...rest }: SmoothLinkProps) {
  const scrollTo = useScrollTo()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || !href.startsWith('#')) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    scrollTo(href)
  }

  return <a href={href} onClick={handleClick} {...rest} />
}
