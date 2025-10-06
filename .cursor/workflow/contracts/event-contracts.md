# Event Contracts

## Overview
This document defines the event contracts for the Diet Game application's event-driven architecture, including event types, schemas, and processing patterns.

## Event Schema

### Base Event Structure
```typescript
interface BaseEvent {
  id: string;
  type: string;
  version: string;
  timestamp: string;
  source: string;
  correlationId?: string;
  causationId?: string;
  metadata: EventMetadata;
  data: any;
}

interface EventMetadata {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  tags?: Record<string, string>;
}
```

## Domain Events

### User Domain Events

#### `UserRegistered`
```typescript
interface UserRegisteredEvent extends BaseEvent {
  type: 'user.registered';
  data: {
    userId: string;
    email: string;
    username: string;
    registrationMethod: 'email' | 'google' | 'apple';
    profile: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      height?: number;
      weight?: number;
      activityLevel: ActivityLevel;
    };
  };
}
```

#### `UserProfileUpdated`
```typescript
interface UserProfileUpdatedEvent extends BaseEvent {
  type: 'user.profile.updated';
  data: {
    userId: string;
    changes: {
      firstName?: { old: string; new: string };
      lastName?: { old: string; new: string };
      height?: { old: number; new: number };
      weight?: { old: number; new: number };
      activityLevel?: { old: ActivityLevel; new: ActivityLevel };
    };
  };
}
```

#### `UserPreferencesChanged`
```typescript
interface UserPreferencesChangedEvent extends BaseEvent {
  type: 'user.preferences.changed';
  data: {
    userId: string;
    preferences: {
      theme?: { old: Theme; new: Theme };
      notifications?: { old: NotificationSettings; new: NotificationSettings };
      privacy?: { old: PrivacySettings; new: PrivacySettings };
    };
  };
}
```

### Nutrition Domain Events

#### `NutritionEntryLogged`
```typescript
interface NutritionEntryLoggedEvent extends BaseEvent {
  type: 'nutrition.entry.logged';
  data: {
    entryId: string;
    userId: string;
    foodId: string;
    quantity: number;
    unit: string;
    mealType: MealType;
    nutritionFacts: NutritionFacts;
    loggedAt: string;
  };
}
```

#### `NutritionGoalAchieved`
```typescript
interface NutritionGoalAchievedEvent extends BaseEvent {
  type: 'nutrition.goal.achieved';
  data: {
    userId: string;
    goalType: 'calories' | 'protein' | 'carbohydrates' | 'fat';
    target: number;
    achieved: number;
    date: string;
  };
}
```

#### `NutritionStreakUpdated`
```typescript
interface NutritionStreakUpdatedEvent extends BaseEvent {
  type: 'nutrition.streak.updated';
  data: {
    userId: string;
    streakType: 'logging' | 'goal_achievement';
    currentStreak: number;
    previousStreak: number;
    isBroken: boolean;
  };
}
```

### Gamification Domain Events

#### `AchievementUnlocked`
```typescript
interface AchievementUnlockedEvent extends BaseEvent {
  type: 'achievement.unlocked';
  data: {
    achievementId: string;
    userId: string;
    achievement: {
      name: string;
      description: string;
      category: AchievementCategory;
      points: number;
      rarity: ItemRarity;
    };
    unlockedAt: string;
  };
}
```

#### `QuestCompleted`
```typescript
interface QuestCompletedEvent extends BaseEvent {
  type: 'quest.completed';
  data: {
    questId: string;
    userId: string;
    quest: {
      title: string;
      type: QuestType;
      difficulty: QuestDifficulty;
      rewards: QuestRewards;
    };
    completedAt: string;
    completionTime: number; // seconds
  };
}
```

#### `LevelUp`
```typescript
interface LevelUpEvent extends BaseEvent {
  type: 'gamification.level.up';
  data: {
    userId: string;
    previousLevel: number;
    newLevel: number;
    experience: number;
    experienceToNext: number;
    rewards: {
      points: number;
      achievements: string[];
      items: QuestItem[];
    };
  };
}
```

#### `PointsEarned`
```typescript
interface PointsEarnedEvent extends BaseEvent {
  type: 'gamification.points.earned';
  data: {
    userId: string;
    points: number;
    source: 'achievement' | 'quest' | 'streak' | 'social';
    sourceId: string;
    totalPoints: number;
  };
}
```

### Social Domain Events

#### `FriendRequestSent`
```typescript
interface FriendRequestSentEvent extends BaseEvent {
  type: 'social.friend.request.sent';
  data: {
    requestId: string;
    fromUserId: string;
    toUserId: string;
    sentAt: string;
  };
}
```

#### `FriendRequestAccepted`
```typescript
interface FriendRequestAcceptedEvent extends BaseEvent {
  type: 'social.friend.request.accepted';
  data: {
    friendshipId: string;
    user1Id: string;
    user2Id: string;
    acceptedAt: string;
  };
}
```

#### `PostCreated`
```typescript
interface PostCreatedEvent extends BaseEvent {
  type: 'social.post.created';
  data: {
    postId: string;
    authorId: string;
    content: string;
    type: PostType;
    media: Media[];
    createdAt: string;
  };
}
```

#### `PostLiked`
```typescript
interface PostLikedEvent extends BaseEvent {
  type: 'social.post.liked';
  data: {
    likeId: string;
    postId: string;
    userId: string;
    likedAt: string;
  };
}
```

### System Domain Events

#### `SystemMaintenanceScheduled`
```typescript
interface SystemMaintenanceScheduledEvent extends BaseEvent {
  type: 'system.maintenance.scheduled';
  data: {
    maintenanceId: string;
    startTime: string;
    endTime: string;
    description: string;
    affectedServices: string[];
  };
}
```

