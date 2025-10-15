import React, { useState } from 'react';
import { DictionaryLogger } from '../utils/logging';
import type { LoadingState } from '../types/dictionary';

interface DictionaryDebugPanelProps {
  loadingState: LoadingState;
  wordCount?: number;
  className?: string;
}

/**
 * Debug panel for dictionary development and troubleshooting
 */
export const DictionaryDebugPanel: React.FC<DictionaryDebugPanelProps> = ({
  loadingState,
  wordCount,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'state' | 'logs' | 'performance'>('state');

  const logger = DictionaryLogger.getInstance();
  const logs = logger.getLogs({ limit: 50 });
  const stats = logger.getStats();

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <div className={`fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div 
        className="p-3 bg-gray-100 rounded-t-lg cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Dictionary Debug</span>
          <span className={`w-2 h-2 rounded-full ${
            loadingState.status === 'loaded' || loadingState.status === 'cached' 
              ? 'bg-green-500' 
              : loadingState.status === 'error' 
                ? 'bg-red-500' 
                : 'bg-yellow-500'
          }`}></span>
        </div>
        <span className="text-xs text-gray-500">
          {isExpanded ? '−' : '+'}
        </span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="w-80 max-h-96 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {['state', 'logs', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-2 text-xs font-medium capitalize ${
                  activeTab === tab 
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {activeTab === 'state' && (
              <div className="space-y-2 text-xs">
                <div><strong>Status:</strong> {loadingState.status}</div>
                <div><strong>Words:</strong> {wordCount?.toLocaleString() || 'N/A'}</div>
                <div><strong>Progress:</strong> {loadingState.progress || 0}%</div>
                <div><strong>Retries:</strong> {loadingState.retryCount}</div>
                <div><strong>Last Attempt:</strong> {
                  loadingState.lastAttempt 
                    ? new Date(loadingState.lastAttempt).toLocaleTimeString()
                    : 'Never'
                }</div>
                {loadingState.error && (
                  <div>
                    <strong>Error:</strong> 
                    <div className="text-red-600 mt-1">{loadingState.error.message}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-1">
                <div className="text-xs text-gray-500 mb-2">
                  Recent logs ({logs.length})
                </div>
                {logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="text-xs p-2 bg-gray-50 rounded">
                    <div className="flex justify-between items-start">
                      <span className={`font-medium ${
                        log.level === 'error' ? 'text-red-600' : 
                        log.level === 'warn' ? 'text-yellow-600' : 
                        'text-blue-600'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-1">{log.message}</div>
                  </div>
                ))}
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => {
                      const exported = logger.exportLogs();
                      const blob = new Blob([exported], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `dictionary-logs-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => logger.clearLogs()}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-2 text-xs">
                <div><strong>Total Logs:</strong> {stats.totalLogs}</div>
                <div><strong>Errors:</strong> {stats.errorCount}</div>
                <div><strong>Warnings:</strong> {stats.warningCount}</div>
                <div><strong>Performance Issues:</strong> {stats.performanceIssues}</div>
                <div><strong>Memory:</strong> {
                  (performance as any).memory ? 
                    `${Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)}MB` : 
                    'N/A'
                }</div>
                <div><strong>Cache Size:</strong> {
                  (() => {
                    try {
                      const data = localStorage.getItem('word-finder:dictionary:data');
                      return data ? `${Math.round(data.length / 1024)}KB` : 'N/A';
                    } catch {
                      return 'N/A';
                    }
                  })()
                }</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};