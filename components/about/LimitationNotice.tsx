import Card from '@/components/shared/Card'

export default function LimitationNotice() {
  return (
    <Card className="p-5 border-amber-200 bg-amber-50">
      <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
        <span>⚠️</span> Honest limitations
      </h3>
      <ul className="text-sm text-amber-700 space-y-1.5 list-disc list-inside">
        <li>Saving as JPEG or re-compressing the PNG will destroy the watermark.</li>
        <li>Taking a screenshot crops and re-encodes the image — the signature won't survive.</li>
        <li>Aggressive image editing (large crops, format conversion) will strip the embedded data.</li>
        <li>
          Orig is a meaningful first line of defense and a timestamped proof-of-ownership record —
          not an undefeatable DRM system.
        </li>
      </ul>
    </Card>
  )
}
