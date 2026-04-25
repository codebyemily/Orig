import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="text-brand-500">◈</span>
          <span>Orig — 100% local, zero uploads, zero tracking.</span>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-slate-900 transition-colors">How it works</Link>
          <Link href="/profile" className="hover:text-slate-900 transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  )
}
