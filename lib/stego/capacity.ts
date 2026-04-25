// Each pixel provides 3 bits (R, G, B LSBs). We use 4 bytes for length prefix.
export function maxPayloadBytes(pixelCount: number): number {
  const totalBits = pixelCount * 3
  const totalBytes = Math.floor(totalBits / 8)
  return totalBytes - 4 // subtract length prefix
}

export function checkCapacity(pixelCount: number, payloadLength: number): void {
  const max = maxPayloadBytes(pixelCount)
  if (payloadLength > max) {
    throw new Error(
      `Image too small to embed payload. Need ${payloadLength} bytes, image supports ${max} bytes.`
    )
  }
}
