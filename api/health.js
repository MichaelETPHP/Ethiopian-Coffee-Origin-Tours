// api/health.js - Comprehensive health check with smart database detection
import { db, initializeDatabase, getDatabaseInfo } from '../lib/db-adapter.js'

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

  const dbInfo = getDatabaseInfo()

  const healthStatus = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Ethiopian Coffee Tours API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: {
      type: dbInfo.type,
      isProduction: dbInfo.isProduction,
      hasPostgresUrl: dbInfo.hasPostgresUrl,
      usePostgres: dbInfo.usePostgres,
    },
    checks: {
      database: { status: 'unknown', message: 'Not tested' },
      email: { status: 'unknown', message: 'Not tested' },
      environment: { status: 'unknown', message: 'Not tested' },
    },
  }

  try {
    // Check environment variables
    const requiredEnvVars = ['JWT_SECRET']
    const optionalEnvVars = [
      'DATABASE_URL',
      'SMTP_HOST',
      'SMTP_USER',
      'SMTP_PASS',
    ]

    const missingRequired = requiredEnvVars.filter(
      (varName) =>
        !process.env[varName] || process.env[varName] === 'your-secret-key'
    )
    const missingOptional = optionalEnvVars.filter(
      (varName) => !process.env[varName]
    )

    if (missingRequired.length > 0) {
      healthStatus.checks.environment = {
        status: 'error',
        message: `Missing required environment variables: ${missingRequired.join(
          ', '
        )}`,
      }
      healthStatus.status = 'ERROR'
    } else if (missingOptional.length > 0) {
      healthStatus.checks.environment = {
        status: 'warning',
        message: `Missing optional environment variables: ${missingOptional.join(
          ', '
        )}`,
        details: {
          required: 'All required variables are set',
          missing: missingOptional,
        },
      }
    } else {
      healthStatus.checks.environment = {
        status: 'ok',
        message: 'All environment variables are set',
      }
    }

    // Check database connectivity
    try {
      console.log(`🔍 Testing ${dbInfo.type} database connection...`)

      // Try to initialize database
      await initializeDatabase()
      console.log(`✅ ${dbInfo.type} database initialization successful`)

      // Test a simple query and health check
      const healthResult = await db.healthCheck()
      console.log(`✅ ${dbInfo.type} health check successful`)

      healthStatus.checks.database = {
        status: 'ok',
        message: `${dbInfo.type} database connection successful`,
        details: {
          type: dbInfo.type,
          connection: healthResult.connection,
          timestamp: healthResult.timestamp,
          environment: dbInfo.isProduction ? 'production' : 'development',
        },
      }
    } catch (dbError) {
      console.error(`❌ ${dbInfo.type} database check failed:`, dbError)
      healthStatus.checks.database = {
        status: 'error',
        message: `${dbInfo.type} database connection failed`,
        details: {
          type: dbInfo.type,
          error: dbError.message,
          code: dbError.code,
        },
      }
      healthStatus.status = 'ERROR'
    }

    // Check email configuration
    const emailConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: !!process.env.SMTP_PASS,
    }

    if (
      emailConfig.host &&
      emailConfig.port &&
      emailConfig.user &&
      emailConfig.hasPassword
    ) {
      healthStatus.checks.email = {
        status: 'ok',
        message: 'Email configuration is set',
        details: {
          host: emailConfig.host,
          port: emailConfig.port,
          user: emailConfig.user,
        },
      }
    } else {
      healthStatus.checks.email = {
        status: 'warning',
        message: 'Email configuration incomplete',
        details: {
          missing: Object.entries(emailConfig)
            .filter(([key, value]) => !value)
            .map(([key]) => key),
        },
      }
    }

    // Determine overall status
    const errorChecks = Object.values(healthStatus.checks).filter(
      (check) => check.status === 'error'
    )
    const warningChecks = Object.values(healthStatus.checks).filter(
      (check) => check.status === 'warning'
    )

    if (errorChecks.length > 0) {
      healthStatus.status = 'ERROR'
    } else if (warningChecks.length > 0) {
      healthStatus.status = 'WARNING'
    } else {
      healthStatus.status = 'OK'
    }

    // Return appropriate status code
    const statusCode =
      healthStatus.status === 'OK'
        ? 200
        : healthStatus.status === 'WARNING'
        ? 200
        : 503

    res.status(statusCode).json(healthStatus)
  } catch (error) {
    console.error('❌ Health check failed:', error)

    healthStatus.status = 'ERROR'
    healthStatus.error = 'Health check failed'
    healthStatus.details =
      process.env.NODE_ENV === 'development' ? error.message : undefined

    res.status(503).json(healthStatus)
  }
}
