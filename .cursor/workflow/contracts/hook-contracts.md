# Custom Hook Interface Contracts

## Overview
This document defines the interface contracts for custom React hooks in the Diet Game application, including type definitions, return values, and usage patterns.

## Base Hook Contract

### Hook Interface Structure
```typescript
interface BaseHook<T> {
  (): T;
  displayName?: string;
  __isHook?: boolean;
}

interface HookState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface HookStateWithMutate<T, M> extends HookState<T> {
  mutate: M;
}
```

### Hook Error Handling
```typescript
interface HookError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  retryable: boolean;
}

interface HookErrorHandler {
  (error: HookError): void;
}
```

## Authentication Hooks

### useAuth Hook
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: HookError | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  profile: Partial<UserProfile>;
}

interface UseAuthReturn extends AuthState, AuthActions {}

const useAuth: BaseHook<UseAuthReturn> = () => {
  // Implementation
};
```

### useAuthGuard Hook
```typescript
interface AuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  fallback?: React.ComponentType;
}

interface UseAuthGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  user: User | null;
  redirectTo: string | null;
}

const useAuthGuard: (options?: AuthGuardOptions) => UseAuthGuardReturn = (options) => {
  // Implementation
};
```

## User Management Hooks

### useUser Hook
```typescript
interface UserState {
  user: User | null;
  profile: UserProfile | null;
  progress: UserProgress | null;
  isLoading: boolean;
  error: HookError | null;
}

interface UserActions {
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProgress: (progress: Partial<UserProgress>) => Promise<void>;
  refreshUser: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

interface UseUserReturn extends UserState, UserActions {}

const useUser: BaseHook<UseUserReturn> = () => {
  // Implementation
};
```

### useUserProgress Hook
```typescript
interface UserProgressState {
  progress: UserProgress | null;
  isLoading: boolean;
  error: HookError | null;
}

interface UserProgressActions {
  addXP: (amount: number, source: string) => Promise<void>;
  addCoins: (amount: number, source: string) => Promise<void>;
  updateLevel: (newLevel: number) => Promise<void>;
  updateStreak: (streak: number) => Promise<void>;
  refreshProgress: () => Promise<void>;
}

interface UseUserProgressReturn extends UserProgressState, UserProgressActions {}

const useUserProgress: BaseHook<UseUserProgressReturn> = () => {
  // Implementation
};
```

## Task Management Hooks

### useTasks Hook
```typescript
interface TasksState {
  tasks: Task[];
  availableTasks: Task[];
  completedTasks: TaskCompletion[];
  isLoading: boolean;
  error: HookError | null;
}

interface TasksActions {
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  completeTask: (taskId: string, completionData: TaskCompletionData) => Promise<void>;
  startTask: (taskId: string) => Promise<void>;
  abandonTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

interface TaskFilters {
  type?: TaskType;
  difficulty?: TaskDifficulty;
  category?: TaskCategory;
  isActive?: boolean;
  isCompleted?: boolean;
  limit?: number;
  offset?: number;
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

interface UseTasksReturn extends TasksState, TasksActions {}

const useTasks: BaseHook<UseTasksReturn> = () => {
  // Implementation
};
```

### useTask Hook
```typescript
interface TaskState {
  task: Task | null;
  completion: TaskCompletion | null;
  isLoading: boolean;
  error: HookError | null;
}

interface TaskActions {
  fetchTask: (taskId: string) => Promise<void>;
  completeTask: (completionData: TaskCompletionData) => Promise<void>;
  startTask: () => Promise<void>;
  abandonTask: () => Promise<void>;
  updateProgress: (progress: number) => Promise<void>;
}

interface UseTaskReturn extends TaskState, TaskActions {}

const useTask: (taskId: string) => UseTaskReturn = (taskId) => {
  // Implementation
};
```

## Nutrition Hooks

### useNutrition Hook
```typescript
interface NutritionState {
  meals: Meal[];
  dailyNutrition: DailyNutrition | null;
  goals: NutritionGoal[];
  isLoading: boolean;
  error: HookError | null;
}

interface NutritionActions {
  logMeal: (meal: MealData) => Promise<void>;
  updateGoals: (goals: Partial<NutritionGoal>[]) => Promise<void>;
  fetchMeals: (dateRange: DateRange) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  refreshNutrition: () => Promise<void>;
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
}

interface DateRange {
  start: string;
  end: string;
}

interface UseNutritionReturn extends NutritionState, NutritionActions {}

const useNutrition: BaseHook<UseNutritionReturn> = () => {
  // Implementation
};
```

### useNutritionQueries Hook
```typescript
interface NutritionQueriesState {
  searchResults: FoodItem[];
  recentSearches: string[];
  isLoading: boolean;
  error: HookError | null;
}

interface NutritionQueriesActions {
  searchFood: (query: string) => Promise<void>;
  getFoodDetails: (foodId: string) => Promise<FoodItem | null>;
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;
}

interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  macros: MacroNutrients;
  servingSize: number;
  servingUnit: string;
  barcode?: string;
  imageUrl?: string;
}

interface UseNutritionQueriesReturn extends NutritionQueriesState, NutritionQueriesActions {}

const useNutritionQueries: BaseHook<UseNutritionQueriesReturn> = () => {
  // Implementation
};
```

## Gamification Hooks

### useGamification Hook
```typescript
interface GamificationState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  quests: Quest[];
  userQuests: UserQuest[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: HookError | null;
}

interface GamificationActions {
  fetchAchievements: () => Promise<void>;
  fetchQuests: () => Promise<void>;
  startQuest: (questId: string) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  fetchLeaderboard: (type: LeaderboardType) => Promise<void>;
  refreshGamification: () => Promise<void>;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  level: number;
  avatar?: string;
  isCurrentUser: boolean;
}

enum LeaderboardType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time'
}

interface UseGamificationReturn extends GamificationState, GamificationActions {}

const useGamification: BaseHook<UseGamificationReturn> = () => {
  // Implementation
};
```

### useAchievements Hook
```typescript
interface AchievementsState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  isLoading: boolean;
  error: HookError | null;
}

