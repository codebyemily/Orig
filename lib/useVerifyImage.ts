'use client'

import { useState, useCallback } from 'react'
import type { VerificationResult } from '@/types/verification'
import { loadImageToCanvas } from './canvas/loadImageToCanvas'
import { extractImageData } from './canvas/extractImageData'
import { decodeLSB } from './stego/decodeLSB'
import { deserializePayload } from './stego/payload'
import {
  computeRotationInvariantVisualHash,
  visualHashesMatch,
} from './crypto/visualHash'
import { loadProfile } from './storage/profileStorage'

type VerifyStatus = 'idle' | 'scanning' | 'done' | 'error'
type Rotation = 0 | 90 | 180 | 270

function rotateCanvas(
  sourceCanvas: HTMLCanvasElement,
  rotation: Rotation
): HTMLCanvasElement {
  const rotatedCanvas = document.createElement('canvas')
  const ctx = rotatedCanvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not create rotated canvas')
  }

  const sourceWidth = sourceCanvas.width
  const sourceHeight = sourceCanvas.height

  if (rotation === 90 || rotation === 270) {
    rotatedCanvas.width = sourceHeight
    rotatedCanvas.height = sourceWidth
  } else {
    rotatedCanvas.width = sourceWidth
    rotatedCanvas.height = sourceHeight
  }

  if (rotation === 0) {
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 90) {
    ctx.translate(rotatedCanvas.width, 0)
    ctx.rotate(Math.PI / 2)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 180) {
    ctx.translate(rotatedCanvas.width, rotatedCanvas.height)
    ctx.rotate(Math.PI)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

  if (rotation === 270) {
    ctx.translate(0, rotatedCanvas.height)
    ctx.rotate(-Math.PI / 2)
    ctx.drawImage(sourceCanvas, 0, 0)
  }

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

        const currentHash = computeRotationInvariantVisualHash(candidateCanvas)

        const tampered = payload.imageHash.startsWith('dhash:')
          ? !visualHashesMatch(payload.imageHash, currentHash)
          : payload.imageHash !== currentHash

        const myProfile = loadProfile()

        const verificationStatus: 'own' | 'other' =
          myProfile && payload.artistId === myProfile.id ? 'own' : 'other'

        setResult({
          status: verificationStatus,
          payload,
          tampered,
          currentHash,
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