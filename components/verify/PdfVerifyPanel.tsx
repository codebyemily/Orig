'use client'

import { useCallback, useState } from 'react'
import Card from '@/components/shared/Card'
import Button from '@/components/shared/Button'
import { validatePdfFile } from '@/lib/validation/pdfValidation'
import { verifyPdf } from '@/lib/pdf/verifyPdf'
import type { PdfVerificationResult } from '@/types/pdfSignature'

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

export default function PdfVerifyPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [result, setResult] = useState<PdfVerificationResult | null>(null)

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files?.[0]
      if (!selected) return

      const validation = validatePdfFile(selected)
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
    },
    []
  )

  const handleVerify = useCallback(async () => {
    if (!file) return

    try {
      setStatus('scanning')
      setError(null)

      const verification = await verifyPdf(file)
      setResult(verification)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify this PDF.')
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
              Upload a PDF to verify
            </label>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInput}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
            />

            <p className="text-sm text-slate-500">
              Orig checks PDF metadata for an embedded ownership signature.
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
            <p className="text-sm text-slate-500">Ready to verify</p>
            <p className="mt-1 font-medium text-slate-800">{file.name}</p>
          </Card>

          {status === 'idle' && (
            <div className="text-center">
              <Button onClick={handleVerify} size="lg">
                Scan PDF for Signature
              </Button>
            </div>
          )}

          {status === 'scanning' && (
            <Card className="p-6 text-center text-slate-500">
              <span className="text-sm">Scanning PDF metadata…</span>
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
                    <span className="text-3xl">📄</span>
                    <div className="space-y-2">
                      <p className="font-semibold text-emerald-800">
                        PDF signature detected
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
                        No Orig PDF signature detected
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        This PDF may not have been signed with Orig.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          <div className="text-center">
            <Button variant="ghost" onClick={handleAnother}>
              Verify another PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
