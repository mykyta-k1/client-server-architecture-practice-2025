const neostandard = require('neostandard');
const { resolveIgnoresFromGitignore } = neostandard;
const babelParser = require('@babel/eslint-parser');
const importPlugin = require('eslint-plugin-import');

// Get base conf from neostandard
const neostandardConfig = neostandard({
  noStyle: true,
  semi: true,
  ignores: resolveIgnoresFromGitignore(),
});

module.exports = [
  ...neostandardConfig, // Unpack base conf
  {
    // Custom settings
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: true,
        sourceType: 'commonjs',
      },
      globals: {
        httpError: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js'],
        },
      },
    },
  },
];
