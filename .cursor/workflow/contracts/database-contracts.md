# Database Integration Contracts

## Overview

This document defines the contracts for database integration in the Diet Game application, including schema definitions, query patterns, data models, and database operations.

## Database Configuration

### Database Connection
```typescript
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  pool: {
    min: number;
    max: number;
    idle: number;
    acquire: number;
  };
  dialect: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  logging: boolean;
  timezone: string;
}

// Environment-specific configurations
const databaseConfigs = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'dietgame_dev',
    username: 'dev_user',
    password: process.env.DB_PASSWORD_DEV,
    ssl: false,
    pool: { min: 2, max: 10, idle: 10000, acquire: 30000 },
    dialect: 'postgresql',
    logging: true,
    timezone: 'UTC'
  },
  staging: {
    host: 'staging-db.dietgame.com',
    port: 5432,
    database: 'dietgame_staging',
    username: 'staging_user',
    password: process.env.DB_PASSWORD_STAGING,
    ssl: true,
    pool: { min: 5, max: 20, idle: 10000, acquire: 30000 },
    dialect: 'postgresql',
    logging: false,
    timezone: 'UTC'
  },
  production: {
    host: 'prod-db.dietgame.com',
    port: 5432,
    database: 'dietgame_prod',
    username: 'prod_user',
    password: process.env.DB_PASSWORD_PROD,
    ssl: true,
    pool: { min: 10, max: 50, idle: 10000, acquire: 30000 },
    dialect: 'postgresql',
    logging: false,
    timezone: 'UTC'
  }
};
```

## Core Data Models

### User Model
```typescript
interface User {
  id: string;
  email?: string;
  username: string;
  displayName?: string;
  photoUrl?: string;
  dietType: 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'balanced';
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  weight: string;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goals: string[];
  preferences: {
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
    language: string;
    timezone: string;
    units: 'metric' | 'imperial';
  };
  subscription: {
    tier: 'free' | 'premium' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
  isAnonymous: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  deletedAt?: string;
}

// User Database Operations
interface UserOperations {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastActiveAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
  search(query: string, limit?: number): Promise<User[]>;
  getActiveUsers(dateRange: { start: string; end: string }): Promise<User[]>;
}
```

### Task Model
```typescript
interface Task {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'meal' | 'shopping' | 'cooking' | 'exercise' | 'education' | 'social';
  category: 'nutrition' | 'fitness' | 'learning' | 'lifestyle' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
  priority: 'low' | 'medium' | 'high';
  xpReward: number;
  coinReward: number;
  requirements: string[];
  tags: string[];
  estimatedDuration: number; // minutes
  actualDuration?: number; // minutes
  completionData?: {
    completedAt: string;
    quality: number; // 1-10
    notes?: string;
    attachments?: string[];
    feedback?: string;
  };
  dueDate?: string;
  reminderDate?: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  parentTaskId?: string;
  subtasks?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// Task Database Operations
interface TaskOperations {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string, filters?: TaskFilters): Promise<Task[]>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  complete(id: string, completionData: Task['completionData']): Promise<Task>;
  getOverdue(userId: string): Promise<Task[]>;
  getUpcoming(userId: string, days?: number): Promise<Task[]>;
  getCompleted(userId: string, dateRange?: DateRange): Promise<Task[]>;
  getStatistics(userId: string, dateRange?: DateRange): Promise<TaskStatistics>;
}

interface TaskFilters {
  type?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  dateRange?: DateRange;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'xpReward';
  sortOrder?: 'asc' | 'desc';
}

interface TaskStatistics {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  averageCompletionTime: number;
  xpEarned: number;
  coinsEarned: number;
  completionRate: number;
  byType: Record<string, number>;
  byDifficulty: Record<string, number>;
}
```

