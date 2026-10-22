'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from './actions'
import AuthShell from '@/components/AuthShell'
import Field from '@/components/Field'
import PasswordInput from '@/components/PasswordInput'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your OpsTrack account."
      footer={
        <>
          New to OpsTrack?{' '}
          <Link href="/signup" className="font-medium text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-5">
        <Field
          label="Work email"
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@company.com"
          defaultValue={state?.email}
        />
        <PasswordInput label="Password" id="password" autoComplete="current-password" />

        {state?.error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
          >
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-brand-600 py-2.5 font-medium text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 disabled:opacity-60"
        >
          {pending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
