'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ArtistProfile } from '@/types/artist'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import VideoPreview from '@/components/video/VideoPreview'
import { validateVideoFile } from '@/lib/validation/videoValidation'
import { watermarkVideo } from '@/lib/video/watermarkVideo'

interface VideoSignPanelProps {
  profile: ArtistProfile | null
}

export default function VideoSignPanel({ profile }: VideoSignPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'signing' | 'done'>('idle')
  const [progressMessage, setProgressMessage] = useState<string>('')

  const canSign = useMemo(() => !!profile?.displayName && !!profile?.id, [profile])

  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    const validation = validateVideoFile(selected)
    if (validation) {
      setError(validation)
      setFile(null)
      setStatus('idle')
      return
    }

    setError(null)
    setStatus('idle')
    setFile(selected)
  }, [])

  const handleAnother = useCallback(() => {
    setFile(null)
    setError(null)
    setStatus('idle')
    setProgressMessage('')
  }, [])

  const handleSign = useCallback(async () => {
    if (!file || !profile?.displayName || !profile?.id) return

    try {
      setStatus('signing')
      setError(null)
      setProgressMessage('Preparing video…')

      const signedBlob = await watermarkVideo(
        file,
        {
          artistId: profile.id,
          displayName: profile.displayName,
          timestamp: new Date().toISOString(),
          contactUrl: profile.contactUrl || undefined,
          copyright: profile.copyright || undefined,
        },
        setProgressMessage
      )

      const url = URL.createObjectURL(signedBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.name.replace(/\.[^/.]+$/, '') + '-signed.webm'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setStatus('done')
      setProgressMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to watermark this video.')
      setStatus('idle')
      setProgressMessage('')
    }
  }, [file, profile])

  if (!canSign) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-3 text-4xl">👤</div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">
          Set up your profile first
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          You need a display name to embed in your video signature.
        </p>
        <Link href="/profile">
          <Button>Go to Profile</Button>
        </Link>
      </Card>
    )
  }

  if (status === 'done') {
    return (
      <Card className="p-8 text-center">
        <div className="mb-3 text-5xl">🎬</div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">
          Signed video downloaded
        </h3>
        <p className="mb-1 text-sm text-slate-500">
          An invisible signature was embedded into the first frame.
        </p>
        <p className="mb-6 text-sm font-medium text-brand-700">
          Signed by @{profile?.displayName}
        </p>

        <Button variant="secondary" onClick={handleAnother}>
          Sign another video
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/30 p-4">
        <div className="text-xl text-brand-500">🎬</div>
        <div className="text-sm">
          <span className="text-slate-500">Signing video as </span>
          <span className="font-semibold text-brand-700">@{profile?.displayName}</span>
        </div>
        <Link
          href="/profile"
          className="ml-auto text-xs text-slate-400 hover:text-slate-600"
        >
          Edit profile
        </Link>
      </Card>

      {!file ? (
        <Card className="p-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Upload a video
            </label>

            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              onChange={handleInput}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
            />

            <p className="text-sm text-slate-500">
              Experimental: supports MP4 and WebM input. MOV is also allowed experimentally depending on browser compatibility. Output downloads as WebM. This prototype embeds a hidden signature into the first frame.
            </p>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <VideoPreview file={file} label="Ready to sign" />

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {status === 'signing' && (
            <Card className="p-4 text-center text-sm text-slate-500">
              {progressMessage || 'Processing video…'}
            </Card>
          )}

          <div className="flex justify-center gap-3">
            <Button
              onClick={handleSign}
              loading={status === 'signing'}
              disabled={status === 'signing'}
              size="lg"
            >
              {status === 'signing' ? 'Signing…' : 'Sign & Download Video'}
            </Button>

            <Button variant="ghost" onClick={handleAnother} disabled={status === 'signing'}>
              Change video
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Experimental video mode: the hidden signature is embedded into the first frame and
            the signed file downloads as WebM.
          </p>
        </div>
      )}
    </div>
  )
}
