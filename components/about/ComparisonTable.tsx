const rows = [
  {
    tool: 'Orig',
    free: '✅ Free',
    local: '✅ 100% local',
    noUpload: '✅ No upload',
    forArtists: '✅ Built for indie artists',
    verify: '✅ Verify any image',
  },
  {
    tool: 'Steg.AI / IMATAG / Digimarc',
    free: '❌ Enterprise pricing',
    local: '❌ Cloud-based',
    noUpload: '❌ Uploads your art',
    forArtists: '❌ Not for indie artists',
    verify: '✅ Enterprise verify',
  },
  {
    tool: 'Glaze / Nightshade',
    free: '✅ Free',
    local: '✅ Local',
    noUpload: '✅ No upload',
    forArtists: '✅ For artists',
    verify: '❌ AI-poison only, not ownership proof',
  },
  {
    tool: 'OpenStego',
    free: '✅ Free',
    local: '✅ Local',
    noUpload: '✅ No upload',
    forArtists: '❌ Developer tool, complex',
    verify: '✅ Verify supported',
  },
  {
    tool: 'Web watermark tools',
    free: '⚠️ Varies',
    local: '❌ Cloud-based',
    noUpload: '❌ Uploads your art',
    forArtists: '⚠️ Visible watermarks only',
    verify: '❌ No signature verification',
  },
]

const headers = ['Tool', 'Free', 'Local', 'No Upload', 'For Artists', 'Verify Ownership']

export default function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={i} className={i === 0 ? 'bg-brand-50' : 'bg-white'}>
              <td className="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{row.tool}</td>
              <td className="px-4 py-3 text-slate-600">{row.free}</td>
              <td className="px-4 py-3 text-slate-600">{row.local}</td>
              <td className="px-4 py-3 text-slate-600">{row.noUpload}</td>
              <td className="px-4 py-3 text-slate-600">{row.forArtists}</td>
              <td className="px-4 py-3 text-slate-600">{row.verify}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
