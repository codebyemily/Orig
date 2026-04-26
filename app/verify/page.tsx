'use client'

import { useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import VerifyPanel from '@/components/verify/VerifyPanel'
import VideoVerifyPanel from '@/components/verify/VideoVerifyPanel'

export default function VerifyPage() {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {mediaType === 'image' ? 'Verify an Image' : 'Verify a Video'}
        </h1>
        <p className="text-slate-500">
          {mediaType === 'image'
            ? 'Drag any image — your own work, or something you found online — to reveal whether it carries an Orig signature.'
            : 'Experimental: scan the first few frames of a video to check whether it carries an Orig signature.'}
        </p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
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

      {mediaType === 'image' ? <VerifyPanel /> : <VideoVerifyPanel />}

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-sm text-slate-500">
        <strong className="text-slate-700">No profile needed to verify.</strong>{' '}
        You can scan any supported file without setting up an account.
      </div>
    </PageContainer>
  )
}
