const MAX_DIMENSION = 1024
const JPEG_QUALITY = 0.8

/**
 * Returns a compressed JPEG data URL suitable for localStorage storage.
 * Scales down large images so they fit within the storage quota while
 * still being usable as a preview. Note: JPEG compression destroys LSB
 * steganographic data, so this output cannot be used for re-verify.
 */
export function compressForStorage(canvas: HTMLCanvasElement): string {
  const { width, height } = canvas
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))

  if (scale === 1) {
    return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
  }

  const compressed = document.createElement('canvas')
  compressed.width = Math.round(width * scale)
  compressed.height = Math.round(height * scale)
  const ctx = compressed.getContext('2d')!
  ctx.drawImage(canvas, 0, 0, compressed.width, compressed.height)
  return compressed.toDataURL('image/jpeg', JPEG_QUALITY)
}
