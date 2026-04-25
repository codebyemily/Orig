import type { VerificationResult } from '@/types/verification'
import Card from '@/components/shared/Card'

interface VerifyResultProps {
  result: VerificationResult
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function VerifyResult({ result }: VerifyResultProps) {
  if (result.status === 'none') {
    return (
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <p className="font-semibold text-slate-700">No signature detected</p>
            <p className="text-sm text-slate-500 mt-0.5">This image has not been signed with Orig.</p>
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'tampered' && result.payload) {
    return (
      <Card className="p-6 border-amber-300 bg-amber-50">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div className="space-y-2">
            <p className="font-semibold text-amber-800">Signature found — but image was modified</p>
            <p className="text-sm text-amber-700">
              This image was signed by <strong>{result.payload.displayName}</strong> on{' '}
              {formatDate(result.payload.timestamp)}, but the pixel data no longer matches the original.
              The image may have been cropped, resaved, or edited.
            </p>
            <SignatureDetails payload={result.payload} />
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'own' && result.payload) {
    return (
      <Card className="p-6 border-emerald-300 bg-emerald-50">
        <div className="flex items-start gap-3">
          <span className="text-3xl">✅</span>
          <div className="space-y-2">
            <p className="font-semibold text-emerald-800">Your signature — verified</p>
            <p className="text-sm text-emerald-700">
              Signed by <strong>@{result.payload.displayName}</strong> on{' '}
              {formatDate(result.payload.timestamp)}
            </p>
            <SignatureDetails payload={result.payload} />
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'other' && result.payload) {
    return (
      <Card className="p-6 border-brand-200 bg-brand-50">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🔏</span>
          <div className="space-y-2">
            <p className="font-semibold text-brand-800">Signed by another artist</p>
            <p className="text-sm text-brand-700">
              Signed by <strong>@{result.payload.displayName}</strong> on{' '}
              {formatDate(result.payload.timestamp)}
            </p>
            <SignatureDetails payload={result.payload} />
          </div>
        </div>
      </Card>
    )
  }

  return null
}

function SignatureDetails({ payload }: { payload: NonNullable<VerificationResult['payload']> }) {
  return (
    <dl className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-600">
      <div className="flex gap-2">
        <dt className="font-medium text-slate-500 w-20 shrink-0">Artist ID</dt>
        <dd className="font-mono truncate">{payload.artistId}</dd>
      </div>
      {payload.contactUrl && (
        <div className="flex gap-2">
          <dt className="font-medium text-slate-500 w-20 shrink-0">Contact</dt>
          <dd className="truncate">{payload.contactUrl}</dd>
        </div>
      )}
      {payload.copyright && (
        <div className="flex gap-2">
          <dt className="font-medium text-slate-500 w-20 shrink-0">Copyright</dt>
          <dd>{payload.copyright}</dd>
        </div>
      )}
      <div className="flex gap-2">
        <dt className="font-medium text-slate-500 w-20 shrink-0">Hash</dt>
        <dd className="font-mono text-xs truncate">{payload.imageHash.slice(0, 24)}…</dd>
      </div>
    </dl>
  )
}
