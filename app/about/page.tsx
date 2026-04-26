import Link from 'next/link'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/shared/Card'

const embeddedFields = [
  { title: 'Artist name', description: 'Your display name or handle' },
  { title: 'Artist ID', description: 'Your unique browser-generated ID' },
  { title: 'Timestamp', description: 'When the image was signed' },
  { title: 'Contact URL', description: 'Optional website or social link' },
  { title: 'Copyright', description: 'Optional copyright statement' },
  { title: 'Image/PDF hash', description: 'Used to help detect later changes' },
]

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="space-y-14">
        {/* Hero section */}
        <section className="pt-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-12 w-12 rotate-45 items-center justify-center border-4 border-slate-900">
              <div className="h-6 w-6 bg-slate-900" />
            </div>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Your art. Invisibly signed.
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-500">
            Orig embeds an invisible ownership signature directly into your image
            files — no visible watermark, no server upload, no account. If your
            art gets stolen, drag it into Orig to prove it&apos;s yours.
          </p>
        </section>

        {/* Three feature cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 text-center">
            <div className="text-4xl">🖼️</div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Drop your image
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              PNG, JPEG, or WEBP. Your file never leaves your browser.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl">✍️</div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Sign invisibly
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your name, timestamp, and ID are hidden in the pixel data — zero
              quality loss.
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-4xl">🔍</div>
            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Verify anywhere
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Drag any copy of the image into Orig to reveal who signed it and
              when.
            </p>
          </Card>
        </section>

        {/* Local privacy banner */}
        <section>
          <Card className="p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-5">
                <div className="text-3xl">🔒</div>

                <div>
                  <h3 className="text-lg font-bold text-emerald-700">
                    100% local — your images never leave your browser
                  </h3>

                  <p className="mt-1 max-w-4xl text-sm leading-6 text-emerald-700">
                    No account. No upload. No tracking. Everything runs via the
                    browser&apos;s Canvas API. Clearing browser data removes all
                    Orig data permanently.
                  </p>
                </div>
              </div>

              <Link
                href="/privacy"
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-700 hover:text-slate-950"
              >
                <span>Privacy</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Card>
        </section>

        {/* What Orig does */}
        <section>
          <h3 className="mb-3 text-xl font-bold text-slate-800">
            What Orig does
          </h3>

          <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
            <p>
              Orig lets creators embed ownership information directly into their files — without changing how they look.
            </p>

            <p>
              For images, Orig hides a signature inside the pixel data instead of adding a visible watermark. For documents like PDFs, it embeds ownership data into the file itself. In both cases, the original appearance stays the same.
            </p>

            <div>
              <p className="mb-1">This means you can:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>sign your work</li>
                <li>share it normally</li>
                <li>later verify whether a copy still carries your signature</li>
              </ul>
            </div>

            <p>
              Everything runs locally in your browser. Your files are never uploaded or sent to a server.
            </p>
          </Card>
        </section>

        {/* How it works */}
        <section>
          <h3 className="mb-3 text-xl font-bold text-slate-800">
            How it works
          </h3>

          <Card className="space-y-4 p-6 text-sm leading-relaxed text-slate-600">
            
            <div>
              <p className="font-semibold text-slate-700 mb-1">Images</p>
              <p>
                Every digital image is made of pixels. Each pixel stores red, green, and blue color values. Orig modifies the least significant bit of those values — a tiny change that is invisible to the human eye, but still readable by software.
              </p>

              <p className="mt-2">
                Orig embeds ownership data such as your display name, artist ID, and timestamp into these bits. When you verify an image later, Orig reads that hidden data back out.
              </p>

              <p className="mt-2">
                Signed images are exported as PNG, because PNG preserves pixel data exactly. Formats like JPEG can destroy embedded data through recompression.
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-700 mb-1">PDFs</p>
              <p>
                For PDF files, Orig embeds ownership information into the document’s internal metadata. This keeps the document visually unchanged while allowing Orig to detect the signature during verification.
              </p>
            </div>

          </Card>
        </section>

        {/* What gets embedded */}
        <section>
          <h3 className="mb-3 text-xl font-bold text-slate-800">
            What gets embedded
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {embeddedFields.map((field) => (
              <Card key={field.title} className="flex items-start gap-3 p-4">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {field.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {field.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  )
}