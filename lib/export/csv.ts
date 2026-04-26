import type { RegistryEntry } from '@/types/registry'

function escapeCsv(value: string) {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportRegistryAsCsv(entries: RegistryEntry[]): string {
  const headers = [
    'id',
    'fileType',
    'filename',
    'signedFilename',
    'timestamp',
    'artistId',
    'displayName',
    'imageHash',
    'hasThumbnail',
    'hasSignedImageData',
    'hasSignedPdfData',
  ]

  const rows = entries.map((entry) => [
    entry.id,
    entry.fileType,
    entry.filename,
    entry.signedFilename,
    entry.timestamp,
    entry.artistId,
    entry.displayName,
    entry.imageHash ?? '',
    entry.thumbnail ? 'yes' : 'no',
    entry.signedImageDataUrl ? 'yes' : 'no',
    entry.signedPdfDataUrl ? 'yes' : 'no',
  ])

  return [
    headers.join(','),
    ...rows.map((row) => row.map((value) => escapeCsv(String(value))).join(',')),
  ].join('\n')
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
