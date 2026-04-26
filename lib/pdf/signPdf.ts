import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { PdfSignaturePayload } from '@/types/pdfSignature'

const ORIG_PDF_MARKER = 'ORIG_PDF_V1'

function buildPayloadString(payload: PdfSignaturePayload) {
  return `${ORIG_PDF_MARKER}|${JSON.stringify(payload)}`
}

export async function signPdf(
  file: File,
  payload: PdfSignaturePayload
): Promise<Blob> {
  const bytes = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(bytes)

  const payloadString = buildPayloadString(payload)

  pdfDoc.setTitle('Orig Signed PDF')
  pdfDoc.setAuthor(payload.displayName)
  pdfDoc.setSubject(payloadString)
  pdfDoc.setKeywords(['Orig', 'Signed PDF', payloadString])
  pdfDoc.setProducer('Orig')
  pdfDoc.setCreator('Orig')

  const pages = pdfDoc.getPages()

  if (pages.length > 0) {
    const firstPage = pages[0]
    const { width } = firstPage.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    firstPage.drawText(payloadString, {
      x: 8,
      y: 8,
      size: 1,
      font,
      color: rgb(1, 1, 1),
      opacity: 0,
      maxWidth: width - 16,
    })
  }

  const signedBytes = await pdfDoc.save()

  return new Blob([signedBytes], { type: 'application/pdf' })
}
