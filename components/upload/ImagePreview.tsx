'use client'

import { useEffect, useState } from 'react'

interface ImagePreviewProps {
  file: File
  label?: string
}

export default function ImagePreview({ file, label }: ImagePreviewProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!src) return null

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-sm text-slate-500">{label}</p>}
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={file.name}
          className="max-h-72 max-w-full object-contain"
        />
      </div>
      <p className="text-xs text-slate-400">{file.name}</p>
    </div>
  )
}
