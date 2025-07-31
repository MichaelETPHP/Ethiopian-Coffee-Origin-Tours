// lib/config.js - Centralized configuration for production
export const config = {
  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    pool: {
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    },
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
    algorithm: 'HS256',
  },

  // Email configuration
  email: {
    host: process.env.SMTP_HOST || 'mail.ehiopiancoffeeorgintrip.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_PORT == '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'hello@ehiopiancoffeeorgintrip.com',
      pass: process.env.SMTP_PASS || 'j7YEMnZDS0h$1p5C',
    },
    from: {
      name: 'Ethiopian Coffee Origin Tours',
      address: process.env.SMTP_USER || 'hello@ehiopiancoffeeorgintrip.com',
    },
    admin: {
      email: 'hello@ehiopiancoffeeorgintrip.com',
      name: 'Admin',
    },
    // Timeout settings for production
    connectionTimeout: 30000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
    // TLS settings for cPanel
    tls: {
      rejectUnauthorized: false,
      servername: 'ehiopiancoffeeorgintrip.com',
    },
    // Pool settings
    pool: true,
    maxConnections: 1,
    maxMessages: 1,
    requireTLS: true,
  },

  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin:
        process.env.NODE_ENV === 'production'
          ? [
              'https://ehiopiancoffeeorgintrip.com',
              'https://www.ehiopiancoffeeorgintrip.com',
            ]
          : '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'X-CSRF-Token',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Content-Type',
        'Date',
        'X-Api-Version',
        'Authorization',
      ],
    },
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Security settings
  security: {
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Application settings
  app: {
    name: 'Ethiopian Coffee Origin Tours',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    frontendUrl:
      process.env.FRONTEND_URL || 'https://ehiopiancoffeeorgintrip.com',
    supportEmail: 'hello@ehiopiancoffeeorgintrip.com',
  },

  // Validation settings
  validation: {
    booking: {
      nameMinLength: 2,
      nameMaxLength: 100,
      ageMin: 18,
      ageMax: 100,
      phoneMinLength: 10,
      phoneMaxLength: 20,
      countryMinLength: 2,
      countryMaxLength: 100,
    },
  },
}

// Validate required environment variables
export function validateConfig() {
  const required = [
    { key: 'DATABASE_URL', value: config.database.url },
    { key: 'JWT_SECRET', value: config.jwt.secret },
    { key: 'SMTP_HOST', value: config.email.host },
    { key: 'SMTP_USER', value: config.email.auth.user },
    { key: 'SMTP_PASS', value: config.email.auth.pass },
  ]

  const missing = required.filter(
    ({ value }) => !value || value === 'your-secret-key'
  )

  if (missing.length > 0) {
    const missingKeys = missing.map(({ key }) => key).join(', ')
    throw new Error(`Missing required environment variables: ${missingKeys}`)
  }

  return true
}

export default config
