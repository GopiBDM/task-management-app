// Creates a login. Usage (from the project folder):
//   node --env-file=.env.local scripts/create-user.mjs you@company.com "Your Name" YourPassword
import pg from 'pg'
import bcrypt from 'bcryptjs'

const [email, name, password] = process.argv.slice(2)
if (!email || !name || !password) {
  console.error('Usage: node --env-file=.env.local scripts/create-user.mjs <email> "<name>" <password>')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const hash = await bcrypt.hash(password, 10) // never store the plain password
await pool.query(
  'insert into users (email, name, password_hash) values ($1, $2, $3)',
  [email.toLowerCase(), name, hash]
)
console.log('User created:', email)
await pool.end()
