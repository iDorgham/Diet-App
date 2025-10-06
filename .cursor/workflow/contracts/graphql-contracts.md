# GraphQL Contracts

## Overview
This document defines the GraphQL schema contracts for the Diet Game application, including queries, mutations, subscriptions, and type definitions.

## Schema Definition

### Types

#### User
```graphql
type User {
  id: ID!
  email: String!
  username: String!
  profile: UserProfile!
  preferences: UserPreferences!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserProfile {
  firstName: String
  lastName: String
  avatar: String
  bio: String
  dateOfBirth: Date
  height: Float
  weight: Float
  activityLevel: ActivityLevel!
  dietaryRestrictions: [DietaryRestriction!]!
  fitnessGoals: [FitnessGoal!]!
}

type UserPreferences {
  theme: Theme!
  notifications: NotificationPreferences!
  privacy: PrivacySettings!
  units: UnitSystem!
}

enum ActivityLevel {
  SEDENTARY
  LIGHTLY_ACTIVE
  MODERATELY_ACTIVE
  VERY_ACTIVE
  EXTRA_ACTIVE
}

enum Theme {
  LIGHT
  DARK
  SYSTEM
}

enum UnitSystem {
  METRIC
  IMPERIAL
}
```

#### Nutrition
```graphql
type NutritionEntry {
  id: ID!
  userId: ID!
  food: Food!
  quantity: Float!
  unit: String!
  mealType: MealType!
  loggedAt: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Food {
  id: ID!
  name: String!
  brand: String
  barcode: String
  nutritionFacts: NutritionFacts!
  servingSize: Float!
  servingUnit: String!
  category: FoodCategory!
}

type NutritionFacts {
  calories: Float!
  protein: Float!
  carbohydrates: Float!
  fat: Float!
  fiber: Float
  sugar: Float
  sodium: Float
  cholesterol: Float
  saturatedFat: Float
  transFat: Float
  vitamins: [Vitamin!]!
  minerals: [Mineral!]!
}

type Vitamin {
  name: String!
  amount: Float!
  unit: String!
  dailyValue: Float
}

type Mineral {
  name: String!
  amount: Float!
  unit: String!
  dailyValue: Float
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}

enum FoodCategory {
  FRUITS
  VEGETABLES
  GRAINS
  PROTEIN
  DAIRY
  BEVERAGES
  SNACKS
  CONDIMENTS
  OTHER
}
```

#### Gamification
```graphql
type Achievement {
  id: ID!
  name: String!
  description: String!
  icon: String!
  points: Int!
  category: AchievementCategory!
  requirements: AchievementRequirements!
  unlockedAt: DateTime
  progress: Float
}

type AchievementRequirements {
  type: RequirementType!
  target: Float!
  current: Float!
  description: String!
}

type Quest {
  id: ID!
  title: String!
  description: String!
  type: QuestType!
  difficulty: QuestDifficulty!
  rewards: QuestRewards!
  requirements: QuestRequirements!
  status: QuestStatus!
  expiresAt: DateTime
  completedAt: DateTime
  progress: Float
}

type QuestRewards {
  experience: Int!
  points: Int!
  achievements: [ID!]!
  items: [QuestItem!]!
}

type QuestItem {
  id: ID!
  name: String!
  type: ItemType!
  rarity: ItemRarity!
  description: String!
}

enum AchievementCategory {
  NUTRITION
  FITNESS
  SOCIAL
  STREAK
  MILESTONE
}

enum RequirementType {
  CALORIES_CONSUMED
  PROTEIN_CONSUMED
  WORKOUTS_COMPLETED
  STREAK_DAYS
  FRIENDS_ADDED
}

enum QuestType {
  DAILY
  WEEKLY
  MONTHLY
  SPECIAL
}

enum QuestDifficulty {
  EASY
  MEDIUM
  HARD
  EXPERT
}

enum QuestStatus {
  ACTIVE
  COMPLETED
  EXPIRED
  LOCKED
}

enum ItemType {
  BADGE
  AVATAR
  TITLE
  POWER_UP
}

enum ItemRarity {
  COMMON
  UNCOMMON
  RARE
  EPIC
  LEGENDARY
}
```

