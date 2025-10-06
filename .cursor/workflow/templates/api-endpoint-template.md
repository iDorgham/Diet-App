# API Endpoint Template

## Overview
This template provides a standardized structure for creating API endpoints in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{ENDPOINT_NAME}}` - Name of the endpoint (e.g., `GetUserProfile`, `CreateTask`)
- `{{HTTP_METHOD}}` - HTTP method (GET, POST, PUT, DELETE)
- `{{ENDPOINT_PATH}}` - API path (e.g., `/api/users/profile`)
- `{{DESCRIPTION}}` - Brief description of the endpoint's purpose
- `{{REQUEST_SCHEMA}}` - Request body/query schema
- `{{RESPONSE_SCHEMA}}` - Response schema

## Endpoint Structure

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

/**
 * {{DESCRIPTION}}
 * 
 * @route {{HTTP_METHOD}} {{ENDPOINT_PATH}}
 * @access Private/Public
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const {{ENDPOINT_NAME}} = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Input validation
    const validatedData = {{REQUEST_SCHEMA}}.parse(req.body);
    
    // Business logic
    const result = await {{ENDPOINT_NAME}}Service(validatedData);
    
    // Success response
    res.status(200).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string,
        version: '1.0.0'
      }
    });
  } catch (error) {
    next(error);
  }
};
```

## Request Schema

```typescript
// Request validation schema
export const {{ENDPOINT_NAME}}RequestSchema = z.object({
  // Define request fields here
  // Example:
  // name: z.string().min(1).max(100),
  // email: z.string().email(),
  // age: z.number().min(0).max(120)
});

export type {{ENDPOINT_NAME}}Request = z.infer<typeof {{ENDPOINT_NAME}}RequestSchema>;
```

## Response Schema

```typescript
// Response schema
export interface {{ENDPOINT_NAME}}Response {
  success: true;
  data: {
    // Define response data structure
    // Example:
    // id: string;
    // name: string;
    // email: string;
    // createdAt: string;
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

## Service Implementation

```typescript
// Service layer implementation
export const {{ENDPOINT_NAME}}Service = async (
  data: {{ENDPOINT_NAME}}Request
): Promise<{{ENDPOINT_NAME}}Response['data']> => {
  try {
    // Business logic implementation
    // Example:
    // const result = await database.create(data);
    // return result;
    
    throw new Error('Service implementation required');
  } catch (error) {
    console.error('{{ENDPOINT_NAME}} service error:', error);
    throw error;
  }
};
```

## Route Configuration

```typescript
import { Router } from 'express';
import { {{ENDPOINT_NAME}} } from './{{ENDPOINT_NAME}}';
import { validateRequest } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// Apply middleware
router.{{HTTP_METHOD.toLowerCase()}}(
  '{{ENDPOINT_PATH}}',
  rateLimit('{{ENDPOINT_NAME}}'), // Apply rate limiting
  authenticateToken, // Apply authentication if needed
  validateRequest({{ENDPOINT_NAME}}RequestSchema), // Apply validation
  {{ENDPOINT_NAME}} // Endpoint handler
);

export default router;
```

## Error Handling

```typescript
// Custom error types
export class {{ENDPOINT_NAME}}Error extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = '{{ENDPOINT_NAME}}Error';
  }
}

// Error handling middleware
export const handle{{ENDPOINT_NAME}}Error = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof {{ENDPOINT_NAME}}Error) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.stack
      }
    });
  } else {
    next(error);
  }
};
```

## Testing

```typescript
import request from 'supertest';
import { app } from '../app';
import { {{ENDPOINT_NAME}}RequestSchema } from './{{ENDPOINT_NAME}}';

