export interface VideoSignaturePayload {
  artistId: string
  displayName: string
  timestamp: string
  contactUrl?: string
  copyright?: string
}

const MARKER = 'ORIG_VIDEO_V1'
const LENGTH_BITS = 32

function bytesToBits(bytes: Uint8Array): number[] {
  const bits: number[] = []

  for (const byte of bytes) {
    for (let bit = 7; bit >= 0; bit--) {
      bits.push((byte >> bit) & 1)
    }
  }

  return bits
}

function bitsToBytes(bits: number[]): Uint8Array {
  const byteLength = Math.ceil(bits.length / 8)
  const bytes = new Uint8Array(byteLength)

  for (let i = 0; i < bits.length; i++) {
    const byteIndex = Math.floor(i / 8)
    const bitIndex = 7 - (i % 8)
    bytes[byteIndex] |= bits[i] << bitIndex
  }

  return bytes
}

function numberToBits(value: number, bitCount: number): number[] {
  const bits: number[] = []

  for (let i = bitCount - 1; i >= 0; i--) {
    bits.push((value >> i) & 1)
  }

  return bits
}

function bitsToNumber(bits: number[]): number {
  let value = 0

  for (const bit of bits) {
    value = (value << 1) | bit
  }

  return value
}

function buildMessage(payload: VideoSignaturePayload): Uint8Array {
  const json = JSON.stringify({
    marker: MARKER,
    payload,
  })

  return new TextEncoder().encode(json)
}

export function embedSignatureInImageData(
  imageData: ImageData,
  payload: VideoSignaturePayload
): ImageData {
  const messageBytes = buildMessage(payload)
  const messageBits = bytesToBits(messageBytes)
  const lengthBits = numberToBits(messageBits.length, LENGTH_BITS)
  const allBits = [...lengthBits, ...messageBits]

  const capacity = Math.floor((imageData.data.length / 4) * 3)

  if (allBits.length > capacity) {
    throw new Error('Video frame is too small to hold the signature payload.')
  }

  const output = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )

  let bitIndex = 0

  for (let i = 0; i < output.data.length && bitIndex < allBits.length; i += 4) {
    for (let channel = 0; channel < 3 && bitIndex < allBits.length; channel++) {
      output.data[i + channel] = (output.data[i + channel] & 0xfe) | allBits[bitIndex]
      bitIndex++
    }
  }

  return output
}

export function extractSignatureFromImageData(
  imageData: ImageData
): VideoSignaturePayload | null {
  const bits: number[] = []

  for (let i = 0; i < imageData.data.length; i += 4) {
    bits.push(imageData.data[i] & 1)
    bits.push(imageData.data[i + 1] & 1)
    bits.push(imageData.data[i + 2] & 1)
  }

  const messageLengthBits = bits.slice(0, LENGTH_BITS)
  const messageLength = bitsToNumber(messageLengthBits)

  if (!Number.isFinite(messageLength) || messageLength <= 0) return null

  const messageBits = bits.slice(LENGTH_BITS, LENGTH_BITS + messageLength)
  if (messageBits.length !== messageLength) return null

  try {
    const bytes = bitsToBytes(messageBits)
    const text = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(text)

    if (parsed?.marker !== MARKER) return null

    return parsed.payload as VideoSignaturePayload
  } catch {
    return null
  }
}