#### Social
```graphql
type Friend {
  id: ID!
  user: User!
  status: FriendshipStatus!
  addedAt: DateTime!
}

type Post {
  id: ID!
  author: User!
  content: String!
  type: PostType!
  media: [Media!]!
  likes: [Like!]!
  comments: [Comment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Comment {
  id: ID!
  post: Post!
  author: User!
  content: String!
  likes: [Like!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Like {
  id: ID!
  user: User!
  createdAt: DateTime!
}

type Media {
  id: ID!
  url: String!
  type: MediaType!
  alt: String
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
  BLOCKED
}

enum PostType {
  MEAL_SHARE
  WORKOUT_UPDATE
  ACHIEVEMENT
  GENERAL
}

enum MediaType {
  IMAGE
  VIDEO
  GIF
}
```

### Queries

#### User Queries
```graphql
type Query {
  # User queries
  me: User
  user(id: ID!): User
  users(search: String, limit: Int, offset: Int): [User!]!
  
  # Profile queries
  myProfile: UserProfile
  userProfile(userId: ID!): UserProfile
  
  # Nutrition queries
  nutritionEntries(
    userId: ID
    date: Date
    mealType: MealType
    limit: Int
    offset: Int
  ): [NutritionEntry!]!
  
  food(id: ID!): Food
  foods(search: String, category: FoodCategory, limit: Int): [Food!]!
  
  # Gamification queries
  achievements(userId: ID): [Achievement!]!
  quests(userId: ID, status: QuestStatus): [Quest!]!
  leaderboard(type: LeaderboardType, period: LeaderboardPeriod): [LeaderboardEntry!]!
  
  # Social queries
  friends(userId: ID, status: FriendshipStatus): [Friend!]!
  posts(userId: ID, limit: Int, offset: Int): [Post!]!
  feed(limit: Int, offset: Int): [Post!]!
}

type LeaderboardEntry {
  user: User!
  score: Float!
  rank: Int!
  period: LeaderboardPeriod!
}

enum LeaderboardType {
  POINTS
  STREAK
  CALORIES_BURNED
  WORKOUTS_COMPLETED
}

enum LeaderboardPeriod {
  DAILY
  WEEKLY
  MONTHLY
  ALL_TIME
}
```

### Mutations

