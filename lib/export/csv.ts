import type { RegistryEntry } from '@/types/registry'

function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function exportRegistryAsCsv(entries: RegistryEntry[]): string {
  const headers = ['id', 'filename', 'timestamp', 'imageHash', 'artistId', 'displayName']
  const rows = entries.map((e) =>
    headers.map((h) => escapeCell(String(e[h as keyof RegistryEntry] ?? ''))).join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

export function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
