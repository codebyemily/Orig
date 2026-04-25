export function stringToBits(str: string): number[] {
  const bytes = new TextEncoder().encode(str)
  const bits: number[] = []
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1)
    }
  }
  return bits
}

export function bitsToString(bits: number[]): string {
  const bytes: number[] = []
  for (let i = 0; i + 7 < bits.length; i += 8) {
    let byte = 0
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i + j]
    }
    bytes.push(byte)
  }
  return new TextDecoder().decode(new Uint8Array(bytes))
}

export function numberToBytes(n: number, byteCount: number): number[] {
  const result: number[] = []
  for (let i = byteCount - 1; i >= 0; i--) {
    result[i] = n & 0xff
    n = n >> 8
  }
  return result
}

export function bytesToNumber(bytes: number[]): number {
  let n = 0
  for (const b of bytes) {
    n = (n << 8) | b
  }
  return n
}
