# Data Models Contracts

## Overview
This document defines the data model contracts for the Diet Game application, including TypeScript interfaces, validation schemas, and database schemas.

## Base Types

### Common Fields
```typescript
interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface TimestampedEntity extends BaseEntity {
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}
```

### Pagination
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

## User Models

### User Profile
```typescript
interface UserProfile extends BaseEntity {
  userId: string;
  userName: string;
  email?: string;
  avatar?: string;
  dietType: DietType;
  bodyType: BodyType;
  weight: string;
  height?: string;
  age?: number;
  goals: string[];
  preferences: UserPreferences;
  isAnonymous: boolean;
  lastActiveAt: Date;
}

enum DietType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  KETO = 'keto',
  PALEO = 'paleo',
  MEDITERRANEAN = 'mediterranean',
  BALANCED = 'balanced'
}

enum BodyType {
  ECTOMORPH = 'ectomorph',
  MESOMORPH = 'mesomorph',
  ENDOMORPH = 'endomorph'
}

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showProgress: boolean;
    showAchievements: boolean;
  };
  language: string;
  timezone: string;
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'celsius' | 'fahrenheit';
  };
}
```

### User Progress
```typescript
interface UserProgress extends BaseEntity {
  userId: string;
  score: number;
  coins: number;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  recipesUnlocked: number;
  hasClaimedGift: boolean;
  streak: number;
  longestStreak: number;
  lastActiveDate: Date;
  weeklyGoal: number;
  monthlyGoal: number;
  achievements: Achievement[];
  statistics: UserStatistics;
}

interface UserStatistics {
  totalTasksCompleted: number;
  totalMealsLogged: number;
  totalWaterLogged: number;
  totalExerciseMinutes: number;
  averageDailyCalories: number;
  averageDailyProtein: number;
  averageDailyCarbs: number;
  averageDailyFat: number;
  totalDaysActive: number;
  joinDate: Date;
}
```

## Task Models

### Task
```typescript
interface Task extends BaseEntity {
  name: string;
  description: string;
  type: TaskType;
  difficulty: TaskDifficulty;
  category: TaskCategory;
  xpReward: number;
  coinReward: number;
  requirements: TaskRequirement[];
  isActive: boolean;
  isRepeatable: boolean;
  cooldownHours?: number;
  prerequisites: string[];
  tags: string[];
  estimatedDuration: number; // in minutes
  instructions: string[];
  tips: string[];
  rewards: TaskReward[];
}

enum TaskType {
  MEAL = 'meal',
  SHOPPING = 'shopping',
  COOKING = 'cooking',
  EXERCISE = 'exercise',
  EDUCATION = 'education',
  SOCIAL = 'social',
  HABIT = 'habit'
}

enum TaskDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

enum TaskCategory {
  NUTRITION = 'nutrition',
  FITNESS = 'fitness',
  LIFESTYLE = 'lifestyle',
  LEARNING = 'learning',
  SOCIAL = 'social'
}

interface TaskRequirement {
  type: 'level' | 'achievement' | 'task' | 'item';
  value: string | number;
  description: string;
}

interface TaskReward {
  type: 'xp' | 'coins' | 'item' | 'achievement';
  value: number | string;
  description: string;
}
```

### Task Completion
```typescript
interface TaskCompletion extends BaseEntity {
  userId: string;
  taskId: string;
  completedAt: Date;
  xpEarned: number;
  coinsEarned: number;
  quality: number; // 1-5 rating
  notes?: string;
  duration?: number; // in minutes
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photos?: string[];
  achievements?: Achievement[];
}
```

## Nutrition Models

### Meal
```typescript
interface Meal extends BaseEntity {
  userId: string;
  type: MealType;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  servingSize: number;
  servingUnit: string;
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  difficulty: TaskDifficulty;
  tags: string[];
  photos?: string[];
  recipe?: Recipe;
  loggedAt: Date;
}

enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage'
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  macros: MacroNutrients;
  category: IngredientCategory;
  isOrganic?: boolean;
  isLocal?: boolean;
  brand?: string;
}

interface MacroNutrients {
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
}

enum IngredientCategory {
  PROTEIN = 'protein',
  CARBOHYDRATE = 'carbohydrate',
  FAT = 'fat',
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  DAIRY = 'dairy',
  GRAIN = 'grain',
  LEGUME = 'legume',
  NUT = 'nut',
  SEED = 'seed',
  SPICE = 'spice',
  HERB = 'herb',
  CONDIMENT = 'condiment',
  BEVERAGE = 'beverage'
}
```

