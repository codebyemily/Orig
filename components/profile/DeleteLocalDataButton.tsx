'use client'

import { useState } from 'react'
import { clearAll } from '@/lib/storage/localStorage'
import Button from '@/components/shared/Button'

export default function DeleteLocalDataButton() {
  const [confirmed, setConfirmed] = useState(false)
  const [deleted, setDeleted] = useState(false)

  function handleDelete() {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    clearAll()
    setDeleted(true)
  }

  if (deleted) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        All local Orig data has been deleted. Refresh the page to start fresh.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {confirmed && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3 border border-red-200">
          This will permanently delete your profile, artist ID, and signing registry from this browser. This cannot be undone. Click again to confirm.
        </p>
      )}
      <Button variant="danger" onClick={handleDelete}>
        {confirmed ? 'Yes, delete everything' : 'Delete all local data'}
      </Button>
    </div>
  )
}
