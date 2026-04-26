import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="w-full px-8 py-6">
        <div className="flex justify-center items-center gap-6 text-xs text-slate-500">
          
          <span className="flex items-center gap-2 text-slate-600">
            <span className="text-brand-500">◈</span>
            Orig © 2026
          </span>

          <Link href="/about" className="hover:text-slate-900 transition-colors">
            About
          </Link>

          <Link href="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy
          </Link>

        </div>
      </div>
    </footer>
  )
}
