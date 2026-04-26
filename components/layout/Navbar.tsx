'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const links = [
  { href: '/registry', label: 'Registry' },
  { href: '/sign', label: 'Sign' },
  { href: '/verify', label: 'Verify' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/registry"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
        >
          <span className="text-xl text-brand-600">◈</span>
          <span>Orig</span>
        </Link>

        <div className="hidden items-center gap-1 sm:gap-2 md:flex">
          {links.map(({ href, label }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-100 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div ref={menuRef} className="relative md:hidden">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white/85 text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur">
              <div className="flex flex-col gap-1">
                {links.map(({ href, label }) => {
                  const active = pathname === href

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-brand-100 text-brand-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
