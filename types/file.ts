export interface SignedFile {
  originalName: string
  blob: Blob
  imageHash: string
  status: 'pending' | 'signing' | 'done' | 'error'
  error?: string
}

export type AcceptedMimeType = 'image/png' | 'image/jpeg' | 'image/webp'
