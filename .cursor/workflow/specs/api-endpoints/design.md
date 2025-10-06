# API Endpoints - Design

## API Architecture

### Base Configuration
```typescript
interface APIConfig {
  baseUrl: string;
  version: string;
  timeout: number;
  retryAttempts: number;
  rateLimits: RateLimitConfig;
  authentication: AuthConfig;
  cors: CORSConfig;
}

const API_CONFIG: APIConfig = {
  baseUrl: 'https://api.dietgame.com',
  version: 'v1',
  timeout: 30000,
  retryAttempts: 3,
  rateLimits: {
    default: { requests: 1000, window: '1h' },
    auth: { requests: 10, window: '1h' },
    upload: { requests: 50, window: '1h' }
  },
  authentication: {
    type: 'JWT',
    tokenExpiry: '24h',
    refreshTokenExpiry: '7d'
  },
  cors: {
    origins: ['https://dietgame.com', 'https://app.dietgame.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    headers: ['Content-Type', 'Authorization']
  }
};
```

### Authentication System
```typescript
// POST /api/v1/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTRA_ACTIVE';
  healthGoals: string[];
  dietaryRestrictions: string[];
}

interface RegisterResponse {
  success: boolean;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

// POST /api/v1/auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  expiresIn: number;
}

// POST /api/v1/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  expiresIn: number;
}

// POST /api/v1/auth/logout
interface LogoutRequest {
  refreshToken: string;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}
```

## User Management Endpoints

### User Profile
```typescript
// GET /api/v1/users/profile
interface GetProfileResponse {
  user: UserProfile;
  stats: UserStats;
  preferences: UserPreferences;
  privacySettings: PrivacySettings;
}

// PUT /api/v1/users/profile
interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
  privacySettings?: Partial<PrivacySettings>;
}

interface UpdateProfileResponse {
  success: boolean;
  user: UserProfile;
  message: string;
}

// GET /api/v1/users/stats
interface GetUserStatsResponse {
  stats: UserStats;
  trends: StatsTrend[];
  achievements: Achievement[];
  badges: Badge[];
  levelProgress: LevelProgress;
}

// POST /api/v1/users/avatar
interface UploadAvatarRequest {
  image: File;
}

interface UploadAvatarResponse {
  success: boolean;
  avatar: {
    url: string;
    thumbnail: string;
  };
  message: string;
}
```

## Nutrition Tracking Endpoints

### Food Logging
```typescript
// POST /api/v1/nutrition/log-food
interface LogFoodRequest {
  foodItemId: string;
  portionSize: number;
  unit: 'grams' | 'cups' | 'pieces' | 'servings';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
  notes?: string;
}

interface LogFoodResponse {
  success: boolean;
  loggedFood: LoggedFood;
  updatedNutrition: DailyNutritionSummary;
  goalProgress: GoalProgress;
  insights: NutritionInsight[];
  xpEarned: number;
  coinsEarned: number;
}

// GET /api/v1/nutrition/daily-summary/:date
interface GetDailySummaryRequest {
  date: string; // YYYY-MM-DD format
}

interface GetDailySummaryResponse {
  summary: DailyNutritionSummary;
  goalComparison: GoalComparison;
  mealBreakdown: MealBreakdown[];
  insights: NutritionInsight[];
  recommendations: string[];
  score: number;
}

// GET /api/v1/nutrition/weekly-summary
interface GetWeeklySummaryRequest {
  startDate: string;
  endDate: string;
}

interface GetWeeklySummaryResponse {
  weeklySummary: WeeklyNutritionSummary;
  trends: NutritionTrend[];
  achievements: Achievement[];
  recommendations: string[];
  averageScore: number;
}

// DELETE /api/v1/nutrition/logs/:logId
interface DeleteFoodLogResponse {
  success: boolean;
  updatedNutrition: DailyNutritionSummary;
  message: string;
}
```

