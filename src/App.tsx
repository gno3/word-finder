import React, { useState } from 'react';
import { useDictionary } from './hooks/useDictionary';
import { DictionaryStartupScreen, DictionaryStatus, DictionaryErrorDisplay } from './components/DictionaryLoadingComponents';
import { ToastManager } from './components/DictionaryFeedback';
import type { ToastMessage } from './components/DictionaryFeedback';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const {
    words,
    loadingState,
    isLoading,
    isReady,
    hasError,
    hasWord,
    refresh,
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

  // Handle word search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const found = hasWord(searchTerm.trim());
    addToast(
      found 
        ? `"${searchTerm}" is a valid word!` 
        : `"${searchTerm}" was not found in the dictionary.`,
      found ? 'success' : 'error'
    );
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
    <div className="min-h-screen bg-gray-50">
      {/* Toast Manager */}
      <ToastManager toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Word Finder</h1>
              <p className="text-sm text-gray-600 mt-1">
                Search and validate words in our dictionary
              </p>
            </div>
            <DictionaryStatus
              loadingState={loadingState}
              wordCount={words?.length}
              variant="compact"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dictionary Status Card */}
        {hasError && loadingState.error && (
          <div className="mb-6">
            <DictionaryErrorDisplay
              error={loadingState.error}
              onRetry={retry}
              onDismiss={() => addToast('Error dismissed', 'info')}
              showDetails={true}
            />
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Word Search
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a word to check:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type a word..."
                  disabled={!isReady}
                />
                <button
                  type="submit"
                  disabled={!isReady || !searchTerm.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Search Status */}
          {!isReady && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {isLoading 
                  ? 'Dictionary is loading... Please wait to search words.' 
                  : 'Dictionary is not available. Please refresh the page.'}
              </p>
            </div>
          )}
        </div>

        {/* Dictionary Info */}
        {isReady && words && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dictionary Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {words.length.toLocaleString()}
                </div>
                <div className="text-sm text-blue-800">Total Words</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {loadingState.status === 'cached' ? 'Cached' : 'Fresh'}
                </div>
                <div className="text-sm text-green-800">Data Source</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {loadingState.lastAttempt > 0 
                    ? new Date(loadingState.lastAttempt).toLocaleDateString()
                    : 'Unknown'}
                </div>
                <div className="text-sm text-purple-800">Last Updated</div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  refresh();
                  addToast('Refreshing dictionary...', 'info');
                }}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
              >
                Refresh Dictionary
              </button>
            </div>
          </div>
        )}

        {/* Sample Words */}
        {isReady && words && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Sample Words
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {words.slice(0, 12).map((word, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(word);
                    addToast(`"${word}" is a valid word!`, 'success');
                  }}
                  className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-left"
                >
                  {word}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Click any word to test the search functionality
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
