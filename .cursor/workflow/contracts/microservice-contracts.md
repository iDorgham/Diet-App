# Microservice Contracts

## Overview
This document defines the contracts for internal microservices in the Diet Game application, including service-to-service communication, data contracts, and integration patterns.

## Base Microservice Contract

### Service Discovery
```typescript
interface MicroserviceInfo {
  name: string;
  version: string;
  host: string;
  port: number;
  health: ServiceHealth;
  capabilities: string[];
  dependencies: string[];
  endpoints: ServiceEndpoint[];
  metadata: Record<string, any>;
}

interface ServiceHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  lastCheck: string;
  responseTime: number;
  errorRate: number;
}

interface ServiceEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters: EndpointParameter[];
  response: EndpointResponse;
  authentication: AuthenticationRequirement;
}

interface EndpointParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: any;
}

interface EndpointResponse {
  statusCode: number;
  schema: any;
  description: string;
  example?: any;
}

interface AuthenticationRequirement {
  required: boolean;
  type: 'bearer' | 'api_key' | 'oauth2' | 'none';
  scopes?: string[];
}
```

### Service Communication
```typescript
interface ServiceRequest {
  id: string;
  service: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timeout: number;
  retries: number;
  correlationId: string;
  timestamp: string;
}

interface ServiceResponse {
  id: string;
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  error?: ServiceError;
  processingTime: number;
  timestamp: string;
}

interface ServiceError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  timestamp: string;
}
```

## User Microservice

### User Service Contract
```typescript
interface UserMicroservice {
  name: 'user-service';
  version: '1.0.0';
  baseUrl: '/api/v1/users';
  
  // User Management
  'GET /users/{userId}': {
    request: {
      params: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { user: User };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /users': {
    request: {
      body: CreateUserRequest;
      headers: { 'Content-Type': 'application/json' };
    };
    response: {
      201: { user: User };
      400: { error: 'Invalid user data' };
      409: { error: 'User already exists' };
    };
  };
  
  'PUT /users/{userId}': {
    request: {
      params: { userId: string };
      body: UpdateUserRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { user: User };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /users/{userId}': {
    request: {
      params: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // User Search
  'GET /users/search': {
    request: {
      query: {
        q: string;
        limit?: number;
        offset?: number;
        filters?: string;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { users: User[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  // User Statistics
  'GET /users/{userId}/stats': {
    request: {
      params: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { stats: UserStatistics };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
}

interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  profile: Partial<UserProfile>;
}

interface UpdateUserRequest {
  email?: string;
  username?: string;
  profile?: Partial<UserProfile>;
}
```

## Task Microservice

### Task Service Contract
```typescript
interface TaskMicroservice {
  name: 'task-service';
  version: '1.0.0';
  baseUrl: '/api/v1/tasks';
  
  // Task Management
  'GET /tasks': {
    request: {
      query: {
        type?: TaskType;
        difficulty?: TaskDifficulty;
        category?: TaskCategory;
        isActive?: boolean;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { tasks: Task[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /tasks/{taskId}': {
    request: {
      params: { taskId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { task: Task };
      404: { error: 'Task not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /tasks': {
    request: {
      body: CreateTaskRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { task: Task };
      400: { error: 'Invalid task data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /tasks/{taskId}': {
    request: {
      params: { taskId: string };
      body: UpdateTaskRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { task: Task };
      404: { error: 'Task not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Task Assignment
  'POST /tasks/{taskId}/assign': {
    request: {
      params: { taskId: string };
      body: AssignTaskRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { assignment: TaskAssignment };
      404: { error: 'Task not found' };
      400: { error: 'Invalid assignment data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Task Completion
  'POST /tasks/{taskId}/complete': {
    request: {
      params: { taskId: string };
      body: CompleteTaskRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { completion: TaskCompletion; rewards: TaskRewards };
      404: { error: 'Task not found' };
      400: { error: 'Invalid completion data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // User Tasks
  'GET /users/{userId}/tasks': {
    request: {
      params: { userId: string };
      query: {
        status?: 'assigned' | 'in_progress' | 'completed';
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { tasks: Task[]; total: number };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
}

interface CreateTaskRequest {
  name: string;
  description: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  category: TaskCategory;
  xpReward: number;
  coinReward: number;
  requirements: TaskRequirement[];
  instructions: string[];
  tips: string[];
  estimatedDuration: number;
  isRepeatable: boolean;
  cooldownHours?: number;
  prerequisites: string[];
  tags: string[];
}

interface UpdateTaskRequest {
  name?: string;
  description?: string;
  type?: TaskType;
  difficulty?: TaskDifficulty;
  category?: TaskCategory;
  xpReward?: number;
  coinReward?: number;
  isActive?: boolean;
  requirements?: TaskRequirement[];
  instructions?: string[];
  tips?: string[];
  estimatedDuration?: number;
  isRepeatable?: boolean;
  cooldownHours?: number;
  prerequisites?: string[];
  tags?: string[];
}

interface AssignTaskRequest {
  userId: string;
  assignedBy: string;
  priority: TaskPriority;
  dueDate?: string;
  context?: TaskContext;
}

interface CompleteTaskRequest {
  userId: string;
  completionData: TaskCompletionData;
  completedAt: string;
}

interface TaskRewards {
  xp: {
    base: number;
    multiplier: number;
    bonus: number;
    total: number;
  };
  coins: number;
  achievements?: Achievement[];
}
```

