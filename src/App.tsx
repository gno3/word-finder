import { useState } from 'react';
import { useDictionary } from './hooks/useDictionary';
import { DictionaryStartupScreen, DictionaryErrorDisplay } from './components/DictionaryLoadingComponents';
import { ToastManager } from './components/DictionaryFeedback';
import { WordFilter } from './components/WordFilter/WordFilter';
import { LoadingProvider, LoadingOverlay, ProgressIndicator } from './components/EnhancedLoadingComponents';

import type { ToastMessage } from './components/DictionaryFeedback';
import './App.css';

function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const {
    words,
    loadingState,
    hasError,
    retry
  } = useDictionary();

  // Handle toast notifications
  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Show enhanced startup screen during initial loading
  if (loadingState.status === 'loading' && !words) {
    return (
      <LoadingProvider>
        <DictionaryStartupScreen
          loadingState={loadingState}
          onRetry={retry}
        />
        {/* Enhanced progress overlay for dictionary loading */}
        {loadingState.progress && loadingState.progress > 0 && (
          <LoadingOverlay
            isVisible={true}
            message="Loading Dictionary"
            progress={loadingState.progress}
            showProgress={true}
            variant="fullscreen"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl text-white">📚</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Loading Dictionary</h2>
              <ProgressIndicator
                value={loadingState.progress}
                label="Download Progress"
                showPercentage={true}
                variant="linear"
                size="md"
                color="primary"
                className="mb-4"
              />
              <p className="text-gray-600">Preparing word database for filtering...</p>
            </div>
          </LoadingOverlay>
        )}
      </LoadingProvider>
    );
  }

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-slate-50">
      {/* Toast Manager */}
      <ToastManager toasts={toasts} onDismiss={removeToast} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-1 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Dictionary Status Card */}
        {hasError && loadingState.error && (
          <div className="mb-8">
            <DictionaryErrorDisplay
              error={loadingState.error}
              onRetry={retry}
              onDismiss={() => addToast('Error dismissed', 'info')}
              showDetails={true}
            />
          </div>
        )}

        {/* Word Filter */}
        <div className="card-modern px-2 py-3 sm:p-6 md:p-8">
          <WordFilter />
        </div>
      </main>
    </div>
    </LoadingProvider>
  );
}

export default App;
