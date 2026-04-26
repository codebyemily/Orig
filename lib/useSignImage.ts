'use client'

import { useState, useCallback } from 'react'
import type { ArtistProfile } from '@/types/artist'
import type { SignaturePayload } from '@/types/signature'
import { loadImageToCanvas } from './canvas/loadImageToCanvas'
import { extractImageData } from './canvas/extractImageData'
import { exportPng, triggerDownload } from './canvas/exportPng'
import { generateThumbnail } from './canvas/thumbnail'
import { compressForStorage } from './canvas/compressForStorage'
import { encodeLSB } from './stego/encodeLSB'
import { serializePayload } from './stego/payload'
import { computeRotationInvariantVisualHash } from './crypto/visualHash'
import { addRegistryEntry } from './storage/registryStorage'

type SignStatus = 'idle' | 'signing' | 'done' | 'error'


export function useSignImage(profile: ArtistProfile | null) {
  const [status, setStatus] = useState<SignStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const signImage = useCallback(
    async (file: File): Promise<string | null> => {
      if (!profile?.displayName) {
        setError('Please set up your artist profile before signing.')
        return null
      }

      setStatus('signing')
      setError(null)

      try {
        const canvas = await loadImageToCanvas(file)
        const imageData = extractImageData(canvas)

        // Rotation-tolerant visual hash.
        // This lets Orig treat 90/180/270 rotation as the same image,
        // while still catching obvious visual edits.
        const imageHash = computeRotationInvariantVisualHash(canvas)

        const payload: SignaturePayload = {
          artistId: profile.id,
          displayName: profile.displayName,
          timestamp: new Date().toISOString(),
          contactUrl: profile.contactUrl,
          copyright: profile.copyright,
          imageHash,
          version: 1,
        }

        const serialized = serializePayload(payload)
        const encodedData = encodeLSB(imageData.data, serialized)

        const ctx = canvas.getContext('2d')!
        const newImageData = new ImageData(
          encodedData,
          canvas.width,
          canvas.height
        )

        ctx.putImageData(newImageData, 0, 0)

        const blob = await exportPng(canvas)
        const thumbnail = generateThumbnail(canvas)
        const signedImageDataUrl = compressForStorage(canvas)

        const baseName = file.name.replace(/\.[^.]+$/, '')
        const outputName = `${baseName}-signed.png`

        triggerDownload(blob, outputName)

        addRegistryEntry({
          id: crypto.randomUUID(),
          filename: file.name,
          signedFilename: outputName,
          thumbnail,
          signedImageDataUrl,
          timestamp: payload.timestamp,
          imageHash,
          artistId: profile.id,
          displayName: profile.displayName,
        })

        setStatus('done')
        return imageHash
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Signing failed'
        setError(msg)
        setStatus('error')
        return null
      }
    },
    [profile]
  )

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return { signImage, status, error, reset }
}