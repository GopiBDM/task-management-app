'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderKanban, ListChecks } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
]

// Navigation links that highlight the page you are on.
export default function NavLinks({ variant }: { variant: 'side' | 'top' }) {
  const pathname = usePathname()

  return (
    <nav className={variant === 'side' ? 'space-y-1' : 'flex gap-1 overflow-x-auto'}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition ${
              active ? 'bg-white/12 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
