'use client'

import { authClient } from '@/lib/auth-client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ClipboardList, LogOut, PlusCircle, ShieldCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import logo from './logo.png'

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
    <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image
            src={logo}
            alt="Логотип компании"
            className="h-30 w-25 object-contain"
            priority
          />
        </Link>

        <nav className="flex items-center gap-0.5">
          {[
            { href: '/', icon: <PlusCircle size={18} />, label: 'Создать' },
            { href: '/history', icon: <ClipboardList size={18} />, label: 'История' },
            ...(isReviewer ? [{ href: '/reviewer', icon: <ShieldCheck size={18} />, label: 'Проверка' }] : []),
          ].map(({ href, icon, label }) => (
            <Link key={href} href={href} className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}>
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          <ThemeToggle />

          <button onClick={handleSignOut} className="px-2 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Выйти">
            <LogOut size={18} />
          </button>
        </nav>
      </div>
    </header>
  )
}
