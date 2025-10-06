# API Architecture Specification

## Overview
The API Architecture defines the design principles, structure, and implementation of RESTful APIs and GraphQL integration for the Diet Planner Game application, ensuring scalable, maintainable, and secure API services.

## EARS Requirements

### Epic Requirements
- **EPIC-AA-001**: The system SHALL provide comprehensive RESTful API services for all application features
- **EPIC-AA-002**: The system SHALL implement GraphQL integration for flexible data querying
- **EPIC-AA-003**: The system SHALL ensure secure and authenticated API access

### Feature Requirements
- **FEAT-AA-001**: The system SHALL implement RESTful design principles with proper HTTP methods and status codes
- **FEAT-AA-002**: The system SHALL provide API versioning and backward compatibility
- **FEAT-AA-003**: The system SHALL implement rate limiting and request validation
- **FEAT-AA-004**: The system SHALL provide comprehensive API documentation

### User Story Requirements
- **US-AA-001**: As a developer, I want well-designed APIs so that I can integrate with the application easily
- **US-AA-002**: As a mobile app developer, I want consistent API responses so that I can build reliable applications
- **US-AA-003**: As a system administrator, I want secure APIs so that I can protect user data

### Acceptance Criteria
- **AC-AA-001**: Given an API request, when it's made with valid credentials, then it SHALL return the expected response format
- **AC-AA-002**: Given an API request, when it's made with invalid data, then it SHALL return appropriate error messages
- **AC-AA-003**: Given an API request, when it exceeds rate limits, then it SHALL return rate limit exceeded error

## API Design Principles

### 1. RESTful Design
- **Resource-Based URLs**: Use nouns for resources, verbs for actions
- **HTTP Methods**: Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- **Stateless**: Each request contains all necessary information
- **Cacheable**: Responses can be cached when appropriate
- **Uniform Interface**: Consistent API design across all endpoints

### 2. Response Format
```typescript
// Standard API response format
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
  timestamp: string;
  requestId: string;
}

// Success response example
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "message": "User retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}

// Error response example
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

## API Endpoints

### 1. Authentication APIs
```typescript
// User registration
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}

// User login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

// Token refresh
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Password reset
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 2. User Management APIs
```typescript
// Get user profile
GET /api/v1/users/profile
Authorization: Bearer {accessToken}

// Update user profile
PUT /api/v1/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "height": 180,
  "weight": 75
}

// Delete user account
DELETE /api/v1/users/account
Authorization: Bearer {accessToken}
```

### 3. Nutrition Tracking APIs
```typescript
// Search foods
GET /api/v1/nutrition/foods/search?query=chicken&limit=20&offset=0
Authorization: Bearer {accessToken}

// Log meal
POST /api/v1/nutrition/meals
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "date": "2024-01-15",
  "mealType": "lunch",
  "foods": [
    {
      "foodId": "food_123",
      "quantity": 150,
      "unit": "g"
    }
  ]
}

// Get daily nutrition summary
GET /api/v1/nutrition/daily-summary?date=2024-01-15
Authorization: Bearer {accessToken}

// Set nutrition goals
POST /api/v1/nutrition/goals
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "goalType": "weight_loss",
  "targetWeight": 70,
  "targetCalories": 1800
}
```

### 4. Gamification APIs
```typescript
// Get user progress
GET /api/v1/gamification/progress
Authorization: Bearer {accessToken}

// Get achievements
GET /api/v1/gamification/achievements
Authorization: Bearer {accessToken}

// Get active challenges
GET /api/v1/gamification/challenges/active
Authorization: Bearer {accessToken}

// Join challenge
POST /api/v1/gamification/challenges/{challengeId}/join
Authorization: Bearer {accessToken}
```

### 5. Social Features APIs
```typescript
// Get user feed
GET /api/v1/social/feed?limit=20&offset=0
Authorization: Bearer {accessToken}

// Create post
POST /api/v1/social/posts
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Just completed my first week of healthy eating! 🎉",
  "postType": "achievement",
  "isPublic": true
}

// Like post
POST /api/v1/social/posts/{postId}/like
Authorization: Bearer {accessToken}

// Add comment
POST /api/v1/social/posts/{postId}/comments
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "content": "Great job! Keep it up!"
}
```

## GraphQL Integration

