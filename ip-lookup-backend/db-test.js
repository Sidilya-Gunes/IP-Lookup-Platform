require('dotenv').config()
const { Client } = require('pg')

console.log('DB URL loaded:', !!process.env.DATABASE_URL)

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

async function testDb() {
  try {
    await client.connect()
    const res = await client.query('select now()')
    console.log('DB connected:', res.rows[0])
  } catch (err) {
    console.error('DB connection error:', err.message)
  } finally {
    await client.end()
  }
}

testDb()
