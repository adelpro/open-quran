const config = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'header-max-length': [2, 'always', 72],

    'scope-case': [2, 'always', 'lower-case'],

    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],

    'type-case': [2, 'always', 'lower-case'],

    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci',
        'hotfix',
      ],
    ],
  },
};

export default config;
