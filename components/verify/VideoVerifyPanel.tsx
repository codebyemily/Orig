'use client'

import { useCallback, useState } from 'react'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import VideoPreview from '@/components/video/VideoPreview'
import { validateVideoFile } from '@/lib/validation/videoValidation'
import { verifyVideo } from '@/lib/video/verifyVideo'

interface VideoScanResult {
  found: boolean
  payload?: {
    artistId: string
    displayName: string
    timestamp: string
    contactUrl?: string
    copyright?: string
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function VideoVerifyPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [result, setResult] = useState<VideoScanResult | null>(null)

  const handleInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    const validation = validateVideoFile(selected)
    if (validation) {
      setError(validation)
      setFile(null)
      setResult(null)
      setStatus('idle')
      return
    }

    setFile(selected)
    setError(null)
    setResult(null)
    setStatus('idle')
  }, [])

  const handleVerify = useCallback(async () => {
    if (!file) return

    try {
      setStatus('scanning')
      setError(null)

      const verification = await verifyVideo(file)

      setResult({
        found: verification.found,
        payload: verification.payload,
      })
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify this video.')
      setStatus('idle')
    }
  }, [file])

  const handleAnother = useCallback(() => {
    setFile(null)
    setError(null)
    setResult(null)
    setStatus('idle')
  }, [])

  return (
    <div className="space-y-5">
      {!file ? (
        <Card className="p-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Upload a video to verify
            </label>

            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
              onChange={handleInput}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
            />

            <p className="text-sm text-slate-500">
              Experimental: scans the first few frames for an Orig video signature. MOV support depends on browser compatibility.
            </p>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <VideoPreview file={file} label="Ready to scan" />

          {status === 'idle' && (
            <div className="text-center">
              <Button onClick={handleVerify} size="lg">
                Scan Video for Signature
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <Card className="p-6 text-center text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-brand-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                <span className="text-sm">Scanning video frames…</span>
              </div>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </Card>
          )}

          {status === 'done' && result && (
            <>
              {result.found && result.payload ? (
                <Card className="border-emerald-300 bg-emerald-50 p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🎬</span>
                    <div className="space-y-2">
                      <p className="font-semibold text-emerald-800">
                        Video signature detected
                      </p>
                      <p className="text-sm text-emerald-700">
                        Signed by <strong>@{result.payload.displayName}</strong> on{' '}
                        {formatDate(result.payload.timestamp)}.
                      </p>

                      {result.payload.contactUrl && (
                        <p className="text-xs text-slate-600">
                          Contact: {result.payload.contactUrl}
                        </p>
                      )}

                      {result.payload.copyright && (
                        <p className="text-xs text-slate-600">
                          Copyright: {result.payload.copyright}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="border-slate-200 p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔍</span>
                    <div>
                      <p className="font-semibold text-slate-700">
                        No Orig video signature detected
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        This video may not have been signed with Orig, or the
                        signed frame may have been removed or recompressed.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          <div className="text-center">
            <Button variant="ghost" onClick={handleAnother}>
              Verify another video
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
