// api/admin/bookings/index.js - GET /api/admin/bookings
import { getPool } from '../../../utils/db.js'
import { authenticateAdmin, setCorsHeaders, handleOptions } from '../../../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authResult = await authenticateAdmin(req)
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error })
  }

  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = req.query
    
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM bookings WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
    const params = []
    const countParams = []

    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
      countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
      countParams.push(searchParam, searchParam, searchParam)
    }

    if (status) {
      query += ' AND status = ?'
      countQuery += ' AND status = ?'
      params.push(status)
      countParams.push(status)
    }

    if (packageFilter) {
      query += ' AND selected_package LIKE ?'
      countQuery += ' AND selected_package LIKE ?'
      params.push(`%${packageFilter}%`)
      countParams.push(`%${packageFilter}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const connection = await getPool().getConnection()
    const [bookings] = await connection.execute(query, params)
    const [countResult] = await connection.execute(countQuery, countParams)
    connection.release()

    res.json({
      bookings,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit),
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// api/admin/bookings/[id].js - PATCH /api/admin/bookings/:id
import { getPool } from '../../../utils/db.js'
import { authenticateAdmin, setCorsHeaders, handleOptions } from '../../../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authResult = await authenticateAdmin(req)
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error })
  }

  try {
    const { id } = req.query
    const { status, notes } = req.body

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const connection = await getPool().getConnection()

    await connection.execute(
      'UPDATE bookings SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, notes || null, id]
    )

    connection.release()

    res.json({ message: 'Booking updated successfully' })
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// api/admin/bookings/export.js - GET /api/admin/bookings/export
import { getPool } from '../../../utils/db.js'
import { authenticateAdmin, setCorsHeaders, handleOptions } from '../../../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authResult = await authenticateAdmin(req)
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error })
  }

  try {
    const connection = await getPool().getConnection()

    const [bookings] = await connection.execute(`
      SELECT 
        id, full_name, email, phone, country, age, booking_type, 
        number_of_people, selected_package, status, created_at
      FROM bookings 
      ORDER BY created_at DESC
    `)

    connection.release()

    // Generate CSV
    const headers = [
      'ID', 'Full Name', 'Email', 'Phone', 'Country', 'Age', 
      'Booking Type', 'Number of People', 'Selected Package', 'Status', 'Created At'
    ]

    let csv = headers.join(',') + '\n'

    bookings.forEach((booking) => {
      const row = [
        booking.id,
        `"${booking.full_name}"`,
        booking.email,
        `"${booking.phone}"`,
        `"${booking.country}"`,
        booking.age,
        booking.booking_type,
        booking.number_of_people,
        `"${booking.selected_package}"`,
        booking.status,
        booking.created_at.toISOString(),
      ]
      csv += row.join(',') + '\n'
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv')
    res.send(csv)
  } catch (error) {
    console.error('Export bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}