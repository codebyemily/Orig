'use client'

import { useState } from 'react'
import Button from '@/components/shared/Button'
import { clearAll } from '@/lib/storage/localStorage'

export default function DeleteLocalDataButton() {
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }

    clearAll()
    window.location.reload()
  }

  function handleCancel() {
    setConfirming(false)
  }

  return (
    <div className="space-y-4">
      {confirming && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This will permanently delete your profile, artist ID, and signing
          registry from this browser. This cannot be undone. Click again to
          confirm.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="danger" onClick={handleDelete}>
          {confirming ? 'Yes, delete everything' : 'Delete all local data'}
        </Button>

        {confirming && (
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
}