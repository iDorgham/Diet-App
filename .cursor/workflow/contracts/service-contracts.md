# Service Layer Interface Contracts

## Overview
This document defines the interface contracts for service layer components in the Diet Game application, including method signatures, parameter types, return types, and error handling patterns.

## Base Service Contract

### Service Interface Structure
```typescript
interface BaseService {
  readonly name: string;
  readonly version: string;
  readonly dependencies: string[];
  
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  getHealthStatus(): Promise<ServiceHealthStatus>;
  getMetrics(): Promise<ServiceMetrics>;
}

interface ServiceHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  lastCheck: string;
  dependencies: Record<string, 'healthy' | 'unhealthy'>;
  errors: ServiceError[];
}

interface ServiceMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  lastRequestTime: string;
  errorRate: number;
}

interface ServiceError {
  code: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  retryable: boolean;
}
```

### Service Configuration
```typescript
interface ServiceConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  timeout: number;
  retries: number;
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    recoveryTimeout: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    enableMetrics: boolean;
  };
}
```

## Authentication Service

### AuthService Interface
```typescript
interface AuthService extends BaseService {
  // Authentication Methods
  authenticate(credentials: LoginCredentials): Promise<AuthResult>;
  refreshToken(refreshToken: string): Promise<TokenResult>;
  revokeToken(token: string): Promise<void>;
  validateToken(token: string): Promise<TokenValidationResult>;
  
  // User Management
  registerUser(userData: RegisterData): Promise<UserRegistrationResult>;
  resetPassword(email: string): Promise<void>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  
  // Session Management
  createSession(userId: string, deviceInfo: DeviceInfo): Promise<Session>;
  destroySession(sessionId: string): Promise<void>;
  getActiveSessions(userId: string): Promise<Session[]>;
  
  // OAuth Integration
  authenticateWithGoogle(code: string): Promise<AuthResult>;
  authenticateWithApple(identityToken: string): Promise<AuthResult>;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  profile: Partial<UserProfile>;
  deviceInfo?: DeviceInfo;
}

interface AuthResult {
  success: boolean;
  user?: User;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
  session?: Session;
  error?: ServiceError;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface TokenValidationResult {
  valid: boolean;
  userId?: string;
  expiresAt?: string;
  error?: ServiceError;
}

interface UserRegistrationResult {
  success: boolean;
  user?: User;
  verificationRequired?: boolean;
  error?: ServiceError;
}

interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
}

interface Session {
  id: string;
  userId: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
}
```

## User Service

### UserService Interface
```typescript
interface UserService extends BaseService {
  // User CRUD Operations
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  deleteUser(userId: string): Promise<void>;
  
  // Profile Management
  updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  uploadAvatar(userId: string, imageData: Buffer): Promise<string>;
  deleteAvatar(userId: string): Promise<void>;
  
  // User Search and Discovery
  searchUsers(query: string, filters?: UserSearchFilters): Promise<User[]>;
  getUsersByIds(userIds: string[]): Promise<User[]>;
  getRecommendedUsers(userId: string): Promise<User[]>;
  
  // User Statistics
  getUserStats(userId: string): Promise<UserStatistics>;
  updateUserStats(userId: string, stats: Partial<UserStatistics>): Promise<void>;
}

interface CreateUserData {
  email: string;
  username: string;
  password: string;
  profile: Partial<UserProfile>;
}

interface UserSearchFilters {
  dietType?: DietType;
  bodyType?: BodyType;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
  ageRange?: {
    min: number;
    max: number;
  };
  activityLevel?: ActivityLevel;
  limit?: number;
  offset?: number;
}
```

## Task Service

