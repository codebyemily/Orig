'use client'

import type { RegistryEntry } from '@/types/registry'
import { exportRegistryAsCsv, downloadCsv } from '@/lib/export/csv'
import { exportRegistryAsJson, downloadJson } from '@/lib/export/json'
import Button from '@/components/shared/Button'

interface ExportButtonsProps {
  entries: RegistryEntry[]
}

export default function ExportButtons({ entries }: ExportButtonsProps) {
  function handleCsv() {
    downloadCsv(exportRegistryAsCsv(entries), 'orig-registry.csv')
  }

  function handleJson() {
    downloadJson(exportRegistryAsJson(entries), 'orig-registry.json')
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handleCsv} disabled={entries.length === 0}>
        Export CSV
      </Button>
      <Button variant="secondary" size="sm" onClick={handleJson} disabled={entries.length === 0}>
        Export JSON
      </Button>
    </div>
  )
}