### Food Database
```typescript
// GET /api/v1/foods/search
interface SearchFoodsRequest {
  query: string;
  category?: string;
  limit?: number;
  offset?: number;
  filters?: FoodSearchFilters;
}

interface SearchFoodsResponse {
  foods: FoodItem[];
  totalCount: number;
  hasMore: boolean;
  suggestions: string[];
}

// GET /api/v1/foods/:foodId
interface GetFoodResponse {
  food: FoodItem;
  alternatives: FoodItem[];
  similarFoods: FoodItem[];
  nutritionalInfo: NutritionalInfo;
}

// POST /api/v1/foods/scan-barcode
interface ScanBarcodeRequest {
  barcode: string;
}

interface ScanBarcodeResponse {
  success: boolean;
  food: FoodItem;
  portionSuggestions: PortionSuggestion[];
  alternatives: FoodItem[];
}

// POST /api/v1/foods/recognize-image
interface RecognizeImageRequest {
  image: File;
}

interface RecognizeImageResponse {
  success: boolean;
  recognizedFoods: RecognizedFood[];
  confidence: number;
  portionEstimate: PortionEstimate;
  alternatives: FoodItem[];
}
```

## Gamification Endpoints

### XP and Leveling
```typescript
// GET /api/v1/gamification/progress
interface GetProgressResponse {
  userProgress: UserProgress;
  levelProgress: LevelProgress;
  recentAchievements: Achievement[];
  availableBadges: Badge[];
  streakStatus: StreakStatus;
  nextMilestones: Milestone[];
}

// POST /api/v1/gamification/complete-task
interface CompleteTaskRequest {
  taskId: string;
  completionData: TaskCompletionData;
  timestamp: string;
}

interface CompleteTaskResponse {
  success: boolean;
  xpEarned: number;
  coinsEarned: number;
  levelUp?: LevelUpResult;
  achievementsUnlocked: Achievement[];
  streakUpdate: StreakUpdate;
  nextActions: string[];
  message: string;
}

// GET /api/v1/gamification/achievements
interface GetAchievementsResponse {
  unlocked: Achievement[];
  available: Achievement[];
  progress: AchievementProgress[];
  categories: AchievementCategory[];
  totalUnlocked: number;
  totalAvailable: number;
}

// GET /api/v1/gamification/leaderboard/:category
interface GetLeaderboardRequest {
  category: 'daily_streak' | 'weekly_xp' | 'monthly_achievements' | 'total_level';
  timeRange: 'daily' | 'weekly' | 'monthly' | 'all_time';
  limit?: number;
}

interface GetLeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank?: UserRank;
  totalParticipants: number;
  lastUpdated: string;
  category: string;
  timeRange: string;
}
```

### Virtual Economy
```typescript
// GET /api/v1/shop/items
interface GetShopItemsRequest {
  category?: string;
  rarity?: string;
  userLevel?: number;
  available?: boolean;
}

interface GetShopItemsResponse {
  items: ShopItem[];
  categories: ShopCategory[];
  userCoins: number;
  featuredItems: ShopItem[];
}

// POST /api/v1/shop/purchase
interface PurchaseItemRequest {
  itemId: string;
  quantity?: number;
}

interface PurchaseItemResponse {
  success: boolean;
  item: ShopItem;
  remainingCoins: number;
  purchaseId: string;
  message: string;
}

// GET /api/v1/shop/purchases
interface GetPurchasesResponse {
  purchases: Purchase[];
  totalSpent: number;
  recentPurchases: Purchase[];
}
```

## Social Features Endpoints

### Friends and Connections
```typescript
// GET /api/v1/social/friends
interface GetFriendsResponse {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  totalFriends: number;
}

// POST /api/v1/social/friend-request
interface SendFriendRequestRequest {
  toUserId: string;
  message?: string;
}

interface SendFriendRequestResponse {
  success: boolean;
  requestId: string;
  message: string;
}

// POST /api/v1/social/friend-request/:requestId/accept
interface AcceptFriendRequestResponse {
  success: boolean;
  friendship: Friendship;
  message: string;
}

// DELETE /api/v1/social/friends/:friendId
interface RemoveFriendResponse {
  success: boolean;
  message: string;
}
```

