import PageContainer from '@/components/layout/PageContainer'
import ProfileForm from '@/components/profile/ProfileForm'
import ArtistIdCard from '@/components/profile/ArtistIdCard'
import DeleteLocalDataButton from '@/components/profile/DeleteLocalDataButton'
import Card from '@/components/shared/Card'

export default function ProfilePage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-2xl text-brand-700">
              ◈
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-brand-700">Artist profile</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Your Orig identity
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                This profile lives only in this browser and is used when you sign images with Orig.
                Your display name and artist ID help anchor ownership across your signed work.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the identity information embedded into images you sign.
            </p>
          </div>
          <ProfileForm />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Artist ID</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your browser-generated identifier stays consistent across signatures.
            </p>
          </div>
          <ArtistIdCard />
        </section>

        <section className="space-y-4 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Danger zone</h2>
            <p className="mt-1 text-sm text-slate-500">
              Delete all local Orig data stored in this browser.
            </p>
          </div>

          <Card className="border-red-200 p-5 sm:p-6">
            <DeleteLocalDataButton />
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}
