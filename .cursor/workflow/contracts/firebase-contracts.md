# Firebase Integration Contracts

## Overview

This document defines the contracts for Firebase integration in the Diet Game application, including authentication, Firestore database operations, Cloud Functions, and real-time features.

## Firebase Configuration

### Project Configuration
```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment-specific configurations
const firebaseConfigs = {
  development: {
    apiKey: "AIzaSyDevKey123",
    authDomain: "dietgame-dev.firebaseapp.com",
    projectId: "dietgame-dev",
    storageBucket: "dietgame-dev.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:dev123"
  },
  staging: {
    apiKey: "AIzaSyStagingKey456",
    authDomain: "dietgame-staging.firebaseapp.com",
    projectId: "dietgame-staging",
    storageBucket: "dietgame-staging.appspot.com",
    messagingSenderId: "987654321",
    appId: "1:987654321:web:staging456"
  },
  production: {
    apiKey: "AIzaSyProdKey789",
    authDomain: "dietgame-prod.firebaseapp.com",
    projectId: "dietgame-prod",
    storageBucket: "dietgame-prod.appspot.com",
    messagingSenderId: "555666777",
    appId: "1:555666777:web:prod789"
  }
};
```

## Authentication Contracts

### Anonymous Authentication
```typescript
// Firebase Anonymous Auth Contract
interface FirebaseAnonymousAuth {
  signInAnonymously(): Promise<{
    user: {
      uid: string;
      isAnonymous: boolean;
      metadata: {
        creationTime: string;
        lastSignInTime: string;
      };
    };
    credential: {
      providerId: string;
      signInMethod: string;
    };
  }>;
}

// Anonymous Auth Response
interface AnonymousAuthResponse {
  success: boolean;
  data: {
    uid: string;
    isAnonymous: boolean;
    customToken?: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

### Custom Token Authentication
```typescript
// Custom Token Generation (Server-side)
interface CustomTokenRequest {
  uid: string;
  claims?: {
    role?: 'user' | 'admin' | 'premium';
    tier?: 'free' | 'premium' | 'pro';
    features?: string[];
  };
}

interface CustomTokenResponse {
  success: boolean;
  data: {
    customToken: string;
    expiresIn: number;
  };
}

