import PageContainer from '@/components/layout/PageContainer'
import LimitationNotice from '@/components/about/LimitationNotice'
import ComparisonTable from '@/components/about/ComparisonTable'
import Card from '@/components/shared/Card'

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">How Orig Works</h1>
        <p className="text-slate-500">
          Plain-English explanation of the technology, honest limitations, and why local-first matters.
        </p>
      </div>

      <div className="space-y-10 max-w-3xl">
        {/* LSB explanation */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">LSB Steganography</h2>
          <div className="prose prose-slate prose-sm max-w-none">
            <Card className="p-6 space-y-3 text-slate-600 text-sm leading-relaxed">
              <p>
                Every digital image is made of pixels. Each pixel stores a red, green, and blue
                value — each value is a number from 0 to 255. Orig modifies the{' '}
                <strong>Least Significant Bit</strong> (LSB) of each color channel — the rightmost
                bit of the number.
              </p>
              <p>
                Changing the LSB shifts a color value by at most 1 — for example, 200 becomes 201.
                This difference is completely invisible to the human eye, but completely readable by
                software.
              </p>
              <p>
                Orig encodes your ownership data (name, timestamp, artist ID, a SHA-256 hash of the
                image) into these bits. The encoding is sequential — R, G, B across each pixel from
                top-left to bottom-right. A length header tells the decoder exactly how many bits to
                read.
              </p>
              <p>
                <strong>Why PNG only output?</strong> PNG is lossless — it preserves every bit
                exactly. JPEG recompression changes pixel values and would destroy the embedded
                data. So Orig always exports as PNG, regardless of your input format.
              </p>
            </Card>
          </div>
        </section>

        {/* Embed fields */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">What gets embedded</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { field: 'Artist name', desc: 'Your display name / handle' },
              { field: 'Artist ID', desc: 'Your unique browser-generated UUID' },
              { field: 'Timestamp', desc: 'The exact time you signed the image' },
              { field: 'Contact URL', desc: 'Optional — your website or social link' },
              { field: 'Copyright', desc: 'Optional — your copyright statement' },
              { field: 'Image hash', desc: 'SHA-256 of original pixel data for tamper detection' },
            ].map(({ field, desc }) => (
              <Card key={field} className="p-4 flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-brand-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{field}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Tamper detection */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Tamper detection</h2>
          <Card className="p-5 text-sm text-slate-600 space-y-2">
            <p>
              At signing time, Orig computes a <strong>SHA-256 hash</strong> of the original pixel
              data using the browser&apos;s built-in Web Crypto API and embeds this hash alongside
              your ownership information.
            </p>
            <p>
              During verification, the same hash is computed on the image being scanned and compared
              to the embedded hash. If they differ, Orig surfaces a tamper warning — the image may
              have been edited, cropped, or resaved after signing.
            </p>
          </Card>
        </section>

        {/* Limitations */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Limitations — disclosed honestly</h2>
          <LimitationNotice />
        </section>

        {/* Comparison */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">How Orig compares</h2>
          <ComparisonTable />
        </section>

        {/* Privacy policy */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">Orig&apos;s own privacy policy</h2>
          <Card className="p-6 text-sm text-slate-600 space-y-3 border-emerald-200 bg-emerald-50">
            <p className="font-semibold text-emerald-800 text-base">Orig collects nothing and sends nothing.</p>
            <div className="space-y-1.5">
              <p>
                <strong>What Orig stores locally:</strong> Your artist profile (name, contact URL,
                copyright, unique ID) and your signing registry — stored in your browser&apos;s
                localStorage, scoped to this origin only.
              </p>
              <p>
                <strong>What Orig never does:</strong> Upload your images. Send any data to a
                server. Use analytics or tracking. Set cookies.
              </p>
              <p>
                <strong>Network requests:</strong> Zero, after the initial page load of the static
                bundle.
              </p>
              <p>
                <strong>Your control:</strong> Clear all Orig data at any time from the{' '}
                <a href="/profile" className="text-emerald-700 underline">
                  Profile page
                </a>
                , or clear your browser&apos;s site data directly. There is no account to delete
                because there is no account.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}
