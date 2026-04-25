import { stringToBits, numberToBytes } from './bitstream'
import { checkCapacity } from './capacity'

export function encodeLSB(data: Uint8ClampedArray, payload: string): Uint8ClampedArray<ArrayBuffer> {
  const pixelCount = data.length / 4
  const payloadBytes = new TextEncoder().encode(payload)
  checkCapacity(pixelCount, payloadBytes.length)

  // Build bit stream: 4-byte length header + payload bytes
  const lengthBytes = numberToBytes(payloadBytes.length, 4)
  const allBytes = [...lengthBytes, ...payloadBytes]
  const bits: number[] = []
  for (const byte of allBytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1)
    }
  }

  const result = new Uint8ClampedArray(new ArrayBuffer(data.length))
  result.set(data)
  let bitIndex = 0

  for (let i = 0; i < data.length && bitIndex < bits.length; i++) {
    // Skip alpha channel (every 4th byte)
    if (i % 4 === 3) continue
    result[i] = (result[i] & 0xfe) | bits[bitIndex]
    bitIndex++
  }

  return result
}