describe('{{ENDPOINT_NAME}}', () => {
  const validRequest = {
    // Valid request data
  };

  const invalidRequest = {
    // Invalid request data
  };

  it('should handle valid request', async () => {
    const response = await request(app)
      .{{HTTP_METHOD.toLowerCase()}}('{{ENDPOINT_PATH}}')
      .send(validRequest)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('should handle invalid request', async () => {
    const response = await request(app)
      .{{HTTP_METHOD.toLowerCase()}}('{{ENDPOINT_PATH}}')
      .send(invalidRequest)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it('should handle authentication errors', async () => {
    const response = await request(app)
      .{{HTTP_METHOD.toLowerCase()}}('{{ENDPOINT_PATH}}')
      .send(validRequest)
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('should handle rate limiting', async () => {
    // Test rate limiting
    const promises = Array(10).fill(null).map(() =>
      request(app)
        .{{HTTP_METHOD.toLowerCase()}}('{{ENDPOINT_PATH}}')
        .send(validRequest)
    );

    const responses = await Promise.all(promises);
    const rateLimitedResponse = responses.find(r => r.status === 429);
    
    expect(rateLimitedResponse).toBeDefined();
  });
});
```

## Documentation

### Endpoint Details
- **Method**: `{{HTTP_METHOD}}`
- **Path**: `{{ENDPOINT_PATH}}`
- **Authentication**: Required/Optional
- **Rate Limit**: Requests per window
- **Description**: {{DESCRIPTION}}

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param1` | `string` | Yes | Description of param1 |
| `param2` | `number` | No | Description of param2 |

### Response Format
```json
{
  "success": true,
  "data": {
    // Response data structure
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_123456789",
    "version": "1.0.0"
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": "Additional error details"
  }
}
```

## Rate Limiting

```typescript
// Rate limiting configuration
export const {{ENDPOINT_NAME}}RateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
  message: 'Too many requests for {{ENDPOINT_NAME}}',
  standardHeaders: true,
  legacyHeaders: false
};
```

## Caching

```typescript
// Caching configuration
export const {{ENDPOINT_NAME}}Cache = {
  ttl: 300, // 5 minutes
  key: (req: Request) => `{{ENDPOINT_NAME}}:${req.user?.id}:${JSON.stringify(req.query)}`,
  condition: (req: Request) => req.method === 'GET'
};
```

## Monitoring

```typescript
// Metrics collection
export const {{ENDPOINT_NAME}}Metrics = {
  requestCount: new Counter({
    name: '{{ENDPOINT_NAME}}_requests_total',
    help: 'Total number of {{ENDPOINT_NAME}} requests',
    labelNames: ['method', 'status']
  }),
  
  requestDuration: new Histogram({
    name: '{{ENDPOINT_NAME}}_request_duration_seconds',
    help: 'Duration of {{ENDPOINT_NAME}} requests',
    labelNames: ['method'],
    buckets: [0.1, 0.5, 1, 2, 5]
  })
};
```

## Security Considerations

1. **Input Validation**: Always validate and sanitize input data
2. **Authentication**: Verify user identity and permissions
3. **Authorization**: Check if user has permission to access resource
4. **Rate Limiting**: Prevent abuse and ensure fair usage
5. **Error Handling**: Don't expose sensitive information in errors
6. **Logging**: Log security-relevant events
7. **HTTPS**: Ensure all communications are encrypted

## Performance Optimization

1. **Caching**: Implement appropriate caching strategies
2. **Database Optimization**: Use efficient queries and indexes
3. **Response Compression**: Compress responses when appropriate
4. **Connection Pooling**: Reuse database connections
5. **Async Processing**: Use async/await for I/O operations
6. **Resource Cleanup**: Properly clean up resources

## Best Practices

1. **Consistent Response Format**: Use standardized response structure
2. **Proper HTTP Status Codes**: Return appropriate status codes
3. **Error Handling**: Implement comprehensive error handling
4. **Logging**: Log important events and errors
5. **Testing**: Write comprehensive unit and integration tests
6. **Documentation**: Document all endpoints and their behavior
7. **Versioning**: Support API versioning for backward compatibility

## Related Endpoints

- `RelatedEndpoint1` - Description of relationship
- `RelatedEndpoint2` - Description of relationship

## Changelog

### v1.0.0
- Initial implementation
- Basic functionality
- Authentication support

### v1.1.0
- Added new feature
- Performance improvements
- Bug fixes
