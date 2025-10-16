import { useState } from 'react';
import { useDictionary } from './hooks/useDictionary';
import { DictionaryStartupScreen, DictionaryErrorDisplay } from './components/DictionaryLoadingComponents';
import { ToastManager } from './components/DictionaryFeedback';
import { WordFilter } from './components/WordFilter/WordFilter';
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

  // Show startup screen during initial loading
  if (loadingState.status === 'loading' && !words) {
    return (
      <DictionaryStartupScreen
        loadingState={loadingState}
        onRetry={retry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast Manager */}
      <ToastManager toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Word Finder</h1>
                <p className="text-sm text-slate-600 mt-0.5">
                  Smart pattern-based word filtering
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
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
        <div className="card-modern p-8">
          <WordFilter />
        </div>
      </main>
    </div>
  );
}

export default App;
