# Integration Test Template

## Overview
This template provides a standardized structure for creating integration tests in the Diet Game application using Jest and Supertest.

## Template Usage
Replace the following placeholders:
- `{{MODULE_NAME}}` - Name of the module being tested (e.g., `User`, `Task`, `Nutrition`)
- `{{API_ENDPOINT}}` - API endpoint being tested (e.g., `/api/users`, `/api/tasks`)
- `{{SERVICE_NAME}}` - Name of the service being tested
- `{{DATABASE_TABLE}}` - Database table name

## Integration Test Structure

```typescript
// src/test/integration/{{MODULE_NAME}}.test.ts

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app';
import { database } from '../../config/database';
import { redis } from '../../config/redis';
import { generateTestToken, createTestUser } from '../helpers/testHelpers';
import { {{MODULE_NAME}}Repository } from '../../repositories/{{MODULE_NAME}}Repository';
import { UserRepository } from '../../repositories/UserRepository';

// ============================================================================
// TEST SETUP
// ============================================================================

describe('{{MODULE_NAME}} Integration Tests', () => {
  let authToken: string;
  let testUser: any;
  let {{module_name}}Repository: {{MODULE_NAME}}Repository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    // Initialize test database connection
    await database.connect();
    await redis.connect();
    
    // Initialize repositories
    {{module_name}}Repository = new {{MODULE_NAME}}Repository();
    userRepository = new UserRepository();
  });

  afterAll(async () => {
    // Clean up database connections
    await database.disconnect();
    await redis.disconnect();
  });

  beforeEach(async () => {
    // Clean up test data before each test
    await database.query('DELETE FROM {{database_table}}');
    await database.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await redis.flushdb();

    // Create test user and get auth token
    testUser = await createTestUser({
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User'
    });
    
    authToken = await generateTestToken(testUser.id);
  });

  afterEach(async () => {
    // Clean up after each test
    await database.query('DELETE FROM {{database_table}}');
    await database.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
    await redis.flushdb();
  });

  // ============================================================================
  // API ENDPOINT TESTS
  // ============================================================================

  describe('POST {{API_ENDPOINT}}', () => {
    const valid{{MODULE_NAME}}Data = {
      name: 'Test {{MODULE_NAME}}',
      description: 'Test description',
      // Add other required fields
    };

    it('should create a new {{MODULE_NAME}} successfully', async () => {
      const response = await request(app)
        .post('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(valid{{MODULE_NAME}}Data)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        name: valid{{MODULE_NAME}}Data.name,
        description: valid{{MODULE_NAME}}Data.description,
        // Add other expected fields
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();

      // Verify data was stored in database
      const stored{{MODULE_NAME}} = await {{module_name}}Repository.findById(response.body.data.id);
      expect(stored{{MODULE_NAME}}).toBeTruthy();
      expect(stored{{MODULE_NAME}}.name).toBe(valid{{MODULE_NAME}}Data.name);
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        // Missing required fields
        description: 'Test description'
      };

      const response = await request(app)
        .post('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'name',
          message: expect.stringContaining('required')
        })
      );
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .post('{{API_ENDPOINT}}')
        .send(valid{{MODULE_NAME}}Data)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 429 for rate limit exceeded', async () => {
      // Make multiple requests to trigger rate limiting
      const requests = Array(10).fill(null).map(() =>
        request(app)
          .post('{{API_ENDPOINT}}')
          .set('Authorization', `Bearer ${authToken}`)
          .send(valid{{MODULE_NAME}}Data)
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(r => r.status === 429);
      
      expect(rateLimitedResponse).toBeDefined();
    });
  });

  describe('GET {{API_ENDPOINT}}', () => {
    let test{{MODULE_NAME}}s: any[];

    beforeEach(async () => {
      // Create test data
      test{{MODULE_NAME}}s = await Promise.all([
        {{module_name}}Repository.create({
          name: '{{MODULE_NAME}} 1',
          description: 'Description 1',
          userId: testUser.id
        }),
        {{module_name}}Repository.create({
          name: '{{MODULE_NAME}} 2',
          description: 'Description 2',
          userId: testUser.id
        }),
        {{module_name}}Repository.create({
          name: '{{MODULE_NAME}} 3',
          description: 'Description 3',
          userId: testUser.id
        })
      ]);
    });

    it('should return list of {{MODULE_NAME}}s with pagination', async () => {
      const response = await request(app)
        .get('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false
      });
    });

    it('should filter {{MODULE_NAME}}s by criteria', async () => {
      const response = await request(app)
        .get('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          filter: JSON.stringify({ name: '{{MODULE_NAME}} 1' })
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('{{MODULE_NAME}} 1');
    });

    it('should sort {{MODULE_NAME}}s correctly', async () => {
      const response = await request(app)
        .get('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ 
          sort: JSON.stringify({ field: 'name', direction: 'DESC' })
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data[0].name).toBe('{{MODULE_NAME}} 3');
      expect(response.body.data[1].name).toBe('{{MODULE_NAME}} 2');
      expect(response.body.data[2].name).toBe('{{MODULE_NAME}} 1');
    });
  });

  describe('GET {{API_ENDPOINT}}/:id', () => {
    let test{{MODULE_NAME}}: any;

    beforeEach(async () => {
      test{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Test {{MODULE_NAME}}',
        description: 'Test description',
        userId: testUser.id
      });
    });

    it('should return {{MODULE_NAME}} by id', async () => {
      const response = await request(app)
        .get(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: test{{MODULE_NAME}}.id,
        name: test{{MODULE_NAME}}.name,
        description: test{{MODULE_NAME}}.description
      });
    });

    it('should return 404 for non-existent {{MODULE_NAME}}', async () => {
      const response = await request(app)
        .get(`{{API_ENDPOINT}}/non-existent-id`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 403 for {{MODULE_NAME}} owned by another user', async () => {
      // Create another user and {{MODULE_NAME}}
      const otherUser = await createTestUser({
        email: 'other@example.com',
        password: 'TestPassword123!',
        name: 'Other User'
      });
      
      const other{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Other {{MODULE_NAME}}',
        description: 'Other description',
        userId: otherUser.id
      });

      const response = await request(app)
        .get(`{{API_ENDPOINT}}/${other{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('PUT {{API_ENDPOINT}}/:id', () => {
    let test{{MODULE_NAME}}: any;

    beforeEach(async () => {
      test{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Test {{MODULE_NAME}}',
        description: 'Test description',
        userId: testUser.id
      });
    });

    it('should update {{MODULE_NAME}} successfully', async () => {
      const updateData = {
        name: 'Updated {{MODULE_NAME}}',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: test{{MODULE_NAME}}.id,
        name: updateData.name,
        description: updateData.description
      });

      // Verify data was updated in database
      const updated{{MODULE_NAME}} = await {{module_name}}Repository.findById(test{{MODULE_NAME}}.id);
      expect(updated{{MODULE_NAME}}.name).toBe(updateData.name);
      expect(updated{{MODULE_NAME}}.description).toBe(updateData.description);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        name: '', // Invalid empty name
      };

      const response = await request(app)
        .put(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 for non-existent {{MODULE_NAME}}', async () => {
      const response = await request(app)
        .put(`{{API_ENDPOINT}}/non-existent-id`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE {{API_ENDPOINT}}/:id', () => {
    let test{{MODULE_NAME}}: any;

    beforeEach(async () => {
      test{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Test {{MODULE_NAME}}',
        description: 'Test description',
        userId: testUser.id
      });
    });

    it('should delete {{MODULE_NAME}} successfully', async () => {
      const response = await request(app)
        .delete(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted successfully');

      // Verify {{MODULE_NAME}} was deleted from database
      const deleted{{MODULE_NAME}} = await {{module_name}}Repository.findById(test{{MODULE_NAME}}.id);
      expect(deleted{{MODULE_NAME}}).toBeNull();
    });

    it('should return 404 for non-existent {{MODULE_NAME}}', async () => {
      const response = await request(app)
        .delete(`{{API_ENDPOINT}}/non-existent-id`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should return 403 for {{MODULE_NAME}} owned by another user', async () => {
      // Create another user and {{MODULE_NAME}}
      const otherUser = await createTestUser({
        email: 'other@example.com',
        password: 'TestPassword123!',
        name: 'Other User'
      });
      
      const other{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Other {{MODULE_NAME}}',
        description: 'Other description',
        userId: otherUser.id
      });

      const response = await request(app)
        .delete(`{{API_ENDPOINT}}/${other{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  // ============================================================================
  // DATABASE INTEGRATION TESTS
  // ============================================================================

  describe('Database Integration', () => {
    it('should handle database transactions correctly', async () => {
      const {{MODULE_NAME}}Data = {
        name: 'Transaction Test {{MODULE_NAME}}',
        description: 'Testing database transactions'
      };

      // Start a transaction
      await database.query('BEGIN');

      try {
        // Create {{MODULE_NAME}} within transaction
        const response = await request(app)
          .post('{{API_ENDPOINT}}')
          .set('Authorization', `Bearer ${authToken}`)
          .send({{MODULE_NAME}}Data)
          .expect(201);

        // Verify {{MODULE_NAME}} exists within transaction
        const {{MODULE_NAME}} = await {{module_name}}Repository.findById(response.body.data.id);
        expect({{MODULE_NAME}}).toBeTruthy();

        // Commit transaction
        await database.query('COMMIT');

        // Verify {{MODULE_NAME}} still exists after commit
        const committed{{MODULE_NAME}} = await {{module_name}}Repository.findById(response.body.data.id);
        expect(committed{{MODULE_NAME}}).toBeTruthy();
      } catch (error) {
        // Rollback transaction on error
        await database.query('ROLLBACK');
        throw error;
      }
    });

    it('should handle database connection failures gracefully', async () => {
      // Simulate database connection failure
      await database.disconnect();

      const response = await request(app)
        .get('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DATABASE_ERROR');

      // Reconnect database for cleanup
      await database.connect();
    });
  });

  // ============================================================================
  // CACHE INTEGRATION TESTS
  // ============================================================================

  describe('Cache Integration', () => {
    it('should cache {{MODULE_NAME}} data correctly', async () => {
      const test{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Cache Test {{MODULE_NAME}}',
        description: 'Testing cache functionality',
        userId: testUser.id
      });

      // First request - should cache the data
      const response1 = await request(app)
        .get(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response1.body.success).toBe(true);

      // Verify data is cached
      const cachedData = await redis.get(`{{module_name}}:${test{{MODULE_NAME}}.id}`);
      expect(cachedData).toBeTruthy();

      // Second request - should use cached data
      const response2 = await request(app)
        .get(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response2.body.success).toBe(true);
      expect(response2.body.data).toEqual(response1.body.data);
    });

    it('should invalidate cache on {{MODULE_NAME}} update', async () => {
      const test{{MODULE_NAME}} = await {{module_name}}Repository.create({
        name: 'Cache Invalidation Test',
        description: 'Testing cache invalidation',
        userId: testUser.id
      });

      // Cache the data
      await request(app)
        .get(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Update the {{MODULE_NAME}}
      await request(app)
        .put(`{{API_ENDPOINT}}/${test{{MODULE_NAME}}.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      // Verify cache was invalidated
      const cachedData = await redis.get(`{{module_name}}:${test{{MODULE_NAME}}.id}`);
      expect(cachedData).toBeNull();
    });
  });

  // ============================================================================
  // EXTERNAL SERVICE INTEGRATION TESTS
  // ============================================================================

  describe('External Service Integration', () => {
    it('should handle external API failures gracefully', async () => {
      // Mock external API to return error
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('External API error'));

      const response = await request(app)
        .post('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'External API Test',
          description: 'Testing external API integration'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('EXTERNAL_SERVICE_ERROR');

      // Restore original fetch
      global.fetch = originalFetch;
    });

    it('should retry failed external API calls', async () => {
      let callCount = 0;
      const originalFetch = global.fetch;
      
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Temporary failure'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      });

      const response = await request(app)
        .post('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Retry Test',
          description: 'Testing retry mechanism'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(callCount).toBe(3); // Should have retried 3 times

      // Restore original fetch
      global.fetch = originalFetch;
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  describe('Performance Tests', () => {
    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const startTime = Date.now();

      const requests = Array(concurrentRequests).fill(null).map((_, index) =>
        request(app)
          .post('{{API_ENDPOINT}}')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Concurrent Test ${index}`,
            description: `Concurrent test description ${index}`
          })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Should complete within reasonable time (adjust based on requirements)
      expect(totalTime).toBeLessThan(5000); // 5 seconds
    });

    it('should handle large datasets efficiently', async () => {
      // Create large number of test records
      const largeDataset = Array(100).fill(null).map((_, index) => ({
        name: `Large Dataset ${index}`,
        description: `Large dataset description ${index}`,
        userId: testUser.id
      }));

      await Promise.all(
        largeDataset.map(data => {{module_name}}Repository.create(data))
      );

      const startTime = Date.now();
      
      const response = await request(app)
        .get('{{API_ENDPOINT}}')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 100 })
        .expect(200);

      const endTime = Date.now();
      const queryTime = endTime - startTime;

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(100);
      expect(queryTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});
```

## Test Configuration

### Test Database Setup
```typescript
// src/test/config/testDatabase.ts

import { Pool } from 'pg';
import { Redis } from 'ioredis';

export const testDatabase = new Pool({
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'diet_game_test',
  user: process.env.TEST_DB_USER || 'postgres',
  password: process.env.TEST_DB_PASSWORD || 'password',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const testRedis = new Redis({
  host: process.env.TEST_REDIS_HOST || 'localhost',
  port: parseInt(process.env.TEST_REDIS_PORT || '6379'),
  db: 1, // Use different database for tests
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});
```

### Test Helpers
```typescript
// src/test/helpers/testHelpers.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { testDatabase } from '../config/testDatabase';
import { UserRepository } from '../../repositories/UserRepository';

export async function createTestUser(userData: {
  email: string;
  password: string;
  name: string;
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const result = await testDatabase.query(
    'INSERT INTO users (email, password, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
    [userData.email, hashedPassword, userData.name]
  );
  
  return result.rows[0];
}

export async function generateTestToken(userId: string): Promise<string> {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

export async function cleanupTestData() {
  await testDatabase.query('DELETE FROM {{database_table}}');
  await testDatabase.query('DELETE FROM users WHERE email LIKE $1', ['test%']);
}
```

## Best Practices

1. **Test Isolation**: Each test should be independent and not affect others
2. **Data Cleanup**: Always clean up test data before and after tests
3. **Realistic Data**: Use realistic test data that matches production patterns
4. **Error Scenarios**: Test both success and failure scenarios
5. **Performance**: Include performance tests for critical paths
6. **Security**: Test authentication, authorization, and input validation
7. **Database**: Test database transactions and connection handling
8. **Caching**: Test cache behavior and invalidation
9. **External Services**: Mock external services and test failure scenarios
10. **Concurrency**: Test concurrent request handling

## Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run specific integration test file
npm run test:integration {{MODULE_NAME}}.test.ts

# Run integration tests with coverage
npm run test:integration:coverage

# Run integration tests in watch mode
npm run test:integration:watch
```

## Related Documentation

- [Unit Test Template](./unit-test-template.md)
- [Testing Guide](../TESTING_GUIDE.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Database Schema](../contracts/database-contracts.md)
