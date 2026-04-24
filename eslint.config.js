import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { useGlassDestructiveForDanger } from './eslint-rules/use-glass-destructive-for-danger.js'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'pengu': {
        rules: {
          'use-glass-destructive-for-danger': useGlassDestructiveForDanger,
        },
      },
    },
    rules: {
      'pengu/use-glass-destructive-for-danger': 'warn',
    },
  },
])