## Nutrition Microservice

### Nutrition Service Contract
```typescript
interface NutritionMicroservice {
  name: 'nutrition-service';
  version: '1.0.0';
  baseUrl: '/api/v1/nutrition';
  
  // Meal Management
  'GET /meals': {
    request: {
      query: {
        userId: string;
        type?: MealType;
        startDate?: string;
        endDate?: string;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { meals: Meal[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /meals/{mealId}': {
    request: {
      params: { mealId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { meal: Meal };
      404: { error: 'Meal not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /meals': {
    request: {
      body: CreateMealRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { meal: Meal; nutritionSummary: NutritionSummary };
      400: { error: 'Invalid meal data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /meals/{mealId}': {
    request: {
      params: { mealId: string };
      body: UpdateMealRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { meal: Meal };
      404: { error: 'Meal not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /meals/{mealId}': {
    request: {
      params: { mealId: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'Meal not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Food Database
  'GET /foods/search': {
    request: {
      query: {
        q: string;
        category?: IngredientCategory;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { foods: FoodItem[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /foods/{foodId}': {
    request: {
      params: { foodId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { food: FoodItem };
      404: { error: 'Food not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /foods/barcode/{barcode}': {
    request: {
      params: { barcode: string };
      headers: { Authorization: string };
    };
    response: {
      200: { food: FoodItem };
      404: { error: 'Food not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Nutrition Analytics
  'GET /analytics/daily': {
    request: {
      query: {
        userId: string;
        date: string;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { dailyNutrition: DailyNutrition };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /analytics/trends': {
    request: {
      query: {
        userId: string;
        startDate: string;
        endDate: string;
        groupBy?: 'day' | 'week' | 'month';
      };
      headers: { Authorization: string };
    };
    response: {
      200: { trends: NutritionTrends };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Nutrition Goals
  'GET /goals': {
    request: {
      query: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { goals: NutritionGoal[] };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /goals': {
    request: {
      body: CreateNutritionGoalRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { goal: NutritionGoal };
      400: { error: 'Invalid goal data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /goals/{goalId}': {
    request: {
      params: { goalId: string };
      body: UpdateNutritionGoalRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { goal: NutritionGoal };
      404: { error: 'Goal not found' };
      401: { error: 'Unauthorized' };
    };
  };
}

interface CreateMealRequest {
  userId: string;
  type: MealType;
  name: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  servingSize: number;
  servingUnit: string;
  timestamp: string;
  photos?: string[];
  notes?: string;
}

interface UpdateMealRequest {
  name?: string;
  ingredients?: Ingredient[];
  totalCalories?: number;
  totalMacros?: MacroNutrients;
  servingSize?: number;
  servingUnit?: string;
  photos?: string[];
  notes?: string;
}

interface NutritionSummary {
  dailyCalories: number;
  dailyMacros: MacroNutrients;
  goalProgress: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface CreateNutritionGoalRequest {
  userId: string;
  type: NutritionGoalType;
  target: number;
  unit: string;
  period: GoalPeriod;
  startDate: string;
  endDate?: string;
}

interface UpdateNutritionGoalRequest {
  target?: number;
  unit?: string;
  period?: GoalPeriod;
  endDate?: string;
  isActive?: boolean;
}
```

## Gamification Microservice