### TaskService Interface
```typescript
interface TaskService extends BaseService {
  // Task CRUD Operations
  getTaskById(taskId: string): Promise<Task | null>;
  getTasks(filters?: TaskFilters): Promise<PaginatedResult<Task>>;
  createTask(taskData: CreateTaskData): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  
  // Task Assignment and Management
  assignTaskToUser(taskId: string, userId: string): Promise<TaskAssignment>;
  getAssignedTasks(userId: string, filters?: TaskFilters): Promise<Task[]>;
  unassignTask(taskId: string, userId: string): Promise<void>;
  
  // Task Completion
  completeTask(taskId: string, userId: string, completionData: TaskCompletionData): Promise<TaskCompletionResult>;
  getTaskCompletions(userId: string, filters?: CompletionFilters): Promise<TaskCompletion[]>;
  
  // Task Recommendations
  getRecommendedTasks(userId: string, limit?: number): Promise<Task[]>;
  getPersonalizedTasks(userId: string, context: TaskContext): Promise<Task[]>;
  
  // Task Analytics
  getTaskAnalytics(userId: string, dateRange: DateRange): Promise<TaskAnalytics>;
  getTaskTrends(userId: string, period: 'week' | 'month' | 'year'): Promise<TaskTrends>;
}

interface CreateTaskData {
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

interface TaskFilters {
  type?: TaskType;
  difficulty?: TaskDifficulty;
  category?: TaskCategory;
  isActive?: boolean;
  isRepeatable?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'difficulty' | 'xpReward' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface TaskCompletionData {
  quality: number; // 1-5 rating
  duration?: number; // minutes
  notes?: string;
  photos?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

interface TaskCompletionResult {
  completion: TaskCompletion;
  rewards: {
    xp: {
      base: number;
      multiplier: number;
      bonus: number;
      total: number;
    };
    coins: number;
    achievements?: Achievement[];
  };
  newProgress: UserProgress;
}

interface CompletionFilters {
  taskId?: string;
  dateRange?: DateRange;
  quality?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
}

interface TaskContext {
  userLevel: number;
  userGoals: string[];
  recentActivity: string[];
  availableTime: number; // minutes
  preferences: UserPreferences;
}

interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  averageCompletionTime: number;
  averageQuality: number;
  xpEarned: number;
  coinsEarned: number;
  achievementsUnlocked: number;
  streak: number;
  topCategories: Array<{
    category: TaskCategory;
    count: number;
    averageQuality: number;
  }>;
}

interface TaskTrends {
  period: string;
  completionRate: number;
  averageQuality: number;
  xpTrend: 'increasing' | 'decreasing' | 'stable';
  streakTrend: 'increasing' | 'decreasing' | 'stable';
  categoryDistribution: Record<TaskCategory, number>;
}
```

## Nutrition Service

