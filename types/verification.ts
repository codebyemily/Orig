import type { SignaturePayload } from './signature'

export type VerificationStatus = 'own' | 'other' | 'none' | 'error'

export type VerificationResult =
  | {
      status: 'none'
    }
  | {
      status: 'own' | 'other'
      payload: SignaturePayload
      tampered: boolean
      currentHash: string
    }
  | {
      status: 'error'
      message: string
    }