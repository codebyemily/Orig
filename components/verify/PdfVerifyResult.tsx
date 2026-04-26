import Card from '@/components/shared/Card'
import type { PdfVerificationResult } from '@/types/pdfSignature'

interface PdfVerifyResultProps {
  result: PdfVerificationResult
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

export default function PdfVerifyResult({ result }: PdfVerifyResultProps) {
  if (!result.found || !result.payload) {
    return (
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
    )
  }

  return (
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
  )
}
