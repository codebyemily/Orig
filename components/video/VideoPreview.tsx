'use client'

import { useEffect, useState } from 'react'

interface VideoPreviewProps {
  file: File
  label?: string
}

export default function VideoPreview({ file, label }: VideoPreviewProps) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSrc(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!src) return null

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <p className="text-sm text-slate-500">{label}</p>}

      <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
        <video
          src={src}
          controls
          playsInline
          className="max-h-[420px] w-full bg-black"
        />
      </div>

      <p className="text-xs text-slate-400">{file.name}</p>
    </div>
  )
}
