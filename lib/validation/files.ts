export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
]

export const EXPERIMENTAL_IMAGE_MIME_TYPES = [
  'image/heic',
  'image/heif',
]

export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]

export const EXPERIMENTAL_IMAGE_EXTENSIONS = [
  '.heic',
  '.heif',
]

export const IMAGE_INPUT_ACCEPT = [
  ...SUPPORTED_IMAGE_MIME_TYPES,
  ...EXPERIMENTAL_IMAGE_MIME_TYPES,
  ...SUPPORTED_IMAGE_EXTENSIONS,
  ...EXPERIMENTAL_IMAGE_EXTENSIONS,
].join(',')

export function isExperimentalImageFile(file: File) {
  const name = file.name.toLowerCase()

  return (
    EXPERIMENTAL_IMAGE_MIME_TYPES.includes(file.type) ||
    EXPERIMENTAL_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext))
  )
}
