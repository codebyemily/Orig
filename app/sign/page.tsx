'use client'

import { useState, useEffect } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import SignPanel from '@/components/sign/SignPanel'
import BatchSignPanel from '@/components/sign/BatchSignPanel'
import VideoSignPanel from '@/components/sign/VideoSignPanel'
import LimitationNotice from '@/components/about/LimitationNotice'
import type { ArtistProfile } from '@/types/artist'
import { loadProfile } from '@/lib/storage/profileStorage'

export default function SignPage() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [imageMode, setImageMode] = useState<'single' | 'batch'>('single')

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {mediaType === 'image' ? 'Sign an Image' : 'Sign a Video'}
        </h1>
        <p className="text-slate-500">
          {mediaType === 'image'
            ? 'Embed your invisible ownership signature into an image. PNG, JPEG, and WEBP are supported. HEIC/HEIF is experimental depending on browser support. The signed output always downloads as PNG.'
            : 'Experimental: embed invisible ownership data into the first frame of a video. Supports MP4 and WebM input depending on browser compatibility. Signed output downloads as WebM.'}
        </p>
      </div>

      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setMediaType('image')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mediaType === 'image'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Image
        </button>
        <button
          onClick={() => setMediaType('video')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mediaType === 'video'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Video (experimental)
        </button>
      </div>

      {mediaType === 'image' ? (
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
        <VideoSignPanel profile={profile} />
      )}

      <div className="mt-8">
        <LimitationNotice />
      </div>
    </PageContainer>
  )
}
