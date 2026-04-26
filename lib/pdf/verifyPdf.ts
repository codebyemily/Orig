import { PDFDocument } from 'pdf-lib'
import type {
  PdfSignaturePayload,
  PdfVerificationResult,
} from '@/types/pdfSignature'

const ORIG_PDF_MARKER = 'ORIG_PDF_V1|'

function parsePayload(value: string | undefined): PdfSignaturePayload | null {
  if (!value) return null

  const markerIndex = value.indexOf(ORIG_PDF_MARKER)
  if (markerIndex === -1) return null

  const jsonPart = value.slice(markerIndex + ORIG_PDF_MARKER.length)

  try {
    return JSON.parse(jsonPart) as PdfSignaturePayload
  } catch {
    return null
  }
}

export async function verifyPdf(file: File): Promise<PdfVerificationResult> {
  try {
    const bytes = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(bytes)

    const candidates = [
      pdfDoc.getSubject(),
      ...(pdfDoc.getKeywords() ?? []),
      pdfDoc.getTitle(),
      pdfDoc.getAuthor(),
      pdfDoc.getProducer(),
      pdfDoc.getCreator(),
    ].filter(Boolean) as string[]

    for (const candidate of candidates) {
      const payload = parsePayload(candidate)
      if (payload) {
        return {
          found: true,
          payload,
        }
      }
    }

    return {
      found: false,
      message: 'No Orig PDF signature detected.',
    }
  } catch {
    return {
      found: false,
      message: 'This PDF could not be read or verified.',
    }
  }
}
