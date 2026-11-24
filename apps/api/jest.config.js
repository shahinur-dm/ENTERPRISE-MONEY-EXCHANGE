module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@erp/types$': '<rootDir>/../../packages/types/src',
    '^@erp/types/(.*)$': '<rootDir>/../../packages/types/src/$1',
    '^@erp/shared$': '<rootDir>/../../packages/shared/src',
    '^@erp/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
};
