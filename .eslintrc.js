const prodRules = {
  'prettier/prettier': 'error',
  'no-throw-literal': 'error',
}

const devRules = {
  ...prodRules,
  'prettier/prettier': ['error', {bracketSpacing: false}],
  'no-unused-vars': 'off',
  'vue/no-unused-components': 'off',
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
  rules: devRules,
}