// Custom Token Verification (Client-side)
interface CustomTokenAuth {
  signInWithCustomToken(customToken: string): Promise<{
    user: {
      uid: string;
      email?: string;
      displayName?: string;
      customClaims: Record<string, any>;
    };
  }>;
}
```

### User Profile Management
```typescript
// User Profile Document Structure
interface UserProfileDocument {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  dietType: 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'balanced';
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph';
  weight: string;
  goals: string[];
  preferences: {
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
    language: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

// User Profile Operations
interface UserProfileOperations {
  createProfile(profile: Omit<UserProfileDocument, 'createdAt' | 'updatedAt' | 'lastActiveAt'>): Promise<void>;
  updateProfile(uid: string, updates: Partial<UserProfileDocument>): Promise<void>;
  getProfile(uid: string): Promise<UserProfileDocument | null>;
  deleteProfile(uid: string): Promise<void>;
}
```

## Firestore Database Contracts

### Collection Structure
```typescript
// Firestore Collections
interface FirestoreCollections {
  users: {
    [uid: string]: UserProfileDocument;
  };
  tasks: {
    [taskId: string]: TaskDocument;
  };
  meals: {
    [mealId: string]: MealDocument;
  };
  achievements: {
    [achievementId: string]: AchievementDocument;
  };
  conversations: {
    [conversationId: string]: ConversationDocument;
  };
  analytics: {
    [userId: string]: {
      [date: string]: AnalyticsDocument;
    };
  };
}
```

### Task Document Contract
```typescript
interface TaskDocument {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'meal' | 'shopping' | 'cooking' | 'exercise' | 'education';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  xpReward: number;
  coinReward: number;
  requirements: string[];
  completionData?: {
    completedAt: string;
    duration?: number;
    quality?: number;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
}

// Task Operations
interface TaskOperations {
  createTask(task: Omit<TaskDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  updateTask(taskId: string, updates: Partial<TaskDocument>): Promise<void>;
  getTasks(userId: string, filters?: TaskFilters): Promise<TaskDocument[]>;
  completeTask(taskId: string, completionData: TaskDocument['completionData']): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}

interface TaskFilters {
  type?: string;
  difficulty?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'xpReward';
  sortOrder?: 'asc' | 'desc';
}
```

### Meal Document Contract
```typescript
interface MealDocument {
  id: string;
  userId: string;
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
  createdAt: string;
  updatedAt: string;
  tags: string[];
  imageUrl?: string;
  notes?: string;
}

// Meal Operations
interface MealOperations {
  logMeal(meal: Omit<MealDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string>;
  updateMeal(mealId: string, updates: Partial<MealDocument>): Promise<void>;
  getMeals(userId: string, dateRange?: DateRange): Promise<MealDocument[]>;
  deleteMeal(mealId: string): Promise<void>;
  getNutritionSummary(userId: string, date: string): Promise<NutritionSummary>;
}

interface DateRange {
  start: string;
  end: string;
}

interface NutritionSummary {
  date: string;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: number;
  goalProgress: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
```

### Achievement Document Contract
```typescript
interface AchievementDocument {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'level' | 'task' | 'social' | 'special';
  category: 'nutrition' | 'fitness' | 'social' | 'learning' | 'consistency';
  requirement: number;
  reward: {
    xp: number;
    coins: number;
    badge: string;
    title?: string;
  };
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Achievement Progress
interface UserAchievementProgress {
  userId: string;
  achievementId: string;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressHistory: Array<{
    date: string;
    progress: number;
    milestone?: string;
  }>;
}

// Achievement Operations
interface AchievementOperations {
  getAchievements(filters?: AchievementFilters): Promise<AchievementDocument[]>;
  getUserProgress(userId: string): Promise<UserAchievementProgress[]>;
  updateProgress(userId: string, achievementId: string, progress: number): Promise<void>;
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
}

interface AchievementFilters {
  type?: string;
  category?: string;
  rarity?: string;
  isActive?: boolean;
}
```

## Cloud Functions Contracts

### Authentication Triggers
```typescript
// User Creation Trigger
interface UserCreationTrigger {
  onCreate: (user: {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
  }) => Promise<void>;
}

// User Deletion Trigger
interface UserDeletionTrigger {
  onDelete: (user: {
    uid: string;
    email?: string;
    displayName?: string;
  }) => Promise<void>;
}
```

### Task Management Functions
```typescript
// Task Completion Function
interface TaskCompletionFunction {
  endpoint: '/api/tasks/complete';
  method: 'POST';
  request: {
    taskId: string;
    completionData: {
      duration?: number;
      quality?: number;
      notes?: string;
    };
  };
  response: {
    success: boolean;
    data: {
      xpAwarded: number;
      coinsAwarded: number;
      achievementsUnlocked: string[];
      newLevel?: number;
    };
  };
}

// Daily Task Generation Function
interface DailyTaskGenerationFunction {
  endpoint: '/api/tasks/generate-daily';
  method: 'POST';
  request: {
    userId: string;
    date: string;
  };
  response: {
    success: boolean;
    data: {
      tasksGenerated: number;
      taskIds: string[];
    };
  };
}
```

### Analytics Functions
```typescript
// Analytics Aggregation Function
interface AnalyticsAggregationFunction {
  endpoint: '/api/analytics/aggregate';
  method: 'POST';
  request: {
    userId: string;
    dateRange: {
      start: string;
      end: string;
    };
    metrics: string[];
  };
  response: {
    success: boolean;
    data: {
      analytics: Record<string, any>;
      insights: string[];
      recommendations: string[];
    };
  };
}
```

## Real-time Features Contracts

### Real-time Listeners
```typescript
// User Progress Listener
interface UserProgressListener {
  path: `users/${userId}/progress`;
  onUpdate: (progress: {
    score: number;
    coins: number;
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    streak: number;
    lastActiveDate: string;
  }) => void;
  onError: (error: Error) => void;
}

// Task Updates Listener
interface TaskUpdatesListener {
  path: `users/${userId}/tasks`;
  onUpdate: (tasks: TaskDocument[]) => void;
  onAdd: (task: TaskDocument) => void;
  onModify: (task: TaskDocument) => void;
  onRemove: (taskId: string) => void;
  onError: (error: Error) => void;
}

// Achievement Unlocks Listener
interface AchievementUnlocksListener {
  path: `users/${userId}/achievements`;
  onUnlock: (achievement: {
    id: string;
    name: string;
    description: string;
    reward: {
      xp: number;
      coins: number;
      badge: string;
    };
    unlockedAt: string;
  }) => void;
  onError: (error: Error) => void;
}
```

### Real-time Database Operations
```typescript
// Real-time Database Contract
interface RealtimeDatabaseOperations {
  // Listen to user progress changes
  listenToUserProgress(userId: string, callback: (progress: any) => void): () => void;
  
  // Listen to task updates
  listenToTasks(userId: string, callback: (tasks: TaskDocument[]) => void): () => void;
  
  // Listen to achievement unlocks
  listenToAchievements(userId: string, callback: (achievements: any[]) => void): () => void;
  
  // Update user progress in real-time
  updateUserProgress(userId: string, progress: Partial<UserProgress>): Promise<void>;
  
  // Send real-time notifications
  sendNotification(userId: string, notification: {
    type: 'achievement' | 'level_up' | 'task_complete' | 'reminder';
    title: string;
    message: string;
    data?: any;
  }): Promise<void>;
}
```

## Storage Contracts

### File Upload Contract
```typescript
// File Upload Request
interface FileUploadRequest {
  file: File;
  path: string;
  metadata?: {
    contentType: string;
    customMetadata?: Record<string, string>;
  };
}

// File Upload Response
interface FileUploadResponse {
  success: boolean;
  data: {
    downloadURL: string;
    path: string;
    size: number;
    contentType: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Storage Operations
interface StorageOperations {
  uploadFile(request: FileUploadRequest): Promise<FileUploadResponse>;
  deleteFile(path: string): Promise<void>;
  getDownloadURL(path: string): Promise<string>;
  getFileMetadata(path: string): Promise<{
    size: number;
    contentType: string;
    timeCreated: string;
    updated: string;
  }>;
}
```

### Image Processing Contract
```typescript
// Image Processing Request
interface ImageProcessingRequest {
  imageUrl: string;
  operations: Array<{
    type: 'resize' | 'crop' | 'compress' | 'format';
    params: Record<string, any>;
  }>;
}

// Image Processing Response
interface ImageProcessingResponse {
  success: boolean;
  data: {
    processedImageUrl: string;
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
  };
}
```

## Security Rules Contracts

### Firestore Security Rules
```typescript
// Firestore Security Rules Template
const firestoreSecurityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tasks are user-specific
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Meals are user-specific
    match /meals/{mealId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Achievements are read-only for users
    match /achievements/{achievementId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can modify achievements
    }
    
    // Analytics are user-specific
    match /analytics/{userId}/{date} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
`;
```

### Storage Security Rules
```typescript
// Storage Security Rules Template
const storageSecurityRules = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile images
    match /users/{userId}/profile/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal images
    match /users/{userId}/meals/{mealId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Achievement badges (read-only)
    match /achievements/{fileName} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
`;
```

## Error Handling Contracts

### Firebase Error Codes
```typescript
enum FirebaseErrorCode {
  // Authentication Errors
  AUTH_USER_NOT_FOUND = 'auth/user-not-found',
  AUTH_WRONG_PASSWORD = 'auth/wrong-password',
  AUTH_INVALID_EMAIL = 'auth/invalid-email',
  AUTH_USER_DISABLED = 'auth/user-disabled',
  AUTH_TOO_MANY_REQUESTS = 'auth/too-many-requests',
  AUTH_OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  
  // Firestore Errors
  FIRESTORE_PERMISSION_DENIED = 'permission-denied',
  FIRESTORE_NOT_FOUND = 'not-found',
  FIRESTORE_ALREADY_EXISTS = 'already-exists',
  FIRESTORE_RESOURCE_EXHAUSTED = 'resource-exhausted',
  FIRESTORE_FAILED_PRECONDITION = 'failed-precondition',
  FIRESTORE_ABORTED = 'aborted',
  FIRESTORE_OUT_OF_RANGE = 'out-of-range',
  FIRESTORE_UNIMPLEMENTED = 'unimplemented',
  FIRESTORE_INTERNAL = 'internal',
  FIRESTORE_UNAVAILABLE = 'unavailable',
  FIRESTORE_DATA_LOSS = 'data-loss',
  FIRESTORE_UNAUTHENTICATED = 'unauthenticated',
  
  // Storage Errors
  STORAGE_OBJECT_NOT_FOUND = 'storage/object-not-found',
  STORAGE_BUCKET_NOT_FOUND = 'storage/bucket-not-found',
  STORAGE_PROJECT_NOT_FOUND = 'storage/project-not-found',
  STORAGE_QUOTA_EXCEEDED = 'storage/quota-exceeded',
  STORAGE_UNAUTHENTICATED = 'storage/unauthenticated',
  STORAGE_UNAUTHORIZED = 'storage/unauthorized',
  STORAGE_RETRY_LIMIT_EXCEEDED = 'storage/retry-limit-exceeded',
  STORAGE_INVALID_CHECKSUM = 'storage/invalid-checksum',
  STORAGE_CANCELED = 'storage/canceled',
  STORAGE_INVALID_EVENT_NAME = 'storage/invalid-event-name',
  STORAGE_INVALID_URL = 'storage/invalid-url',
  STORAGE_INVALID_ARGUMENT = 'storage/invalid-argument',
  STORAGE_NO_DEFAULT_BUCKET = 'storage/no-default-bucket',
  STORAGE_CANNOT_SLICE_BLOB = 'storage/cannot-slice-blob',
  STORAGE_SERVER_FILE_WRONG_SIZE = 'storage/server-file-wrong-size'
}

// Error Response Contract
interface FirebaseErrorResponse {
  success: false;
  error: {
    code: FirebaseErrorCode;
    message: string;
    details?: any;
    timestamp: string;
  };
}
```

## Performance Optimization Contracts

### Caching Strategy
```typescript
// Cache Configuration
interface CacheConfig {
  userProfile: {
    ttl: 300; // 5 minutes
    maxSize: 1000;
  };
  tasks: {
    ttl: 60; // 1 minute
    maxSize: 5000;
  };
  achievements: {
    ttl: 3600; // 1 hour
    maxSize: 100;
  };
  meals: {
    ttl: 1800; // 30 minutes
    maxSize: 10000;
  };
}

// Cache Operations
interface CacheOperations {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
}
```

### Batch Operations
```typescript
// Batch Write Contract
interface BatchWriteRequest {
  operations: Array<{
    type: 'set' | 'update' | 'delete';
    path: string;
    data?: any;
  }>;
}

interface BatchWriteResponse {
  success: boolean;
  data: {
    writeCount: number;
    commitTime: string;
  };
  error?: {
    code: string;
    message: string;
    failedOperations: number[];
  };
}

// Batch Operations
interface BatchOperations {
  batchWrite(request: BatchWriteRequest): Promise<BatchWriteResponse>;
  batchRead(paths: string[]): Promise<Record<string, any>>;
  batchDelete(paths: string[]): Promise<void>;
}
```

## Monitoring and Analytics Contracts

### Performance Metrics
```typescript
// Performance Metrics Contract
interface PerformanceMetrics {
  firestore: {
    readLatency: number;
    writeLatency: number;
    readCount: number;
    writeCount: number;
    errorRate: number;
  };
  storage: {
    uploadLatency: number;
    downloadLatency: number;
    uploadCount: number;
    downloadCount: number;
    errorRate: number;
  };
  auth: {
    signInLatency: number;
    signInCount: number;
    errorRate: number;
  };
  functions: {
    executionLatency: number;
    executionCount: number;
    errorRate: number;
    memoryUsage: number;
  };
}

// Analytics Collection
interface AnalyticsCollection {
  collectMetrics(metrics: PerformanceMetrics): Promise<void>;
  getMetrics(dateRange: DateRange): Promise<PerformanceMetrics[]>;
  getAlerts(): Promise<Array<{
    type: 'error_rate' | 'latency' | 'usage';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
  }>>;
}
```

---

*Last updated: January 15, 2024*  
*Firebase SDK Version: 10.7.0*
