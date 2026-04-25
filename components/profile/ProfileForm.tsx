'use client'

import { useState, useEffect } from 'react'
import type { ArtistProfile } from '@/types/artist'
import { loadProfile, saveProfile, initProfile } from '@/lib/storage/profileStorage'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'

export default function ProfileForm() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = loadProfile() ?? initProfile()
    setProfile(p)
  }, [])

  function handleChange(field: keyof ArtistProfile, value: string) {
    if (!profile) return
    setProfile({ ...profile, [field]: value })
    setSaved(false)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    saveProfile(profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!profile) return null

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Display name / handle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            placeholder="@maya.art"
            required
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
          <p className="mt-1 text-xs text-slate-400">This name will be embedded in every image you sign.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact URL <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            value={profile.contactUrl ?? ''}
            onChange={(e) => handleChange('contactUrl', e.target.value)}
            placeholder="https://maya.art"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Copyright statement <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={profile.copyright ?? ''}
            onChange={(e) => handleChange('copyright', e.target.value)}
            placeholder="© 2026 Maya Reyes. All rights reserved."
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
          />
        </div>

        <Button type="submit" className="w-full">
          {saved ? '✓ Saved' : 'Save Profile'}
        </Button>
      </form>
    </Card>
  )
}
