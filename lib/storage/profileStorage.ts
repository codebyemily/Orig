import type { ArtistProfile } from '@/types/artist'
import { getItem, setItem, removeItem } from './localStorage'
import { generateArtistId } from '@/lib/crypto/artistId'

const KEY = 'orig:profile'

export function loadProfile(): ArtistProfile | null {
  return getItem<ArtistProfile>(KEY)
}

export function saveProfile(profile: ArtistProfile): void {
  setItem(KEY, profile)
}

export function deleteProfile(): void {
  removeItem(KEY)
}

export function getOrCreateProfile(): ArtistProfile | null {
  return loadProfile()
}

export function initProfile(): ArtistProfile {
  const existing = loadProfile()
  if (existing) return existing
  const profile: ArtistProfile = {
    id: generateArtistId(),
    displayName: '',
    createdAt: new Date().toISOString(),
  }
  saveProfile(profile)
  return profile
}
