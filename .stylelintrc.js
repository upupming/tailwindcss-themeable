module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  ignoreFiles: [
    // avoid conflict with prettier
    '**/*.html'
  ]
}
