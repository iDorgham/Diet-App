# AI Service Integration Contracts

## Overview

This document defines the contracts for AI service integration in the Diet Game application, including AI Coach interactions, food recognition, nutrition analysis, and personalized recommendations.

## AI Service Configuration

### Service Endpoints
```typescript
interface AIServiceConfig {
  baseUrl: string;
  apiKey: string;
  model: {
    chat: 'gpt-4-turbo' | 'gpt-3.5-turbo' | 'claude-3-opus';
    vision: 'gpt-4-vision' | 'claude-3-sonnet';
    embedding: 'text-embedding-ada-002' | 'text-embedding-3-small';
  };
  timeout: number;
  retryAttempts: number;
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}

// Environment-specific configurations
const aiServiceConfigs = {
  development: {
    baseUrl: 'https://api-dev.dietgame.com/ai',
    apiKey: process.env.AI_API_KEY_DEV,
    model: {
      chat: 'gpt-3.5-turbo',
      vision: 'gpt-4-vision',
      embedding: 'text-embedding-ada-002'
    },
    timeout: 30000,
    retryAttempts: 3,
    rateLimits: {
      requestsPerMinute: 60,
      tokensPerMinute: 90000
    }
  },
  production: {
    baseUrl: 'https://api.dietgame.com/ai',
    apiKey: process.env.AI_API_KEY_PROD,
    model: {
      chat: 'gpt-4-turbo',
      vision: 'gpt-4-vision',
      embedding: 'text-embedding-3-small'
    },
    timeout: 60000,
    retryAttempts: 5,
    rateLimits: {
      requestsPerMinute: 100,
      tokensPerMinute: 150000
    }
  }
};
```

## AI Coach Chat Contracts

### Chat Request Contract
```typescript
interface AIChatRequest {
  message: string;
  context: {
    userId: string;
    conversationId?: string;
    userProfile: {
      dietType: string;
      bodyType: string;
      goals: string[];
      preferences: string[];
      restrictions: string[];
    };
    recentActivity: {
      meals: Array<{
        type: string;
        name: string;
        timestamp: string;
        calories: number;
      }>;
      tasks: Array<{
        type: string;
        status: string;
        completedAt?: string;
      }>;
      achievements: Array<{
        name: string;
        unlockedAt: string;
      }>;
    };
    currentContext: {
      timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      currentTask?: string;
      mood?: 'motivated' | 'struggling' | 'neutral' | 'excited';
      energyLevel?: 'low' | 'medium' | 'high';
    };
  };
  options?: {
    maxTokens?: number;
    temperature?: number;
    includeSuggestions?: boolean;
    includeMotivation?: boolean;
  };
}

// Chat Response Contract
interface AIChatResponse {
  success: boolean;
  data: {
    response: string;
    conversationId: string;
    suggestions?: Array<{
      type: 'task' | 'tip' | 'recipe' | 'exercise' | 'motivation';
      title: string;
      description: string;
      action?: {
        type: string;
        data: any;
      };
      priority: 'low' | 'medium' | 'high';
    }>;
    motivation?: {
      message: string;
      type: 'encouragement' | 'celebration' | 'challenge' | 'support';
      intensity: number; // 1-10
    };
    xpAwarded: number;
    metadata: {
      model: string;
      tokensUsed: number;
      responseTime: number;
      confidence: number;
    };
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
```

### Conversation Management
```typescript
// Conversation History Contract
interface ConversationHistory {
  conversationId: string;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    metadata?: {
      tokensUsed?: number;
      suggestions?: any[];
      xpAwarded?: number;
    };
  }>;
  context: {
    dietType: string;
    goals: string[];
    preferences: string[];
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Conversation Operations
interface ConversationOperations {
  createConversation(userId: string, initialContext: any): Promise<string>;
  getConversation(conversationId: string): Promise<ConversationHistory>;
  updateConversation(conversationId: string, message: any): Promise<void>;
  deleteConversation(conversationId: string): Promise<void>;
  getConversationHistory(userId: string, limit?: number): Promise<ConversationHistory[]>;
}
```

## Food Recognition Contracts

