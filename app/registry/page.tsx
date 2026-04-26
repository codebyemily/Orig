'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PageContainer from '@/components/layout/PageContainer'
import ExportButtons from '@/components/sign/ExportButtons'
import Button from '@/components/shared/Button'
import EmptyState from '@/components/shared/EmptyState'
import type { RegistryEntry } from '@/types/registry'
import { loadRegistry, deleteRegistryEntry } from '@/lib/storage/registryStorage'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function legacyEntryAlert() {
  alert(
    'This older registry entry does not include the full signed image. Please sign the image again to enable preview, download, and re-verify.'
  )
}

export default function RegistryPage() {
  const router = useRouter()

  const [entries, setEntries] = useState<RegistryEntry[]>([])
  const [filter, setFilter] = useState('')
  const [previewEntry, setPreviewEntry] = useState<RegistryEntry | null>(null)

  useEffect(() => {
    setEntries(loadRegistry())
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return entries

    const q = filter.toLowerCase()

    return entries.filter(
      (entry) =>
        entry.filename.toLowerCase().includes(q) ||
        entry.displayName.toLowerCase().includes(q) ||
        entry.timestamp.includes(q)
    )
  }, [entries, filter])

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      'Remove this registry entry? This only removes the local record. It does not delete any image files.'
    )

    if (!confirmed) return

    deleteRegistryEntry(id)
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  function openSignedImagePopup(entry: RegistryEntry) {
    if (!entry.signedImageDataUrl) {
      legacyEntryAlert()
      return
    }

    setPreviewEntry(entry)
  }

  function downloadSignedImage(entry: RegistryEntry) {
    if (!entry.signedImageDataUrl) {
      legacyEntryAlert()
      return
    }

    const link = document.createElement('a')
    link.href = entry.signedImageDataUrl
    link.download = entry.signedFilename || entry.filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  function handleReverify(entry: RegistryEntry) {
    if (!entry.signedImageDataUrl) {
      legacyEntryAlert()
      return
    }

    sessionStorage.setItem('orig:reverify-entry', JSON.stringify(entry))
    router.push('/verify?fromRegistry=1')
  }

  return (
    <PageContainer size="wide">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-slate-900">
            Signature Registry
          </h1>
          <p className="text-sm text-slate-500">
            A local record of every image you&apos;ve signed.{' '}
            <span className="text-slate-400">{entries.length} entries</span>
          </p>
        </div>

        <ExportButtons entries={entries} />
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No signed images yet"
          description="Sign an image to see it appear here with a timestamp and file hash."
          action={
            <Link href="/sign">
              <Button>Sign your first image</Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-4">
            <input
              type="search"
              placeholder="Filter by filename, artist, or date…"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 sm:w-80"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] bg-white text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Preview
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Filename
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Signed
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Hash
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filtered.map((entry) => (
                    <tr
                      key={entry.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {entry.thumbnail ? (
                          <button
                            type="button"
                            onClick={() => openSignedImagePopup(entry)}
                            className="block rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            title="View signed image"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={entry.thumbnail}
                              alt={entry.filename}
                              className="h-10 w-10 rounded-md border border-slate-200 object-cover hover:opacity-80"
                            />
                          </button>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-400">
                            🖼️
                          </div>
                        )}
                      </td>

                      <td className="max-w-[320px] truncate px-4 py-3 font-medium text-slate-800">
                        {entry.filename}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {formatDate(entry.timestamp)}
                      </td>

                      <td className="max-w-[140px] truncate px-4 py-3 font-mono text-xs text-slate-400">
                        {entry.imageHash.slice(0, 16)}…
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-baseline gap-2 -ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReverify(entry)}
                          >
                            Re-verify
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadSignedImage(entry)}
                          >
                            Download
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleDelete(entry.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && filter && (
            <p className="py-8 text-center text-sm text-slate-400">
              No entries match &quot;{filter}&quot;
            </p>
          )}
        </>
      )}

      {previewEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewEntry(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Signed image preview
                </h2>
                <p className="text-sm text-slate-500">
                  {previewEntry.signedFilename || previewEntry.filename}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadSignedImage(previewEntry)}
                >
                  Download
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReverify(previewEntry)}
                >
                  Re-verify
                </Button>

                <button
                  type="button"
                  onClick={() => setPreviewEntry(null)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex max-h-[70vh] items-center justify-center overflow-auto rounded-xl bg-slate-100 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewEntry.signedImageDataUrl}
                alt={previewEntry.signedFilename || previewEntry.filename}
                className="max-h-[65vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}