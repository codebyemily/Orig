export type RegistryFileType = 'image' | 'pdf'

export interface RegistryEntry {
  id: string
  fileType: RegistryFileType

  filename: string
  signedFilename: string
  timestamp: string
  artistId: string
  displayName: string

  // image-specific
  thumbnail?: string
  signedImageDataUrl?: string
  imageHash?: string

  // pdf-specific
  signedPdfDataUrl?: string
}
