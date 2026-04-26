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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      {/* Mobile */}
      <nav className="flex w-full items-center justify-between px-4 py-3 md:hidden">
        <Link
          href="/registry"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-900"
        >
          <span className="text-brand-600">◈</span>
          <span>Orig</span>
        </Link>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <span className="text-base">{open ? '✕' : '☰'}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="flex flex-col gap-1">
                {links.map(({ href, label }) => {
                  const active = pathname === href

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`rounded-md px-3 py-2 text-sm font-medium ${
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

      {/* Desktop */}
      <nav className="relative hidden w-full items-center justify-center px-8 py-3 md:flex">
        <Link
          href="/registry"
          className="absolute left-8 flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
        >
          <span className="text-brand-600">◈</span>
          <span>Orig</span>
        </Link>

        <div className="flex items-center gap-2">
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
      </nav>
    </header>
  )
}
