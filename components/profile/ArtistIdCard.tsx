'use client'

import { useState, useEffect } from 'react'
import { loadProfile } from '@/lib/storage/profileStorage'
import CopyButton from '@/components/shared/CopyButton'
import Card from '@/components/shared/Card'

export default function ArtistIdCard() {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    const p = loadProfile()
    if (p) setId(p.id)
  }, [])

  if (!id) return null

  return (
    <Card className="rounded-2xl p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Your unique artist ID</h3>
        <p className="mt-1 text-sm text-slate-500">
          This ID is generated once in your browser and embedded into every image you sign. Even if
          you change your display name later, this ID helps keep your signatures connected.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center">
        <code className="flex-1 break-all text-xs font-mono text-slate-700">{id}</code>
        <CopyButton text={id} />
      </div>
    </Card>
  )
}
