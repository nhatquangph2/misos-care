/**
 * Analytics Component
 * Optimized loading of third-party analytics scripts
 * Add your analytics provider here (Google Analytics, Plausible, etc.)
 */

'use client';

import Script from 'next/script';

export function Analytics() {
  // Only load analytics in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <>
      {/* Google Analytics (if enabled) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive" // Load after page is interactive
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Vercel Analytics (already built-in, but can be customized) */}
      {/* Add other analytics providers here with strategy="lazyOnload" */}
    </>
  );
}