### NutritionService Interface
```typescript
interface NutritionService extends BaseService {
  // Meal Management
  logMeal(userId: string, mealData: MealData): Promise<Meal>;
  getMeals(userId: string, filters?: MealFilters): Promise<PaginatedResult<Meal>>;
  updateMeal(mealId: string, updates: Partial<Meal>): Promise<Meal>;
  deleteMeal(mealId: string): Promise<void>;
  
  // Food Database
  searchFood(query: string, filters?: FoodSearchFilters): Promise<FoodItem[]>;
  getFoodDetails(foodId: string): Promise<FoodItem | null>;
  getFoodByBarcode(barcode: string): Promise<FoodItem | null>;
  
  // Nutrition Analytics
  getDailyNutrition(userId: string, date: string): Promise<DailyNutrition>;
  getNutritionAnalytics(userId: string, dateRange: DateRange): Promise<NutritionAnalytics>;
  getNutritionTrends(userId: string, period: 'week' | 'month' | 'year'): Promise<NutritionTrends>;
  
  // Goal Management
  setNutritionGoals(userId: string, goals: NutritionGoal[]): Promise<void>;
  getNutritionGoals(userId: string): Promise<NutritionGoal[]>;
  updateNutritionGoals(userId: string, goals: Partial<NutritionGoal>[]): Promise<void>;
  
  // Recipe Management
  getRecipes(filters?: RecipeFilters): Promise<PaginatedResult<Recipe>>;
  createRecipe(recipeData: CreateRecipeData): Promise<Recipe>;
  updateRecipe(recipeId: string, updates: Partial<Recipe>): Promise<Recipe>;
  deleteRecipe(recipeId: string): Promise<void>;
  getRecipeNutrition(recipeId: string): Promise<RecipeNutrition>;
}

interface MealData {
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

interface MealFilters {
  type?: MealType;
  dateRange?: DateRange;
  minCalories?: number;
  maxCalories?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

interface FoodSearchFilters {
  category?: IngredientCategory;
  minCalories?: number;
  maxCalories?: number;
  hasBarcode?: boolean;
  isOrganic?: boolean;
  limit?: number;
  offset?: number;
}

interface DailyNutrition {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  waterIntake: number;
  goalProgress: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
  };
  recommendations: string[];
}

interface NutritionAnalytics {
  dateRange: DateRange;
  averageDailyCalories: number;
  averageDailyMacros: MacroNutrients;
  averageWaterIntake: number;
  goalAchievementRate: number;
  topFoods: Array<{
    food: string;
    frequency: number;
    averageCalories: number;
  }>;
  mealPatterns: {
    breakfast: MealPattern;
    lunch: MealPattern;
    dinner: MealPattern;
    snacks: MealPattern;
  };
}

interface MealPattern {
  averageCalories: number;
  averageMacros: MacroNutrients;
  commonFoods: string[];
  averageTime: string;
}

interface NutritionTrends {
  period: string;
  calorieTrend: 'increasing' | 'decreasing' | 'stable';
  macroTrends: {
    protein: 'increasing' | 'decreasing' | 'stable';
    carbs: 'increasing' | 'decreasing' | 'stable';
    fat: 'increasing' | 'decreasing' | 'stable';
  };
  goalAchievementTrend: 'improving' | 'declining' | 'stable';
  waterIntakeTrend: 'increasing' | 'decreasing' | 'stable';
}

interface RecipeFilters {
  category?: RecipeCategory;
  cuisine?: string;
  difficulty?: TaskDifficulty;
  maxPrepTime?: number;
  maxCookTime?: number;
  maxCalories?: number;
  tags?: string[];
  createdBy?: string;
  limit?: number;
  offset?: number;
}

interface CreateRecipeData {
  name: string;
  description: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
  servings: number;
  preparationTime: number;
  cookingTime: number;
  difficulty: TaskDifficulty;
  category: RecipeCategory;
  cuisine: string;
  tags: string[];
  photos?: string[];
  videoUrl?: string;
  source?: string;
  author?: string;
  isPublic: boolean;
  createdBy: string;
}

interface RecipeNutrition {
  caloriesPerServing: number;
  macrosPerServing: MacroNutrients;
  totalCalories: number;
  totalMacros: MacroNutrients;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    macros: MacroNutrients;
  }>;
}
```

## Gamification Service

### GamificationService Interface
```typescript
interface GamificationService extends BaseService {
  // Achievement Management
  getAchievements(filters?: AchievementFilters): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  checkAchievements(userId: string, triggerType: string, triggerData: any): Promise<Achievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  
  // Quest Management
  getQuests(filters?: QuestFilters): Promise<Quest[]>;
  getUserQuests(userId: string): Promise<UserQuest[]>;
  startQuest(userId: string, questId: string): Promise<UserQuest>;
  completeQuest(userId: string, questId: string): Promise<QuestCompletionResult>;
  abandonQuest(userId: string, questId: string): Promise<void>;
  
  // Progress Management
  addXP(userId: string, amount: number, source: string): Promise<XPResult>;
  addCoins(userId: string, amount: number, source: string): Promise<CoinsResult>;
  updateLevel(userId: string, newLevel: number): Promise<LevelResult>;
  updateStreak(userId: string, streak: number): Promise<StreakResult>;
  
  // Leaderboard Management
  getLeaderboard(type: LeaderboardType, filters?: LeaderboardFilters): Promise<LeaderboardEntry[]>;
  getUserRank(userId: string, type: LeaderboardType): Promise<UserRank>;
  
  // Reward Management
  getRewards(userId: string): Promise<Reward[]>;
  claimReward(userId: string, rewardId: string): Promise<RewardClaimResult>;
  createReward(rewardData: CreateRewardData): Promise<Reward>;
}

interface AchievementFilters {
  type?: AchievementType;
  category?: AchievementCategory;
  rarity?: AchievementRarity;
  isHidden?: boolean;
  isRepeatable?: boolean;
  limit?: number;
  offset?: number;
}

interface QuestFilters {
  type?: QuestType;
  difficulty?: TaskDifficulty;
  isActive?: boolean;
  isRepeatable?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

interface XPResult {
  previousXP: number;
  newXP: number;
  xpAdded: number;
  levelUp: boolean;
  newLevel?: number;
  xpToNext?: number;
}

interface CoinsResult {
  previousCoins: number;
  newCoins: number;
  coinsAdded: number;
}

interface LevelResult {
  previousLevel: number;
  newLevel: number;
  xpToNext: number;
  rewards: {
    coins: number;
    achievements: Achievement[];
    items: string[];
  };
}

interface StreakResult {
  previousStreak: number;
  newStreak: number;
  streakType: string;
  isBroken: boolean;
  rewards?: {
    xp: number;
    coins: number;
  };
}

interface QuestCompletionResult {
  quest: Quest;
  completion: UserQuest;
  rewards: {
    xp: number;
    coins: number;
    achievements: Achievement[];
    items: string[];
  };
  newProgress: UserProgress;
}

interface LeaderboardFilters {
  category?: 'xp' | 'streak' | 'tasks' | 'achievements';
  limit?: number;
  offset?: number;
}

interface UserRank {
  rank: number;
  score: number;
  level: number;
  totalUsers: number;
}

interface CreateRewardData {
  name: string;
  description: string;
  type: RewardType;
  value: number | string;
  cost: number;
  category: RewardCategory;
  rarity: RewardRarity;
  isActive: boolean;
  expiresAt?: string;
  requirements?: RewardRequirement[];
}

interface RewardClaimResult {
  success: boolean;
  reward: Reward;
  newCoins: number;
  error?: ServiceError;
}
```

