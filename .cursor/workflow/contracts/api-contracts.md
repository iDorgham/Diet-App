# API Contracts

## Overview
This document defines the API contracts for the Diet Game application, including request/response schemas, error handling, and authentication requirements.

## Contract Standards

### Base Response Format
```typescript
interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

### Error Codes
```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}
```

## Authentication Contracts

### Anonymous Authentication
```typescript
// POST /api/auth/anonymous
interface AnonymousAuthRequest {
  deviceId?: string;
  userAgent?: string;
}

interface AnonymousAuthResponse {
  success: true;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      isAnonymous: true;
      createdAt: string;
    };
  };
}
```

### Token Refresh
```typescript
// POST /api/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  success: true;
  data: {
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
}
```

## User Management Contracts

### Get User Profile
```typescript
// GET /api/users/profile
interface GetUserProfileResponse {
  success: true;
  data: {
    id: string;
    userName: string;
    dietType: 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'balanced';
    bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
    weight: string;
    goals: string[];
    createdAt: string;
    updatedAt: string;
  };
}
```

### Update User Profile
```typescript
// PUT /api/users/profile
interface UpdateUserProfileRequest {
  userName?: string;
  dietType?: 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'balanced';
  bodyType?: 'ectomorph' | 'mesomorph' | 'endomorph';
  weight?: string;
  goals?: string[];
}

interface UpdateUserProfileResponse {
  success: true;
  data: {
    id: string;
    userName: string;
    dietType: string;
    bodyType: string;
    weight: string;
    goals: string[];
    updatedAt: string;
  };
}
```

### Get User Progress
```typescript
// GET /api/users/progress
interface GetUserProgressResponse {
  success: true;
  data: {
    score: number;
    coins: number;
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    recipesUnlocked: number;
    hasClaimedGift: boolean;
    streak: number;
    lastActiveDate: string;
  };
}
```

## Task Management Contracts

### Get Available Tasks
```typescript
// GET /api/tasks
interface GetTasksRequest {
  type?: 'meal' | 'shopping' | 'cooking' | 'exercise' | 'education';
  difficulty?: 'easy' | 'medium' | 'hard';
  limit?: number;
  offset?: number;
}

interface GetTasksResponse {
  success: true;
  data: {
    tasks: Array<{
      id: string;
      name: string;
      description: string;
      type: string;
      difficulty: string;
      xpReward: number;
      coinReward: number;
      requirements: string[];
      isActive: boolean;
      createdAt: string;
    }>;
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}
```

### Complete Task
```typescript
// POST /api/tasks/:id/complete
interface CompleteTaskRequest {
  taskId: string;
  completionData?: {
    notes?: string;
    duration?: number;
    quality?: number;
  };
}

interface CompleteTaskResponse {
  success: true;
  data: {
    taskId: string;
    completedAt: string;
    rewards: {
      xp: {
        base: number;
        multiplier: number;
        bonus: number;
        total: number;
      };
      coins: number;
      achievements?: Array<{
        id: string;
        name: string;
        description: string;
        reward: {
          xp: number;
          coins: number;
          badge: string;
        };
      }>;
    };
    newProgress: {
      level: number;
      currentXP: number;
      xpToNextLevel: number;
      totalCoins: number;
    };
  };
}
```

## AI Coach Contracts

### Chat with AI Coach
```typescript
// POST /api/ai/chat
interface AIChatRequest {
  message: string;
  context?: {
    currentTask?: string;
    userGoals?: string[];
    recentActivity?: string[];
  };
  conversationId?: string;
}

interface AIChatResponse {
  success: true;
  data: {
    response: string;
    conversationId: string;
    suggestions?: Array<{
      type: 'task' | 'tip' | 'recipe' | 'exercise';
      title: string;
      description: string;
      action?: string;
    }>;
    xpAwarded: number;
  };
}
```

### Get AI Insights
```typescript
// GET /api/ai/insights
interface GetAIInsightsRequest {
  type?: 'nutrition' | 'progress' | 'recommendations';
  dateRange?: {
    start: string;
    end: string;
  };
}

interface GetAIInsightsResponse {
  success: true;
  data: {
    insights: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      confidence: number;
      actionable: boolean;
      createdAt: string;
    }>;
    summary: {
      totalInsights: number;
      actionableInsights: number;
      averageConfidence: number;
    };
  };
}
```

## Nutrition Tracking Contracts

### Log Meal
```typescript
// POST /api/nutrition/meals
interface LogMealRequest {
  meal: {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    ingredients: Array<{
      name: string;
      quantity: number;
      unit: string;
      calories: number;
      macros: {
        protein: number;
        carbs: number;
        fat: number;
      };
    }>;
    totalCalories: number;
    totalMacros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    timestamp: string;
  };
}

interface LogMealResponse {
  success: true;
  data: {
    mealId: string;
    loggedAt: string;
    nutritionSummary: {
      dailyCalories: number;
      dailyMacros: {
        protein: number;
        carbs: number;
        fat: number;
      };
      goalProgress: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    };
    xpAwarded: number;
  };
}
```

### Get Nutrition Analytics
```typescript
// GET /api/nutrition/analytics
interface GetNutritionAnalyticsRequest {
  dateRange: {
    start: string;
    end: string;
  };
  groupBy?: 'day' | 'week' | 'month';
}

