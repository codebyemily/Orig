import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/shared/Card'

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Privacy</h1>
        <p className="text-slate-500">
          Orig is designed to minimize data exposure. This page explains what stays in your browser,
          what may be stored by the app, and what Orig does not collect.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What stays local</h2>
          <p>
            Orig processes supported files such as images and PDFs directly in your browser during
            signing and verification. Your uploaded files are not sent to a third-party service for
            analysis.
          </p>
          <p>
            Image and PDF signing logic runs client-side, and signed files are generated in your
            browser before download.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What Orig stores</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>Your display name or handle</li>
            <li>Your artist ID</li>
            <li>Your optional contact URL</li>
            <li>Your optional copyright statement</li>
            <li>Your signature registry, depending on the feature being used</li>
          </ul>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">Profile and app storage</h2>
          <p>
            Orig may store profile information through the app so your signing identity can persist
            across sessions. Some data, such as registry entries and signed file references, may also
            be stored locally in your browser.
          </p>
          <p>
            Storage behavior may differ by feature as Orig expands beyond image signing.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What Orig does not do</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>Orig does not add visible watermarks unless a feature explicitly says so</li>
            <li>Orig does not use advertising trackers</li>
            <li>Orig does not require a public profile or social account to sign work</li>
            <li>Orig does not send your files to an outside watermarking service</li>
          </ul>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">Network requests</h2>
          <p>
            Orig may make requests to its own application backend for features such as profile
            persistence. However, signing and verification of supported files are designed to happen
            locally in the browser whenever possible.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">Your control</h2>
          <p>
            You can remove locally stored Orig data from the app where supported, or clear your
            browser&apos;s site data directly.
          </p>
          <p>
            If a feature stores profile information through the app, deletion or reset behavior should
            be handled through the relevant profile controls.
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}
