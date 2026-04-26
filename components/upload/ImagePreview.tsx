'use client'

import { useEffect, useState } from 'react'
import { isExperimentalImageFile } from '@/lib/validation/files'

interface ImagePreviewProps {
  file: File
  label?: string
}

export default function ImagePreview({ file, label }: ImagePreviewProps) {
  const [src, setSrc] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    setPreviewFailed(false)

    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!src) return null

  const experimental = isExperimentalImageFile(file)

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-sm text-slate-500">{label}</p>}

      <div className="max-w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
        {!previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={file.name}
            className="max-h-72 max-w-full object-contain"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="flex min-h-48 w-[320px] max-w-full items-center justify-center bg-slate-50 px-6 text-center text-sm text-slate-500">
            {experimental
              ? 'Preview unavailable in this browser for this HEIC/HEIF file. You can still try signing it if decoding succeeds.'
              : 'Preview unavailable for this file.'}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400">{file.name}</p>

      {experimental && (
        <p className="text-center text-xs text-amber-700">
          HEIC/HEIF support is experimental and may vary by browser.
        </p>
      )}
    </div>
  )
}
