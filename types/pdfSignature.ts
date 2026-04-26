export interface PdfSignaturePayload {
  artistId: string
  displayName: string
  timestamp: string
  contactUrl?: string
  copyright?: string
}

export interface PdfVerificationResult {
  found: boolean
  payload?: PdfSignaturePayload
  message?: string
}
