'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/registry', label: 'Registry' },
  { href: '/sign', label: 'Sign' },
  { href: '/verify', label: 'Verify' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="relative mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/registry"
          className="absolute left-4 flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-slate-900 sm:left-6 lg:left-8"
        >
          <span className="text-xl text-brand-600">◈</span>
          <span>Orig</span>
        </Link>
  
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
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