import { auth } from '@/lib/auth'
import { getAllWriteOffs } from '@/app/actions/write-offs'
import { NavBar } from '@/components/nav-bar'
import { ReviewCard } from '@/components/review-card'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

export default async function ReviewerPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const user = session.user as typeof session.user & { role?: string }
  if (user.role !== 'reviewer') redirect('/')

  const items = await getAllWriteOffs()
  const pending = items.filter(i => i.status === 'pending')
  const reviewed = items.filter(i => i.status !== 'pending')

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Панель проверки</h1>
          <p className="text-sm text-muted-foreground mt-1">
            На проверке: <strong>{pending.length}</strong> &nbsp;·&nbsp; Проверено: <strong>{reviewed.length}</strong>
          </p>
        </div>

        {pending.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Ожидают проверки</h2>
            <div className="space-y-3">
              {pending.map(item => <ReviewCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {reviewed.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Проверенные</h2>
            <div className="space-y-3">
              {reviewed.map(item => <ReviewCard key={item.id} item={item} />)}
            </div>
          </section>
        )}

        {items.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ShieldCheck size={40} className="mx-auto mb-3 opacity-40" />
            <p>Заявок пока нет</p>
          </div>
        )}
      </main>
    </div>
  )
}
