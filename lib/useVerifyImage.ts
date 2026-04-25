'use client'

import { useState, useCallback } from 'react'
import type { VerificationResult } from '@/types/verification'
import { loadImageToCanvas } from './canvas/loadImageToCanvas'
import { extractImageData } from './canvas/extractImageData'
import { decodeLSB } from './stego/decodeLSB'
import { deserializePayload } from './stego/payload'
import { sha256Hex } from './crypto/sha256'
import { loadProfile } from './storage/profileStorage'

type VerifyStatus = 'idle' | 'scanning' | 'done' | 'error'

export function useVerifyImage() {
  const [status, setStatus] = useState<VerifyStatus>('idle')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const verify = useCallback(async (file: File) => {
    setStatus('scanning')
    setResult(null)
    setError(null)

    try {
      const canvas = await loadImageToCanvas(file)
      const imageData = extractImageData(canvas)
      const currentHash = await sha256Hex(imageData.data)
      const raw = decodeLSB(imageData.data)

      if (!raw) {
        setResult({ status: 'none' })
        setStatus('done')
        return
      }

      const payload = deserializePayload(raw)
      if (!payload) {
        setResult({ status: 'none' })
        setStatus('done')
        return
      }

      const tampered = payload.imageHash !== currentHash
      const myProfile = loadProfile()
      let verificationStatus: VerificationResult['status']

      if (tampered) {
        verificationStatus = 'tampered'
      } else if (myProfile && payload.artistId === myProfile.id) {
        verificationStatus = 'own'
      } else {
        verificationStatus = 'other'
      }

      setResult({ status: verificationStatus, payload, tampered, currentHash })
      setStatus('done')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setError(null)
  }, [])

  return { verify, status, result, error, reset }
}
