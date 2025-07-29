import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
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
                    {this.state.error?.message}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
