'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js caught an error:', error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--qt-bg)', color: 'var(--qt-text)' }}>
      <div className="mb-6 p-4 rounded-full" style={{ background: 'rgba(255, 77, 106, 0.1)', color: 'var(--qt-error)' }}>
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-display font-black mb-4">Something went wrong!</h2>
      <p className="text-lg mb-8 max-w-md" style={{ color: 'var(--qt-text-secondary)' }}>
        We encountered an unexpected error. This might be caused by a browser extension interfering with the page.
      </p>
      <div className="flex gap-4">
        <button
          className="qt-btn"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link href="/" className="qt-btn-secondary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
