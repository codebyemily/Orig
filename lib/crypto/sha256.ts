export async function sha256Hex(data: Uint8ClampedArray): Promise<string> {
  const copy = new Uint8Array(data).buffer as ArrayBuffer
  const hashBuffer = await crypto.subtle.digest('SHA-256', copy)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
