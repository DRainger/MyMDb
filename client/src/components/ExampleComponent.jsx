import React, { useState } from 'react'
import Loading, { PageLoading, CardLoading, SkeletonLoading } from './Loading'

const ExampleComponent = () => {
  const [loadingType, setLoadingType] = useState('none')

  const simulateLoading = (type) => {
    setLoadingType(type)
    setTimeout(() => setLoadingType('none'), 2000)
  }

  return (
    <div className="min-h-screen bg-primary text-text p-6">
      <div className="main-container">
        <h1 className="text-3xl font-bold text-accent mb-8">דוגמאות לשימוש ב-Loading</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Loading */}
          <div className="bg-secondary rounded-xl p-6 shadow-lg border border-accent/20">
            <h3 className="text-lg font-semibold mb-4 text-accent">Loading בסיסי</h3>
            <div className="space-y-4">
              <Loading size="small" text="טוען..." />
              <Loading size="medium" text="טוען..." />
              <Loading size="large" text="טוען..." />
            </div>
          </div>

          {/* Loading Variants */}
          <div className="bg-secondary rounded-xl p-6 shadow-lg border border-accent/20">
            <h3 className="text-lg font-semibold mb-4 text-accent">סוגי Loading</h3>
            <div className="space-y-4">
              <Loading variant="spinner" text="Spinner" />
              <Loading variant="dots" text="Dots" />
              <Loading variant="pulse" text="Pulse" />
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="bg-secondary rounded-xl p-6 shadow-lg border border-accent/20">
            <h3 className="text-lg font-semibold mb-4 text-accent">דוגמאות אינטראקטיביות</h3>
            <div className="space-y-3">
              <button 
                onClick={() => simulateLoading('page')}
                className="w-full bg-accent text-primary hover:bg-accentDark px-4 py-2 rounded-lg font-medium transition-colors"
              >
                הדגם Page Loading
              </button>
              <button 
                onClick={() => simulateLoading('card')}
                className="w-full bg-secondary border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                הדגם Card Loading
              </button>
              <button 
                onClick={() => simulateLoading('skeleton')}
                className="w-full bg-secondary border border-accent text-accent hover:bg-accent hover:text-primary px-4 py-2 rounded-lg font-medium transition-colors"
              >
                הדגם Skeleton Loading
              </button>
            </div>
          </div>
        </div>

        {/* Loading Examples */}
        {loadingType === 'page' && <PageLoading text="טוען דף..." />}
        {loadingType === 'card' && <CardLoading text="טוען כרטיס..." />}
        {loadingType === 'skeleton' && <SkeletonLoading />}

        {/* Usage Instructions */}
        <div className="mt-8 bg-secondary rounded-xl p-6 shadow-lg border border-accent/20">
          <h3 className="text-lg font-semibold mb-4 text-accent">הוראות שימוש</h3>
          <div className="space-y-2 text-text/70 text-sm">
            <p><strong>Loading בסיסי:</strong> &lt;Loading size="medium" text="טוען..." /&gt;</p>
            <p><strong>Page Loading:</strong> &lt;PageLoading text="טוען דף..." /&gt;</p>
            <p><strong>Card Loading:</strong> &lt;CardLoading text="טוען..." /&gt;</p>
            <p><strong>Skeleton Loading:</strong> &lt;SkeletonLoading /&gt;</p>
            <p><strong>Button Loading:</strong> &lt;ButtonLoading text="טוען..." /&gt;</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExampleComponent
