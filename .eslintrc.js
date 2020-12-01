module.exports = {
  extends: [
    'airbnb'
  ],
  rules: {
    'import/no-unresolved': 0
  },
  overrides: [{
    files: ["lib/*.js"],
    rules: {
      "import/no-extraneous-dependencies": 0,
      "no-restricted-syntax": 0,
      "no-await-in-loop": 0,
      "no-continue": 0,
      "no-underscore-dangle": 0,
      "class-methods-use-this": 0,
    }
  }]
};
