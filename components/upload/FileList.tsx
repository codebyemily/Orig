import type { BatchFileStatus } from '@/lib/useBatchSign'
import StatusBadge from '@/components/shared/StatusBadge'

interface FileListProps {
  files: BatchFileStatus[]
}

const statusMap = {
  pending: { label: 'Pending', variant: 'neutral' as const },
  signing: { label: 'Signing…', variant: 'info' as const },
  done: { label: 'Done', variant: 'success' as const },
  error: { label: 'Error', variant: 'error' as const },
}

export default function FileList({ files }: FileListProps) {
  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
      {files.map((item) => {
        const s = statusMap[item.status]
        return (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-sm text-slate-700 truncate flex-1">{item.file.name}</span>
            <StatusBadge variant={s.variant}>{s.label}</StatusBadge>
            {item.error && (
              <span className="text-xs text-red-500 truncate max-w-xs">{item.error}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
