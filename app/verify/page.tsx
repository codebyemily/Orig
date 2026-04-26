'use client'

import { useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'
import VerifyPanel from '@/components/verify/VerifyPanel'
import PdfVerifyPanel from '@/components/verify/PdfVerifyPanel'

export default function VerifyPage() {
  const [fileType, setFileType] = useState<'image' | 'pdf'>('image')

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          {fileType === 'image' ? 'Verify an Image' : 'Verify a PDF'}
        </h1>
        <p className="text-slate-500">
          {fileType === 'image'
            ? 'Drag any image — your own work, or something you found online — to reveal whether it carries an Orig signature.'
            : 'Upload a PDF to check whether it carries an Orig ownership signature.'}
        </p>
      </div>

      <div className="mb-6 flex w-fit gap-1 rounded-lg bg-slate-100 p-1">
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

      {fileType === 'image' ? <VerifyPanel /> : <PdfVerifyPanel />}

      <div className="mt-8 rounded-xl bg-slate-100 p-4 text-sm text-slate-500">
        <strong className="text-slate-700">No profile needed to verify.</strong>{' '}
        You can scan any supported file without setting up an account.
      </div>
    </PageContainer>
  )
}
