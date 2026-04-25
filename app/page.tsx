import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import Button from '@/components/shared/Button'
import Card from '@/components/shared/Card'

export default function HomePage() {
  return (
    <PageContainer>
      {/* Hero */}
      <div className="text-center py-12">
        <div className="text-7xl mb-6 select-none">◈</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Your art. Invisibly signed.
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          Orig embeds an invisible ownership signature directly into your image files — no visible
          watermark, no server upload, no account. If your art gets stolen, drag it into Orig to prove
          it&apos;s yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/sign">
            <Button size="lg" className="w-full sm:w-auto">
              ✍️ Sign an image
            </Button>
          </Link>
          <Link href="/verify">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              🔍 Verify ownership
            </Button>
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-12">
        {[
          {
            icon: '🖼️',
            title: 'Drop your image',
            body: 'PNG, JPEG, or WEBP. Your file never leaves your browser.',
          },
          {
            icon: '✍️',
            title: 'Sign invisibly',
            body: 'Your name, timestamp, and ID are hidden in the pixel data — zero quality loss.',
          },
          {
            icon: '🔍',
            title: 'Verify anywhere',
            body: 'Drag any copy of the image into Orig to reveal who signed it and when.',
          },
        ].map(({ icon, title, body }) => (
          <Card key={title} className="p-6 text-center">
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
            <p className="text-sm text-slate-500">{body}</p>
          </Card>
        ))}
      </div>

      {/* Privacy badge */}
      <Card className="p-5 flex flex-col sm:flex-row items-center gap-4 border-emerald-200 bg-emerald-50">
        <div className="text-3xl">🔒</div>
        <div>
          <p className="font-semibold text-emerald-800">100% local — your images never leave your browser</p>
          <p className="text-sm text-emerald-700 mt-0.5">
            No account. No upload. No tracking. Everything runs via the browser&apos;s Canvas API.
            Clearing browser data removes all Orig data permanently.
          </p>
        </div>
        <Link href="/about" className="ml-auto whitespace-nowrap">
          <Button variant="ghost" size="sm">How it works →</Button>
        </Link>
      </Card>

      {/* Quote strip */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 text-center">
        {[
          '"Your signature is invisibly embedded."',
          '"Signed by @maya.art — April 24, 2026, 2:14 PM."',
          '"No signature detected."',
        ].map((q) => (
          <div key={q} className="flex-1 px-4 py-5 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 italic">
            {q}
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
