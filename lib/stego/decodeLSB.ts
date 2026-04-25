import { bitsToString, bytesToNumber } from './bitstream'

export function decodeLSB(data: Uint8ClampedArray): string | null {
  const bits: number[] = []

  for (let i = 0; i < data.length; i++) {
    if (i % 4 === 3) continue
    bits.push(data[i] & 1)
  }

  // Read 4-byte length header (32 bits)
  if (bits.length < 32) return null

  const lengthBytes: number[] = []
  for (let i = 0; i < 4; i++) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j]
    }
    lengthBytes.push(byte)
  }

  const payloadLength = bytesToNumber(lengthBytes)

  // Sanity check
  const maxPossibleBytes = Math.floor(bits.length / 8) - 4
  if (payloadLength <= 0 || payloadLength > maxPossibleBytes) return null

  const payloadBits = bits.slice(32, 32 + payloadLength * 8)
  if (payloadBits.length < payloadLength * 8) return null

  try {
    return bitsToString(payloadBits)
  } catch {
    return null
  }
}