interface AchievementsActions {
  fetchAchievements: () => Promise<void>;
  checkAchievements: (triggerType: string, triggerData: any) => Promise<void>;
  claimAchievement: (achievementId: string) => Promise<void>;
  refreshAchievements: () => Promise<void>;
}

interface UseAchievementsReturn extends AchievementsState, AchievementsActions {}

const useAchievements: BaseHook<UseAchievementsReturn> = () => {
  // Implementation
};
```

## AI Coach Hooks

### useAI Hook
```typescript
interface AIState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: HookError | null;
}

interface AIActions {
  sendMessage: (message: string, context?: AIContext) => Promise<void>;
  startNewConversation: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  getInsights: (type: InsightType) => Promise<AIInsight[]>;
}

interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  title?: string;
}

interface AIContext {
  currentTask?: string;
  userGoals?: string[];
  recentActivity?: string[];
}

interface UseAIReturn extends AIState, AIActions {}

const useAI: BaseHook<UseAIReturn> = () => {
  // Implementation
};
```

### useAICoach Hook
```typescript
interface AICoachState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: HookError | null;
  suggestions: AISuggestion[];
}

interface AICoachActions {
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  getSuggestions: () => Promise<void>;
  rateResponse: (messageId: string, rating: number) => Promise<void>;
}

interface AISuggestion {
  type: 'task' | 'tip' | 'recipe' | 'exercise';
  title: string;
  description: string;
  action?: string;
}

interface UseAICoachReturn extends AICoachState, AICoachActions {}

const useAICoach: BaseHook<UseAICoachReturn> = () => {
  // Implementation
};
```

## Social Hooks

### useSocial Hook
```typescript
interface SocialState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  posts: Post[];
  isLoading: boolean;
  error: HookError | null;
}

interface SocialActions {
  fetchFriends: () => Promise<void>;
  sendFriendRequest: (userId: string, message?: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  fetchPosts: (filters?: PostFilters) => Promise<void>;
  createPost: (post: PostData) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, content: string) => Promise<void>;
}

interface PostFilters {
  type?: PostType;
  authorId?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

interface PostData {
  content: string;
  type: PostType;
  media?: PostMedia[];
  tags: string[];
  isPublic: boolean;
}

interface UseSocialReturn extends SocialState, SocialActions {}

const useSocial: BaseHook<UseSocialReturn> = () => {
  // Implementation
};
```

### useFriends Hook
```typescript
interface FriendsState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  isLoading: boolean;
  error: HookError | null;
}

