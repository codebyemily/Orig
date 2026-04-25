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
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">Your Unique Artist ID</h3>
      <p className="text-xs text-slate-500 mb-3">
        This ID is generated once, stored only in your browser, and embedded in every image you sign.
        Even if you change your display name, this ID anchors all your previous signatures.
      </p>
      <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
        <code className="text-xs text-slate-700 font-mono flex-1 break-all">{id}</code>
        <CopyButton text={id} />
      </div>
    </Card>
  )
}
