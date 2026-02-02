# Q-Ease Backend Testing Guide

This document explains how to run tests for the Q-Ease backend API.

## Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and the database is set up
2. **Environment Variables**: Configure `.env` file in the backend directory
3. **Dependencies**: Install all required npm packages

## Running Tests

### 1. Unit Tests with Jest

#### Run all tests:
```bash
cd backend
npm test
```

#### Run tests in watch mode (during development):
```bash
npm run test:watch
```

#### Run tests with coverage report:
```bash
npm run test:coverage
```

#### Run specific test files:
```bash
npx jest __tests__/unit/utils/helpers.test.js
```

#### Run tests with specific pattern:
```bash
npx jest --testNamePattern="Helper Functions"
```

#### Run all tests (may require database setup):
```bash
npm test
```

### 2. Postman API Testing

#### Setup Instructions:

1. **Import Collection**:
   - Open Postman
   - Click "Import" 
   - Select `docs/api/postman/Q-Ease_API_Collection.json`

2. **Import Environment**:
   - In Postman, click the "Environment" dropdown
   - Click "Import"
   - Select `docs/api/postman/Q-Ease_Environment.json`

3. **Configure Environment**:
   - Select "Q-Ease Development Environment"
   - Update variables as needed:
     - `base_url`: Your backend URL (default: http://localhost:5000)
     - `user_email`: Test user email
     - `user_password`: Test user password

#### Test Execution Order:

For proper testing, follow this sequence:

1. **Authentication Tests**:
   - Register a new user
   - Login to get authentication token
   - (Token will be automatically saved to environment)

2. **Organisation Tests**:
   - Create organisation (requires Super Admin role)
   - Verify organisation
   - Search organisations

3. **Queue Tests**:
   - Create queue (requires Organisation Admin role)
   - Get queue status
   - Test pause/resume functionality

4. **Token Tests**:
   - Generate token (as user)
   - Generate walk-in token (as staff)
   - Call next token
   - Update token status
   - Get user tokens

5. **Analytics Tests**:
   - Get queue analytics
   - Get organisation analytics
   - Get platform analytics (Super Admin only)

## Test Structure

```
backend/
├── __tests__/
│   ├── setup.js                    # Test setup and teardown
│   └── unit/
│       ├── controllers/
│       │   ├── authController.test.js
│       │   ├── organisationController.test.js
│       │   ├── queueController.test.js
│       │   └── tokenController.test.js
│       └── utils/
│           └── helpers.test.js
└── jest.config.js                  # Jest configuration
```

## Writing New Tests

### Test File Structure:
```javascript
const request = require('supertest');
const { prisma } = require('../../src/models');

describe('Controller Name', () => {
  beforeEach(async () => {
    // Setup test data
  });

  afterEach(async () => {
    // Cleanup test data
  });

  describe('METHOD /endpoint', () => {
    it('should do something', async () => {
      // Test implementation
      const response = await request(app)
        .post('/api/endpoint')
        .send(data)
        .expect(200);

      expect(response.body.success).toBe(true);
      // Additional assertions
    });
  });
});
```

### Best Practices:

1. **Isolation**: Each test should be independent
2. **Setup/Teardown**: Use `beforeEach` and `afterEach` for data management
3. **Assertions**: Test both success and error cases
4. **Mocking**: Mock external dependencies when appropriate
5. **Coverage**: Aim for high test coverage (>80%)

## Common Test Scenarios

### Authentication Tests:
- Valid registration/login
- Invalid credentials
- Token refresh
- Unauthorized access

### Business Logic Tests:
- Queue creation and management
- Token generation and calling
- Priority handling
- Position calculation
- Analytics calculations

### Error Handling Tests:
- Invalid input data
- Missing required fields
- Database errors
- Unauthorized access attempts

## Continuous Integration

The project includes GitHub Actions workflows for automated testing:

- **CI Pipeline**: Runs on every push/PR
- **Test Suite**: Executes all unit tests
- **Coverage Reports**: Generates coverage statistics
- **Quality Gates**: Enforces minimum coverage thresholds

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Ensure PostgreSQL is running
   - Check `.env` database configuration
   - Verify database exists and is accessible

2. **Authentication Errors**:
   - Ensure tokens are properly set in environment
   - Check role permissions for endpoints
   - Verify JWT secret configuration

3. **Test Data Conflicts**:
   - Ensure `beforeEach` properly cleans up data
   - Check for unique constraint violations
   - Verify test data isolation

4. **Port Conflicts**:
   - Ensure backend server isn't already running
   - Check if port 5000 is available
   - Update `base_url` in Postman environment if needed

## Performance Testing

For load testing, consider using:
- **Artillery**: For API load testing
- **k6**: For performance benchmarking
- **Apache Bench**: For simple stress testing

Example artillery script:
```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 20
scenarios:
  - flow:
    - post:
        url: '/api/auth/login'
        json:
          email: 'test@example.com'
          password: 'password123'
```

This comprehensive testing setup ensures the Q-Ease backend is robust, reliable, and maintains high quality standards.