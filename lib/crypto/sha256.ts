export async function sha256Hex(data: Uint8Array | Uint8ClampedArray): Promise<string> {
  const bytes = new Uint8Array(data.length)
  bytes.set(data)

  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function normalizeImageDataForHash(data: Uint8ClampedArray): Uint8Array {
  const normalized = new Uint8Array(data.length)

  for (let i = 0; i < data.length; i++) {
    const channelIndex = i % 4

    // Keep alpha unchanged.
    if (channelIndex === 3) {
      normalized[i] = data[i]
    } else {
      // Clear the least significant bit for RGB channels.
      // This ignores the bits Orig uses for the invisible signature.
      normalized[i] = data[i] & 0b11111110
    }
  }

  return normalized
}