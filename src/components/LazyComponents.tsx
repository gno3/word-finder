import { lazy } from 'react';

/**
 * Lazy-loaded components for better performance
 */

// Lazy load dictionary components that aren't needed immediately
export const DictionaryStatsCard = lazy(() => 
  import('./DictionaryFeedback').then(module => ({ 
    default: module.DictionaryStatsCard 
  }))
);

export const DictionaryErrorDisplay = lazy(() => 
  import('./DictionaryLoadingComponents').then(module => ({ 
    default: module.DictionaryErrorDisplay 
  }))
);

// Lazy load heavy utility components
export const DictionaryDebugPanel = lazy(() => 
  import('./DictionaryDebugPanel').then(module => ({ 
    default: module.DictionaryDebugPanel 
  }))
);