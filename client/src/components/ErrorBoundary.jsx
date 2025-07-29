import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-primary p-4">
    <div className="max-w-md w-full bg-secondary border border-accent/20 shadow-lg rounded-xl p-6 text-center">
      <h2 className="text-2xl font-semibold text-red-400 mb-4">משהו השתבש</h2>
      <p className="text-text/70 mb-4">
        אירעה שגיאה בלתי צפויה. אנא רענן את הדף ונסה שוב.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-accent text-primary hover:bg-accentDark px-6 py-2 rounded-lg font-medium transition-colors"
      >
        רענן דף
      </button>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 text-right">
          <details className="text-sm text-text/60 whitespace-pre-wrap">
            <summary className="cursor-pointer mb-2 font-medium">פרטי שגיאה (למפתחים)</summary>
            <pre className="bg-primary/50 p-3 rounded-lg text-xs overflow-auto max-h-64 border border-accent/20">
              {error?.message}
            </pre>
          </details>
        </div>
      )}
    </div>
  </div>
)

const MyErrorBoundary = ({ children }) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error('Caught by functional ErrorBoundary:', error, info)
    }}
  >
    {children}
  </ErrorBoundary>
)

export default MyErrorBoundary