### Social Feed
```typescript
// GET /api/v1/social/feed
interface GetFeedRequest {
  page?: number;
  limit?: number;
  type?: 'all' | 'friends' | 'public';
  userId?: string;
}

interface GetFeedResponse {
  posts: Post[];
  hasMore: boolean;
  nextPage?: number;
  totalCount: number;
  lastUpdated: string;
}

// POST /api/v1/social/posts
interface CreatePostRequest {
  content: string;
  type: 'achievement' | 'progress' | 'meal' | 'general';
  media?: File[];
  tags?: string[];
  privacy: 'public' | 'friends' | 'private';
}

interface CreatePostResponse {
  success: boolean;
  post: Post;
  message: string;
}

// POST /api/v1/social/posts/:postId/like
interface LikePostResponse {
  success: boolean;
  like: Like;
  totalLikes: number;
  message: string;
}

// POST /api/v1/social/posts/:postId/comments
interface CommentOnPostRequest {
  content: string;
  parentCommentId?: string;
}

interface CommentOnPostResponse {
  success: boolean;
  comment: Comment;
  totalComments: number;
  message: string;
}
```

### Team Challenges
```typescript
// GET /api/v1/challenges/team
interface GetTeamChallengesResponse {
  challenges: TeamChallenge[];
  userChallenges: UserChallenge[];
  availableChallenges: TeamChallenge[];
  totalChallenges: number;
}

// POST /api/v1/challenges/team
interface CreateTeamChallengeRequest {
  name: string;
  description: string;
  type: ChallengeType;
  startDate: string;
  endDate: string;
  maxTeamSize: number;
  rewards: ChallengeReward[];
  rules: ChallengeRule[];
}

interface CreateTeamChallengeResponse {
  success: boolean;
  challenge: TeamChallenge;
  message: string;
}

// POST /api/v1/challenges/team/:challengeId/join
interface JoinTeamChallengeRequest {
  teamId?: string;
  createNewTeam?: boolean;
  teamName?: string;
}

interface JoinTeamChallengeResponse {
  success: boolean;
  membership: TeamMembership;
  team: Team;
  message: string;
}
```

## AI Coach Endpoints

### AI Recommendations
```typescript
// GET /api/v1/ai/meal-recommendations
interface GetMealRecommendationsRequest {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  preferences?: DietaryPreferences;
  excludeIngredients?: string[];
  maxPreparationTime?: number;
  servings?: number;
}

interface GetMealRecommendationsResponse {
  recommendations: MealRecommendation[];
  alternatives: MealRecommendation[];
  nutritionalSummary: NutritionalSummary;
  personalizedTips: string[];
  confidence: number;
}

// POST /api/v1/ai/analyze-food
interface AnalyzeFoodRequest {
  foodItem: FoodItem;
  portionSize: number;
  context: 'meal' | 'snack' | 'planning';
  userGoals: HealthGoal[];
}

interface AnalyzeFoodResponse {
  analysis: NutritionAnalysis;
  recommendations: string[];
  alternatives: FoodItem[];
  portionAdvice: string;
  score: number;
}

// GET /api/v1/ai/motivational-message
interface GetMotivationalMessageRequest {
  context: 'daily_checkin' | 'goal_achievement' | 'struggle' | 'celebration';
  progressData: ProgressData;
}

interface GetMotivationalMessageResponse {
  message: MotivationalMessage;
  actionableAdvice?: string;
  nextSteps: string[];
  encouragementLevel: number;
}

// POST /api/v1/ai/chat
interface AIChatRequest {
  message: string;
  context: ChatContext;
  conversationId?: string;
}

interface AIChatResponse {
  response: string;
  conversationId: string;
  suggestions: string[];
  xpEarned: number;
  followUpQuestions: string[];
}
```