### Image Recognition Request
```typescript
interface FoodRecognitionRequest {
  image: {
    data: string; // base64 encoded image
    format: 'jpeg' | 'png' | 'webp';
    size: number; // bytes
  };
  context?: {
    userId: string;
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timeOfDay?: string;
    userPreferences?: string[];
    dietaryRestrictions?: string[];
  };
  options?: {
    maxResults?: number;
    confidenceThreshold?: number;
    includeNutrition?: boolean;
    includeRecipes?: boolean;
  };
}

// Food Recognition Response
interface FoodRecognitionResponse {
  success: boolean;
  data: {
    recognizedFoods: Array<{
      name: string;
      confidence: number;
      category: string;
      portionSize?: {
        estimated: number;
        unit: string;
        confidence: number;
      };
      nutrition?: {
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
      };
      alternatives?: Array<{
        name: string;
        confidence: number;
        nutrition: any;
      }>;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
    suggestions: Array<{
      type: 'portion_adjustment' | 'alternative_food' | 'meal_completion';
      message: string;
      action?: any;
    }>;
    metadata: {
      model: string;
      processingTime: number;
      imageQuality: 'low' | 'medium' | 'high';
    };
  };
  error?: {
    code: 'IMAGE_TOO_LARGE' | 'UNSUPPORTED_FORMAT' | 'NO_FOOD_DETECTED' | 'LOW_CONFIDENCE';
    message: string;
  };
}
```

### Barcode Recognition Contract
```typescript
interface BarcodeRecognitionRequest {
  barcode: string;
  context?: {
    userId: string;
    location?: string;
    mealType?: string;
  };
}

interface BarcodeRecognitionResponse {
  success: boolean;
  data: {
    product: {
      name: string;
      brand: string;
      category: string;
      barcode: string;
      nutrition: {
        servingSize: number;
        servingUnit: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
        ingredients?: string[];
        allergens?: string[];
      };
      imageUrl?: string;
      verified: boolean;
    };
    suggestions: Array<{
      type: 'healthier_alternative' | 'portion_guidance' | 'meal_pairing';
      message: string;
      product?: any;
    }>;
  };
  error?: {
    code: 'PRODUCT_NOT_FOUND' | 'INVALID_BARCODE' | 'DATABASE_ERROR';
    message: string;
  };
}
```

## Nutrition Analysis Contracts

### Meal Analysis Request
```typescript
interface MealAnalysisRequest {
  meal: {
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
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timestamp: string;
  };
  userContext: {
    userId: string;
    goals: string[];
    dietaryRestrictions: string[];
    dailyTargets: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    recentMeals: Array<{
      type: string;
      calories: number;
      timestamp: string;
    }>;
  };
}

// Meal Analysis Response
interface MealAnalysisResponse {
  success: boolean;
  data: {
    analysis: {
      overall: {
        score: number; // 1-10
        rating: 'excellent' | 'good' | 'fair' | 'poor';
        summary: string;
      };
      strengths: string[];
      improvements: string[];
      warnings: Array<{
        type: 'calorie_excess' | 'nutrient_deficiency' | 'allergen_risk' | 'portion_size';
        message: string;
        severity: 'low' | 'medium' | 'high';
      }>;
    };
    recommendations: Array<{
      type: 'add_food' | 'reduce_portion' | 'substitute_ingredient' | 'timing_adjustment';
      priority: 'low' | 'medium' | 'high';
      message: string;
      suggestion: {
        food?: string;
        quantity?: number;
        unit?: string;
        reason: string;
      };
    }>;
    nextMeal: {
      suggestions: string[];
      timing: string;
      calorieTarget: number;
    };
    xpAwarded: number;
  };
}
```

