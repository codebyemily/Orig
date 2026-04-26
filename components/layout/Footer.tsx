import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="order-2 flex items-center gap-2 text-center text-xs md:order-1 md:text-sm">
            <span className="text-brand-500">◈</span>
            <span>© 2026 Orig All rights reserved.</span>
          </div>

          <div className="order-1 flex items-center gap-5 md:order-2">
            <Link href="/about" className="transition-colors hover:text-slate-900">
              About
            </Link>

            <Link href="/privacy" className="transition-colors hover:text-slate-900">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
