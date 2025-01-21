const config = {
  extends: ["expo", "prettier"],
  plugins: ["prettier", "import"],
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
