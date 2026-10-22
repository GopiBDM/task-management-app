import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'opstrack_session'

const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET)

// A signed token that says "this browser is user <id>". It expires in 7 days.
export async function signToken(userId: string) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

// Returns the user id if the token is genuine and not expired, otherwise null.
export async function verifyToken(token?: string) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret())
    return (payload.sub as string) ?? null
  } catch {
    return null
  }
}
