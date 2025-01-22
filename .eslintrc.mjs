const config = {
  extends: [
    "next",
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    "next/core-web-vitals",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  plugins: ["import", "jsx-a11y"],
  rules: {
    "prettier/prettier": "error",
    "sort-imports": [
      "error",
      { ignoreCase: true, ignoreDeclarationSort: true },
    ],
    "import/order": [
      "error",
      {
        groups: [
          ["external", "builtin"],
          "internal",
          ["sibling", "parent"],
          "index",
        ],
        pathGroups: [
          {
            pattern: "@(react|react-native)",
            group: "external",
            position: "before",
          },
          {
            pattern: "@src/**",
            group: "internal",
          },
        ],
        pathGroupsExcludedImportTypes: ["internal", "react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};

export default config;
