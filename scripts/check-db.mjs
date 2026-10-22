import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
})
try {
  const r = await pool.query('select count(*)::int as users from users')
  console.log('Connected. Users in table:', r.rows[0].users)
} catch (e) {
  console.error('FAILED:', e.code, e.message)
}
await pool.end()