### Gamification Service Contract
```typescript
interface GamificationMicroservice {
  name: 'gamification-service';
  version: '1.0.0';
  baseUrl: '/api/v1/gamification';
  
  // Achievement Management
  'GET /achievements': {
    request: {
      query: {
        type?: AchievementType;
        category?: AchievementCategory;
        rarity?: AchievementRarity;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { achievements: Achievement[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /achievements/{achievementId}': {
    request: {
      params: { achievementId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { achievement: Achievement };
      404: { error: 'Achievement not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /users/{userId}/achievements': {
    request: {
      params: { userId: string };
      query: {
        unlocked?: boolean;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { achievements: UserAchievement[]; total: number };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /achievements/check': {
    request: {
      body: CheckAchievementsRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { unlockedAchievements: Achievement[] };
      400: { error: 'Invalid request data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Quest Management
  'GET /quests': {
    request: {
      query: {
        type?: QuestType;
        difficulty?: TaskDifficulty;
        isActive?: boolean;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { quests: Quest[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /quests/{questId}': {
    request: {
      params: { questId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { quest: Quest };
      404: { error: 'Quest not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /users/{userId}/quests': {
    request: {
      params: { userId: string };
      query: {
        status?: 'active' | 'completed' | 'failed';
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { quests: UserQuest[]; total: number };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /quests/{questId}/start': {
    request: {
      params: { questId: string };
      body: StartQuestRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { userQuest: UserQuest };
      404: { error: 'Quest not found' };
      400: { error: 'Cannot start quest' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /quests/{questId}/complete': {
    request: {
      params: { questId: string };
      body: CompleteQuestRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { completion: QuestCompletion; rewards: QuestRewards };
      404: { error: 'Quest not found' };
      400: { error: 'Cannot complete quest' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Progress Management
  'GET /users/{userId}/progress': {
    request: {
      params: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { progress: UserProgress };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /users/{userId}/xp': {
    request: {
      params: { userId: string };
      body: AddXPRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { xpResult: XPResult };
      404: { error: 'User not found' };
      400: { error: 'Invalid XP data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /users/{userId}/coins': {
    request: {
      params: { userId: string };
      body: AddCoinsRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { coinsResult: CoinsResult };
      404: { error: 'User not found' };
      400: { error: 'Invalid coins data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Leaderboard
  'GET /leaderboard': {
    request: {
      query: {
        type: LeaderboardType;
        category?: 'xp' | 'streak' | 'tasks' | 'achievements';
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { leaderboard: LeaderboardEntry[]; currentUser?: UserRank };
      401: { error: 'Unauthorized' };
    };
  };
}

interface CheckAchievementsRequest {
  userId: string;
  triggerType: string;
  triggerData: any;
  context: {
    userLevel: number;
    userStats: UserStatistics;
    recentActivity: string[];
  };
}

interface StartQuestRequest {
  userId: string;
  startedAt: string;
}

interface CompleteQuestRequest {
  userId: string;
  completedAt: string;
  completionData?: any;
}

interface QuestRewards {
  xp: number;
  coins: number;
  achievements: Achievement[];
  items: string[];
}

interface AddXPRequest {
  amount: number;
  source: string;
  sourceId?: string;
  multiplier?: number;
  bonus?: number;
}

interface AddCoinsRequest {
  amount: number;
  source: string;
  sourceId?: string;
}
```

## AI Microservice

### AI Service Contract
```typescript
interface AIMicroservice {
  name: 'ai-service';
  version: '1.0.0';
  baseUrl: '/api/v1/ai';
  
  // Chat and Conversation
  'POST /chat': {
    request: {
      body: ChatRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { response: AIResponse };
      400: { error: 'Invalid chat request' };
      401: { error: 'Unauthorized' };
      429: { error: 'Rate limit exceeded' };
    };
  };
  
  'GET /conversations/{conversationId}': {
    request: {
      params: { conversationId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { conversation: Conversation };
      404: { error: 'Conversation not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /conversations': {
    request: {
      body: CreateConversationRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { conversation: Conversation };
      400: { error: 'Invalid conversation data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /conversations/{conversationId}': {
    request: {
      params: { conversationId: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'Conversation not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // AI Insights
  'POST /insights/generate': {
    request: {
      body: GenerateInsightsRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { insights: AIInsight[] };
      400: { error: 'Invalid insights request' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /insights': {
    request: {
      query: {
        userId: string;
        type?: InsightType;
        category?: InsightCategory;
        isRead?: boolean;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { insights: AIInsight[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /insights/{insightId}/read': {
    request: {
      params: { insightId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { insight: AIInsight };
      404: { error: 'Insight not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Food Recognition
  'POST /food/recognize': {
    request: {
      body: FoodRecognitionRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { recognition: FoodRecognitionResult };
      400: { error: 'Invalid image data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /food/analyze': {
    request: {
      body: NutritionAnalysisRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { analysis: NutritionAnalysisResult };
      400: { error: 'Invalid image data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Recommendations
  'POST /recommendations/tasks': {
    request: {
      body: TaskRecommendationRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { recommendations: TaskRecommendation[] };
      400: { error: 'Invalid recommendation request' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /recommendations/meals': {
    request: {
      body: MealRecommendationRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { recommendations: MealRecommendation[] };
      400: { error: 'Invalid recommendation request' };
      401: { error: 'Unauthorized' };
    };
  };
}

interface ChatRequest {
  userId: string;
  message: string;
  context?: AIContext;
  conversationId?: string;
}

interface CreateConversationRequest {
  userId: string;
  title?: string;
}

interface GenerateInsightsRequest {
  userId: string;
  type: InsightType;
  data: any;
  context: {
    userProgress: UserProgress;
    recentActivity: string[];
    goals: string[];
  };
}

interface FoodRecognitionRequest {
  imageData: string; // base64 encoded
  userId: string;
}

interface NutritionAnalysisRequest {
  imageData: string; // base64 encoded
  userId: string;
  context?: {
    mealType?: MealType;
    previousMeals?: Meal[];
  };
}

interface TaskRecommendationRequest {
  userId: string;
  context: TaskContext;
  limit?: number;
}

interface MealRecommendationRequest {
  userId: string;
  preferences: MealPreferences;
  context: {
    dietaryRestrictions: string[];
    goals: string[];
    recentMeals: Meal[];
  };
  limit?: number;
}
```

