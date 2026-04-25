'use client'

import { useState, useEffect } from 'react'
import { getItem, setItem } from './storage/localStorage'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    const stored = getItem<T>(key)
    if (stored !== null) setValue(stored)
  }, [key])

  function update(newValue: T) {
    setValue(newValue)
    setItem(key, newValue)
  }

  return [value, update] as const
}
