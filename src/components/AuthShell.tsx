import { Check } from 'lucide-react'
import Logo from './Logo'

const points = [
  'Projects and tasks in one place',
  'Clear owners and due dates',
  'See what is overdue at a glance',
]

// The split-screen frame shared by the login and sign-up pages.
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-linear-to-br from-brand-900 via-[#0B4A45] to-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="text-lg font-semibold tracking-tight">OpsTrack</span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Keep every project and task on track.
          </h2>
          <ul className="mt-8 space-y-3 text-white/85">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">
                  <Check size={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">Built for our team.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo size={28} />
            <span className="text-lg font-semibold tracking-tight text-ink">OpsTrack</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-muted">{footer}</div>
        </div>
      </section>
    </main>
  )
}