interface FriendsActions {
  fetchFriends: () => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
  sendFriendRequest: (userId: string, message?: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
}

interface UseFriendsReturn extends FriendsState, FriendsActions {}

const useFriends: BaseHook<UseFriendsReturn> = () => {
  // Implementation
};
```

## Form Hooks

### useForm Hook
```typescript
interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface FormActions<T> {
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  setTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  reset: () => void;
  submit: () => Promise<void>;
  validate: () => boolean;
  validateField: (field: keyof T) => boolean;
}

interface FormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

interface UseFormReturn<T> extends FormState<T>, FormActions<T> {}

const useForm: <T>(options: FormOptions<T>) => UseFormReturn<T> = (options) => {
  // Implementation
};
```

### useField Hook
```typescript
interface FieldState {
  value: any;
  error: string | null;
  touched: boolean;
  isDirty: boolean;
}

interface FieldActions {
  setValue: (value: any) => void;
  setError: (error: string) => void;
  setTouched: (touched: boolean) => void;
  reset: () => void;
  validate: () => boolean;
}

interface FieldOptions {
  name: string;
  initialValue?: any;
  validate?: (value: any) => string | null;
  required?: boolean;
}

interface UseFieldReturn extends FieldState, FieldActions {}

const useField: (options: FieldOptions) => UseFieldReturn = (options) => {
  // Implementation
};
```

## Utility Hooks

### useLocalStorage Hook
```typescript
interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: Error | null;
}

const useLocalStorage: <T>(
  key: string,
  initialValue: T
) => UseLocalStorageReturn<T> = (key, initialValue) => {
  // Implementation
};
```

### useFirestore Hook
```typescript
interface FirestoreState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FirestoreActions<T> {
  add: (data: Omit<T, 'id'>) => Promise<string>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

interface UseFirestoreReturn<T> extends FirestoreState<T>, FirestoreActions<T> {}

const useFirestore: <T>(
  collection: string,
  documentId?: string
) => UseFirestoreReturn<T> = (collection, documentId) => {
  // Implementation
};
```

### useOffline Hook
```typescript
interface OfflineState {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

interface OfflineActions {
  sync: () => Promise<void>;
  clearOfflineData: () => Promise<void>;
  getOfflineData: () => Promise<any[]>;
}

interface UseOfflineReturn extends OfflineState, OfflineActions {}

const useOffline: BaseHook<UseOfflineReturn> = () => {
  // Implementation
};
```

### usePWA Hook
```typescript
interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  hasUpdate: boolean;
  isOnline: boolean;
}

interface PWAActions {
  install: () => Promise<void>;
  update: () => Promise<void>;
  share: (data: ShareData) => Promise<void>;
}

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface UsePWAReturn extends PWAState, PWAActions {}

const usePWA: BaseHook<UsePWAReturn> = () => {
  // Implementation
};
```

### useAR Hook
```typescript
interface ARState {
  isSupported: boolean;
  isActive: boolean;
  isTracking: boolean;
  error: Error | null;
}

interface ARActions {
  start: () => Promise<void>;
  stop: () => void;
  capture: () => Promise<string>;
  detectFood: (image: string) => Promise<FoodDetectionResult>;
}

interface FoodDetectionResult {
  foods: DetectedFood[];
  confidence: number;
  processingTime: number;
}

interface DetectedFood {
  name: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nutrition?: {
    calories: number;
    macros: MacroNutrients;
  };
}

interface UseARReturn extends ARState, ARActions {}

const useAR: BaseHook<UseARReturn> = () => {
  // Implementation
};
```

## Hook Testing

### Hook Testing Utilities
```typescript
interface HookTestHelper {
  renderHook: <T>(hook: () => T) => {
    result: { current: T };
    rerender: () => void;
    unmount: () => void;
  };
  waitForNextUpdate: () => Promise<void>;
  act: (callback: () => void) => void;
}

interface HookTestSuite {
  testHookInitialization: () => Promise<void>;
  testHookStateUpdates: () => Promise<void>;
  testHookErrorHandling: () => Promise<void>;
  testHookCleanup: () => Promise<void>;
}
```

## Hook Documentation

### Hook Documentation Template
```typescript
/**
 * Custom hook for [purpose]
 * 
 * @param {Type} param - Description of parameter
 * @returns {Type} Description of return value
 * 
 * @example
 * ```typescript
 * const { data, loading, error } = useExampleHook();
 * ```
 * 
 * @throws {Error} Description of when error is thrown
 * 
 * @since 1.0.0
 */
```

This custom hook interface contract specification ensures consistent and type-safe hook implementations across the Diet Game application with proper error handling, testing, and documentation standards.
