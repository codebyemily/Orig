'use client'

import { useState, useEffect } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import SignPanel from '@/components/sign/SignPanel'
import BatchSignPanel from '@/components/sign/BatchSignPanel'
import LimitationNotice from '@/components/about/LimitationNotice'
import type { ArtistProfile } from '@/types/artist'
import { loadProfile } from '@/lib/storage/profileStorage'

export default function SignPage() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [mode, setMode] = useState<'single' | 'batch'>('single')

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign an Image</h1>
        <p className="text-slate-500">
          Embed your invisible ownership signature into an image. PNG, JPEG, and WEBP are supported.
          HEIC/HEIF is experimental depending on browser support. The signed output always downloads as PNG.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit mb-6">
        <button
          onClick={() => setMode('single')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === 'single' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Single image
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            mode === 'batch' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Batch (multiple)
        </button>
      </div>

      {mode === 'single' ? (
        <SignPanel profile={profile} />
      ) : (
        <BatchSignPanel profile={profile} />
      )}

      <div className="mt-8">
        <LimitationNotice />
      </div>
    </PageContainer>
  )
}