### Meal Model
```typescript
interface Meal {
  id: string;
  userId: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
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
    micronutrients?: {
      fiber?: number;
      sugar?: number;
      sodium?: number;
      cholesterol?: number;
      vitamins?: Record<string, number>;
      minerals?: Record<string, number>;
    };
  }>;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  totalMicronutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    vitamins?: Record<string, number>;
    minerals?: Record<string, number>;
  };
  servingSize: number;
  servingUnit: string;
  servings: number;
  preparationTime?: number; // minutes
  cookingTime?: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine?: string;
  tags: string[];
  imageUrl?: string;
  recipeUrl?: string;
  notes?: string;
  rating?: number; // 1-5
  isFavorite: boolean;
  isCustom: boolean;
  source?: 'user' | 'ai' | 'community' | 'database';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

// Meal Database Operations
interface MealOperations {
  create(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal>;
  findById(id: string): Promise<Meal | null>;
  findByUserId(userId: string, filters?: MealFilters): Promise<Meal[]>;
  update(id: string, updates: Partial<Meal>): Promise<Meal>;
  delete(id: string): Promise<void>;
  getByDateRange(userId: string, dateRange: DateRange): Promise<Meal[]>;
  getNutritionSummary(userId: string, date: string): Promise<NutritionSummary>;
  getTrends(userId: string, period: 'week' | 'month' | 'year'): Promise<MealTrends>;
  search(query: string, filters?: MealSearchFilters): Promise<Meal[]>;
  getFavorites(userId: string): Promise<Meal[]>;
  getRecent(userId: string, limit?: number): Promise<Meal[]>;
}

interface MealFilters {
  type?: string;
  dateRange?: DateRange;
  tags?: string[];
  cuisine?: string;
  difficulty?: string;
  isFavorite?: boolean;
  isCustom?: boolean;
  source?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'calories' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface MealSearchFilters {
  query: string;
  type?: string;
  cuisine?: string;
  difficulty?: string;
  maxCalories?: number;
  minProtein?: number;
  tags?: string[];
  limit?: number;
}

interface NutritionSummary {
  date: string;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  totalMicronutrients?: {
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  meals: number;
  goalProgress: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: string[];
}

interface MealTrends {
  period: string;
  averageCalories: number;
  averageMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealFrequency: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  topIngredients: Array<{
    name: string;
    frequency: number;
    averageQuantity: number;
  }>;
  cuisineDistribution: Record<string, number>;
}
```

### Achievement Model
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'level' | 'task' | 'social' | 'special' | 'milestone';
  category: 'nutrition' | 'fitness' | 'social' | 'learning' | 'consistency' | 'exploration';
  requirement: number;
  requirementType: 'count' | 'streak' | 'score' | 'time' | 'custom';
  reward: {
    xp: number;
    coins: number;
    badge: string;
    title?: string;
    unlockable?: string;
  };
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  isHidden: boolean;
  prerequisites?: string[];
  tags: string[];
  metadata?: {
    difficulty: number;
    estimatedTime: number;
    category: string;
  };
  createdAt: string;
  updatedAt: string;
}

