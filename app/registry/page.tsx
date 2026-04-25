'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import ExportButtons from '@/components/sign/ExportButtons'
import Button from '@/components/shared/Button'
import EmptyState from '@/components/shared/EmptyState'
import type { RegistryEntry } from '@/types/registry'
import { loadRegistry, deleteRegistryEntry } from '@/lib/storage/registryStorage'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function RegistryPage() {
  const [entries, setEntries] = useState<RegistryEntry[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    setEntries(loadRegistry())
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return entries
    const q = filter.toLowerCase()
    return entries.filter(
      (e) =>
        e.filename.toLowerCase().includes(q) ||
        e.displayName.toLowerCase().includes(q) ||
        e.timestamp.includes(q)
    )
  }, [entries, filter])

  function handleDelete(id: string) {
    deleteRegistryEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <PageContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Signature Registry</h1>
          <p className="text-slate-500 text-sm">
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
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Preview</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Filename</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Signed</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Hash</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {entry.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.thumbnail}
                          alt={entry.filename}
                          className="w-10 h-10 object-cover rounded-md border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
                          🖼️
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-xs truncate">
                      {entry.filename}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 max-w-[120px] truncate">
                      {entry.imageHash.slice(0, 16)}…
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href="/verify">
                          <Button variant="ghost" size="sm">Re-verify</Button>
                        </Link>
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

          {filtered.length === 0 && filter && (
            <p className="text-center text-slate-400 py-8 text-sm">No entries match &quot;{filter}&quot;</p>
          )}
        </>
      )}
    </PageContainer>
  )
}
