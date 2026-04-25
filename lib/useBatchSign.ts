'use client'

import { useState, useCallback } from 'react'
import type { ArtistProfile } from '@/types/artist'
import type { SignaturePayload } from '@/types/signature'
import { loadImageToCanvas } from './canvas/loadImageToCanvas'
import { extractImageData } from './canvas/extractImageData'
import { exportPng, triggerDownload } from './canvas/exportPng'
import { generateThumbnail } from './canvas/thumbnail'
import { encodeLSB } from './stego/encodeLSB'
import { serializePayload } from './stego/payload'
import { sha256Hex } from './crypto/sha256'
import { addRegistryEntry } from './storage/registryStorage'

export interface BatchFileStatus {
  id: string
  file: File
  status: 'pending' | 'signing' | 'done' | 'error'
  error?: string
}

export function useBatchSign(profile: ArtistProfile | null) {
  const [files, setFiles] = useState<BatchFileStatus[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const setFiles_ = useCallback((newFiles: File[]) => {
    setFiles(newFiles.map((f) => ({ id: crypto.randomUUID(), file: f, status: 'pending' as const })))
  }, [])

  const signAll = useCallback(async () => {
    if (!profile?.displayName || isRunning) return
    setIsRunning(true)

    for (let i = 0; i < files.length; i++) {
      const item = files[i]
      if (item.status === 'done') continue

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'signing' } : f))
      )

      try {
        const canvas = await loadImageToCanvas(item.file)
        const imageData = extractImageData(canvas)
        const imageHash = await sha256Hex(imageData.data)

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
        ctx.putImageData(new ImageData(encodedData, canvas.width, canvas.height), 0, 0)

        const blob = await exportPng(canvas)
        const thumbnail = generateThumbnail(canvas)
        const baseName = item.file.name.replace(/\.[^.]+$/, '')
        triggerDownload(blob, `${baseName}-signed.png`)

        addRegistryEntry({
          id: crypto.randomUUID(),
          filename: item.file.name,
          thumbnail,
          timestamp: payload.timestamp,
          imageHash,
          artistId: profile.id,
          displayName: profile.displayName,
        })

        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'done' } : f))
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed'
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'error', error: msg } : f))
        )
      }
    }

    setIsRunning(false)
  }, [profile, files, isRunning])

  const clear = useCallback(() => setFiles([]), [])

  return { files, setFiles: setFiles_, signAll, isRunning, clear }
}
