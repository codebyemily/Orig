import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/shared/Card'

export default function PrivacyPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Privacy</h1>
        <p className="text-slate-500">
          Orig is built to keep your work local. This page explains what is stored, what is not
          collected, and what stays on your device.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What stays local</h2>
          <p>
            Orig processes images directly in your browser using standard web APIs. Your image files
            are not uploaded to a server for signing or verification.
          </p>
          <p>
            Your artist profile and signature registry are stored in your browser&apos;s localStorage
            for this site only.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What Orig stores</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>Your display name or handle</li>
            <li>Your artist ID</li>
            <li>Your optional contact URL</li>
            <li>Your optional copyright statement</li>
            <li>Your local signature registry</li>
          </ul>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">What Orig does not do</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>Orig does not upload your images</li>
            <li>Orig does not create an account for you</li>
            <li>Orig does not use analytics or tracking scripts</li>
            <li>Orig does not send your signature data to a server</li>
          </ul>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">Network requests</h2>
          <p>
            After the app loads, Orig is designed to avoid sending image or profile data anywhere.
            Your signing and verification actions happen locally in the browser.
          </p>
        </Card>

        <Card className="space-y-3 p-6 text-sm leading-relaxed text-slate-600">
          <h2 className="text-lg font-semibold text-slate-800">Your control</h2>
          <p>
            You can delete all locally stored Orig data from the Profile page at any time. You can
            also clear your browser&apos;s site data directly.
          </p>
          <p>
            Because Orig does not create a remote account, there is no server-side account data to
            delete.
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}
