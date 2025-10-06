# Testing Strategy Specification

## Overview
The Testing Strategy defines a comprehensive testing approach for the Diet Planner Game application, covering unit, integration, end-to-end, and performance testing to ensure quality, reliability, and maintainability.

## EARS Requirements

### Epic Requirements
- **EPIC-TS-001**: The system SHALL implement comprehensive testing coverage across all components
- **EPIC-TS-002**: The system SHALL provide automated testing pipeline for continuous integration
- **EPIC-TS-003**: The system SHALL ensure performance and security testing standards

### Feature Requirements
- **FEAT-TS-001**: The system SHALL implement unit testing for all business logic
- **FEAT-TS-002**: The system SHALL provide integration testing for API endpoints
- **FEAT-TS-003**: The system SHALL implement end-to-end testing for user workflows
- **FEAT-TS-004**: The system SHALL provide performance and load testing

### User Story Requirements
- **US-TS-001**: As a developer, I want comprehensive tests so that I can refactor code safely
- **US-TS-002**: As a QA engineer, I want automated tests so that I can focus on edge cases
- **US-TS-003**: As a product manager, I want reliable releases so that users have a stable experience

### Acceptance Criteria
- **AC-TS-001**: Given code changes, when tests run, then coverage SHALL be above 80%
- **AC-TS-002**: Given a failing test, when CI runs, then deployment SHALL be blocked
- **AC-TS-003**: Given performance tests, when load is applied, then response time SHALL be under 200ms

## Testing Pyramid

### 1. Unit Tests (70%)
```typescript
// Unit test example
import { UserService } from '../services/user-service';
import { UserRepository } from '../repositories/user-repository';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<UserRepository>;

    userService = new UserService(mockUserRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 'user_123';
      const expectedUser = { id: userId, email: 'test@example.com' };
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      const userId = 'nonexistent';
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById(userId))
        .rejects.toThrow('User not found');
    });
  });
});
```

### 2. Integration Tests (20%)
```typescript
// Integration test example
import request from 'supertest';
import app from '../app';
import { Database } from '../database';

describe('User API Integration', () => {
  let database: Database;

  beforeAll(async () => {
    database = new Database();
    await database.connect();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await database.clear();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/v1/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });
  });
});
```

### 3. End-to-End Tests (10%)
```typescript
// E2E test example
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should complete user registration', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Fill registration form
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="username"]', 'testuser');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="firstName"]', 'Test');
    await page.fill('[data-testid="lastName"]', 'User');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page).toHaveURL('/dashboard');
  });
});
```

## Test Configuration

### 1. Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

### 2. Test Database Setup
```typescript
// tests/setup.ts
import { Database } from '../src/database';

let testDatabase: Database;

beforeAll(async () => {
  testDatabase = new Database({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '5432'),
    database: process.env.TEST_DB_NAME || 'diet_game_test'
  });
  
  await testDatabase.connect();
});

afterAll(async () => {
  await testDatabase.disconnect();
});

beforeEach(async () => {
  await testDatabase.clear();
});
```

## Performance Testing

### 1. Load Testing with Artillery
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "User Registration"
    weight: 30
    flow:
      - post:
          url: "/api/v1/auth/register"
          json:
            email: "user{{ $randomInt(1, 10000) }}@example.com"
            username: "user{{ $randomInt(1, 10000) }}"
            password: "password123"
            firstName: "Test"
            lastName: "User"

  - name: "Meal Logging"
    weight: 70
    flow:
      - post:
          url: "/api/v1/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.data.tokens.accessToken"
              as: "token"
      - post:
          url: "/api/v1/nutrition/meals"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            date: "2024-01-15"
            mealType: "lunch"
            foods:
              - foodId: "food_123"
                quantity: 150
                unit: "g"
```

### 2. Performance Monitoring
```typescript
// Performance test utilities
import { performance } from 'perf_hooks';

export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(operation: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(operation, duration);
    };
  }

  recordMetric(operation: string, value: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation)!.push(value);
  }

  getStats(operation: string): { avg: number; min: number; max: number; p95: number } {
    const values = this.metrics.get(operation) || [];
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, p95: 0 };
    }

    const sorted = values.sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index];

    return { avg, min, max, p95 };
  }
}
```

## Security Testing

### 1. Security Test Suite
```typescript
// Security tests
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should reject requests without valid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .expect(401);

      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('Input Validation', () => {
    it('should sanitize SQL injection attempts', async () => {
      const maliciousInput = "'; DROP TABLE users; --";
      
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: maliciousInput,
          username: 'testuser',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent XSS attacks', async () => {
      const xssPayload = '<script>alert("xss")</script>';
      
      const response = await request(app)
        .post('/api/v1/social/posts')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          content: xssPayload,
          postType: 'text'
        })
        .expect(201);

      expect(response.body.data.content).not.toContain('<script>');
    });
  });
});
```

## Test Automation

### 1. CI/CD Pipeline
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: diet_game_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/diet_game_test
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

### 2. Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:e2e": "playwright test",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:performance": "artillery run artillery-config.yml"
  }
}
```

## Future Enhancements

### 1. Advanced Testing Features
- **Visual Regression Testing**: Screenshot comparison for UI changes
- **API Contract Testing**: Ensure API compatibility
- **Chaos Engineering**: Test system resilience
- **Mutation Testing**: Test test quality

### 2. Test Optimization
- **Parallel Test Execution**: Run tests in parallel
- **Test Data Management**: Efficient test data setup
- **Test Environment Isolation**: Isolated test environments
- **Test Result Analytics**: Detailed test reporting