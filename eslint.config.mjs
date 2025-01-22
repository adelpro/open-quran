// eslint.config.js
import typescript from '@typescript-eslint/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import markdown from 'eslint-plugin-markdown';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  js.configs.recommended,
  {
    plugins: {
      prettier,
      '@typescript-eslint': typescript,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      markdown,
    },
    overrides: [
      {
        files: ['*.md'],
        processor: 'markdown/markdown', // Using markdown lint processor
        rules: {
          'markdown/markdown-format': 'warn', // Rule to enforce markdown formatting
          'markdown/first-header-h1': 'error', // Rule to ensure first header is H1
          'markdown/no-inline-html': 'warn', // Rule to disallow inline HTML
          'markdown/no-multiple-space-atx': 'error', // Rule to disallow multiple spaces after ATX style header
        },
      },
    ],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'sort-imports': 'off',
      'import/order': [
        'error',
        {
          groups: [
            ['external', 'builtin'],
            'internal',
            ['sibling', 'parent'],
            'index',
          ],
          pathGroups: [
            {
              pattern: '@(react|react-native)',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@src/**',
              group: 'internal',
            },
            {
              pattern: '@components/**',
              group: 'internal',
            },
            {
              pattern: '@utils/**',
              group: 'internal',
            },
            {
              pattern: '@types/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal', 'react'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
