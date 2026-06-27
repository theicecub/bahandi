const STATUS_MAP = {
  pending:  { label: 'На проверке', className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' },
  approved: { label: 'Подтверждено', className: 'bg-accent/15 text-accent dark:bg-accent/20 dark:text-accent' },
  rejected: { label: 'Отклонено',   className: 'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400' },
} as const

type Status = keyof typeof STATUS_MAP

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as Status] ?? { label: status, className: 'bg-muted text-muted-foreground' }
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
}
