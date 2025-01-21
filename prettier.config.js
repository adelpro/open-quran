module.exports = {
  importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-sort-imports'],
};
