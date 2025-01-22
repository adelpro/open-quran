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
    rules: {
      // Prettier integration
      'prettier/prettier': 'error',

      // TypeScript-specific rules
      '@typescript-eslint/no-explicit-any': 'error',

      // React hooks best practices
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Markdown linting rules
      'markdown/first-header-h1': 'error', // Rule to ensure first header is H1
      'markdown/no-inline-html': 'warn', // Rule to disallow inline HTML
      'markdown/no-multiple-space-atx': 'error', // Rule to disallow multiple spaces after ATX style header
      'markdown/no-multiple-space-blockquote': 'error', // Rule to disallow multiple spaces after blockquote
      'markdownlint/md001': 'off',
      'markdownlint/md003': 'warn',
      'markdownlint/md025': [
        'error',
        {
          level: 2,
        },
      ],

      // Sort imports with enhanced rules
      'sort-imports': 'off', // Disabled to avoid conflict with import/order
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'], // External libraries
            'internal', // Internal modules
            ['sibling', 'parent'], // Sibling and parent
            'index', // Index files
          ],
          pathGroups: [
            {
              pattern: '^react',
              group: 'builtin',
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
          ],
          pathGroupsExcludedImportTypes: ['internal'],
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