### Daily Nutrition Analysis
```typescript
interface DailyNutritionAnalysisRequest {
  userId: string;
  date: string;
  meals: Array<{
    type: string;
    name: string;
    calories: number;
    macros: any;
    timestamp: string;
  }>;
  userGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weight?: number;
    activityLevel: string;
  };
}

interface DailyNutritionAnalysisResponse {
  success: boolean;
  data: {
    summary: {
      totalCalories: number;
      goalProgress: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
      mealDistribution: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snacks: number;
      };
    };
    insights: Array<{
      type: 'achievement' | 'improvement' | 'warning' | 'tip';
      title: string;
      message: string;
      actionable: boolean;
      priority: 'low' | 'medium' | 'high';
    }>;
    trends: {
      calorieTrend: 'increasing' | 'decreasing' | 'stable';
      macroBalance: 'balanced' | 'protein_heavy' | 'carb_heavy' | 'fat_heavy';
      mealTiming: 'optimal' | 'late_night' | 'irregular' | 'skipping_meals';
    };
    recommendations: Array<{
      category: 'nutrition' | 'timing' | 'variety' | 'hydration';
      message: string;
      action?: string;
    }>;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      unlocked: boolean;
      progress?: number;
    }>;
  };
}
```

## Personalized Recommendations Contracts

### Meal Recommendations Request
```typescript
interface MealRecommendationsRequest {
  userId: string;
  context: {
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    timeOfDay: string;
    calorieTarget: number;
    preferences: {
      cuisine: string[];
      cookingTime: 'quick' | 'medium' | 'elaborate';
      difficulty: 'easy' | 'medium' | 'hard';
      ingredients: string[];
      avoidIngredients: string[];
    };
    dietaryRestrictions: string[];
    recentMeals: Array<{
      name: string;
      type: string;
      timestamp: string;
    }>;
    availableIngredients?: string[];
    budget?: 'low' | 'medium' | 'high';
  };
  options?: {
    maxRecommendations?: number;
    includeNutrition?: boolean;
    includeRecipes?: boolean;
    includeAlternatives?: boolean;
  };
}

// Meal Recommendations Response
interface MealRecommendationsResponse {
  success: boolean;
  data: {
    recommendations: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      cuisine: string;
      difficulty: 'easy' | 'medium' | 'hard';
      prepTime: number; // minutes
      cookTime: number; // minutes
      servings: number;
      nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
        sugar?: number;
        sodium?: number;
      };
      ingredients: Array<{
        name: string;
        quantity: number;
        unit: string;
        optional: boolean;
      }>;
      instructions: string[];
      imageUrl?: string;
      confidence: number;
      reasons: string[];
      alternatives?: Array<{
        name: string;
        difference: string;
        nutrition: any;
      }>;
    }>;
    summary: {
      totalRecommendations: number;
      averagePrepTime: number;
      averageCalories: number;
      varietyScore: number;
    };
    insights: Array<{
      type: 'nutrition_balance' | 'variety' | 'preference_match' | 'goal_alignment';
      message: string;
      actionable: boolean;
    }>;
  };
}
```

### Task Recommendations Contract
```typescript
interface TaskRecommendationsRequest {
  userId: string;
  context: {
    currentLevel: number;
    currentXP: number;
    recentTasks: Array<{
      type: string;
      difficulty: string;
      completedAt: string;
      xpEarned: number;
    }>;
    userGoals: string[];
    availableTime: number; // minutes
    energyLevel: 'low' | 'medium' | 'high';
    preferences: {
      taskTypes: string[];
      difficulty: string[];
      timeOfDay: string[];
    };
  };
}

interface TaskRecommendationsResponse {
  success: boolean;
  data: {
    recommendedTasks: Array<{
      id: string;
      name: string;
      description: string;
      type: string;
      difficulty: 'easy' | 'medium' | 'hard';
      estimatedTime: number; // minutes
      xpReward: number;
      coinReward: number;
      requirements: string[];
      confidence: number;
      reasons: string[];
      prerequisites?: string[];
    }>;
    personalizedInsights: Array<{
      type: 'skill_development' | 'goal_progress' | 'variety' | 'challenge';
      message: string;
      actionable: boolean;
    }>;
    suggestedSchedule: Array<{
      timeSlot: string;
      taskId: string;
      reason: string;
    }>;
  };
}
```

## AI Service Error Handling

