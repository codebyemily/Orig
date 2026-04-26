import type { VerificationResult } from '@/types/verification'
import type { SignaturePayload } from '@/types/signature'
import Card from '@/components/shared/Card'

interface VerifyResultProps {
  result: VerificationResult
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

export default function VerifyResult({ result }: VerifyResultProps) {
  if (result.status === 'none') {
    return (
      <Card className="p-6 border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔍</span>
          <div>
            <p className="font-semibold text-slate-700">
              No Orig signature detected
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              This image may not have been signed with Orig, or the signature may
              have been stripped by recompression, cropping, or format conversion.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'own') {
    const displayName = result.payload.displayName

    return (
      <Card
        className={
          result.tampered
            ? 'p-6 border-amber-300 bg-amber-50'
            : 'p-6 border-emerald-300 bg-emerald-50'
        }
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{result.tampered ? '⚠️' : '✅'}</span>

          <div className="space-y-2">
            <p
              className={
                result.tampered
                  ? 'font-semibold text-amber-800'
                  : 'font-semibold text-emerald-800'
              }
            >
              {result.tampered
                ? 'Your signature was found — visual content may have changed'
                : 'Your signature — verified'}
            </p>

            <p
              className={
                result.tampered
                  ? 'text-sm text-amber-700'
                  : 'text-sm text-emerald-700'
              }
            >
              Signed by <strong>@{displayName}</strong> on{' '}
              {formatDate(result.payload.timestamp)}.
            </p>

            {result.tampered ? (
              <p className="text-sm text-amber-700">
                The ownership signature is still present, but the image no longer
                visually matches the signed version closely enough. Possible
                causes include cropping, resizing, heavy recompression,
                screenshots, or editing.
              </p>
            ) : (
              <p className="text-sm text-emerald-700">
                The ownership signature is present and the image visually matches
                the signed version.
              </p>
            )}

            <SignatureDetails payload={result.payload} />
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'other') {
    const displayName = result.payload.displayName

    return (
      <Card
        className={
          result.tampered
            ? 'p-6 border-amber-300 bg-amber-50'
            : 'p-6 border-brand-200 bg-brand-50'
        }
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{result.tampered ? '⚠️' : '🔏'}</span>

          <div className="space-y-2">
            <p
              className={
                result.tampered
                  ? 'font-semibold text-amber-800'
                  : 'font-semibold text-brand-800'
              }
            >
              {result.tampered
                ? 'Signature found — visual content may have changed'
                : 'Signed by another artist'}
            </p>

            <p
              className={
                result.tampered
                  ? 'text-sm text-amber-700'
                  : 'text-sm text-brand-700'
              }
            >
              Signed by <strong>@{displayName}</strong> on{' '}
              {formatDate(result.payload.timestamp)}.
            </p>

            {result.tampered ? (
              <p className="text-sm text-amber-700">
                The Orig signature is still present, but the image no longer
                visually matches the signed version closely enough. Possible
                causes include cropping, resizing, heavy recompression,
                screenshots, or editing.
              </p>
            ) : (
              <p className="text-sm text-brand-700">
                The Orig signature was detected successfully.
              </p>
            )}

            <SignatureDetails payload={result.payload} />
          </div>
        </div>
      </Card>
    )
  }

  if (result.status === 'error') {
    return (
      <Card className="p-6 border-red-300 bg-red-50">
        <div className="flex items-start gap-3">
          <span className="text-3xl">❌</span>
          <div>
            <p className="font-semibold text-red-800">Verification failed</p>
            <p className="text-sm text-red-700 mt-0.5">
              {result.message ?? 'Please try another image.'}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return null
}

function SignatureDetails({ payload }: { payload: SignaturePayload }) {
  return (
    <dl className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-600">
      {payload.contactUrl && (
        <div className="flex gap-2">
          <dt className="font-medium text-slate-500 w-20 shrink-0">Contact</dt>
          <dd className="truncate">{payload.contactUrl}</dd>
        </div>
      )}

      {payload.copyright && (
        <div className="flex gap-2">
          <dt className="font-medium text-slate-500 w-20 shrink-0">
            Copyright
          </dt>
          <dd>{payload.copyright}</dd>
        </div>
      )}
    </dl>
  )
}