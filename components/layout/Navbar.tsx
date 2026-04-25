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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900">
          <span className="text-brand-600 text-xl">◈</span>
          <span>Orig</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-brand-100 text-brand-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
