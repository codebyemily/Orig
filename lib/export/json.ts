import type { RegistryEntry } from '@/types/registry'

export function exportRegistryAsJson(entries: RegistryEntry[]): string {
  return JSON.stringify(entries, null, 2)
}

export function downloadJson(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