#### User Mutations
```graphql
type Mutation {
  # User mutations
  updateProfile(input: UpdateProfileInput!): UserProfile!
  updatePreferences(input: UpdatePreferencesInput!): UserPreferences!
  
  # Nutrition mutations
  logNutrition(input: LogNutritionInput!): NutritionEntry!
  updateNutritionEntry(id: ID!, input: UpdateNutritionInput!): NutritionEntry!
  deleteNutritionEntry(id: ID!): Boolean!
  
  # Gamification mutations
  claimAchievement(id: ID!): Achievement!
  completeQuest(id: ID!): Quest!
  redeemReward(id: ID!): QuestItem!
  
  # Social mutations
  sendFriendRequest(userId: ID!): Friend!
  acceptFriendRequest(id: ID!): Friend!
  rejectFriendRequest(id: ID!): Boolean!
  removeFriend(id: ID!): Boolean!
  
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  
  likePost(id: ID!): Like!
  unlikePost(id: ID!): Boolean!
  
  addComment(postId: ID!, input: AddCommentInput!): Comment!
  updateComment(id: ID!, input: UpdateCommentInput!): Comment!
  deleteComment(id: ID!): Boolean!
  
  likeComment(id: ID!): Like!
  unlikeComment(id: ID!): Boolean!
}

# Input Types
input UpdateProfileInput {
  firstName: String
  lastName: String
  avatar: String
  bio: String
  dateOfBirth: Date
  height: Float
  weight: Float
  activityLevel: ActivityLevel
  dietaryRestrictions: [DietaryRestriction!]
  fitnessGoals: [FitnessGoal!]
}

input UpdatePreferencesInput {
  theme: Theme
  notifications: NotificationPreferencesInput
  privacy: PrivacySettingsInput
  units: UnitSystem
}

input LogNutritionInput {
  foodId: ID!
  quantity: Float!
  unit: String!
  mealType: MealType!
  loggedAt: DateTime
}

input UpdateNutritionInput {
  quantity: Float
  unit: String
  mealType: MealType
  loggedAt: DateTime
}

input CreatePostInput {
  content: String!
  type: PostType!
  media: [MediaInput!]
}

input UpdatePostInput {
  content: String
  media: [MediaInput!]
}

input AddCommentInput {
  content: String!
}

input UpdateCommentInput {
  content: String!
}

input MediaInput {
  url: String!
  type: MediaType!
  alt: String
}

input NotificationPreferencesInput {
  email: Boolean
  push: Boolean
  inApp: Boolean
  mealReminders: Boolean
  workoutReminders: Boolean
  socialUpdates: Boolean
}

input PrivacySettingsInput {
  profileVisibility: ProfileVisibility
  activityVisibility: ActivityVisibility
  allowFriendRequests: Boolean
  showInLeaderboards: Boolean
}

enum ProfileVisibility {
  PUBLIC
  FRIENDS_ONLY
  PRIVATE
}

enum ActivityVisibility {
  PUBLIC
  FRIENDS_ONLY
  PRIVATE
}

enum DietaryRestriction {
  VEGETARIAN
  VEGAN
  GLUTEN_FREE
  DAIRY_FREE
  NUT_FREE
  KETO
  PALEO
  LOW_CARB
  LOW_SODIUM
}

enum FitnessGoal {
  WEIGHT_LOSS
  WEIGHT_GAIN
  MUSCLE_GAIN
  ENDURANCE
  STRENGTH
  FLEXIBILITY
  GENERAL_FITNESS
}
```

### Subscriptions

```graphql
type Subscription {
  # Real-time updates
  nutritionEntryAdded(userId: ID!): NutritionEntry!
  nutritionEntryUpdated(userId: ID!): NutritionEntry!
  nutritionEntryDeleted(userId: ID!): ID!
  
  achievementUnlocked(userId: ID!): Achievement!
  questCompleted(userId: ID!): Quest!
  
  friendRequestReceived: Friend!
  friendRequestAccepted: Friend!
  
  postLiked(postId: ID!): Like!
  commentAdded(postId: ID!): Comment!
  commentLiked(commentId: ID!): Like!
  
  leaderboardUpdated(type: LeaderboardType!): [LeaderboardEntry!]!
}
```

## Error Handling

### Error Types
```graphql
type Error {
  message: String!
  code: String!
  field: String
  details: String
}

union UserResult = User | Error
union NutritionEntryResult = NutritionEntry | Error
union AchievementResult = Achievement | Error
```

### Common Error Codes
- `UNAUTHENTICATED`: User not authenticated
- `UNAUTHORIZED`: User not authorized for action
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMITED`: Rate limit exceeded
- `INTERNAL_ERROR`: Internal server error

## Rate Limiting

### Limits
- **Queries**: 1000 requests per hour per user
- **Mutations**: 100 requests per hour per user
- **Subscriptions**: 10 concurrent subscriptions per user

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Authentication

### Headers
```
Authorization: Bearer <jwt_token>
```

### JWT Claims
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1640995200,
  "exp": 1640998800,
  "role": "user"
}
```

## Caching

### Query Caching
- **User data**: 5 minutes
- **Nutrition entries**: 1 minute
- **Achievements**: 10 minutes
- **Leaderboards**: 5 minutes

### Cache Headers
```
Cache-Control: public, max-age=300
ETag: "abc123"
```

## Related Documentation
- [API Documentation](../API_DOCUMENTATION.md)
- [Authentication Guide](../AUTHENTICATION.md)
- [Rate Limiting Guide](../RATE_LIMITING.md)
- [Error Handling Guide](../DEVELOPER_GUIDE.md#error-handling)