## AI Service

### AIService Interface
```typescript
interface AIService extends BaseService {
  // Chat and Conversation
  sendMessage(userId: string, message: string, context?: AIContext): Promise<AIResponse>;
  getConversationHistory(userId: string, conversationId: string): Promise<ChatMessage[]>;
  createConversation(userId: string, title?: string): Promise<Conversation>;
  deleteConversation(userId: string, conversationId: string): Promise<void>;
  
  // AI Insights
  generateInsights(userId: string, type: InsightType): Promise<AIInsight[]>;
  getInsights(userId: string, filters?: InsightFilters): Promise<AIInsight[]>;
  markInsightAsRead(userId: string, insightId: string): Promise<void>;
  
  // Food Recognition
  recognizeFood(imageData: Buffer): Promise<FoodRecognitionResult>;
  analyzeNutrition(imageData: Buffer): Promise<NutritionAnalysisResult>;
  
  // Personalized Recommendations
  getTaskRecommendations(userId: string, context: TaskContext): Promise<TaskRecommendation[]>;
  getMealRecommendations(userId: string, preferences: MealPreferences): Promise<MealRecommendation[]>;
  getExerciseRecommendations(userId: string, context: ExerciseContext): Promise<ExerciseRecommendation[]>;
  
  // Content Generation
  generateMealPlan(userId: string, requirements: MealPlanRequirements): Promise<MealPlan>;
  generateWorkoutPlan(userId: string, requirements: WorkoutPlanRequirements): Promise<WorkoutPlan>;
  generateMotivationalMessage(userId: string, context: MotivationContext): Promise<string>;
}

interface AIContext {
  currentTask?: string;
  userGoals?: string[];
  recentActivity?: string[];
  userLevel?: number;
  userStats?: UserStatistics;
  conversationHistory?: ChatMessage[];
}

interface AIResponse {
  message: string;
  conversationId: string;
  suggestions?: AISuggestion[];
  xpAwarded: number;
  processingTime: number;
  model: string;
  tokens: number;
  confidence: number;
  metadata?: Record<string, any>;
}

interface InsightFilters {
  type?: InsightType;
  category?: InsightCategory;
  isRead?: boolean;
  actionable?: boolean;
  dateRange?: DateRange;
  limit?: number;
  offset?: number;
}

interface FoodRecognitionResult {
  foods: DetectedFood[];
  confidence: number;
  processingTime: number;
  imageAnalysis: {
    quality: 'high' | 'medium' | 'low';
    lighting: 'good' | 'poor';
    clarity: 'clear' | 'blurry';
  };
}

interface NutritionAnalysisResult {
  estimatedCalories: number;
  estimatedMacros: MacroNutrients;
  foodItems: DetectedFood[];
  confidence: number;
  processingTime: number;
  recommendations: string[];
}

interface TaskRecommendation {
  task: Task;
  reason: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
}

interface MealRecommendation {
  meal: Meal;
  reason: string;
  confidence: number;
  nutritionMatch: number; // 0-1
  preferenceMatch: number; // 0-1
  estimatedPrepTime: number;
}

interface ExerciseRecommendation {
  exercise: Exercise;
  reason: string;
  confidence: number;
  difficulty: TaskDifficulty;
  estimatedDuration: number;
  caloriesBurned: number;
}

interface MealPlanRequirements {
  duration: number; // days
  mealsPerDay: number;
  caloriesPerDay: number;
  macros: MacroNutrients;
  dietaryRestrictions: string[];
  preferences: string[];
  budget?: number;
}

interface WorkoutPlanRequirements {
  duration: number; // weeks
  frequency: number; // days per week
  durationPerSession: number; // minutes
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  equipment: string[];
  preferences: string[];
}

interface MotivationContext {
  userProgress: UserProgress;
  recentAchievements: Achievement[];
  currentGoals: string[];
  mood?: 'motivated' | 'struggling' | 'neutral';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}
```

