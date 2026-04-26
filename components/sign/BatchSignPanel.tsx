'use client'

import { useCallback } from 'react'
import type { ArtistProfile } from '@/types/artist'
import { useBatchSign } from '@/lib/useBatchSign'
import Dropzone from '@/components/upload/Dropzone'
import FileList from '@/components/upload/FileList'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'

interface BatchSignPanelProps {
  profile: ArtistProfile | null
}

export default function BatchSignPanel({ profile }: BatchSignPanelProps) {
  const { files, setFiles, signAll, isRunning, clear } = useBatchSign(profile)

  const handleFiles = useCallback((newFiles: File[]) => {
    setFiles(newFiles)
  }, [setFiles])

  const doneCount = files.filter((f) => f.status === 'done').length
  const allDone = files.length > 0 && doneCount === files.length

  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        <Dropzone
          onFiles={handleFiles}
          multiple
          label="Drop multiple images here"
          sublabel="All images will be signed and downloaded separately. PNG, JPEG, and WEBP are supported. HEIC/HEIF is experimental."
        />
      ) : (
        <>
          <FileList files={files} />

          {allDone ? (
            <Card className="p-4 text-center">
              <p className="text-emerald-700 font-semibold">All {doneCount} images signed and downloaded!</p>
              <Button variant="secondary" className="mt-3" onClick={clear}>
                Sign another batch
              </Button>
            </Card>
          ) : (
            <div className="flex gap-3 justify-center">
              <Button onClick={signAll} loading={isRunning} disabled={isRunning || !profile?.displayName} size="lg">
                {isRunning ? `Signing… (${doneCount}/${files.length})` : `Sign All ${files.length} Images`}
              </Button>
              <Button variant="ghost" onClick={clear} disabled={isRunning}>
                Clear
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
