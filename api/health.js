// api/health.js - Simple health check
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Vercel API is working',
    environment: process.env.NODE_ENV || 'development',
  })
}
