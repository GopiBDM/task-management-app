import { cookies } from 'next/headers'
import { cache } from 'react'
import { pool } from './db'
import { SESSION_COOKIE, signToken, verifyToken } from './jwt'

export async function createSession(userId: string) {
  const token = await signToken(userId)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript in the browser cannot read it
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function deleteSession() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

// Who is signed in right now? Returns null if nobody.
export const getCurrentUser = cache(async () => {
  const store = await cookies()
  const userId = await verifyToken(store.get(SESSION_COOKIE)?.value)
  if (!userId) return null

  const { rows } = await pool.query(
    'select id, email, name from users where id = $1',
    [userId]
  )
  return (rows[0] as { id: string; email: string; name: string }) ?? null
})
