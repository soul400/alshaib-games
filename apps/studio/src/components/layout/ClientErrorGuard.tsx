'use client';

import { useEffect } from 'react';

/**
 * 🛡️ ClientErrorGuard
 * Intercepts unhandled DOM Event rejections (e.g. HTML5 Audio aborts, WebSocket disconnects,
 * Image network blips) that would otherwise cause Next.js dev overlay to pop up with '[object Event]'.
 */
export function ClientErrorGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason instanceof Event || 
        (reason && typeof reason === 'object' && (reason.toString?.() === '[object Event]' || 'isTrusted' in reason))
      ) {
        event.preventDefault();
        console.warn('🛡️ ClientErrorGuard: Safely intercepted unhandled DOM Event rejection.');
      }
    };

    const handleError = (event: ErrorEvent) => {
      const err = event.error;
      if (
        err instanceof Event ||
        (err && typeof err === 'object' && (err.toString?.() === '[object Event]' || 'isTrusted' in err))
      ) {
        event.preventDefault();
        console.warn('🛡️ ClientErrorGuard: Safely intercepted unhandled DOM Error event.');
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
