# API Architecture

## Overview
This document outlines the API architecture for the Diet Planner Game application, covering RESTful API design, GraphQL integration, authentication, rate limiting, and versioning strategies.

## API Design Principles

### 1. RESTful Design
- Resource-based URLs
- HTTP methods for operations
- Stateless communication
- Cacheable responses
- Uniform interface

### 2. GraphQL Integration
- Single endpoint for complex queries
- Type-safe schema
- Real-time subscriptions
- Efficient data fetching

## API Endpoints Structure

### Authentication APIs
```typescript
// Authentication endpoints
POST /api/auth/anonymous
POST /api/auth/refresh
POST /api/auth/verify
DELETE /api/auth/logout
```

### User Management APIs
```typescript
// User profile endpoints
GET /api/users/profile
PUT /api/users/profile
GET /api/users/progress
PUT /api/users/progress
GET /api/users/achievements
```

### Task Management APIs
```typescript
// Task endpoints
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
POST /api/tasks/:id/complete
```

### AI Coach APIs
```typescript
// AI Coach endpoints
POST /api/coach/chat
GET /api/coach/history
POST /api/coach/feedback
GET /api/coach/suggestions
```

### Nutrition APIs
```typescript
// Nutrition endpoints
GET /api/nutrition/recipes
POST /api/nutrition/log
GET /api/nutrition/analytics
POST /api/nutrition/plan
```

## Rate Limiting Strategy

### Rate Limit Configuration
```typescript
const rateLimits = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    message: 'Too many requests from this IP'
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    max: 5, // login attempts per window
    message: 'Too many authentication attempts'
  },
  ai: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // AI requests per minute
    message: 'AI API rate limit exceeded'
  }
};
```

## API Versioning

### Version Strategy
- URL-based versioning: `/api/v1/`, `/api/v2/`
- Header-based versioning: `API-Version: v1`
- Backward compatibility for 2 major versions
- Deprecation notices with 6-month notice period

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}
```

### Error Codes
```typescript
const errorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR'
};
```

## Security Implementation

### Authentication
- JWT tokens with refresh mechanism
- Anonymous authentication for guest users
- Token expiration and rotation
- Secure token storage

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- API key management
- CORS configuration

## Performance Optimization

### Caching Strategy
- Redis for API response caching
- ETags for conditional requests
- CDN integration for static assets
- Database query optimization

### Response Optimization
- Response compression (gzip)
- Pagination for large datasets
- Field selection for GraphQL
- Connection pooling

## Monitoring and Analytics

### API Metrics
- Request/response times
- Error rates
- Throughput metrics
- User behavior analytics

### Health Checks
- Database connectivity
- External service status
- Memory and CPU usage
- API endpoint availability
