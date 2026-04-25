const THUMB_SIZE = 80

export function generateThumbnail(canvas: HTMLCanvasElement): string {
  const thumb = document.createElement('canvas')
  const scale = Math.min(THUMB_SIZE / canvas.width, THUMB_SIZE / canvas.height)
  thumb.width = Math.round(canvas.width * scale)
  thumb.height = Math.round(canvas.height * scale)
  const ctx = thumb.getContext('2d')!
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height)
  return thumb.toDataURL('image/jpeg', 0.7)
}
