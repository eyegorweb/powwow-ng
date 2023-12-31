module.exports = {
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['<rootDir>/src/**/*.js', '<rootDir>/src/**/*.vue'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/main.js',
    '<rootDir>/src/router.js',
    '<rootDir>/src/util.js',
    '<rootDir>/src/App.vue',
    '<rootDir>/src/store/index.js',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/src/**/*.spec.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
};
