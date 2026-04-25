import type { SignaturePayload } from './signature'

export type VerificationStatus = 'own' | 'other' | 'none' | 'tampered'

export interface VerificationResult {
  status: VerificationStatus
  payload?: SignaturePayload
  tampered?: boolean
  currentHash?: string
}