## Notification Service

### NotificationService Interface
```typescript
interface NotificationService extends BaseService {
  // Notification Management
  sendNotification(notification: NotificationRequest): Promise<NotificationResult>;
  sendBulkNotifications(notifications: NotificationRequest[]): Promise<NotificationResult[]>;
  getNotifications(userId: string, filters?: NotificationFilters): Promise<PaginatedResult<Notification>>;
  markAsRead(userId: string, notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(userId: string, notificationId: string): Promise<void>;
  
  // Notification Preferences
  updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void>;
  getPreferences(userId: string): Promise<NotificationPreferences>;
  
  // Scheduled Notifications
  scheduleNotification(notification: ScheduledNotificationRequest): Promise<string>;
  cancelScheduledNotification(notificationId: string): Promise<void>;
  getScheduledNotifications(userId: string): Promise<ScheduledNotification[]>;
  
  // Push Notifications
  registerDevice(userId: string, deviceToken: string, platform: 'ios' | 'android' | 'web'): Promise<void>;
  unregisterDevice(userId: string, deviceToken: string): Promise<void>;
  sendPushNotification(userId: string, notification: PushNotificationRequest): Promise<void>;
}

interface NotificationRequest {
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

interface NotificationFilters {
  type?: NotificationType;
  category?: NotificationCategory;
  isRead?: boolean;
  dateRange?: DateRange;
  limit?: number;
  offset?: number;
}

interface NotificationPreferences {
  channels: Record<NotificationChannel, boolean>;
  categories: Record<NotificationCategory, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
    timezone: string;
  };
  frequency: {
    email: 'immediate' | 'daily' | 'weekly';
    push: 'immediate' | 'batched';
    sms: 'immediate' | 'daily';
  };
}

interface ScheduledNotificationRequest extends NotificationRequest {
  scheduledFor: string;
  timezone: string;
}

interface ScheduledNotification {
  id: string;
  userId: string;
  notification: NotificationRequest;
  scheduledFor: string;
  timezone: string;
  status: 'scheduled' | 'sent' | 'cancelled' | 'failed';
  createdAt: string;
}

interface PushNotificationRequest {
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
  sound?: string;
  imageUrl?: string;
  actionUrl?: string;
}
```

## Analytics Service

