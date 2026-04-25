'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/sign', label: 'Sign' },
  { href: '/verify', label: 'Verify' },
  { href: '/registry', label: 'Registry' },
  { href: '/profile', label: 'Profile' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
        >
          <span className="text-xl text-brand-600">◈</span>
          <span>Orig</span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
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
