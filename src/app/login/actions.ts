'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { pool } from '@/lib/db'
import { createSession } from '@/lib/session'

// `email` is sent back on errors so the form can keep what you typed.
export type LoginState = { error: string; email?: string } | undefined

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Enter your email and password.', email }
  }

  const { rows } = await pool.query(
    'select id, password_hash from users where email = $1',
    [email]
  )
  const user = rows[0]
  const passwordOk = user && (await bcrypt.compare(password, user.password_hash))

  // Same message for both cases, so nobody can probe which emails exist.
  if (!passwordOk) {
    return { error: 'Email or password is incorrect.', email }
  }

  await createSession(user.id)
  redirect('/')
}
