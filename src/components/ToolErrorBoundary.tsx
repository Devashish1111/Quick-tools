'use client';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="qt-card border-l-4 border-l-[var(--qt-error)] p-8 my-8 max-w-2xl mx-auto flex flex-col items-center text-center animate-fade-in" style={{ background: 'rgba(255, 77, 106, 0.05)' }}>
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(255, 77, 106, 0.1)', color: 'var(--qt-error)' }}>
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--qt-error)' }}>This tool encountered a problem</h3>
      <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--qt-text-secondary)' }}>
        We caught an unexpected error while running this specific tool. The rest of the website is still working normally.
      </p>
      
      {/* Dev Mode Only Error Detail */}
      {process.env.NODE_ENV === 'development' && (
        <div className="w-full mb-6 p-4 rounded-xl text-left overflow-auto text-xs font-mono" style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--qt-error)' }}>
          <p className="font-bold mb-2">Developer Details:</p>
          {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      <button onClick={resetErrorBoundary} className="qt-btn">
        <RefreshCw className="w-4 h-4 mr-2" />
        Restart Tool
      </button>
    </div>
  );
}

export function ToolErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
