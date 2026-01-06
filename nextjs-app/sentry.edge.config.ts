import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Edge Configuration
 * This file configures the initialization of Sentry for edge features (middleware, edge routes, etc).
 */
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Environment
    environment: process.env.NODE_ENV,
})
