const ACCEPTED_PDF_TYPES = ['application/pdf']
const ACCEPTED_PDF_EXTENSIONS = ['.pdf']
const MAX_SIZE_MB = 100

export function validatePdfFile(file: File): string | null {
  const fileName = file.name.toLowerCase()

  const acceptedByType = ACCEPTED_PDF_TYPES.includes(file.type)
  const acceptedByExtension = ACCEPTED_PDF_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  )

  if (!acceptedByType && !acceptedByExtension) {
    return 'Unsupported file type. Please use a PDF.'
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File too large. Maximum size is ${MAX_SIZE_MB}MB.`
  }

  return null
}
