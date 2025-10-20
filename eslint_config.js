const neostandard = require('neostandard');
const { resolveIgnoresFromGitignore } = neostandard;

module.exports = {
    noStyle: true, // Disable style rules avoiding conflicts with Prettier (default: false)
    semi: true,    // Enable semicolons to avoid conflicts with Prettier (default: false)
    ignores: resolveIgnoresFromGitignore() // Ignore files specified in .gitignore
}