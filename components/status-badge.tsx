const STATUS_MAP = {
  pending:  { label: 'На проверке', className: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Подтверждено', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Отклонено',   className: 'bg-red-100 text-red-800' },
} as const

type Status = keyof typeof STATUS_MAP

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as Status] ?? { label: status, className: 'bg-muted text-muted-foreground' }
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${s.className}`}>{s.label}</span>
}
