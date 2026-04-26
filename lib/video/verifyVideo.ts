import {
  extractSignatureFromImageData,
  type VideoSignaturePayload,
} from '@/lib/video/frameSignature'

function seekVideo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve) => {
    const handler = () => {
      video.removeEventListener('seeked', handler)
      resolve()
    }

    video.addEventListener('seeked', handler)
    video.currentTime = Math.min(time, Math.max(0, video.duration || 0))
  })
}

export interface VideoVerificationResult {
  found: boolean
  payload?: VideoSignaturePayload
  scannedTimestamps: number[]
}

export async function verifyVideo(file: File): Promise<VideoVerificationResult> {
  const video = document.createElement('video')
  video.src = URL.createObjectURL(file)
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  video.crossOrigin = 'anonymous'

  await new Promise<void>((resolve, reject) => {
    const onLoaded = () => {
      cleanup()
      resolve()
    }

    const onError = () => {
      cleanup()
      URL.revokeObjectURL(video.src)
      reject(
        new Error(
          'This video could not be processed in this browser. MP4 and WebM are most reliable. MOV support is experimental and may fail depending on the codec.'
        )
      )
    }

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('error', onError)
    }

    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('error', onError)
  })

  const width = video.videoWidth
  const height = video.videoHeight

  if (!width || !height) {
    URL.revokeObjectURL(video.src)
    throw new Error('Unable to read video dimensions.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    URL.revokeObjectURL(video.src)
    throw new Error('Failed to create video canvas.')
  }

  const duration = Math.max(video.duration || 0, 0)
  const timestamps = Array.from(
    new Set(
      [0, 0.03, 0.06, 0.1, 0.15, 0.2, 0.3, 0.5, 0.75, 1.0].filter(
        (t) => t <= duration || duration === 0
      )
    )
  )

  for (const time of timestamps) {
    await seekVideo(video, time)
    ctx.drawImage(video, 0, 0, width, height)

    const frame = ctx.getImageData(0, 0, width, height)
    const payload = extractSignatureFromImageData(frame)

    if (payload) {
      URL.revokeObjectURL(video.src)
      return {
        found: true,
        payload,
        scannedTimestamps: timestamps,
      }
    }
  }

  URL.revokeObjectURL(video.src)

  return {
    found: false,
    scannedTimestamps: timestamps,
  }
}
