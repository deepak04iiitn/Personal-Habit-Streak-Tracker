export default {
  testEnvironment: 'node',
  
  // Enable ES modules support
  extensionsToTreatAsEsm: [],

  globals: {},
  
  // Transform for ES modules
  transform: {},
  
  // Test file patterns  
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'backend/controllers/**/*.js',
    'backend/models/**/*.js', 
    'backend/routes/**/*.js',
    'backend/utils/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/backend/tests/setup/jest.setup.js'],
  
  // Increase timeout for database operations
  testTimeout: 30000,
  
  // Handle ES modules properly
  preset: null,
  
  // Suppress experimental VM modules warning
  verbose: false,
  
  // Handle dynamic imports
  testEnvironmentOptions: {
    node: {
      experimental: {
        vmModules: true
      }
    }
  }
};