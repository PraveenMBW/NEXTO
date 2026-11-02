/**
 * One-off device checks. Media-query based capabilities (reduced motion,
 * pointer type) are reactive and live in CapabilitiesProvider instead.
 */

export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    if (!gl) return false
    // Release the probe context immediately — browsers cap live contexts.
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

type NavigatorHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function detectSaveData(): boolean {
  return Boolean((navigator as NavigatorHints).connection?.saveData)
}

/** Conservative low-power heuristic: few cores or little memory. */
export function detectLowPower(): boolean {
  const nav = navigator as NavigatorHints
  const cores = nav.hardwareConcurrency ?? 8
  const memory = nav.deviceMemory ?? 8
  return cores <= 4 || memory <= 4
}

/**
 * `?hero=3d` / `?hero=static` forces the hero visual mode — used for QA and
 * for rendering the static fallback image.
 */
export function heroOverride(): '3d' | 'static' | null {
  const value = new URLSearchParams(window.location.search).get('hero')
  return value === '3d' || value === 'static' ? value : null
}
