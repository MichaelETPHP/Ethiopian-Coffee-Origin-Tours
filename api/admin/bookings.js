// api/admin/bookings.js
import pg from 'pg'

const { Pool } = pg

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Simple token check (replace with proper JWT verification later)
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token || !token.startsWith('simple-token-')) {
    return res
      .status(401)
      .json({ error: 'Access denied. No valid token provided.' })
  }

  try {
    console.log('Connecting to database...')
    const client = await pool.connect()

    try {
      // Get query parameters
      const {
        page = 1,
        limit = 50,
        search = '',
        status = '',
        package: packageFilter = '',
      } = req.query

      const offset = (page - 1) * limit

      // Build query
      let query = 'SELECT * FROM bookings WHERE 1=1'
      let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
      const params = []
      const countParams = []
      let paramIndex = 1

      // Add search filter
      if (search) {
        query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
          paramIndex + 1
        } OR phone ILIKE $${paramIndex + 2})`
        countQuery += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
          paramIndex + 1
        } OR phone ILIKE $${paramIndex + 2})`
        const searchParam = `%${search}%`
        params.push(searchParam, searchParam, searchParam)
        countParams.push(searchParam, searchParam, searchParam)
        paramIndex += 3
      }

      // Add status filter
      if (status) {
        query += ` AND status = $${paramIndex}`
        countQuery += ` AND status = $${paramIndex}`
        params.push(status)
        countParams.push(status)
        paramIndex += 1
      }

      // Add package filter
      if (packageFilter) {
        query += ` AND selected_package ILIKE $${paramIndex}`
        countQuery += ` AND selected_package ILIKE $${paramIndex}`
        params.push(`%${packageFilter}%`)
        countParams.push(`%${packageFilter}%`)
        paramIndex += 1
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
        paramIndex + 1
      }`
      params.push(parseInt(limit), parseInt(offset))

      console.log('Executing query:', query)
      console.log('With params:', params)

      // Execute queries
      const [bookingsResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, countParams),
      ])

      console.log('Query results:', {
        bookingsCount: bookingsResult.rows.length,
        totalCount: countResult.rows[0]?.total || 0,
      })

      // Return results
      res.status(200).json({
        bookings: bookingsResult.rows,
        total: parseInt(countResult.rows[0]?.total || 0),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((countResult.rows[0]?.total || 0) / limit),
      })
    } catch (queryError) {
      console.error('Database query error:', queryError)
      res.status(500).json({
        error: 'Database query failed',
        details: queryError.message,
      })
    } finally {
      client.release()
    }
  } catch (connectionError) {
    console.error('Database connection error:', connectionError)
    res.status(500).json({
      error: 'Database connection failed',
      details: connectionError.message,
    })
  }
}