// User Achievement Progress
interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressHistory: Array<{
    date: string;
    progress: number;
    milestone?: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Achievement Database Operations
interface AchievementOperations {
  create(achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement>;
  findById(id: string): Promise<Achievement | null>;
  findAll(filters?: AchievementFilters): Promise<Achievement[]>;
  update(id: string, updates: Partial<Achievement>): Promise<Achievement>;
  delete(id: string): Promise<void>;
  getUserProgress(userId: string): Promise<UserAchievement[]>;
  updateProgress(userId: string, achievementId: string, progress: number): Promise<UserAchievement>;
  unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement>;
  getUnlockedAchievements(userId: string): Promise<Achievement[]>;
  getAvailableAchievements(userId: string): Promise<Achievement[]>;
  getStatistics(userId: string): Promise<AchievementStatistics>;
}

interface AchievementFilters {
  type?: string;
  category?: string;
  rarity?: string;
  isActive?: boolean;
  isHidden?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

interface AchievementStatistics {
  total: number;
  unlocked: number;
  available: number;
  totalXpEarned: number;
  totalCoinsEarned: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  byRarity: Record<string, number>;
  recentUnlocks: Achievement[];
}
```

### User Progress Model
```typescript
interface UserProgress {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  coins: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  recipesUnlocked: number;
  achievementsUnlocked: number;
  tasksCompleted: number;
  mealsLogged: number;
  hasClaimedGift: boolean;
  giftClaimedAt?: string;
  statistics: {
    totalPlayTime: number; // minutes
    averageSessionTime: number; // minutes
    favoriteMealType: string;
    favoriteTaskType: string;
    mostActiveDay: string;
    mostActiveHour: number;
  };
  preferences: {
    notificationFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
    reminderTimes: string[];
    goalReminders: boolean;
    achievementNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// User Progress Database Operations
interface UserProgressOperations {
  create(progress: Omit<UserProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProgress>;
  findByUserId(userId: string): Promise<UserProgress | null>;
  update(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  addXP(userId: string, xp: number): Promise<UserProgress>;
  addCoins(userId: string, coins: number): Promise<UserProgress>;
  updateStreak(userId: string, streak: number): Promise<UserProgress>;
  claimGift(userId: string): Promise<UserProgress>;
  getLeaderboard(category: string, limit?: number): Promise<LeaderboardEntry[]>;
  getStatistics(userId: string): Promise<ProgressStatistics>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  level: number;
  avatar?: string;
  isCurrentUser: boolean;
}

interface ProgressStatistics {
  totalUsers: number;
  averageLevel: number;
  averageXP: number;
  topPerformers: LeaderboardEntry[];
  recentActivity: Array<{
    userId: string;
    username: string;
    action: string;
    timestamp: string;
  }>;
}
```

## Database Schema Definitions

### PostgreSQL Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    photo_url TEXT,
    diet_type VARCHAR(20) NOT NULL CHECK (diet_type IN ('vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'balanced')),
    body_type VARCHAR(20) NOT NULL CHECK (body_type IN ('ectomorph', 'mesomorph', 'endomorph')),
    weight VARCHAR(20) NOT NULL,
    height INTEGER,
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    goals TEXT[],
    preferences JSONB NOT NULL DEFAULT '{}',
    subscription JSONB NOT NULL DEFAULT '{}',
    is_anonymous BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('meal', 'shopping', 'cooking', 'exercise', 'education', 'social')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('nutrition', 'fitness', 'learning', 'lifestyle', 'community')),
    difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'expired')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    xp_reward INTEGER NOT NULL DEFAULT 0,
    coin_reward INTEGER NOT NULL DEFAULT 0,
    requirements TEXT[],
    tags TEXT[],
    estimated_duration INTEGER,
    actual_duration INTEGER,
    completion_data JSONB,
    due_date TIMESTAMP WITH TIME ZONE,
    reminder_date TIMESTAMP WITH TIME ZONE,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_pattern JSONB,
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Meals table
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL,
    total_calories INTEGER NOT NULL,
    total_macros JSONB NOT NULL,
    total_micronutrients JSONB,
    serving_size DECIMAL(10,2) NOT NULL DEFAULT 1,
    serving_unit VARCHAR(20) NOT NULL DEFAULT 'serving',
    servings INTEGER NOT NULL DEFAULT 1,
    preparation_time INTEGER,
    cooking_time INTEGER,
    difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    cuisine VARCHAR(50),
    tags TEXT[],
    image_url TEXT,
    recipe_url TEXT,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_custom BOOLEAN NOT NULL DEFAULT false,
    source VARCHAR(20) CHECK (source IN ('user', 'ai', 'community', 'database')),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('streak', 'level', 'task', 'social', 'special', 'milestone')),
    category VARCHAR(20) NOT NULL CHECK (category IN ('nutrition', 'fitness', 'social', 'learning', 'consistency', 'exploration')),
    requirement INTEGER NOT NULL,
    requirement_type VARCHAR(20) NOT NULL CHECK (requirement_type IN ('count', 'streak', 'score', 'time', 'custom')),
    reward JSONB NOT NULL,
    icon VARCHAR(100) NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    prerequisites UUID[],
    tags TEXT[],
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User achievements table
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    current_progress INTEGER NOT NULL DEFAULT 0,
    is_unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    progress_history JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1,
    current_xp INTEGER NOT NULL DEFAULT 0,
    xp_to_next_level INTEGER NOT NULL DEFAULT 100,
    total_xp INTEGER NOT NULL DEFAULT 0,
    coins INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recipes_unlocked INTEGER NOT NULL DEFAULT 0,
    achievements_unlocked INTEGER NOT NULL DEFAULT 0,
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    meals_logged INTEGER NOT NULL DEFAULT 0,
    has_claimed_gift BOOLEAN NOT NULL DEFAULT false,
    gift_claimed_at TIMESTAMP WITH TIME ZONE,
    statistics JSONB NOT NULL DEFAULT '{}',
    preferences JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_last_active ON users(last_active_at);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_timestamp ON meals(timestamp);
CREATE INDEX idx_meals_type ON meals(type);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_level ON user_progress(level);
CREATE INDEX idx_user_progress_total_xp ON user_progress(total_xp);
```

## Query Patterns and Operations

### Complex Queries
```typescript
// User Dashboard Query
interface DashboardQuery {
  userId: string;
  dateRange: DateRange;
}

interface DashboardData {
  user: User;
  progress: UserProgress;
  recentTasks: Task[];
  recentMeals: Meal[];
  achievements: Achievement[];
  statistics: {
    tasksCompleted: number;
    mealsLogged: number;
    xpEarned: number;
    coinsEarned: number;
    streak: number;
  };
  insights: string[];
  recommendations: string[];
}

// Analytics Query
interface AnalyticsQuery {
  userId: string;
  metrics: string[];
  dateRange: DateRange;
  groupBy: 'day' | 'week' | 'month';
}

interface AnalyticsData {
  period: string;
  metrics: Record<string, any>;
  trends: Record<string, 'increasing' | 'decreasing' | 'stable'>;
  insights: Array<{
    type: string;
    message: string;
    actionable: boolean;
  }>;
  recommendations: string[];
}

// Search Query
interface SearchQuery {
  query: string;
  filters: {
    type?: string;
    category?: string;
    tags?: string[];
    dateRange?: DateRange;
    userId?: string;
  };
  pagination: {
    limit: number;
    offset: number;
  };
  sort: {
    field: string;
    order: 'asc' | 'desc';
  };
}

interface SearchResults {
  results: Array<{
    type: 'task' | 'meal' | 'achievement' | 'user';
    id: string;
    title: string;
    description: string;
    relevance: number;
    metadata: any;
  }>;
  total: number;
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

### Database Operations Interface
```typescript
interface DatabaseOperations {
  // Transaction operations
  transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T>;
  
  // Batch operations
  batchCreate<T>(table: string, records: Omit<T, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<T[]>;
  batchUpdate<T>(table: string, updates: Array<{ id: string; data: Partial<T> }>): Promise<T[]>;
  batchDelete(table: string, ids: string[]): Promise<void>;
  
  // Aggregation operations
  aggregate(table: string, pipeline: any[]): Promise<any[]>;
  count(table: string, conditions?: any): Promise<number>;
  sum(table: string, field: string, conditions?: any): Promise<number>;
  average(table: string, field: string, conditions?: any): Promise<number>;
  
  // Search operations
  fullTextSearch(table: string, query: string, fields: string[]): Promise<any[]>;
  fuzzySearch(table: string, query: string, fields: string[]): Promise<any[]>;
  
  // Performance operations
  explain(query: string): Promise<any>;
  analyze(table: string): Promise<any>;
  optimize(table: string): Promise<void>;
}
```

## Data Validation and Constraints

### Validation Rules
```typescript
interface ValidationRules {
  user: {
    email: {
      required: false;
      format: 'email';
      unique: true;
    };
    username: {
      required: true;
      minLength: 3;
      maxLength: 50;
      pattern: '^[a-zA-Z0-9_-]+$';
      unique: true;
    };
    dietType: {
      required: true;
      enum: ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'balanced'];
    };
    weight: {
      required: true;
      pattern: '^\\d+(\\.\\d+)?\\s*(kg|lbs)?$';
    };
  };
  task: {
    name: {
      required: true;
      minLength: 1;
      maxLength: 200;
    };
    xpReward: {
      required: true;
      min: 0;
      max: 1000;
    };
    coinReward: {
      required: true;
      min: 0;
      max: 100;
    };
  };
  meal: {
    name: {
      required: true;
      minLength: 1;
      maxLength: 200;
    };
    totalCalories: {
      required: true;
      min: 0;
      max: 10000;
    };
    ingredients: {
      required: true;
      minItems: 1;
      maxItems: 50;
    };
  };
}

// Validation Functions
interface ValidationFunctions {
  validateUser(user: Partial<User>): ValidationResult;
  validateTask(task: Partial<Task>): ValidationResult;
  validateMeal(meal: Partial<Meal>): ValidationResult;
  validateAchievement(achievement: Partial<Achievement>): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}
```

## Database Migration Contracts

### Migration Schema
```typescript
interface Migration {
  version: string;
  name: string;
  description: string;
  up: (db: Database) => Promise<void>;
  down: (db: Database) => Promise<void>;
  dependencies?: string[];
  rollback?: boolean;
}

// Migration Operations
interface MigrationOperations {
  getCurrentVersion(): Promise<string>;
  getPendingMigrations(): Promise<Migration[]>;
  runMigration(migration: Migration): Promise<void>;
  rollbackMigration(version: string): Promise<void>;
  runAllPending(): Promise<void>;
  rollbackAll(): Promise<void>;
  createMigration(name: string, description: string): Promise<Migration>;
}
```

## Performance Optimization

### Indexing Strategy
```typescript
interface IndexStrategy {
  primary: {
    users: ['id'];
    tasks: ['id'];
    meals: ['id'];
    achievements: ['id'];
    user_achievements: ['id'];
    user_progress: ['id'];
  };
  unique: {
    users: ['email', 'username'];
    user_achievements: ['user_id', 'achievement_id'];
    user_progress: ['user_id'];
  };
  composite: {
    tasks: [['user_id', 'status'], ['user_id', 'due_date'], ['user_id', 'type']];
    meals: [['user_id', 'timestamp'], ['user_id', 'type'], ['user_id', 'is_favorite']];
    user_achievements: [['user_id', 'is_unlocked'], ['achievement_id', 'is_unlocked']];
  };
  partial: {
    tasks: ['status = "pending"', 'status = "completed"'];
    meals: ['is_favorite = true', 'is_custom = true'];
    users: ['is_anonymous = false', 'deleted_at IS NULL'];
  };
}

// Query Optimization
interface QueryOptimization {
  useIndexes: boolean;
  explainQueries: boolean;
  cacheResults: boolean;
  batchSize: number;
  connectionPooling: boolean;
  readReplicas: boolean;
  queryTimeout: number;
}
```

## Backup and Recovery

### Backup Strategy
```typescript
interface BackupStrategy {
  full: {
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number; // days
    compression: boolean;
    encryption: boolean;
  };
  incremental: {
    frequency: 'hourly' | 'daily';
    retention: number; // days
  };
  pointInTime: {
    enabled: boolean;
    retention: number; // days
  };
}

// Backup Operations
interface BackupOperations {
  createFullBackup(): Promise<BackupResult>;
  createIncrementalBackup(): Promise<BackupResult>;
  restoreBackup(backupId: string, targetDate?: string): Promise<void>;
  listBackups(): Promise<BackupInfo[]>;
  deleteBackup(backupId: string): Promise<void>;
  verifyBackup(backupId: string): Promise<boolean>;
}

interface BackupResult {
  id: string;
  type: 'full' | 'incremental';
  size: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  checksum: string;
}

interface BackupInfo {
  id: string;
  type: string;
  size: number;
  createdAt: string;
  status: string;
  retention: number;
}
```

---

*Last updated: January 15, 2024*  
*Database Version: PostgreSQL 15.0*
