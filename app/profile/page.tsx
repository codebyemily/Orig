import PageContainer from '@/components/layout/PageContainer'
import ProfileForm from '@/components/profile/ProfileForm'
import ArtistIdCard from '@/components/profile/ArtistIdCard'
import DeleteLocalDataButton from '@/components/profile/DeleteLocalDataButton'
import Card from '@/components/shared/Card'

export default function ProfilePage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Artist Profile</h1>
        <p className="text-slate-500">
          Your profile is stored only in this browser. It&apos;s never uploaded anywhere.
        </p>
      </div>

      <div className="space-y-6 max-w-xl">
        <ProfileForm />
        <ArtistIdCard />

        {/* Privacy section */}
        <Card className="p-5 border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-3">Privacy &amp; Data</h3>
          <ul className="text-sm text-slate-500 space-y-1.5 list-disc list-inside">
            <li>Your profile and registry are stored in your browser&apos;s localStorage.</li>
            <li>No data is ever transmitted to any server.</li>
            <li>Orig makes zero outbound network requests after initial page load.</li>
            <li>There is no account — so there&apos;s nothing to delete on any server.</li>
          </ul>
        </Card>

        <div>
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">Danger zone</h3>
          <DeleteLocalDataButton />
        </div>
      </div>
    </PageContainer>
  )
}
