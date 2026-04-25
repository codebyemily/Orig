'use client'

import { useCallback, useState } from 'react'
import { validateImageFile } from '@/lib/validation/imageValidation'

interface DropzoneProps {
  onFiles: (files: File[]) => void
  multiple?: boolean
  label?: string
  sublabel?: string
}

export default function Dropzone({
  onFiles,
  multiple = false,
  label = 'Drop your image here',
  sublabel = 'or click to browse — PNG, JPEG, WEBP accepted',
}: DropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const files = Array.from(fileList)
      const errors: string[] = []
      const valid: File[] = []
      for (const f of files) {
        const err = validateImageFile(f)
        if (err) errors.push(`${f.name}: ${err}`)
        else valid.push(f)
      }
      setError(errors.length ? errors.join('; ') : null)
      if (valid.length) onFiles(valid)
    },
    [onFiles]
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      setDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files)
    },
    [handleFiles]
  )

  return (
    <div className="w-full">
      <label
        className={`relative flex flex-col items-center justify-center w-full min-h-52 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'
        }`}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple={multiple}
          className="sr-only"
          onChange={onInputChange}
        />
        <div className="flex flex-col items-center gap-3 text-center px-6 py-8">
          <div className="text-5xl opacity-40 select-none">
            {dragging ? '📥' : '🖼️'}
          </div>
          <div>
            <p className="font-semibold text-slate-700">{label}</p>
            <p className="text-sm text-slate-400 mt-1">{sublabel}</p>
          </div>
        </div>
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