### AnalyticsService Interface
```typescript
interface AnalyticsService extends BaseService {
  // Event Tracking
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackUserAction(userId: string, action: UserAction): Promise<void>;
  trackPageView(userId: string, page: PageView): Promise<void>;
  
  // User Analytics
  getUserAnalytics(userId: string, dateRange: DateRange): Promise<UserAnalytics>;
  getUserEngagement(userId: string, period: 'week' | 'month' | 'year'): Promise<EngagementMetrics>;
  getUserRetention(userId: string): Promise<RetentionMetrics>;
  
  // Application Analytics
  getApplicationMetrics(dateRange: DateRange): Promise<ApplicationMetrics>;
  getFeatureUsage(feature: string, dateRange: DateRange): Promise<FeatureUsageMetrics>;
  getPerformanceMetrics(dateRange: DateRange): Promise<PerformanceMetrics>;
  
  // Custom Reports
  generateReport(reportConfig: ReportConfig): Promise<Report>;
  getReport(reportId: string): Promise<Report>;
  scheduleReport(reportConfig: ReportConfig, schedule: ReportSchedule): Promise<string>;
}

interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  properties: Record<string, any>;
  context: {
    page?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  };
}

interface UserAction {
  action: string;
  target?: string;
  value?: any;
  metadata?: Record<string, any>;
}

interface PageView {
  page: string;
  title: string;
  url: string;
  referrer?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface UserAnalytics {
  userId: string;
  dateRange: DateRange;
  totalSessions: number;
  totalTimeSpent: number;
  averageSessionDuration: number;
  pageViews: number;
  uniquePages: number;
  actions: Record<string, number>;
  goals: Array<{
    goal: string;
    completed: number;
    total: number;
    completionRate: number;
  }>;
  engagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
  };
}

interface EngagementMetrics {
  period: string;
  activeDays: number;
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  returnRate: number;
  featureUsage: Record<string, number>;
  taskCompletionRate: number;
  achievementRate: number;
}

interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  cohort: Array<{
    date: string;
    users: number;
    retention: number[];
  }>;
}

interface ApplicationMetrics {
  dateRange: DateRange;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  revenue?: number;
}

interface FeatureUsageMetrics {
  feature: string;
  dateRange: DateRange;
  totalUsage: number;
  uniqueUsers: number;
  averageUsagePerUser: number;
  usageTrend: 'increasing' | 'decreasing' | 'stable';
  topUsers: Array<{
    userId: string;
    usage: number;
  }>;
}

interface PerformanceMetrics {
  dateRange: DateRange;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
  throughput: number;
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errors: Array<{
    error: string;
    count: number;
    rate: number;
  }>;
}

interface ReportConfig {
  name: string;
  type: 'user' | 'application' | 'feature' | 'performance' | 'custom';
  metrics: string[];
  dimensions: string[];
  filters: Record<string, any>;
  dateRange: DateRange;
  format: 'json' | 'csv' | 'pdf';
}

interface Report {
  id: string;
  name: string;
  type: string;
  data: any;
  generatedAt: string;
  expiresAt: string;
  downloadUrl?: string;
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  timezone: string;
  recipients: string[];
  format: 'json' | 'csv' | 'pdf';
}
```

## Service Factory

### ServiceFactory Interface
```typescript
interface ServiceFactory {
  createService<T extends BaseService>(serviceType: ServiceType, config: ServiceConfig): Promise<T>;
  getService<T extends BaseService>(serviceType: ServiceType): T | null;
  destroyService(serviceType: ServiceType): Promise<void>;
  getServiceHealth(): Promise<Record<string, ServiceHealthStatus>>;
  getServiceMetrics(): Promise<Record<string, ServiceMetrics>>;
}

enum ServiceType {
  AUTH = 'auth',
  USER = 'user',
  TASK = 'task',
  NUTRITION = 'nutrition',
  GAMIFICATION = 'gamification',
  AI = 'ai',
  NOTIFICATION = 'notification',
  ANALYTICS = 'analytics'
}
```

## Service Testing

### Service Testing Utilities
```typescript
interface ServiceTestHelper {
  createMockService<T extends BaseService>(serviceType: ServiceType): T;
  mockServiceMethod<T>(service: T, method: keyof T, implementation: any): void;
  resetServiceMocks(): void;
  assertServiceMethodCalled(service: BaseService, method: string, args?: any[]): void;
  assertServiceMethodNotCalled(service: BaseService, method: string): void;
}

interface ServiceTestSuite {
  testServiceInitialization(): Promise<void>;
  testServiceHealthCheck(): Promise<void>;
  testServiceMetrics(): Promise<void>;
  testServiceErrorHandling(): Promise<void>;
  testServiceCleanup(): Promise<void>;
}
```

This service layer interface contract specification ensures consistent and type-safe service implementations across the Diet Game application with proper error handling, monitoring, and testing capabilities.
