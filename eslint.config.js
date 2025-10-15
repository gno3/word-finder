import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TypeScript rules (relaxed for rapid development)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn', // Changed from error to warning
      '@typescript-eslint/explicit-function-return-type': 'off', // Disabled for convenience
      '@typescript-eslint/no-unsafe-function-type': 'off', // Disabled
      
      // React-specific rules
      'react-hooks/exhaustive-deps': 'warn',
      
      // General code quality (relaxed)
      'prefer-const': 'warn',
      'no-var': 'error',
      'no-console': 'off', // Allow console statements for debugging
    },
  },
])
