// lib/sheets-dev.js - Development version using SQLite instead of Google Sheets
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null

/**
 * Initialize SQLite database
 */
async function getDatabase() {
  if (!db) {
    const dbPath = path.join(__dirname, '..', 'server', 'database.sqlite')
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    // Create bookings table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        age INTEGER NOT NULL,
        country TEXT NOT NULL,
        bookingType TEXT NOT NULL,
        numberOfPeople INTEGER NOT NULL,
        selectedPackage TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('✅ SQLite database initialized')
  }
  return db
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData) {
  try {
    const db = await getDatabase()
    
    const result = await db.run(`
      INSERT INTO bookings (
        fullName, email, phone, age, country, 
        bookingType, numberOfPeople, selectedPackage, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.age,
      bookingData.country,
      bookingData.bookingType,
      bookingData.numberOfPeople,
      bookingData.selectedPackage,
      'pending'
    ])
    
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', result.lastID)
    
    console.log('✅ Booking created in SQLite:', booking.id)
    return booking
  } catch (error) {
    console.error('❌ SQLite error:', error)
    throw new Error('Failed to create booking in database')
  }
}

/**
 * Get all bookings
 */
export async function getBookings(options = {}) {
  try {
    const db = await getDatabase()
    
    let query = 'SELECT * FROM bookings'
    const params = []
    
    if (options.status) {
      query += ' WHERE status = ?'
      params.push(options.status)
    }
    
    query += ' ORDER BY createdAt DESC'
    
    const bookings = await db.all(query, params)
    return bookings
  } catch (error) {
    console.error('❌ SQLite error:', error)
    throw new Error('Failed to retrieve bookings')
  }
}

/**
 * Update a booking
 */
export async function updateBooking(id, updateData) {
  try {
    const db = await getDatabase()
    
    const fields = Object.keys(updateData)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ')
    
    const values = Object.keys(updateData)
      .filter(key => key !== 'id')
      .map(key => updateData[key])
    
    values.push(new Date().toISOString(), id)
    
    await db.run(`
      UPDATE bookings 
      SET ${fields}, updatedAt = ? 
      WHERE id = ?
    `, values)
    
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', id)
    return booking
  } catch (error) {
    console.error('❌ SQLite error:', error)
    throw new Error('Failed to update booking')
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(id) {
  try {
    const db = await getDatabase()
    await db.run('DELETE FROM bookings WHERE id = ?', id)
    return { success: true }
  } catch (error) {
    console.error('❌ SQLite error:', error)
    throw new Error('Failed to delete booking')
  }
}

/**
 * Get a single booking
 */
export async function getBooking(id) {
  try {
    const db = await getDatabase()
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', id)
    return booking
  } catch (error) {
    console.error('❌ SQLite error:', error)
    throw new Error('Failed to retrieve booking')
  }
}

/**
 * Check for duplicate bookings
 */
export async function checkDuplicateBooking(email, selectedPackage) {
  try {
    const db = await getDatabase()
    const booking = await db.get(
      'SELECT * FROM bookings WHERE email = ? AND selectedPackage = ?',
      [email, selectedPackage]
    )
    return booking || null
  } catch (error) {
    console.error('❌ SQLite error:', error)
    // Return null to allow booking creation even if check fails
    return null
  }
}

/**
 * Initialize spreadsheet (no-op for SQLite)
 */
export async function initializeSpreadsheet() {
  console.log('✅ SQLite database ready')
  return { success: true }
} 