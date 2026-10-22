'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { signup } from './actions'
import AuthShell from '@/components/AuthShell'
import Field from '@/components/Field'
import PasswordInput from '@/components/PasswordInput'

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, undefined)

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your OpsTrack login in a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-5">
        <Field
          label="Full name"
          id="name"
          required
          autoComplete="name"
          placeholder="Your name"
          defaultValue={state?.values.name}
        />
        <Field
          label="Work email"
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@company.com"
          defaultValue={state?.values.email}
        />
        <PasswordInput
          label="Password"
          id="password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters."
        />
        <PasswordInput label="Confirm password" id="confirm" autoComplete="new-password" />

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
          {pending ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
