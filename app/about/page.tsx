import PageContainer from '@/components/layout/PageContainer'
import LimitationNotice from '@/components/about/LimitationNotice'
import Card from '@/components/shared/Card'

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">About Orig</h1>
        <p className="text-slate-500">
          What Orig does, how invisible signing works, and the limits of the technology.
        </p>
      </div>

      <div className="max-w-3xl space-y-10">
        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">What Orig does</h2>
          <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
            <p>
              Orig helps artists invisibly sign digital images directly in the browser. Instead of
              adding a visible watermark, Orig hides ownership data inside the image itself.
            </p>
            <p>
              That means you can sign a file, keep the artwork visually unchanged, and later verify
              whether a copy still carries an Orig signature.
            </p>
            <p>
              Everything runs locally in your browser. Your images are never uploaded to a server.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">How it works</h2>
          <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
            <p>
              Every digital image is made of pixels. Each pixel stores red, green, and blue color
              values. Orig modifies the least significant bit of those values — a tiny change that
              is not visible to the human eye, but can still be read by software.
            </p>
            <p>
              Orig embeds ownership data such as your display name, artist ID, timestamp, and other
              signature details into those bits. When you verify an image later, Orig reads that
              hidden data back out.
            </p>
            <p>
              Orig always exports signed files as PNG, because PNG preserves image data exactly.
              Formats like JPEG can destroy hidden watermark data through recompression.
            </p>
          </Card>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">What gets embedded</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { field: 'Artist name', desc: 'Your display name or handle' },
              { field: 'Artist ID', desc: 'Your unique browser-generated ID' },
              { field: 'Timestamp', desc: 'When the image was signed' },
              { field: 'Contact URL', desc: 'Optional website or social link' },
              { field: 'Copyright', desc: 'Optional copyright statement' },
              { field: 'Image hash', desc: 'Used to help detect later changes' },
            ].map(({ field, desc }) => (
              <Card key={field} className="flex items-start gap-3 p-4">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{field}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-800">Limitations</h2>
          <LimitationNotice />
        </section>
      </div>
    </PageContainer>
  )
}
