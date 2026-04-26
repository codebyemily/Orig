import type { RegistryEntry } from '@/types/registry'
import { getItem, setItem } from './localStorage'

const KEY = 'orig:registry'

export function loadRegistry(): RegistryEntry[] {
  return getItem<RegistryEntry[]>(KEY) ?? []
}

export function addRegistryEntry(entry: RegistryEntry): void {
  const registry = loadRegistry()
  registry.unshift(entry)
  setItem(KEY, registry)
}

export function deleteRegistryEntry(id: string): void {
  const registry = loadRegistry().filter((entry) => entry.id !== id)
  setItem(KEY, registry)
}

export function clearRegistry(): void {
  setItem(KEY, [])
}
