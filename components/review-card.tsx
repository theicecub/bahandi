'use client'

import { reviewWriteOff } from '@/app/actions/write-offs'
import { PhotoGrid } from '@/components/photo-grid'
import { StatusBadge } from '@/components/status-badge'
import type { WriteOff } from '@/lib/db/schema'
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react'
import { useState } from 'react'

export function ReviewCard({ item }: { item: WriteOff }) {
  const [expanded, setExpanded] = useState(item.status === 'pending')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function handle(status: 'approved' | 'rejected') {
    setLoading(true)
    try {
      await reviewWriteOff(item.id, status, note || undefined)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button type="button" onClick={() => setExpanded(e => !e)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{item.productName}</span>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm text-muted-foreground truncate">{item.outletName} · {item.quantity} шт.</p>
        </div>
        {expanded ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Details */}
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Тип: </span>{item.deductionType === 'with_deduction' ? 'С удержанием' : 'Без удержания'}</p>
            {item.deductedEmployeeName && <p><span className="text-muted-foreground">Сотрудник: </span>{item.deductedEmployeeName}</p>}
            <p><span className="text-muted-foreground">Причина: </span>{item.reason}</p>
            <p><span className="text-muted-foreground">Дата: </span>{new Date(item.createdAt).toLocaleString('ru-RU')}</p>
          </div>

          <PhotoGrid photoUrl={item.photoUrl} />

          {item.reviewerNote && (
            <div className="bg-secondary rounded-xl border border-border px-3 py-2 text-sm">
              <span className="font-semibold text-foreground">Примечание: </span>
              <span className="text-muted-foreground">{item.reviewerNote}</span>
            </div>
          )}

          {/* Actions — only for pending */}
          {item.status === 'pending' && (
            <div className="space-y-2 pt-1">
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Примечание (необязательно)..." />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handle('rejected')} disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-destructive text-destructive font-semibold text-sm disabled:opacity-50 hover:bg-destructive/10 transition-colors">
                  <X size={16} /> Отклонить
                </button>
                <button onClick={() => handle('approved')} disabled={loading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                  <Check size={16} /> Подтвердить
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
