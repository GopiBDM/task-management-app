import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getCurrentUser } from '@/lib/session'
import { logout } from './actions'
import Logo from '@/components/Logo'
import NavLinks from '@/components/NavLinks'

// Shared frame for every signed-in page: sidebar (desktop) or top bar (mobile).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-canvas text-ink md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden bg-brand-900 p-4 text-white md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col">
        <div className="flex items-center gap-3 px-2 py-3">
          <Logo size={28} />
          <span className="text-base font-semibold tracking-tight">OpsTrack</span>
        </div>

        <div className="mt-6 flex-1">
          <NavLinks variant="side" />
        </div>

        <div className="rounded-xl bg-white/8 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-white/60">{user.email}</div>
            </div>
          </div>
          <form action={logout} className="mt-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-2 text-sm font-medium text-white/90 transition hover:bg-white/20">
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="bg-brand-900 px-4 py-3 text-white md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={24} />
            <span className="font-semibold tracking-tight">OpsTrack</span>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
              <LogOut size={16} />
              Sign out
            </button>
          </form>
        </div>
        <div className="mt-3">
          <NavLinks variant="top" />
        </div>
      </header>

      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  )
}
