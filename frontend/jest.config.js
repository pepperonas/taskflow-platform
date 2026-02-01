module.exports = {
  // Use jsdom test environment for React tests
  testEnvironment: 'jsdom',
  // Ensure Jest globals (describe, it, expect, jest) are available
  injectGlobals: true,
  // Setup files that run BEFORE test environment
  setupFiles: ['<rootDir>/src/testSetupBeforeEnv.ts'],
  // Setup files that run AFTER test environment (for DOM matchers etc.)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.test.json',
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  // Transform axios and other ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(axios|@bundled-es-modules)/)',
  ],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  // Ignore E2E test directory
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/workflows/**', // Vue components
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};
