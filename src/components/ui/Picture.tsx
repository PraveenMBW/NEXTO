import type { ImgHTMLAttributes } from 'react'
import { IMAGE_SIZES } from '../../content/site'

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  /** Artwork name in /public/images, e.g. "work-1". */
  name: string
  /** Rendered width hint for the browser, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string
  /** Above-the-fold images load eagerly; everything else lazily. */
  priority?: boolean
}

/** Responsive WebP with intrinsic dimensions (no layout shift). */
export function Picture({ name, sizes, priority = false, alt = '', ...rest }: PictureProps) {
  const [large, small, aspect] = IMAGE_SIZES[name]
  const base = `${import.meta.env.BASE_URL}images/${name}`
  return (
    <img
      src={`${base}-${small}.webp`}
      srcSet={`${base}-${small}.webp ${small}w, ${base}-${large}.webp ${large}w`}
      sizes={sizes}
      width={large}
      height={Math.round(large * aspect)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      {...rest}
    />
  )
}
