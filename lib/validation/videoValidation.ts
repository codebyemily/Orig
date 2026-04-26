const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov']
const MAX_SIZE_MB = 200

export function validateVideoFile(file: File): string | null {
  const fileName = file.name.toLowerCase()

  const acceptedByType = ACCEPTED_VIDEO_TYPES.includes(file.type)
  const acceptedByExtension = ACCEPTED_VIDEO_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )

  if (!acceptedByType && !acceptedByExtension) {
    return 'Unsupported video type. Please use MP4 or WebM. MOV is experimental.'
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
  }

  return null
}
