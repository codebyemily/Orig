import type { SignaturePayload } from '@/types/signature'

const MAGIC = 'ORIG'
const VERSION = 1

export function serializePayload(payload: SignaturePayload): string {
  const json = JSON.stringify({ ...payload, version: VERSION })
  return `${MAGIC}:${json}`
}

export function deserializePayload(raw: string): SignaturePayload | null {
  try {
    if (!raw.startsWith(`${MAGIC}:`)) return null
    const json = raw.slice(MAGIC.length + 1)
    const obj = JSON.parse(json) as SignaturePayload
    if (!obj.artistId || !obj.displayName || !obj.timestamp || !obj.imageHash) return null
    return obj
  } catch {
    return null
  }
}
