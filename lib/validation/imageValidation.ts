const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
]

const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif']

const MAX_SIZE_MB = 50

export function validateImageFile(file: File): string | null {
  const fileName = file.name.toLowerCase()

  const acceptedByType = ACCEPTED_TYPES.includes(file.type)
  const acceptedByExtension = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext))

  if (!acceptedByType && !acceptedByExtension) {
    return `Unsupported file type. Please use PNG, JPEG, WEBP, or try HEIC/HEIF experimentally.`
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
  }

  return null
}
