import PageContainer from '@/components/layout/PageContainer'
import VerifyPanel from '@/components/verify/VerifyPanel'

export default function VerifyPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify an Image</h1>
        <p className="text-slate-500">
          Drag any image — your own work, or something you found online — to reveal whether it
          carries an Orig signature.
        </p>
      </div>

      <VerifyPanel />

      <div className="mt-8 p-4 bg-slate-100 rounded-xl text-sm text-slate-500">
        <strong className="text-slate-700">No profile needed to verify.</strong> You can scan any
        image without setting up an account. If a signature is found, all embedded information will
        be displayed.
      </div>
    </PageContainer>
  )
}
