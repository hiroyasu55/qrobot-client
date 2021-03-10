const prodRules = {
  'prettier/prettier': 'off',
  'no-throw-literal': 'error',
}

const devRules = {
  ...prodRules,
  'no-unused-vars': 'off',
  'vue/no-unused-components': 'off',
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [],
  rules: devRules,
}
