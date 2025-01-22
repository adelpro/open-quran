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
  plugins: ["import", "jsx-a11y", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "error",  
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn", 
    "sort-imports": "off",
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
          {
            pattern: "@components/**",
            group: "internal",
          },
          {
            pattern: "@utils/**",
            group: "internal",
          },
          {
            pattern: "@types/**",
            group: "internal",
          }
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