#### `SystemErrorOccurred`
```typescript
interface SystemErrorOccurredEvent extends BaseEvent {
  type: 'system.error.occurred';
  data: {
    errorId: string;
    service: string;
    errorType: string;
    message: string;
    stackTrace?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    userId?: string;
  };
}
```

## Event Processing Patterns

### Event Sourcing
Events are stored as the source of truth for all state changes:

```typescript
interface EventStore {
  append(streamId: string, events: BaseEvent[]): Promise<void>;
  getEvents(streamId: string, fromVersion?: number): Promise<BaseEvent[]>;
  getSnapshot(streamId: string): Promise<Snapshot>;
}
```

### CQRS (Command Query Responsibility Segregation)
Commands generate events, queries read from projections:

```typescript
// Command side
interface Command {
  type: string;
  data: any;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<BaseEvent[]>;
}

// Query side
interface Projection {
  handle(event: BaseEvent): Promise<void>;
}

interface ReadModel {
  getById(id: string): Promise<any>;
  search(criteria: SearchCriteria): Promise<any[]>;
}
```

### Saga Pattern
Long-running transactions managed through event coordination:

```typescript
interface Saga {
  id: string;
  type: string;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  steps: SagaStep[];
  currentStep: number;
}

interface SagaStep {
  id: string;
  action: string;
  compensation?: string;
  status: 'pending' | 'completed' | 'failed' | 'compensated';
}
```

## Event Bus

### Event Bus Interface
```typescript
interface EventBus {
  publish(event: BaseEvent): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): Promise<void>;
  unsubscribe(eventType: string, handler: EventHandler): Promise<void>;
}

interface EventHandler {
  handle(event: BaseEvent): Promise<void>;
}
```

### Event Routing
Events are routed based on type and metadata:

```typescript
interface EventRouter {
  route(event: BaseEvent): Promise<string[]>; // Returns handler IDs
}

interface RoutingRule {
  eventType: string;
  conditions: RoutingCondition[];
  handlers: string[];
}

interface RoutingCondition {
  field: string;
  operator: 'equals' | 'contains' | 'matches' | 'exists';
  value: any;
}
```

## Event Validation

### Schema Validation
All events must conform to their defined schemas:

```typescript
interface EventValidator {
  validate(event: BaseEvent): ValidationResult;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### Business Rule Validation
Events are validated against business rules:

```typescript
interface BusinessRuleValidator {
  validate(event: BaseEvent, context: ValidationContext): Promise<ValidationResult>;
}

interface ValidationContext {
  userId?: string;
  sessionId?: string;
  timestamp: string;
  previousEvents: BaseEvent[];
}
```

## Event Persistence

### Event Store Implementation
```typescript
interface EventStoreConfig {
  provider: 'postgresql' | 'mongodb' | 'dynamodb';
  connectionString: string;
  tableName: string;
  batchSize: number;
  retentionPeriod: number; // days
}

class EventStore {
  async append(streamId: string, events: BaseEvent[]): Promise<void> {
    // Implementation for appending events
  }
  
  async getEvents(streamId: string, fromVersion?: number): Promise<BaseEvent[]> {
    // Implementation for retrieving events
  }
  
  async getSnapshot(streamId: string): Promise<Snapshot> {
    // Implementation for retrieving snapshots
  }
}
```

### Snapshot Strategy
```typescript
interface Snapshot {
  streamId: string;
  version: number;
  data: any;
  timestamp: string;
}

interface SnapshotPolicy {
  frequency: number; // events between snapshots
  maxAge: number; // days
  compression: boolean;
}
```

## Event Monitoring

### Event Metrics
```typescript
interface EventMetrics {
  eventType: string;
  count: number;
  averageProcessingTime: number;
  errorRate: number;
  lastProcessed: string;
}

interface EventMonitor {
  getMetrics(eventType?: string): Promise<EventMetrics[]>;
  getHealthStatus(): Promise<HealthStatus>;
}
```

### Event Tracing
```typescript
interface EventTrace {
  eventId: string;
  correlationId: string;
  handlers: HandlerTrace[];
  processingTime: number;
  status: 'success' | 'failed' | 'timeout';
}

interface HandlerTrace {
  handlerId: string;
  startTime: string;
  endTime: string;
  processingTime: number;
  status: 'success' | 'failed';
  error?: string;
}
```

## Error Handling

### Event Processing Errors
```typescript
interface EventProcessingError {
  eventId: string;
  handlerId: string;
  error: Error;
  retryCount: number;
  maxRetries: number;
  nextRetryAt: string;
}

interface ErrorHandler {
  handle(error: EventProcessingError): Promise<void>;
}
```

### Dead Letter Queue
Failed events are sent to a dead letter queue for manual processing:

```typescript
interface DeadLetterQueue {
  add(event: BaseEvent, error: Error): Promise<void>;
  process(): Promise<BaseEvent[]>;
  remove(eventId: string): Promise<void>;
}
```

## Testing

### Event Testing Utilities
```typescript
interface EventTestHelper {
  createEvent(type: string, data: any): BaseEvent;
  assertEventPublished(eventType: string, data: any): Promise<void>;
  assertEventNotPublished(eventType: string): Promise<void>;
  clearEvents(): Promise<void>;
}

class EventTestSuite {
  async testEventPublishing(): Promise<void> {
    // Test event publishing
  }
  
  async testEventHandling(): Promise<void> {
    // Test event handling
  }
  
  async testEventOrdering(): Promise<void> {
    // Test event ordering
  }
}
```

## Related Documentation
- [Event-Driven Architecture](../architecture/event-driven-architecture.md)
- [API Documentation](../API_DOCUMENTATION.md)
- [Monitoring Architecture](../architecture/monitoring-architecture.md)
- [Testing Guide](../TESTING_GUIDE.md)
