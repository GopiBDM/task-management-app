'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { pool } from '@/lib/db'
import { createSession } from '@/lib/session'

export type SignupState =
  | { error: string; values: { name: string; email: string } }
  | undefined

export async function signup(_prev: SignupState, formData: FormData): Promise<SignupState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  const values = { name, email }

  // 1. Mandatory fields and basic checks
  if (!name || !email || !password || !confirm) {
    return { error: 'Fill in all the fields.', values }
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: 'Enter a valid email address.', values }
  }

  // 2. Optional: only allow your company's email domain (set in .env.local)
  const domain = process.env.ALLOWED_EMAIL_DOMAIN?.trim().toLowerCase()
  if (domain && !email.endsWith('@' + domain)) {
    return { error: `Use your @${domain} email address.`, values }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.', values }
  }
  if (password !== confirm) {
    return { error: 'The two passwords do not match.', values }
  }

  // 3. Save the user (password is hashed, never stored as typed)
  const hash = await bcrypt.hash(password, 10)
  let userId: string
  try {
    const { rows } = await pool.query(
      'insert into users (email, name, password_hash) values ($1, $2, $3) returning id',
      [email, name, hash]
    )
    userId = rows[0].id
  } catch (err: any) {
    // 23505 = PostgreSQL's "unique violation": this email is already registered
    if (err.code === '23505') {
      return { error: 'An account with this email already exists. Try signing in.', values }
    }
    throw err
  }

  // 4. Sign them in and go to Home (redirect must stay outside try/catch)
  await createSession(userId)
  redirect('/')
}
