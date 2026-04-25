type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const styles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  error: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  neutral: 'bg-slate-100 text-slate-600 ring-slate-500/20',
}

interface StatusBadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
}

export default function StatusBadge({ variant, children }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[variant]}`}>
      {children}
    </span>
  )
}
