const config = {
  semi: true,
  useTabs: false,
  bracketSameLine: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  printWidth: 80,
  trailingComma: 'es5',
  endOfLine: 'auto',
  tabWidth: 2,
  sortingMethod: 'lineLength',
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-sort-imports'],
  /*   importOrder: [
    '^react', // React imports first
    '^@?(react|react-native)', // External libraries
    '<THIRD_PARTY_MODULES>', // Other third-party modules
    '^@src/(.*)$', // Internal imports (example: @src)
    '^@components/(.*)$',
    '^@utils/(.*)$',
    '^\\./', // Relative imports
    '^\\../', // Parent imports
    '^.+\\.s?css$', // Style imports last
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true, */
};

export default config;