### Error Codes
```typescript
enum AIServiceErrorCode {
  // General Errors
  SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'AI_RATE_LIMIT_EXCEEDED',
  INVALID_REQUEST = 'AI_INVALID_REQUEST',
  TIMEOUT = 'AI_TIMEOUT',
  
  // Authentication Errors
  INVALID_API_KEY = 'AI_INVALID_API_KEY',
  QUOTA_EXCEEDED = 'AI_QUOTA_EXCEEDED',
  
  // Model Errors
  MODEL_UNAVAILABLE = 'AI_MODEL_UNAVAILABLE',
  MODEL_OVERLOADED = 'AI_MODEL_OVERLOADED',
  INVALID_MODEL = 'AI_INVALID_MODEL',
  
  // Content Errors
  CONTENT_FILTERED = 'AI_CONTENT_FILTERED',
  INVALID_INPUT = 'AI_INVALID_INPUT',
  IMAGE_TOO_LARGE = 'AI_IMAGE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'AI_UNSUPPORTED_FORMAT',
  
  // Processing Errors
  PROCESSING_FAILED = 'AI_PROCESSING_FAILED',
  LOW_CONFIDENCE = 'AI_LOW_CONFIDENCE',
  NO_RESULTS = 'AI_NO_RESULTS'
}

// Error Response Contract
interface AIServiceErrorResponse {
  success: false;
  error: {
    code: AIServiceErrorCode;
    message: string;
    details?: {
      retryable: boolean;
      retryAfter?: number; // seconds
      alternativeAction?: string;
    };
    timestamp: string;
    requestId: string;
  };
}
```

### Retry Strategy
```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors: AIServiceErrorCode[];
}

const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    AIServiceErrorCode.SERVICE_UNAVAILABLE,
    AIServiceErrorCode.MODEL_OVERLOADED,
    AIServiceErrorCode.TIMEOUT,
    AIServiceErrorCode.RATE_LIMIT_EXCEEDED
  ]
};
```

## Performance Monitoring Contracts

### Metrics Collection
```typescript
interface AIServiceMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
  };
  tokens: {
    input: number;
    output: number;
    total: number;
    cost: number;
  };
  errors: {
    byCode: Record<AIServiceErrorCode, number>;
    byEndpoint: Record<string, number>;
    retryRate: number;
  };
  models: {
    usage: Record<string, number>;
    performance: Record<string, {
      averageResponseTime: number;
      errorRate: number;
      successRate: number;
    }>;
  };
}

// Metrics Collection Contract
interface MetricsCollection {
  collectMetrics(metrics: AIServiceMetrics): Promise<void>;
  getMetrics(timeRange: {
    start: string;
    end: string;
  }): Promise<AIServiceMetrics>;
  getAlerts(): Promise<Array<{
    type: 'error_rate' | 'response_time' | 'quota_usage';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>>;
}
```

## AI Service Integration Examples

### JavaScript/TypeScript Integration
```typescript
class AIServiceClient {
  private config: AIServiceConfig;
  
  constructor(config: AIServiceConfig) {
    this.config = config;
  }
  
  async chat(request: AIChatRequest): Promise<AIChatResponse> {
    const response = await fetch(`${this.config.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Request-ID': this.generateRequestId()
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model.chat
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async recognizeFood(request: FoodRecognitionRequest): Promise<FoodRecognitionResponse> {
    const response = await fetch(`${this.config.baseUrl}/vision/recognize-food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Request-ID': this.generateRequestId()
      },
      body: JSON.stringify({
        ...request,
        model: this.config.model.vision
      })
    });
    
    return response.json();
  }
  
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### Python Integration
```python
import requests
import json
from typing import Dict, Any, Optional

class AIServiceClient:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.base_url = config['baseUrl']
        self.api_key = config['apiKey']
    
    def chat(self, request: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_url}/chat",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}',
                'X-Request-ID': self._generate_request_id()
            },
            json={
                **request,
                'model': self.config['model']['chat']
            },
            timeout=self.config['timeout']
        )
        
        response.raise_for_status()
        return response.json()
    
    def recognize_food(self, request: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_url}/vision/recognize-food",
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {self.api_key}',
                'X-Request-ID': self._generate_request_id()
            },
            json={
                **request,
                'model': self.config['model']['vision']
            },
            timeout=self.config['timeout']
        )
        
        response.raise_for_status()
        return response.json()
    
    def _generate_request_id(self) -> str:
        import time
        import random
        return f"req_{int(time.time() * 1000)}_{random.randint(100000, 999999)}"
```

---

*Last updated: January 15, 2024*  
*AI Service Version: v2.1.0*
