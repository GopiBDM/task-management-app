import Link from 'next/link'
import { FolderKanban, ListChecks, TriangleAlert, Plus, ClipboardList } from 'lucide-react'
import { pool } from '@/lib/db'
import { getCurrentUser } from '@/lib/session'

type MyTask = {
  id: string
  title: string
  due_label: string
  priority: string
  status: string
  project_name: string
  overdue: boolean
}

const statusStyle: Record<string, string> = {
  'To do': 'bg-slate-100 text-slate-700',
  'In progress': 'bg-blue-50 text-blue-700',
  Done: 'bg-green-50 text-green-700',
}

const priorityStyle: Record<string, string> = {
  High: 'bg-red-50 text-red-700',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
}

export default async function HomePage() {
  const user = (await getCurrentUser())!

  const counts = await pool.query(`
    select
      (select count(*)::int from projects where status = 'Active')                          as projects,
      (select count(*)::int from tasks where status <> 'Done')                              as open_tasks,
      (select count(*)::int from tasks where status <> 'Done' and due_date < current_date)  as overdue
  `)

  const mine = await pool.query<MyTask>(
    `select t.id, t.title,
            to_char(t.due_date, 'DD Mon YYYY') as due_label,
            t.priority, t.status,
            p.name as project_name,
            (t.due_date < current_date) as overdue
       from tasks t
       join projects p on p.id = t.project_id
      where t.assignee_id = $1 and t.status <> 'Done'
      order by t.due_date
      limit 8`,
    [user.id]
  )

  const c = counts.rows[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user.name.split(' ')[0]
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const stats = [
    { label: 'Active projects', value: c.projects, href: '/projects', icon: FolderKanban, tone: 'bg-brand-50 text-brand-700' },
    { label: 'Open tasks', value: c.open_tasks, href: '/tasks', icon: ListChecks, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Overdue tasks', value: c.overdue, href: '/tasks?filter=overdue', icon: TriangleAlert, tone: c.overdue > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600' },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{today}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {greeting}, {firstName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus size={16} /> New project
          </Link>
          <Link
            href="/tasks/new"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium transition hover:border-brand-600 hover:text-brand-700"
          >
            <Plus size={16} /> New task
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, href, icon: Icon, tone }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-brand-600 hover:shadow-md"
          >
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}>
              <Icon size={20} />
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
            <div className="mt-0.5 text-sm text-muted">{label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Assigned to you</h2>
          <Link href="/tasks" className="text-sm font-medium text-brand-700 hover:underline">
            View all tasks
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white shadow-sm">
          {mine.rows.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-canvas/60 text-left text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Due</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mine.rows.map((t) => (
                  <tr key={t.id} className="border-b border-line/70 last:border-0 transition hover:bg-canvas/60">
                    <td className="px-4 py-3">
                      <Link href={`/tasks/${t.id}`} className="font-medium text-ink hover:text-brand-700">
                        {t.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{t.project_name}</td>
                    <td className={`px-4 py-3 ${t.overdue ? 'font-medium text-red-700' : 'text-muted'}`}>
                      {t.due_label}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle[t.priority] ?? ''}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[t.status] ?? ''}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
                <ClipboardList size={24} />
              </div>
              <p className="mt-4 font-medium">Nothing assigned to you yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Create a project, then add tasks to it and assign them. They will show up here.
              </p>
              <Link
                href="/projects/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                <Plus size={16} /> Create a project
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
