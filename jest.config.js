export default {
  testEnvironment: 'node',
  
  extensionsToTreatAsEsm: [],

  globals: {},
  
  transform: {},
    
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  
  collectCoverageFrom: [
    'backend/controllers/**/*.js',
    'backend/models/**/*.js', 
    'backend/routes/**/*.js',
    'backend/utils/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  setupFilesAfterEnv: ['<rootDir>/backend/tests/setup/jest.setup.js'],
  
  testTimeout: 30000,
  
  preset: null,
  
  verbose: false,
  
  testEnvironmentOptions: {
    node: {
      experimental: {
        vmModules: true
      }
    }
  }
};