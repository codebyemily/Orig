import { isExperimentalImageFile } from '@/lib/validation/files'

export function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to create canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)

      const isExperimental = isExperimentalImageFile(file)

      if (isExperimental) {
        reject(
          new Error(
            'This HEIC/HEIF file could not be processed in this browser. Please convert it to PNG or JPEG and try again.'
          )
        )
      } else {
        reject(new Error('This image could not be loaded. Please try another file.'))
      }
    }

    img.src = url
  })
}
