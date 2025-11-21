const neostandard = require('neostandard');
const { resolveIgnoresFromGitignore } = neostandard;

// From ESLint v9.0.0, the default configuration file is now eslint.config.js.
module.exports = neostandard({
  noStyle: true, // Disable style rules to avoid conflicts with Prettier (default: false)
  semi: true, // Enable semicolons to avoid conflicts with Prettier (default: false)
  ignores: resolveIgnoresFromGitignore(), // Ignore node_modules directory (default: []), replacement for .eslintignore
});