### 1. Schema Definition
```graphql
# GraphQL schema
type User {
  id: ID!
  email: String!
  username: String!
  firstName: String!
  lastName: String!
  profile: UserProfile
  nutritionGoals: [NutritionGoal!]!
  mealLogs: [MealLog!]!
  achievements: [Achievement!]!
  challenges: [Challenge!]!
}

type UserProfile {
  bio: String
  profileImageUrl: String
  timezone: String
  language: String
  privacySettings: JSON
}

type NutritionGoal {
  id: ID!
  goalType: String!
  targetWeight: Float
  targetCalories: Int
  targetProtein: Int
  targetCarbohydrates: Int
  targetFat: Int
  startDate: String!
  targetDate: String
  isActive: Boolean!
}

type MealLog {
  id: ID!
  date: String!
  mealType: String!
  foods: [FoodEntry!]!
  totalCalories: Float!
  totalProtein: Float!
  totalCarbohydrates: Float!
  totalFat: Float!
}

type FoodEntry {
  foodId: ID!
  name: String!
  quantity: Float!
  unit: String!
  calories: Float!
  protein: Float!
  carbohydrates: Float!
  fat: Float!
}

type Achievement {
  id: ID!
  name: String!
  description: String!
  icon: String!
  category: String!
  rarity: String!
  unlockedAt: String
}

type Challenge {
  id: ID!
  title: String!
  description: String!
  type: String!
  requirements: JSON!
  rewards: JSON!
  startDate: String!
  endDate: String!
  progress: Float
  status: String!
}

type Query {
  user: User
  nutritionSummary(date: String!): NutritionSummary
  leaderboard(type: String!, period: String!, limit: Int): [LeaderboardEntry!]!
  socialFeed(limit: Int, offset: Int): [Post!]!
}

type Mutation {
  updateProfile(input: ProfileInput!): User!
  logMeal(input: MealLogInput!): MealLog!
  setNutritionGoals(input: NutritionGoalsInput!): [NutritionGoal!]!
  joinChallenge(challengeId: ID!): Challenge!
  createPost(input: PostInput!): Post!
  likePost(postId: ID!): Post!
  addComment(postId: ID!, content: String!): Comment!
}

type Subscription {
  userProgressUpdated: UserProgress!
  newAchievement: Achievement!
  challengeCompleted: Challenge!
}
```

### 2. GraphQL Resolvers
```typescript
// GraphQL resolvers
const resolvers = {
  Query: {
    user: async (parent: any, args: any, context: any) => {
      return await userService.getUser(context.userId);
    },

    nutritionSummary: async (parent: any, args: any, context: any) => {
      return await nutritionService.getDailySummary(context.userId, args.date);
    },

    leaderboard: async (parent: any, args: any, context: any) => {
      return await leaderboardService.getLeaderboard(
        args.type,
        args.period,
        args.limit || 100
      );
    },

    socialFeed: async (parent: any, args: any, context: any) => {
      return await socialService.getFeed(
        context.userId,
        args.limit || 20,
        args.offset || 0
      );
    }
  },

  Mutation: {
    updateProfile: async (parent: any, args: any, context: any) => {
      return await userService.updateProfile(context.userId, args.input);
    },

    logMeal: async (parent: any, args: any, context: any) => {
      return await nutritionService.logMeal(context.userId, args.input);
    },

    setNutritionGoals: async (parent: any, args: any, context: any) => {
      return await nutritionService.setGoals(context.userId, args.input);
    },

    joinChallenge: async (parent: any, args: any, context: any) => {
      return await gamificationService.joinChallenge(context.userId, args.challengeId);
    },

    createPost: async (parent: any, args: any, context: any) => {
      return await socialService.createPost(context.userId, args.input);
    },

    likePost: async (parent: any, args: any, context: any) => {
      return await socialService.likePost(context.userId, args.postId);
    },

    addComment: async (parent: any, args: any, context: any) => {
      return await socialService.addComment(context.userId, args.postId, args.content);
    }
  },

  Subscription: {
    userProgressUpdated: {
      subscribe: (parent: any, args: any, context: any) => {
        return pubsub.asyncIterator(`USER_PROGRESS_${context.userId}`);
      }
    },

    newAchievement: {
      subscribe: (parent: any, args: any, context: any) => {
        return pubsub.asyncIterator(`ACHIEVEMENT_${context.userId}`);
      }
    },

    challengeCompleted: {
      subscribe: (parent: any, args: any, context: any) => {
        return pubsub.asyncIterator(`CHALLENGE_${context.userId}`);
      }
    }
  }
};
```

## Authentication and Authorization

### 1. JWT Implementation
```typescript
// JWT service
import jwt from 'jsonwebtoken';

class JWTService {
  private secret: string;
  private expiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  generateTokens(userId: string, userData: any): { accessToken: string; refreshToken: string } {
    const accessToken = jwt.sign(
      { userId, ...userData },
      this.secret,
      { expiresIn: this.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      this.secret,
      { expiresIn: this.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  refreshToken(refreshToken: string): string {
    const decoded = this.verifyToken(refreshToken);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }

    return jwt.sign(
      { userId: decoded.userId },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }
}

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token required'
      }
    });
  }

  try {
    const jwtService = new JWTService();
    const decoded = jwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Invalid or expired token'
      }
    });
  }
};
```

