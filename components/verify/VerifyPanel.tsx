'use client'

import { useState, useCallback } from 'react'
import { useVerifyImage } from '@/lib/useVerifyImage'
import Dropzone from '@/components/upload/Dropzone'
import ImagePreview from '@/components/upload/ImagePreview'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import VerifyResult from './VerifyResult'

export default function VerifyPanel() {
  const [file, setFile] = useState<File | null>(null)
  const { verify, status, result, error, reset } = useVerifyImage()

  const handleFiles = useCallback((files: File[]) => {
    reset()
    setFile(files[0])
  }, [reset])

  const handleVerify = useCallback(async () => {
    if (!file) return
    await verify(file)
  }, [file, verify])

  const handleAnother = useCallback(() => {
    setFile(null)
    reset()
  }, [reset])

  return (
    <div className="space-y-5">
      {!file ? (
        <Dropzone
          onFiles={handleFiles}
          label="Drop an image to verify"
          sublabel="Works on any image — signed by you, or by someone else"
        />
      ) : (
        <div className="space-y-4">
          <ImagePreview file={file} label="Scanning this image" />

          {status === 'idle' && (
            <div className="text-center">
              <Button onClick={handleVerify} size="lg">
                Scan for Signature
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <Card className="p-6 text-center text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-brand-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm">Scanning pixel data…</span>
              </div>
            </Card>
          )}

          {status === 'error' && (
            <Card className="p-4 border-red-200 bg-red-50">
              <p className="text-sm text-red-700">{error}</p>
            </Card>
          )}

          {status === 'done' && result && (
            <VerifyResult result={result} />
          )}

          <div className="text-center">
            <Button variant="ghost" onClick={handleAnother}>
              Verify another image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
