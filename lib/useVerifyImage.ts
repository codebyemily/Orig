'use client'

import { useState, useCallback } from 'react'
import type { VerificationResult } from '@/types/verification'
import { loadImageToCanvas } from './canvas/loadImageToCanvas'
import { extractImageData } from './canvas/extractImageData'
import { decodeLSB } from './stego/decodeLSB'
import { deserializePayload } from './stego/payload'
import { normalizeImageDataForHash, sha256Hex } from './crypto/sha256'
import { loadProfile } from './storage/profileStorage'

type VerifyStatus = 'idle' | 'scanning' | 'done' | 'error'
type Rotation = 0 | 90 | 180 | 270

function rotateCanvas(
  sourceCanvas: HTMLCanvasElement,
  rotation: Rotation
): HTMLCanvasElement {
  if (rotation === 0) return sourceCanvas

  const rotatedCanvas = document.createElement('canvas')
  const ctx = rotatedCanvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not create rotated canvas')
  }

  if (rotation === 90 || rotation === 270) {
    rotatedCanvas.width = sourceCanvas.height
    rotatedCanvas.height = sourceCanvas.width
  } else {
    rotatedCanvas.width = sourceCanvas.width
    rotatedCanvas.height = sourceCanvas.height
  }

  switch (rotation) {
    case 90:
      ctx.translate(rotatedCanvas.width, 0)
      ctx.rotate(Math.PI / 2)
      break
    case 180:
      ctx.translate(rotatedCanvas.width, rotatedCanvas.height)
      ctx.rotate(Math.PI)
      break
    case 270:
      ctx.translate(0, rotatedCanvas.height)
      ctx.rotate(-Math.PI / 2)
      break
  }

  ctx.drawImage(sourceCanvas, 0, 0)
  return rotatedCanvas
}

export function useVerifyImage() {
  const [status, setStatus] = useState<VerifyStatus>('idle')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const verify = useCallback(async (file: File) => {
    setStatus('scanning')
    setResult(null)
    setError(null)

    try {
      const originalCanvas = await loadImageToCanvas(file)
      const rotations: Rotation[] = [0, 90, 180, 270]

      for (const rotation of rotations) {
        const candidateCanvas = rotateCanvas(originalCanvas, rotation)
        const imageData = extractImageData(candidateCanvas)

        const raw = decodeLSB(imageData.data)
        if (!raw) continue

        let payload
        try {
          payload = deserializePayload(raw)
        } catch {
          continue
        }

        if (!payload) continue

        const normalizedBytes = normalizeImageDataForHash(imageData.data)
        const currentHash = await sha256Hex(normalizedBytes)

        const orientationCorrected = rotation !== 0
        const tampered = payload.imageHash !== currentHash || orientationCorrected
        const myProfile = loadProfile()

        const verificationStatus: 'own' | 'other' =
          myProfile && payload.artistId === myProfile.id ? 'own' : 'other'

        let registeredName: string | undefined
        try {
          const res = await fetch(`/api/profiles?id=${encodeURIComponent(payload.artistId)}`)
          if (res.ok) {
            const profile = await res.json()
            registeredName = profile.displayName
          }
        } catch {
          // DB lookup failure doesn't block verification
        }

        setResult({
          status: verificationStatus,
          payload,
          tampered,
          currentHash,
          registeredName,
        })

        setStatus('done')
        return
      }

      setResult({ status: 'none' })
      setStatus('done')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
      setResult({
        status: 'error',
        message: msg,
      })
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