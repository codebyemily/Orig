'use client'

import { useState, useEffect } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import SignPanel from '@/components/sign/SignPanel'
import BatchSignPanel from '@/components/sign/BatchSignPanel'
import PdfSignPanel from '@/components/sign/PdfSignPanel'
import LimitationNotice from '@/components/about/LimitationNotice'
import type { ArtistProfile } from '@/types/artist'
import { loadProfile } from '@/lib/storage/profileStorage'

export default function SignPage() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image')
  const [imageMode, setImageMode] = useState<'single' | 'batch'>('single')

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {fileType === 'image' ? 'Sign an Image' : 'Sign a PDF'}
        </h1>
      </div>

      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setFileType('image')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            fileType === 'image'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Image
        </button>
        <button
          onClick={() => setFileType('pdf')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            fileType === 'pdf'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          PDF
        </button>
      </div>

      {fileType === 'image' ? (
        <>
          <div className="mb-6 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setImageMode('single')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                imageMode === 'single'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Single image
            </button>
            <button
              onClick={() => setImageMode('batch')}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                imageMode === 'batch'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Batch (multiple)
            </button>
          </div>

          {imageMode === 'single' ? (
            <SignPanel profile={profile} />
          ) : (
            <BatchSignPanel profile={profile} />
          )}
        </>
      ) : (
        <PdfSignPanel profile={profile} />
      )}
    </PageContainer>
  )
}