## Notification Microservice

### Notification Service Contract
```typescript
interface NotificationMicroservice {
  name: 'notification-service';
  version: '1.0.0';
  baseUrl: '/api/v1/notifications';
  
  // Notification Management
  'POST /notifications': {
    request: {
      body: SendNotificationRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { result: NotificationResult };
      400: { error: 'Invalid notification data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'POST /notifications/bulk': {
    request: {
      body: SendBulkNotificationsRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { results: NotificationResult[] };
      400: { error: 'Invalid notification data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /notifications': {
    request: {
      query: {
        userId: string;
        type?: NotificationType;
        category?: NotificationCategory;
        isRead?: boolean;
        limit?: number;
        offset?: number;
      };
      headers: { Authorization: string };
    };
    response: {
      200: { notifications: Notification[]; total: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /notifications/{notificationId}/read': {
    request: {
      params: { notificationId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { notification: Notification };
      404: { error: 'Notification not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /notifications/read-all': {
    request: {
      body: { userId: string };
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { count: number };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /notifications/{notificationId}': {
    request: {
      params: { notificationId: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'Notification not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Notification Preferences
  'GET /preferences': {
    request: {
      query: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { preferences: NotificationPreferences };
      404: { error: 'User not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'PUT /preferences': {
    request: {
      body: UpdateNotificationPreferencesRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      200: { preferences: NotificationPreferences };
      400: { error: 'Invalid preferences data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Scheduled Notifications
  'POST /scheduled': {
    request: {
      body: ScheduleNotificationRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { scheduledNotification: ScheduledNotification };
      400: { error: 'Invalid scheduled notification data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'GET /scheduled': {
    request: {
      query: { userId: string };
      headers: { Authorization: string };
    };
    response: {
      200: { scheduledNotifications: ScheduledNotification[] };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /scheduled/{notificationId}': {
    request: {
      params: { notificationId: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'Scheduled notification not found' };
      401: { error: 'Unauthorized' };
    };
  };
  
  // Device Management
  'POST /devices': {
    request: {
      body: RegisterDeviceRequest;
      headers: { Authorization: string; 'Content-Type': 'application/json' };
    };
    response: {
      201: { device: Device };
      400: { error: 'Invalid device data' };
      401: { error: 'Unauthorized' };
    };
  };
  
  'DELETE /devices/{deviceToken}': {
    request: {
      params: { deviceToken: string };
      headers: { Authorization: string };
    };
    response: {
      204: {};
      404: { error: 'Device not found' };
      401: { error: 'Unauthorized' };
    };
  };
}

interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  actionUrl?: string;
  metadata?: Record<string, any>;
  channels: NotificationChannel[];
}

interface SendBulkNotificationsRequest {
  notifications: SendNotificationRequest[];
}

interface NotificationResult {
  success: boolean;
  notificationId: string;
  channels: Array<{
    channel: NotificationChannel;
    status: 'sent' | 'delivered' | 'failed';
    sentAt: string;
    deliveryTime?: number;
    error?: string;
  }>;
}

interface UpdateNotificationPreferencesRequest {
  userId: string;
  preferences: NotificationPreferences;
}

interface ScheduleNotificationRequest {
  userId: string;
  notification: SendNotificationRequest;
  scheduledFor: string;
  timezone: string;
}

interface RegisterDeviceRequest {
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo: {
    model?: string;
    os?: string;
    version?: string;
  };
}

interface Device {
  id: string;
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo: Record<string, any>;
  isActive: boolean;
  registeredAt: string;
  lastUsedAt: string;
}
```

