module.exports = {
  extends: ["@commitlint/config-conventional"],
  ignores: [commit => /^init: .+/.test(commit)],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'bug',
        'fix',
        'ui',
        'ci',
        'docs',
        'style',
        'perf',
        'release',
        'refactor',
        'test',
        'chore',
        'revert',
        'merge',
        'build'
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'body-leading-blank': [1, 'always'],
    'header-max-length': [0, 'always', 72]
  },
};
