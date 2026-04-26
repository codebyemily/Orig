type Rotation = 0 | 90 | 180 | 270

function rotateCanvas(
  sourceCanvas: HTMLCanvasElement,
  rotation: Rotation
): HTMLCanvasElement {
  const rotatedCanvas = document.createElement('canvas')
  const ctx = rotatedCanvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not create rotated canvas')
  }

  const sourceWidth = sourceCanvas.width
  const sourceHeight = sourceCanvas.height

  if (rotation === 90 || rotation === 270) {
    rotatedCanvas.width = sourceHeight
    rotatedCanvas.height = sourceWidth
  } else {
    rotatedCanvas.width = sourceWidth
    rotatedCanvas.height = sourceHeight
  }

  if (rotation === 0) {
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 90) {
    ctx.translate(rotatedCanvas.width, 0)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 180) {
    ctx.translate(rotatedCanvas.width, rotatedCanvas.height)
    ctx.rotate(Math.PI)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 270) {
    ctx.translate(0, rotatedCanvas.height)
    ctx.rotate(-Math.PI / 2)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  return rotatedCanvas
}

function computeAHash(canvas: HTMLCanvasElement): string {
  const size = 16
  const smallCanvas = document.createElement('canvas')
  smallCanvas.width = size
  smallCanvas.height = size

  const ctx = smallCanvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not create visual hash canvas')
  }

  ctx.drawImage(canvas, 0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const pixels = imageData.data

  const grays: number[] = []

  for (let i = 0; i < pixels.length; i += 4) {
    const gray =
      pixels[i] * 0.299 +
      pixels[i + 1] * 0.587 +
      pixels[i + 2] * 0.114

    grays.push(gray)
  }

  const average =
    grays.reduce((sum, value) => sum + value, 0) / grays.length

  let bits = ''

  for (const gray of grays) {
    bits += gray >= average ? '1' : '0'
  }

  let hex = ''

  for (let i = 0; i < bits.length; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16)
  }

  return hex
}

export function computeRotationInvariantVisualHash(
  canvas: HTMLCanvasElement
): string {
  const rotations: Rotation[] = [0, 90, 180, 270]

  const hashes = rotations.map((rotation) => {
    const rotated = rotateCanvas(canvas, rotation)
    return computeAHash(rotated)
  })

  return `ahash16:${hashes.sort()[0]}`
}

export function hammingDistance(hashA: string, hashB: string): number {
  const a = hashA.replace(/^ahash16:/, '').replace(/^dhash:/, '')
  const b = hashB.replace(/^ahash16:/, '').replace(/^dhash:/, '')

  if (a.length !== b.length) {
    return Number.POSITIVE_INFINITY
  }

  let distance = 0

  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16)
    const y = parseInt(b[i], 16)
    let diff = x ^ y

    while (diff) {
      distance += diff & 1
      diff >>= 1
    }
  }

  return distance
}

export function visualHashesMatch(hashA: string, hashB: string): boolean {
  const distance = hammingDistance(hashA, hashB)

  // 16x16 hash = 256 bits.
  // Lower number = stricter.
  // This should allow rotation but catch obvious edits like drawn lines.
  return distance <= 6
}