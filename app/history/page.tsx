import { auth } from '@/lib/auth'
import { getMyWriteOffs } from '@/app/actions/write-offs'
import { NavBar } from '@/components/nav-bar'
import { PhotoGrid } from '@/components/photo-grid'
import { StatusBadge } from '@/components/status-badge'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClipboardList } from 'lucide-react'

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const items = await getMyWriteOffs()

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={session.user} />
      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">История списаний</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardList size={40} className="mx-auto mb-3 opacity-40" />
            <p>Заявок пока нет</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.outletName}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span>Кол-во: <strong className="text-foreground">{item.quantity}</strong></span>
                  <span>{item.deductionType === 'with_deduction' ? 'С удержанием' : 'Без удержания'}</span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{item.reason}</p>

                <div className="mt-3">
                  <PhotoGrid photoUrl={item.photoUrl} compact />
                </div>

                {item.reviewerNote && (
                  <div className="mt-3 bg-secondary rounded-xl px-3 py-2 text-sm border border-border">
                    <span className="font-semibold text-foreground">Ответ проверяющего: </span>
                    <span className="text-muted-foreground">{item.reviewerNote}</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(item.createdAt).toLocaleString('ru-RU')}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
