import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="text-brand-500">◈</span>
          <span>© 2026 Orig All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/privacy" className="transition-colors hover:text-slate-900">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}
