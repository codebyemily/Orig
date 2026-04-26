'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import type { ArtistProfile } from '@/types/artist'
import type { PdfSignaturePayload } from '@/types/pdfSignature'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import { validatePdfFile } from '@/lib/validation/pdfValidation'
import { signPdf } from '@/lib/pdf/signPdf'
import { addRegistryEntry } from '@/lib/storage/registryStorage'

interface PdfSignPanelProps {
  profile: ArtistProfile | null
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to save signed PDF to registry.'))

    reader.readAsDataURL(blob)
  })
}

export default function PdfSignPanel({ profile }: PdfSignPanelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'signing' | 'done'>('idle')

  const canSign = useMemo(
    () => !!profile?.displayName && !!profile?.id,
    [profile]
  )

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0]
      if (!selected) return

      const validation = validatePdfFile(selected)
      if (validation) {
        setError(validation)
        setFile(null)
        setStatus('idle')
        return
      }

      setError(null)
      setStatus('idle')
      setFile(selected)
    },
    []
  )

  const handleAnother = useCallback(() => {
    setFile(null)
    setError(null)
    setStatus('idle')
  }, [])

  const handleSign = useCallback(async () => {
    if (!file || !profile?.displayName || !profile?.id) return

    try {
      setStatus('signing')
      setError(null)

      const payload: PdfSignaturePayload = {
        artistId: profile.id,
        displayName: profile.displayName,
        timestamp: new Date().toISOString(),
        contactUrl: profile.contactUrl || undefined,
        copyright: profile.copyright || undefined,
      }

      const signedBlob = await signPdf(file, payload)
      const signedPdfDataUrl = await blobToDataUrl(signedBlob)

      const outputName = file.name.replace(/\.pdf$/i, '') + '-signed.pdf'

      const url = URL.createObjectURL(signedBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = outputName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      addRegistryEntry({
        id: crypto.randomUUID(),
        fileType: 'pdf',
        filename: file.name,
        signedFilename: outputName,
        signedPdfDataUrl,
        timestamp: payload.timestamp,
        artistId: profile.id,
        displayName: profile.displayName,
      })

      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign this PDF.')
      setStatus('idle')
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
          You need a display name to embed in your PDF signature.
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
        <div className="mb-3 text-5xl">📄</div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">
          Signed PDF downloaded
        </h3>
        <p className="mb-1 text-sm text-slate-500">
          Your Orig signature was embedded into the PDF metadata.
        </p>
        <p className="mb-6 text-sm font-medium text-brand-700">
          Signed by @{profile?.displayName}
        </p>

        <Button variant="secondary" onClick={handleAnother}>
          Sign another PDF
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-3 border-brand-200 bg-brand-50/30 p-4">
        <div className="text-xl text-brand-500">📄</div>
        <div className="text-sm">
          <span className="text-slate-500">Signing PDF as </span>
          <span className="font-semibold text-brand-700">
            @{profile?.displayName}
          </span>
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
              Upload a PDF
            </label>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInput}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
            />

            <p className="text-sm text-slate-500">
              Orig embeds ownership data into PDF metadata and downloads a signed
              PDF copy.
            </p>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Ready to sign</p>
            <p className="mt-1 font-medium text-slate-800">{file.name}</p>
            <p className="mt-2 text-xs text-slate-400">
              Signed output will download as a new PDF file.
            </p>
          </Card>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-center gap-3">
            <Button
              onClick={handleSign}
              loading={status === 'signing'}
              disabled={status === 'signing'}
              size="lg"
            >
              {status === 'signing' ? 'Signing…' : 'Sign & Download PDF'}
            </Button>

            <Button
              variant="ghost"
              onClick={handleAnother}
              disabled={status === 'signing'}
            >
              Change PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
