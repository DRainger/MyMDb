import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md w-full bg-white border border-gray-200 shadow-md rounded-lg p-6 text-center">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">משהו השתבש</h2>
      <p className="text-gray-700 mb-4">
        אירעה שגיאה בלתי צפויה. אנא רענן את הדף ונסה שוב.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
      >
        רענן דף
      </button>

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 text-left">
          <details className="text-sm text-gray-600 whitespace-pre-wrap">
            <summary className="cursor-pointer mb-2 font-medium">פרטי שגיאה (למפתחים)</summary>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-64">
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
