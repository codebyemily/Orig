'use client'

import { useState, useEffect, useCallback } from 'react'
import type { RegistryEntry } from '@/types/registry'
import { loadRegistry, addRegistryEntry, deleteRegistryEntry, clearRegistry } from './storage/registryStorage'

export function useSignatureRegistry() {
  const [entries, setEntries] = useState<RegistryEntry[]>([])

  useEffect(() => {
    setEntries(loadRegistry())
  }, [])

  const addEntry = useCallback((entry: RegistryEntry) => {
    addRegistryEntry(entry)
    setEntries(loadRegistry())
  }, [])

  const deleteEntry = useCallback((id: string) => {
    deleteRegistryEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    clearRegistry()
    setEntries([])
  }, [])

  return { entries, addEntry, deleteEntry, clearAll }
}