## Service Registry

### Service Registry Contract
```typescript
interface ServiceRegistry {
  name: 'service-registry';
  version: '1.0.0';
  baseUrl: '/api/v1/registry';
  
  // Service Registration
  'POST /services': {
    request: {
      body: RegisterServiceRequest;
      headers: { 'Content-Type': 'application/json' };
    };
    response: {
      201: { service: MicroserviceInfo };
      400: { error: 'Invalid service data' };
      409: { error: 'Service already registered' };
    };
  };
  
  'PUT /services/{serviceName}': {
    request: {
      params: { serviceName: string };
      body: UpdateServiceRequest;
      headers: { 'Content-Type': 'application/json' };
    };
    response: {
      200: { service: MicroserviceInfo };
      404: { error: 'Service not found' };
      400: { error: 'Invalid service data' };
    };
  };
  
  'DELETE /services/{serviceName}': {
    request: {
      params: { serviceName: string };
    };
    response: {
      204: {};
      404: { error: 'Service not found' };
    };
  };
  
  // Service Discovery
  'GET /services': {
    request: {
      query: {
        name?: string;
        version?: string;
        status?: 'healthy' | 'degraded' | 'unhealthy';
        limit?: number;
        offset?: number;
      };
    };
    response: {
      200: { services: MicroserviceInfo[]; total: number };
    };
  };
  
  'GET /services/{serviceName}': {
    request: {
      params: { serviceName: string };
    };
    response: {
      200: { service: MicroserviceInfo };
      404: { error: 'Service not found' };
    };
  };
  
  'GET /services/{serviceName}/health': {
    request: {
      params: { serviceName: string };
    };
    response: {
      200: { health: ServiceHealth };
      404: { error: 'Service not found' };
    };
  };
  
  // Health Checks
  'POST /services/{serviceName}/health': {
    request: {
      params: { serviceName: string };
      body: HealthCheckRequest;
    };
    response: {
      200: { health: ServiceHealth };
      404: { error: 'Service not found' };
    };
  };
}

interface RegisterServiceRequest {
  name: string;
  version: string;
  host: string;
  port: number;
  capabilities: string[];
  dependencies: string[];
  endpoints: ServiceEndpoint[];
  metadata: Record<string, any>;
}

interface UpdateServiceRequest {
  version?: string;
  host?: string;
  port?: number;
  capabilities?: string[];
  dependencies?: string[];
  endpoints?: ServiceEndpoint[];
  metadata?: Record<string, any>;
}

interface HealthCheckRequest {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  errorRate: number;
  timestamp: string;
}
```

## Circuit Breaker

### Circuit Breaker Contract
```typescript
interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number; // milliseconds
  monitoringPeriod: number; // milliseconds
  halfOpenMaxCalls: number;
}

interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  lastFailureTime: string;
  nextAttemptTime: string;
  successCount: number;
  totalCalls: number;
}

interface CircuitBreaker {
  execute<T>(operation: () => Promise<T>): Promise<T>;
  getState(): CircuitBreakerState;
  reset(): void;
}
```

## Service Mesh

### Service Mesh Contract
```typescript
interface ServiceMeshConfig {
  services: MicroserviceInfo[];
  loadBalancer: LoadBalancerConfig;
  retryPolicy: RetryPolicyConfig;
  timeoutPolicy: TimeoutPolicyConfig;
  circuitBreaker: CircuitBreakerConfig;
  rateLimiting: RateLimitingConfig;
  tracing: TracingConfig;
}

interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'random';
  healthCheck: {
    enabled: boolean;
    interval: number;
    timeout: number;
    path: string;
  };
}

interface RetryPolicyConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

interface TimeoutPolicyConfig {
  defaultTimeout: number;
  serviceTimeouts: Record<string, number>;
}

interface RateLimitingConfig {
  enabled: boolean;
  requestsPerMinute: number;
  burstLimit: number;
}

interface TracingConfig {
  enabled: boolean;
  samplingRate: number;
  headers: string[];
}
```

This microservice contract specification ensures reliable service-to-service communication and integration patterns for the Diet Game application with proper service discovery, health monitoring, and fault tolerance mechanisms.
