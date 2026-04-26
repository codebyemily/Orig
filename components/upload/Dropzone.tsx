'use client'

import { useCallback, useState } from 'react'
import { validateImageFile } from '@/lib/validation/imageValidation'
import { IMAGE_INPUT_ACCEPT, isExperimentalImageFile } from '@/lib/validation/files'

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
  sublabel = 'or click to browse — PNG, JPEG, and WEBP supported. HEIC/HEIF experimental',
}: DropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

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

      const hasExperimental = valid.some(isExperimentalImageFile)
      setNotice(
        hasExperimental
          ? 'HEIC/HEIF support is experimental and depends on browser support. If a file fails to load, convert it to PNG or JPEG and try again.'
          : null
      )

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
        className={`relative flex min-h-52 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50'
        }`}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept={IMAGE_INPUT_ACCEPT}
          multiple={multiple}
          className="sr-only"
          onChange={onInputChange}
        />
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <div className="select-none text-5xl opacity-40">{dragging ? '📥' : '🖼️'}</div>
          <div>
            <p className="font-semibold text-slate-700">{label}</p>
            <p className="mt-1 text-sm text-slate-400">{sublabel}</p>
          </div>
        </div>
      </label>

      {notice && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-700">
          {notice}
        </p>
      )}

      {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}
