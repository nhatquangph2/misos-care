import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Server-side Configuration
 * This file configures the initialization of Sentry on the server.
 */
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Environment
    environment: process.env.NODE_ENV,

    // Ignore common non-errors
    ignoreErrors: [
        'NEXT_NOT_FOUND',
        'NEXT_REDIRECT',
    ],
})
