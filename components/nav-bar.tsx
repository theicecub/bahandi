'use client'

import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ClipboardList, LogOut, PlusCircle, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { BahandiLogo } from '@/components/bahandi-logo'

interface User {
  id: string
  name: string
  email: string
  role?: string
}

export function NavBar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const isReviewer = user.role === 'reviewer'

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="Bahandi">
          <BahandiLogo size="sm" />
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/" className={`p-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${
            pathname === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}>
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Создать</span>
          </Link>

          <Link href="/history" className={`p-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${
            pathname === '/history' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}>
            <ClipboardList size={18} />
            <span className="hidden sm:inline">История</span>
          </Link>

          {isReviewer && (
            <Link href="/reviewer" className={`p-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === '/reviewer' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>
              <ShieldCheck size={18} />
              <span className="hidden sm:inline">Проверка</span>
            </Link>
          )}

          <ThemeToggle />

          <button onClick={handleSignOut} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Выйти">
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  )
}