### Recipe
```typescript
interface Recipe extends BaseEntity {
  name: string;
  description: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
  servings: number;
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  difficulty: TaskDifficulty;
  category: RecipeCategory;
  cuisine: string;
  tags: string[];
  photos?: string[];
  videoUrl?: string;
  source?: string;
  author?: string;
  rating?: number;
  reviewCount?: number;
  isPublic: boolean;
  createdBy: string;
  nutritionPerServing: MacroNutrients;
  caloriesPerServing: number;
}

interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  isOptional: boolean;
}

enum RecipeCategory {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  APPETIZER = 'appetizer',
  SOUP = 'soup',
  SALAD = 'salad',
  MAIN_COURSE = 'main_course',
  SIDE_DISH = 'side_dish'
}
```

### Nutrition Goal
```typescript
interface NutritionGoal extends BaseEntity {
  userId: string;
  type: NutritionGoalType;
  target: number;
  unit: string;
  period: GoalPeriod;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  progress: number;
  achievements: GoalAchievement[];
}

enum NutritionGoalType {
  CALORIES = 'calories',
  PROTEIN = 'protein',
  CARBS = 'carbs',
  FAT = 'fat',
  FIBER = 'fiber',
  WATER = 'water',
  VEGETABLES = 'vegetables',
  FRUITS = 'fruits'
}

enum GoalPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

interface GoalAchievement {
  date: Date;
  value: number;
  percentage: number;
  isMet: boolean;
}
```

## Gamification Models

### Achievement
```typescript
interface Achievement extends BaseEntity {
  name: string;
  description: string;
  type: AchievementType;
  category: AchievementCategory;
  requirement: AchievementRequirement;
  reward: AchievementReward;
  icon: string;
  rarity: AchievementRarity;
  isHidden: boolean;
  isRepeatable: boolean;
  cooldownDays?: number;
  prerequisites: string[];
  tags: string[];
}

enum AchievementType {
  STREAK = 'streak',
  LEVEL = 'level',
  TASK = 'task',
  SOCIAL = 'social',
  SPECIAL = 'special',
  MILESTONE = 'milestone'
}

enum AchievementCategory {
  NUTRITION = 'nutrition',
  FITNESS = 'fitness',
  LIFESTYLE = 'lifestyle',
  SOCIAL = 'social',
  LEARNING = 'learning',
  EXPLORATION = 'exploration'
}

interface AchievementRequirement {
  type: 'count' | 'streak' | 'level' | 'score' | 'time';
  value: number;
  unit?: string;
  description: string;
}

interface AchievementReward {
  xp: number;
  coins: number;
  badge?: string;
  title?: string;
  item?: string;
  description: string;
}

enum AchievementRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}
```

### User Achievement
```typescript
interface UserAchievement extends BaseEntity {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date;
  xpEarned: number;
  coinsEarned: number;
  badge?: string;
  title?: string;
}
```

### Quest
```typescript
interface Quest extends BaseEntity {
  name: string;
  description: string;
  type: QuestType;
  difficulty: TaskDifficulty;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeLimit?: number; // in hours
  isActive: boolean;
  isRepeatable: boolean;
  cooldownDays?: number;
  prerequisites: string[];
  tags: string[];
  startDate?: Date;
  endDate?: Date;
}

enum QuestType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SPECIAL = 'special',
  EVENT = 'event'
}

interface QuestObjective {
  id: string;
  description: string;
  type: 'task' | 'achievement' | 'streak' | 'score';
  target: number;
  current: number;
  isCompleted: boolean;
  completedAt?: Date;
}

interface QuestReward {
  type: 'xp' | 'coins' | 'item' | 'achievement';
  value: number | string;
  description: string;
}
```

### User Quest
```typescript
interface UserQuest extends BaseEntity {
  userId: string;
  questId: string;
  startedAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  isFailed: boolean;
  progress: number;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeRemaining?: number; // in seconds
}
```

## Social Models

