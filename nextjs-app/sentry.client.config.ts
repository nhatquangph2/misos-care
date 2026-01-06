import * as Sentry from '@sentry/nextjs'

/**
 * Sentry Client-side Configuration
 * This file configures the initialization of Sentry on the client.
 */
Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay for production only
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Environment
    environment: process.env.NODE_ENV,

    // Enable React Error Boundary integration
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Ignore common non-errors
    ignoreErrors: [
        // Network errors
        'Network request failed',
        'Failed to fetch',
        'Load failed',
        // User aborts
        'AbortError',
        'cancelled',
        // Third party
        /^chrome-extension:\/\//,
        /^moz-extension:\/\//,
    ],
})
