const config = {
  semi: false,
  singleQuote: true,
  printWidth: 80,
  trailingComma: "es5",
  endOfLine: "auto",
  tabWidth: 2,
  sortingMethod: "lineLength",
  importOrder: ["^@core/(.*)$", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-sort-imports"],
};

export default config;
