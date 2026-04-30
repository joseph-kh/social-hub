const path = require('path')

const buildExpoLintCommand = (filenames) =>
  `expo lint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildExpoLintCommand, 'prettier --write'],
  '!(*.{js,jsx,ts,tsx})': ['prettier --write --ignore-unknown'],
}