### 2. Role-Based Access Control
```typescript
// RBAC implementation
enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

enum Permission {
  READ_USER = 'read:user',
  WRITE_USER = 'write:user',
  DELETE_USER = 'delete:user',
  READ_ADMIN = 'read:admin',
  WRITE_ADMIN = 'write:admin'
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_USER, Permission.WRITE_USER],
  [Role.MODERATOR]: [Permission.READ_USER, Permission.WRITE_USER, Permission.DELETE_USER],
  [Role.ADMIN]: Object.values(Permission)
};

const requirePermission = (permission: Permission) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user.role as Role;
    const userPermissions = rolePermissions[userRole] || [];

    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
};

// Usage in routes
app.get('/api/v1/admin/users', 
  authenticateToken, 
  requirePermission(Permission.READ_ADMIN),
  (req, res) => {
    // Admin-only endpoint
  }
);
```

## Rate Limiting

### 1. Rate Limiting Implementation
```typescript
// Rate limiting service
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// General API rate limiting
const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication rate limiting
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later'
    }
  },
  skipSuccessfulRequests: true,
});

// Search rate limiting
const searchLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 search requests per minute
  message: {
    success: false,
    error: {
      code: 'SEARCH_RATE_LIMIT_EXCEEDED',
      message: 'Too many search requests, please try again later'
    }
  }
});

// Apply rate limiting to routes
app.use('/api/v1/', generalLimiter);
app.use('/api/v1/auth/', authLimiter);
app.use('/api/v1/nutrition/foods/search', searchLimiter);
```

## API Versioning

### 1. Versioning Strategy
```typescript
// API versioning middleware
const apiVersioning = (req: any, res: any, next: any) => {
  const version = req.headers['api-version'] || req.query.version || 'v1';
  
  // Validate version
  const supportedVersions = ['v1', 'v2'];
  if (!supportedVersions.includes(version)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_VERSION',
        message: `API version ${version} is not supported. Supported versions: ${supportedVersions.join(', ')}`
      }
    });
  }

  req.apiVersion = version;
  next();
};

// Version-specific routes
app.use('/api/v1/', apiVersioning, v1Routes);
app.use('/api/v2/', apiVersioning, v2Routes);

// Version-specific response formatting
const formatResponse = (req: any, res: any, next: any) => {
  const originalJson = res.json;
  
  res.json = function(data: any) {
    const version = req.apiVersion;
    
    if (version === 'v2') {
      // V2 response format
      data = {
        ...data,
        version: 'v2',
        timestamp: new Date().toISOString()
      };
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};
```

## Error Handling

### 1. Global Error Handler
```typescript
// Global error handler
const errorHandler = (error: any, req: any, res: any, next: any) => {
  console.error('API Error:', error);

  let statusCode = 500;
  let errorCode = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected error occurred';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid input data';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = 'Authentication required';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    message = 'Access denied';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = 'Resource not found';
  } else if (error.name === 'ConflictError') {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = 'Resource conflict';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: error.details || null
    },
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
};

// Custom error classes
class ValidationError extends Error {
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
```

## API Documentation

### 1. OpenAPI Specification
```yaml
# OpenAPI 3.0 specification
openapi: 3.0.0
info:
  title: Diet Planner Game API
  description: API for the Diet Planner Game application
  version: 1.0.0
  contact:
    name: API Support
    email: support@dietgame.com

servers:
  - url: https://api.dietgame.com/v1
    description: Production server
  - url: https://staging-api.dietgame.com/v1
    description: Staging server

paths:
  /auth/register:
    post:
      summary: Register a new user
      tags:
        - Authentication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: User registered successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RegisterResponse'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

  /users/profile:
    get:
      summary: Get user profile
      tags:
        - Users
      security:
        - bearerAuth: []
      responses:
        '200':
          description: User profile retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    RegisterRequest:
      type: object
      required:
        - email
        - username
        - password
        - firstName
        - lastName
      properties:
        email:
          type: string
          format: email
        username:
          type: string
          minLength: 3
          maxLength: 50
        password:
          type: string
          minLength: 8
        firstName:
          type: string
          maxLength: 100
        lastName:
          type: string
          maxLength: 100

    RegisterResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
          properties:
            user:
              $ref: '#/components/schemas/User'
            tokens:
              $ref: '#/components/schemas/Tokens'
        message:
          type: string
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
        timestamp:
          type: string
          format: date-time
        requestId:
          type: string
```

## Testing Strategy

### 1. API Testing
```typescript
// API test suite
import request from 'supertest';
import app from '../app';

describe('API Tests', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Register and login user for tests
    const registerResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword123'
      });

    authToken = loginResponse.body.data.tokens.accessToken;
    userId = loginResponse.body.data.user.id;
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'newpassword123',
          firstName: 'New',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('User Management', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = Array(101).fill(null).map(() =>
        request(app)
          .get('/api/v1/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
```

## Future Enhancements

### 1. Advanced Features
- **GraphQL Subscriptions**: Real-time data updates
- **API Caching**: Intelligent caching strategies
- **Request/Response Compression**: Gzip compression
- **API Analytics**: Usage analytics and insights

### 2. Performance Optimizations
- **Connection Pooling**: Efficient database connections
- **Response Streaming**: Stream large responses
- **Batch Operations**: Batch multiple operations
- **CDN Integration**: Content delivery optimization

