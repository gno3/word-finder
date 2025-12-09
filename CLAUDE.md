# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server
npm run build            # TypeScript compilation + Vite production build
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues

# Testing
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Generate coverage reports
```

For running a single test file:
```bash
npx vitest run path/to/test.test.tsx
```

## Architecture Overview

### Service Layer Pattern

The application uses a **service-first architecture** where business logic lives in service classes, not React components:

- **DictionaryService** (`src/services/DictionaryService.ts`): Manages dictionary loading, caching, validation, and word lookup with binary search. Implements an event-based system for state propagation.
- **WordFilterService** (`src/services/wordFilterService.ts`): Implements segment-based pattern matching algorithm for filtering dictionary words.

### React Integration via Hooks

Services integrate with React through custom hooks that subscribe to service events:

- **useDictionary** (`src/hooks/useDictionary.ts`): Creates a singleton DictionaryService instance, subscribes to its events (`loading-started`, `loading-completed`, `loading-failed`, etc.), and provides reactive state.
- Service events update React state, triggering re-renders only when necessary.

### Critical Architecture Patterns

1. **Event-Driven Service-to-Hook Communication**
   - Services emit events (not tied to React)
   - Hooks subscribe to service events in useEffect
   - This enables service reuse outside React and clean separation of concerns

2. **Singleton Service Pattern**
   - DictionaryService is created once per hook instance via `useRef`
   - The same instance persists across component re-renders
   - Initialization tracked via `initializationPromiseRef` to prevent duplicate loads

3. **Cache-First Loading Strategy**
   - On initialization, DictionaryService checks localStorage for valid cached data
   - If valid cache exists, loads instantly with `status: 'cached'`
   - Only fetches from network if cache is missing or invalid
   - Cache validation uses checksums and metadata timestamps

4. **Retry Logic with Exponential Backoff**
   - RetryUtils wraps fetch operations with automatic retry (max 3 attempts)
   - Delays increase exponentially: 1s → 2s → 4s (capped at 8s)
   - All retry logic is in `src/utils/retry.ts`, not scattered across services

5. **Segment-Based Word Filtering Algorithm**
   - Input: Array of `Segment` objects with `{availableLetters: string, targetLength: number}`
   - Pre-filters dictionary by total word length (optimization)
   - Splits candidate words into segments matching the length pattern
   - Validates each segment uses only available letters (frequency matters)
   - Example: `[{availableLetters: "abc", targetLength: 2}, {availableLetters: "xyz", targetLength: 2}]` matches 4-letter words like "abxy"

### TypeScript Type System

The codebase uses a comprehensive type system in `src/types/`:

- **dictionary.ts**: Core dictionary types, loading states, cache metadata, error types
- **wordFilter.ts**: Segment definitions, filter results, validation states, reset operations
- **responsive.ts**: Responsive design utilities and viewport types

All service interfaces are defined in these type files. When adding new features, define types first, then implement.

### Utility Organization

Utilities in `src/utils/` are highly specialized and single-purpose:

- **storage.ts**: localStorage operations with quota handling
- **validation.ts**: Dictionary content validation, checksums, URL validation
- **retry.ts**: Exponential backoff, retryable fetch, error wrapping
- **errorHandling.ts**: User-friendly error messages, recovery suggestions
- **wordSplitting.ts**: Word segmentation for pattern matching
- **letterValidation.ts**: Letter frequency validation for segments
- **segmentValidation.ts**: Segment constraint validation
- **inputValidation.ts**: User input normalization and validation

Each utility exports a class or pure functions. Avoid mixing concerns across utilities.

### Component Structure

Components follow a **container/presentational** pattern:

- **Container components** (`App.tsx`, `WordFilter.tsx`): Manage state via hooks, handle business logic
- **Presentational components** (`DictionaryLoadingComponents.tsx`, `FilterResults.tsx`): Receive props, render UI, emit events

The app uses **Tailwind CSS v4** for all styling. No CSS modules or styled-components.

### Testing Configuration

Tests use **Vitest** with jsdom environment. Setup file at `src/tests/setup.ts` configures:
- React Testing Library globals
- Jest DOM matchers
- Mock implementations for browser APIs (localStorage, fetch)

When writing tests:
1. Import `@testing-library/react` for component tests
2. Import `@testing-library/jest-dom` for extended matchers
3. Mock services at the service layer, not the hook layer
4. Use `vi.fn()` for mocks (Vitest, not Jest)

## Technical Stack

- **React 19.1.1** with hooks (no class components)
- **TypeScript 5.9.3** with strict mode enabled
- **Vite 7.1.7** for build/dev server
- **Tailwind CSS v4** for styling
- **Vitest 3.2.4** for testing
- **ESLint 9.36.0** with TypeScript plugin

## Performance Considerations

- **Binary search** for word lookup (O(log n)) - dictionary is sorted on load
- **Length pre-filtering** before segment matching (significant optimization)
- **LocalStorage caching** to avoid repeated network requests
- **Event-based updates** to minimize unnecessary React re-renders
- Target: <100ms word lookup, <5s dictionary loading

## Error Handling Philosophy

All errors are **typed and structured** via `DictionaryError` and `FilterError` interfaces:

- Errors include `type` (network/validation/storage/size), `message`, `retryable` flag
- User-facing messages generated via `ErrorHandlingUtils.getUserFriendlyMessage()`
- Errors propagate through service events, not thrown exceptions in hooks
- Recovery suggestions provided via `ErrorHandlingUtils.getSuggestedActions()`

Never throw raw errors from services. Always wrap in typed error objects.

## Key Constraints

From README.md "Constitutional Compliance":

- **Minimal dependencies**: Leverage browser APIs where possible
- **Type safety**: All public APIs must have TypeScript interfaces
- **Mobile-first**: Responsive design using Tailwind breakpoints (sm/md/lg/xl)
- **Offline support**: App works with cached dictionary when offline
- **Clean code**: Modular architecture, clear separation of concerns