interface GetNutritionAnalyticsResponse {
  success: true;
  data: {
    analytics: Array<{
      date: string;
      calories: number;
      macros: {
        protein: number;
        carbs: number;
        fat: number;
      };
      meals: number;
      waterIntake: number;
    }>;
    summary: {
      averageCalories: number;
      averageMacros: {
        protein: number;
        carbs: number;
        fat: number;
      };
      totalMeals: number;
      averageWaterIntake: number;
    };
    trends: {
      calories: 'increasing' | 'decreasing' | 'stable';
      protein: 'increasing' | 'decreasing' | 'stable';
      carbs: 'increasing' | 'decreasing' | 'stable';
      fat: 'increasing' | 'decreasing' | 'stable';
    };
  };
}
```

## Gamification Contracts

### Get Achievements
```typescript
// GET /api/gamification/achievements
interface GetAchievementsResponse {
  success: true;
  data: {
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      type: 'streak' | 'level' | 'task' | 'social' | 'special';
      requirement: number;
      currentProgress: number;
      isUnlocked: boolean;
      unlockedAt?: string;
      reward: {
        xp: number;
        coins: number;
        badge: string;
      };
    }>;
    summary: {
      totalAchievements: number;
      unlockedAchievements: number;
      totalXpEarned: number;
      totalCoinsEarned: number;
    };
  };
}
```

### Get Leaderboard
```typescript
// GET /api/gamification/leaderboard
interface GetLeaderboardRequest {
  type: 'weekly' | 'monthly' | 'all-time';
  category?: 'xp' | 'streak' | 'tasks' | 'achievements';
  limit?: number;
}

interface GetLeaderboardResponse {
  success: true;
  data: {
    leaderboard: Array<{
      rank: number;
      userId: string;
      userName: string;
      score: number;
      level: number;
      avatar?: string;
      isCurrentUser: boolean;
    }>;
    currentUser: {
      rank: number;
      score: number;
      level: number;
    };
    period: {
      type: string;
      start: string;
      end: string;
    };
  };
}
```

## Error Response Contracts

### Validation Error
```typescript
interface ValidationErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR';
    message: 'Validation failed';
    details: {
      field: string;
      message: string;
      value: any;
    }[];
  };
}
```

### Authentication Error
```typescript
interface AuthenticationErrorResponse {
  success: false;
  error: {
    code: 'AUTHENTICATION_ERROR';
    message: 'Authentication required';
    details: {
      reason: 'token_expired' | 'token_invalid' | 'token_missing';
    };
  };
}
```

### Rate Limit Error
```typescript
interface RateLimitErrorResponse {
  success: false;
  error: {
    code: 'RATE_LIMIT_EXCEEDED';
    message: 'Rate limit exceeded';
    details: {
      limit: number;
      remaining: number;
      resetTime: string;
    };
  };
}
```

## Request/Response Headers

### Required Headers
```typescript
interface RequiredHeaders {
  'Content-Type': 'application/json';
  'Authorization': 'Bearer <token>';
  'X-Request-ID': string;
  'X-Client-Version': string;
}
```

### Optional Headers
```typescript
interface OptionalHeaders {
  'X-User-Agent': string;
  'X-Device-ID': string;
  'X-Session-ID': string;
  'Accept-Language': string;
}
```

## Rate Limiting

### Rate Limits
```typescript
interface RateLimits {
  general: {
    requests: 100;
    window: '15m';
  };
  auth: {
    requests: 5;
    window: '15m';
  };
  ai: {
    requests: 10;
    window: '1m';
  };
  nutrition: {
    requests: 50;
    window: '1h';
  };
}
```

## Versioning

### API Versioning
- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Header Versioning**: `API-Version: v1`
- **Backward Compatibility**: 2 major versions
- **Deprecation Notice**: 6 months

### Version Headers
```typescript
interface VersionHeaders {
  'API-Version': 'v1';
  'X-API-Version': '1.0.0';
  'X-Supported-Versions': 'v1,v2';
}
```

## Contract Testing

### Contract Validation
```typescript
// Example contract validation
const validateApiContract = (request: any, response: any, contract: ApiContract) => {
  const requestValidator = new Ajv().compile(contract.requestSchema);
  const responseValidator = new Ajv().compile(contract.responseSchema);
  
  const isRequestValid = requestValidator(request);
  const isResponseValid = responseValidator(response);
  
  if (!isRequestValid) {
    throw new Error(`Request validation failed: ${requestValidator.errors}`);
  }
  
  if (!isResponseValid) {
    throw new Error(`Response validation failed: ${responseValidator.errors}`);
  }
  
  return true;
};
```

### Contract Examples
```typescript
// Example API contract
const userProfileContract: ApiContract = {
  endpoint: '/api/users/profile',
  method: 'GET',
  requestSchema: {
    type: 'object',
    properties: {
      headers: {
        type: 'object',
        required: ['Authorization'],
        properties: {
          Authorization: { type: 'string', pattern: '^Bearer .+' }
        }
      }
    }
  },
  responseSchema: {
    type: 'object',
    required: ['success', 'data'],
    properties: {
      success: { type: 'boolean' },
      data: {
        type: 'object',
        required: ['id', 'userName', 'dietType'],
        properties: {
          id: { type: 'string' },
          userName: { type: 'string' },
          dietType: { type: 'string', enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'balanced'] }
        }
      }
    }
  }
};
```

This API contract specification ensures consistent communication between the frontend and backend, with proper validation, error handling, and versioning strategies.
