import {
  embedSignatureInImageData,
  extractSignatureFromImageData,
  type VideoSignaturePayload,
} from '@/lib/video/frameSignature'

function waitForEvent<T extends keyof HTMLVideoElementEventMap>(
  target: HTMLVideoElement,
  event: T
) {
  return new Promise<void>((resolve) => {
    const handler = () => {
      target.removeEventListener(event, handler)
      resolve()
    }

    target.addEventListener(event, handler)
  })
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getSupportedRecorderMimeType(): string {
  const candidates = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]

  for (const candidate of candidates) {
    if (
      typeof MediaRecorder !== 'undefined' &&
      MediaRecorder.isTypeSupported(candidate)
    ) {
      return candidate
    }
  }

  return 'video/webm'
}

export async function watermarkVideo(
  file: File,
  payload: VideoSignaturePayload,
  onProgress?: (message: string) => void
): Promise<Blob> {
  onProgress?.('Loading video…')

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

  onProgress?.('Preparing output recording…')

  const stream = canvas.captureStream(30)
  const mimeType = getSupportedRecorderMimeType()
  const recorder = new MediaRecorder(stream, { mimeType })
  const chunks: BlobPart[] = []

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data)
  }

  const recordingDone = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }))
    }
  })

  let stopped = false
  let debugLogged = false

  function drawLoop() {
    if (stopped) return

    ctx.drawImage(video, 0, 0, width, height)

    if (video.currentTime <= 1.0) {
      const frame = ctx.getImageData(0, 0, width, height)
      const signedFrame = embedSignatureInImageData(frame, payload)
      ctx.putImageData(signedFrame, 0, 0)

      if (!debugLogged) {
        const debugPayload = extractSignatureFromImageData(
          ctx.getImageData(0, 0, width, height)
        )
        console.log('Signed frame decodes before recording:', debugPayload)
        debugLogged = true
      }
    }

    if (!video.paused && !video.ended) {
      requestAnimationFrame(drawLoop)
    }
  }

  recorder.start(250)
  onProgress?.('Rendering signed video…')

  await video.play()
  drawLoop()

  await waitForEvent(video, 'ended')
  stopped = true

  ctx.drawImage(video, 0, 0, width, height)
  await wait(200)

  recorder.stop()
  URL.revokeObjectURL(video.src)

  return recordingDone
}