### Friend
```typescript
interface Friend extends BaseEntity {
  userId: string;
  friendId: string;
  status: FriendStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  lastInteraction?: Date;
  mutualFriends: number;
  sharedAchievements: number;
  sharedQuests: number;
}

enum FriendStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  BLOCKED = 'blocked',
  DECLINED = 'declined'
}
```

### Post
```typescript
interface Post extends BaseEntity {
  userId: string;
  type: PostType;
  content: string;
  media?: PostMedia[];
  tags: string[];
  isPublic: boolean;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  relatedTask?: string;
  relatedAchievement?: string;
  relatedQuest?: string;
}

enum PostType {
  ACHIEVEMENT = 'achievement',
  PROGRESS = 'progress',
  TIP = 'tip',
  QUESTION = 'question',
  RECIPE = 'recipe',
  WORKOUT = 'workout',
  GENERAL = 'general'
}

interface PostMedia {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
}
```

### Comment
```typescript
interface Comment extends BaseEntity {
  postId: string;
  userId: string;
  content: string;
  parentId?: string; // for replies
  likes: number;
  isEdited: boolean;
  editedAt?: Date;
}
```

## AI Models

### Chat Message
```typescript
interface ChatMessage extends BaseEntity {
  userId: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
    confidence?: number;
  };
  attachments?: MessageAttachment[];
}

enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

interface MessageAttachment {
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}
```

### AI Insight
```typescript
interface AIInsight extends BaseEntity {
  userId: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0-1
  actionable: boolean;
  category: InsightCategory;
  data: any;
  recommendations: string[];
  relatedData: string[];
  expiresAt?: Date;
  isRead: boolean;
  readAt?: Date;
}

enum InsightType {
  NUTRITION = 'nutrition',
  PROGRESS = 'progress',
  HABIT = 'habit',
  GOAL = 'goal',
  SOCIAL = 'social',
  GENERAL = 'general'
}

enum InsightCategory {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  WARNING = 'warning',
  SUGGESTION = 'suggestion'
}
```

## Validation Schemas

### Zod Schemas
```typescript
import { z } from 'zod';

export const UserProfileSchema = z.object({
  userName: z.string().min(1).max(50),
  dietType: z.nativeEnum(DietType),
  bodyType: z.nativeEnum(BodyType),
  weight: z.string().min(1),
  goals: z.array(z.string()).min(1).max(10)
});

export const TaskSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  type: z.nativeEnum(TaskType),
  difficulty: z.nativeEnum(TaskDifficulty),
  xpReward: z.number().min(0),
  coinReward: z.number().min(0)
});

export const MealSchema = z.object({
  type: z.nativeEnum(MealType),
  name: z.string().min(1).max(100),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().min(0),
    unit: z.string().min(1),
    calories: z.number().min(0)
  })).min(1),
  totalCalories: z.number().min(0)
});
```

## Database Indexes

### User Indexes
```typescript
// User collection indexes
const userIndexes = [
  { userId: 1 }, // Primary key
  { email: 1 }, // Unique index
  { userName: 1 }, // Unique index
  { dietType: 1 },
  { bodyType: 1 },
  { createdAt: -1 },
  { lastActiveAt: -1 }
];
```

### Task Indexes
```typescript
// Task collection indexes
const taskIndexes = [
  { id: 1 }, // Primary key
  { type: 1 },
  { difficulty: 1 },
  { category: 1 },
  { isActive: 1 },
  { isRepeatable: 1 },
  { tags: 1 },
  { createdAt: -1 }
];
```

### Nutrition Indexes
```typescript
// Meal collection indexes
const mealIndexes = [
  { id: 1 }, // Primary key
  { userId: 1, loggedAt: -1 }, // Compound index
  { type: 1 },
  { totalCalories: 1 },
  { tags: 1 },
  { loggedAt: -1 }
];
```

## Data Migration

### Migration Scripts
```typescript
// Example migration script
export const migrateUserProfiles = async (db: Database) => {
  const users = await db.collection('users').find({}).toArray();
  
  for (const user of users) {
    // Add new fields with default values
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          preferences: {
            notifications: { email: true, push: true, sms: false },
            privacy: { profileVisibility: 'public', showProgress: true },
            language: 'en',
            timezone: 'UTC',
            units: { weight: 'kg', height: 'cm', temperature: 'celsius' }
          },
          version: 1
        }
      }
    );
  }
};
```

This comprehensive data model specification ensures type safety, consistency, and maintainability across the Diet Game application.
