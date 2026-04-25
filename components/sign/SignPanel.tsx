'use client'

import { useState, useCallback } from 'react'
import type { ArtistProfile } from '@/types/artist'
import { useSignImage } from '@/lib/useSignImage'
import Dropzone from '@/components/upload/Dropzone'
import ImagePreview from '@/components/upload/ImagePreview'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'
import Link from 'next/link'

interface SignPanelProps {
  profile: ArtistProfile | null
}

export default function SignPanel({ profile }: SignPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const { signImage, status, error, reset } = useSignImage(profile)

  const handleFiles = useCallback((files: File[]) => {
    reset()
    setFile(files[0])
  }, [reset])

  const handleSign = useCallback(async () => {
    if (!file) return
    await signImage(file)
  }, [file, signImage])

  const handleAnother = useCallback(() => {
    setFile(null)
    reset()
  }, [reset])

  if (!profile?.displayName) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-3">👤</div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Set up your profile first</h3>
        <p className="text-slate-500 text-sm mb-4">You need a display name to embed in your signature.</p>
        <Link href="/profile">
          <Button>Go to Profile</Button>
        </Link>
      </Card>
    )
  }

  if (status === 'done') {
    return (
      <Card className="p-8 text-center">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Signed &amp; downloaded!</h3>
        <p className="text-slate-500 text-sm mb-1">Your signature is invisibly embedded.</p>
        <p className="text-sm text-brand-700 font-medium mb-6">Signed by @{profile.displayName}</p>
        <Button variant="secondary" onClick={handleAnother}>
          Sign another image
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <Card className="p-4 flex items-center gap-3 border-brand-200 bg-brand-50/30">
        <div className="text-brand-500 text-xl">✍️</div>
        <div className="text-sm">
          <span className="text-slate-500">Signing as </span>
          <span className="font-semibold text-brand-700">@{profile.displayName}</span>
        </div>
        <Link href="/profile" className="ml-auto text-xs text-slate-400 hover:text-slate-600">
          Edit profile
        </Link>
      </Card>

      {!file ? (
        <Dropzone onFiles={handleFiles} label="Drop your image here" />
      ) : (
        <div className="space-y-4">
          <ImagePreview file={file} label="Ready to sign" />

          {error && (
            <p className="text-sm text-red-600 text-center bg-red-50 rounded-lg p-3">{error}</p>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSign}
              loading={status === 'signing'}
              disabled={status === 'signing'}
              size="lg"
            >
              {status === 'signing' ? 'Signing…' : 'Sign & Download'}
            </Button>
            <Button variant="ghost" onClick={handleAnother} disabled={status === 'signing'}>
              Change image
            </Button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Output is always PNG to preserve the invisible watermark.
          </p>
        </div>
      )}
    </div>
  )
}
