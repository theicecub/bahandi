import { auth } from '@/lib/auth'
import { WriteOffForm } from '@/components/write-off-form'
import { NavBar } from '@/components/nav-bar'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={session.user} />
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Новое списание</h1>
          <p className="text-sm text-muted-foreground mt-1">Заполните форму и прикрепите фото</p>
        </div>
        <WriteOffForm />
      </main>
    </div>
  )
}