## WebSocket Endpoints

### Real-time Updates
```typescript
// WebSocket Connection: /ws/v1/updates
interface WebSocketMessage {
  type: 'PROGRESS_UPDATE' | 'ACHIEVEMENT_UNLOCKED' | 'LEVEL_UP' | 'FRIEND_ACTIVITY' | 'CHALLENGE_UPDATE';
  data: any;
  timestamp: string;
  userId: string;
}

// Progress Updates
interface ProgressUpdateMessage {
  type: 'PROGRESS_UPDATE';
  data: {
    xpEarned: number;
    coinsEarned: number;
    levelProgress: number;
    streakUpdate: StreakUpdate;
  };
}

// Achievement Notifications
interface AchievementMessage {
  type: 'ACHIEVEMENT_UNLOCKED';
  data: {
    achievement: Achievement;
    rewards: AchievementReward[];
    celebration: boolean;
  };
}

// Friend Activity
interface FriendActivityMessage {
  type: 'FRIEND_ACTIVITY';
  data: {
    friendId: string;
    activity: 'LEVEL_UP' | 'ACHIEVEMENT' | 'POST' | 'CHALLENGE_COMPLETE';
    details: any;
  };
}
```

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

// Common Error Codes
const ERROR_CODES = {
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR'
};
```

## Rate Limiting

### Rate Limit Configuration
```typescript
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later'
  },
  api: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 1000,
    message: 'Rate limit exceeded, please try again later'
  },
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50,
    message: 'Upload rate limit exceeded, please try again later'
  }
};
```

## API Documentation

### OpenAPI Specification
```yaml
openapi: 3.0.0
info:
  title: Diet Game API
  description: AI-powered gamified diet application API
  version: 1.0.0
  contact:
    name: Diet Game Support
    email: support@dietgame.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.dietgame.com/v1
    description: Production server
  - url: https://staging-api.dietgame.com/v1
    description: Staging server

security:
  - BearerAuth: []

paths:
  /auth/login:
    post:
      summary: User login
      description: Authenticate user and return JWT tokens
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/APIError'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  
  schemas:
    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 8
        rememberMe:
          type: boolean
          default: false
```

## Performance Optimization

### Caching Strategy
```typescript
class APICacheManager {
  private cache = new Map<string, CachedResponse>();
  
  async getCachedResponse(key: string): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached.timestamp, cached.ttl)) {
      return cached.data;
    }
    return null;
  }
  
  async cacheResponse(key: string, data: any, ttl: number = 300000): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  }
}
```

### Request Batching
```typescript
class RequestBatcher {
  private batchQueue: BatchRequest[] = [];
  private batchSize = 10;
  private batchTimeout = 100; // 100ms
  
  async addRequest(request: BatchRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({
        ...request,
        resolve,
        reject
      });
      
      if (this.batchQueue.length >= this.batchSize) {
        this.processBatch();
      } else {
        setTimeout(() => this.processBatch(), this.batchTimeout);
      }
    });
  }
  
  private async processBatch(): Promise<void> {
    const batch = this.batchQueue.splice(0, this.batchSize);
    await this.executeBatch(batch);
  }
}
```

## Security Implementation

### Authentication Middleware
```typescript
class AuthenticationMiddleware {
  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = this.extractToken(req);
      if (!token) {
        throw new Error('No token provided');
      }
      
      const decoded = await this.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token'
        }
      });
    }
  }
  
  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}
```

### Input Validation
```typescript
class InputValidator {
  validateRequest(schema: any, data: any): ValidationResult {
    const { error, value } = schema.validate(data);
    
    if (error) {
      return {
        isValid: false,
        errors: error.details.map(detail => detail.message)
      };
    }
    
    return {
      isValid: true,
      data: value
    };
  }
  
  sanitizeInput(input: any): any {
    // Remove potentially dangerous characters
    if (typeof input === 'string') {
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    return input;
  }
}
```
