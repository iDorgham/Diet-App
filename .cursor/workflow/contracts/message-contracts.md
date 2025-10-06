# Message Queue Contracts

## Overview
This document defines the message queue contracts for asynchronous communication and event processing in the Diet Game application, including message formats, routing, and processing patterns.

## Base Message Structure

### Message Format
```typescript
interface BaseMessage {
  id: string;
  type: string;
  version: string;
  timestamp: string;
  source: string;
  destination?: string;
  correlationId?: string;
  causationId?: string;
  priority: MessagePriority;
  ttl?: number; // seconds
  retryCount: number;
  maxRetries: number;
  metadata: MessageMetadata;
  payload: any;
}

enum MessagePriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 10,
  CRITICAL = 15
}

interface MessageMetadata {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  traceId?: string;
  tags?: Record<string, string>;
  headers?: Record<string, string>;
}
```

### Message Headers
```typescript
interface MessageHeaders {
  'Content-Type': 'application/json';
  'Message-Type': string;
  'Message-Version': string;
  'Message-Source': string;
  'Message-Destination'?: string;
  'Correlation-ID'?: string;
  'Causation-ID'?: string;
  'Priority': string;
  'TTL'?: string;
  'Retry-Count'?: string;
  'Max-Retries'?: string;
  'User-ID'?: string;
  'Session-ID'?: string;
  'Request-ID'?: string;
  'Trace-ID'?: string;
}
```

## Queue Configuration

### Queue Types
```typescript
interface QueueConfig {
  name: string;
  type: QueueType;
  durable: boolean;
  autoDelete: boolean;
  exclusive: boolean;
  arguments?: Record<string, any>;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  messageTtl?: number;
  maxLength?: number;
  maxPriority?: number;
}

enum QueueType {
  STANDARD = 'standard',
  FIFO = 'fifo',
  DELAYED = 'delayed',
  DEAD_LETTER = 'dead_letter',
  RETRY = 'retry'
}

interface ExchangeConfig {
  name: string;
  type: ExchangeType;
  durable: boolean;
  autoDelete: boolean;
  arguments?: Record<string, any>;
}

enum ExchangeType {
  DIRECT = 'direct',
  TOPIC = 'topic',
  FANOUT = 'fanout',
  HEADERS = 'headers'
}
```

### Routing Configuration
```typescript
interface RoutingConfig {
  exchange: string;
  routingKey: string;
  queue: string;
  bindingArguments?: Record<string, any>;
}

interface MessageRouter {
  route(message: BaseMessage): Promise<RoutingConfig[]>;
  addRoute(route: RoutingConfig): void;
  removeRoute(route: RoutingConfig): void;
}
```

## Domain Messages

### User Domain Messages

#### User Registration Messages
```typescript
interface UserRegistrationMessage extends BaseMessage {
  type: 'user.registration.requested';
  payload: {
    email: string;
    username: string;
    password: string;
    profile: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      height?: number;
      weight?: number;
      activityLevel: ActivityLevel;
    };
    registrationMethod: 'email' | 'google' | 'apple';
    ipAddress: string;
    userAgent: string;
  };
}

interface UserRegistrationCompletedMessage extends BaseMessage {
  type: 'user.registration.completed';
  payload: {
    userId: string;
    email: string;
    username: string;
    profile: UserProfile;
    registeredAt: string;
  };
}

interface UserRegistrationFailedMessage extends BaseMessage {
  type: 'user.registration.failed';
  payload: {
    email: string;
    username: string;
    reason: string;
    errorCode: string;
    failedAt: string;
  };
}
```

#### User Profile Messages
```typescript
interface UserProfileUpdateMessage extends BaseMessage {
  type: 'user.profile.update.requested';
  payload: {
    userId: string;
    changes: {
      firstName?: string;
      lastName?: string;
      height?: number;
      weight?: number;
      activityLevel?: ActivityLevel;
      dietType?: DietType;
      bodyType?: BodyType;
    };
    updatedBy: string;
    reason: string;
  };
}

interface UserProfileUpdatedMessage extends BaseMessage {
  type: 'user.profile.updated';
  payload: {
    userId: string;
    profile: UserProfile;
    changes: Record<string, any>;
    updatedAt: string;
    updatedBy: string;
  };
}
```

### Nutrition Domain Messages

#### Meal Logging Messages
```typescript
interface MealLoggingMessage extends BaseMessage {
  type: 'meal.logging.requested';
  payload: {
    userId: string;
    meal: {
      type: MealType;
      name: string;
      ingredients: Ingredient[];
      totalCalories: number;
      totalMacros: MacroNutrients;
      servingSize: number;
      servingUnit: string;
      timestamp: string;
    };
    source: 'manual' | 'barcode' | 'ai_scan' | 'recipe';
  };
}

interface MealLoggedMessage extends BaseMessage {
  type: 'meal.logged';
  payload: {
    mealId: string;
    userId: string;
    meal: Meal;
    nutritionSummary: {
      dailyCalories: number;
      dailyMacros: MacroNutrients;
      goalProgress: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
      };
    };
    xpAwarded: number;
    loggedAt: string;
  };
}

interface NutritionGoalUpdateMessage extends BaseMessage {
  type: 'nutrition.goal.update';
  payload: {
    userId: string;
    goalType: NutritionGoalType;
    current: number;
    target: number;
    progress: number;
    updatedAt: string;
  };
}
```

### Task Domain Messages

#### Task Management Messages
```typescript
interface TaskAssignmentMessage extends BaseMessage {
  type: 'task.assignment.requested';
  payload: {
    userId: string;
    taskId: string;
    assignedBy: 'system' | 'user' | 'ai';
    priority: TaskPriority;
    dueDate?: string;
    context?: {
      userLevel: number;
      userGoals: string[];
      recentActivity: string[];
    };
  };
}

interface TaskAssignedMessage extends BaseMessage {
  type: 'task.assigned';
  payload: {
    taskId: string;
    userId: string;
    task: Task;
    assignedAt: string;
    dueDate?: string;
    priority: TaskPriority;
  };
}

interface TaskCompletionMessage extends BaseMessage {
  type: 'task.completion.requested';
  payload: {
    taskId: string;
    userId: string;
    completionData: {
      quality: number; // 1-5 rating
      duration?: number; // minutes
      notes?: string;
      photos?: string[];
      location?: {
        latitude: number;
        longitude: number;
        address?: string;
      };
    };
    completedAt: string;
  };
}

interface TaskCompletedMessage extends BaseMessage {
  type: 'task.completed';
  payload: {
    taskId: string;
    userId: string;
    task: Task;
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
    completedAt: string;
  };
}
```

### Gamification Domain Messages

#### Achievement Messages
```typescript
interface AchievementCheckMessage extends BaseMessage {
  type: 'achievement.check.requested';
  payload: {
    userId: string;
    triggerType: 'task_completion' | 'streak_update' | 'level_up' | 'social_action';
    triggerData: any;
    context: {
      userLevel: number;
      userStats: UserStatistics;
      recentActivity: string[];
    };
  };
}

interface AchievementUnlockedMessage extends BaseMessage {
  type: 'achievement.unlocked';
  payload: {
    achievementId: string;
    userId: string;
    achievement: Achievement;
    unlockedAt: string;
    triggerType: string;
    triggerData: any;
  };
}

interface LevelUpMessage extends BaseMessage {
  type: 'level.up';
  payload: {
    userId: string;
    previousLevel: number;
    newLevel: number;
    xpEarned: number;
    totalXP: number;
    xpToNext: number;
    rewards: {
      coins: number;
      achievements: Achievement[];
      items: string[];
    };
    leveledUpAt: string;
  };
}
```

### Social Domain Messages

#### Friend Request Messages
```typescript
interface FriendRequestMessage extends BaseMessage {
  type: 'friend.request.sent';
  payload: {
    requestId: string;
    fromUserId: string;
    toUserId: string;
    message?: string;
    sentAt: string;
  };
}

interface FriendRequestAcceptedMessage extends BaseMessage {
  type: 'friend.request.accepted';
  payload: {
    friendshipId: string;
    user1Id: string;
    user2Id: string;
    acceptedAt: string;
  };
}

interface FriendRequestDeclinedMessage extends BaseMessage {
  type: 'friend.request.declined';
  payload: {
    requestId: string;
    fromUserId: string;
    toUserId: string;
    declinedAt: string;
    reason?: string;
  };
}
```

#### Social Activity Messages
```typescript
interface PostCreatedMessage extends BaseMessage {
  type: 'post.created';
  payload: {
    postId: string;
    authorId: string;
    content: string;
    type: PostType;
    media?: PostMedia[];
    tags: string[];
    isPublic: boolean;
    createdAt: string;
  };
}

interface PostLikedMessage extends BaseMessage {
  type: 'post.liked';
  payload: {
    likeId: string;
    postId: string;
    userId: string;
    likedAt: string;
  };
}

interface CommentCreatedMessage extends BaseMessage {
  type: 'comment.created';
  payload: {
    commentId: string;
    postId: string;
    authorId: string;
    content: string;
    parentId?: string;
    createdAt: string;
  };
}
```

### AI Domain Messages

#### AI Coach Messages
```typescript
interface AICoachRequestMessage extends BaseMessage {
  type: 'ai.coach.request';
  payload: {
    userId: string;
    message: string;
    context: {
      currentTask?: string;
      userGoals: string[];
      recentActivity: string[];
      userLevel: number;
      userStats: UserStatistics;
    };
    conversationId?: string;
    requestId: string;
  };
}

interface AICoachResponseMessage extends BaseMessage {
  type: 'ai.coach.response';
  payload: {
    userId: string;
    conversationId: string;
    response: string;
    suggestions?: AISuggestion[];
    xpAwarded: number;
    processingTime: number;
    model: string;
    tokens: number;
    confidence: number;
    responseId: string;
  };
}

interface AIInsightGeneratedMessage extends BaseMessage {
  type: 'ai.insight.generated';
  payload: {
    insightId: string;
    userId: string;
    type: InsightType;
    title: string;
    description: string;
    confidence: number;
    actionable: boolean;
    data: any;
    recommendations: string[];
    generatedAt: string;
  };
}
```

### Notification Messages

#### Notification Delivery Messages
```typescript
interface NotificationRequestMessage extends BaseMessage {
  type: 'notification.request';
  payload: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    category: NotificationCategory;
    priority: NotificationPriority;
    actionUrl?: string;
    metadata?: Record<string, any>;
    scheduledFor?: string;
    channels: NotificationChannel[];
  };
}

interface NotificationSentMessage extends BaseMessage {
  type: 'notification.sent';
  payload: {
    notificationId: string;
    userId: string;
    channel: NotificationChannel;
    status: 'sent' | 'delivered' | 'failed';
    sentAt: string;
    deliveryTime?: number;
    error?: string;
  };
}

enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  ACHIEVEMENT = 'achievement',
  TASK_REMINDER = 'task_reminder',
  SOCIAL = 'social',
  SYSTEM = 'system'
}

enum NotificationCategory {
  TASK = 'task',
  ACHIEVEMENT = 'achievement',
  SOCIAL = 'social',
  SYSTEM = 'system',
  NUTRITION = 'nutrition',
  FITNESS = 'fitness'
}

enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  SMS = 'sms',
  WEBHOOK = 'webhook'
}
```

## Message Processing

### Message Handler Interface
```typescript
interface MessageHandler<T extends BaseMessage> {
  handle(message: T): Promise<void>;
  canHandle(messageType: string): boolean;
  getMessageType(): string;
}

interface MessageProcessor {
  process(message: BaseMessage): Promise<void>;
  registerHandler(handler: MessageHandler<any>): void;
  unregisterHandler(messageType: string): void;
}
```

### Message Consumer
```typescript
interface MessageConsumer {
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  getStatus(): ConsumerStatus;
  getMetrics(): ConsumerMetrics;
}

enum ConsumerStatus {
  STOPPED = 'stopped',
  STARTING = 'starting',
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPING = 'stopping',
  ERROR = 'error'
}

interface ConsumerMetrics {
  messagesProcessed: number;
  messagesFailed: number;
  averageProcessingTime: number;
  lastProcessedAt: string;
  errorRate: number;
}
```

### Message Producer
```typescript
interface MessageProducer {
  send(message: BaseMessage): Promise<void>;
  sendBatch(messages: BaseMessage[]): Promise<void>;
  sendDelayed(message: BaseMessage, delay: number): Promise<void>;
  getMetrics(): ProducerMetrics;
}

interface ProducerMetrics {
  messagesSent: number;
  messagesFailed: number;
  averageSendTime: number;
  lastSentAt: string;
  errorRate: number;
}
```

## Error Handling

### Dead Letter Queue
```typescript
interface DeadLetterMessage extends BaseMessage {
  originalMessage: BaseMessage;
  error: {
    code: string;
    message: string;
    stack?: string;
  };
  failedAt: string;
  retryCount: number;
  maxRetries: number;
}

interface DeadLetterHandler {
  handle(message: DeadLetterMessage): Promise<void>;
  retry(message: DeadLetterMessage): Promise<void>;
  discard(message: DeadLetterMessage): Promise<void>;
}
```

### Retry Strategy
```typescript
interface RetryConfig {
  maxRetries: number;
  backoffStrategy: BackoffStrategy;
  retryableErrors: string[];
}

enum BackoffStrategy {
  FIXED = 'fixed',
  LINEAR = 'linear',
  EXPONENTIAL = 'exponential',
  CUSTOM = 'custom'
}

interface RetryPolicy {
  calculateDelay(retryCount: number, baseDelay: number): number;
  shouldRetry(error: Error, retryCount: number): boolean;
}
```

## Message Persistence

### Message Store
```typescript
interface MessageStore {
  save(message: BaseMessage): Promise<void>;
  getById(messageId: string): Promise<BaseMessage | null>;
  getByCorrelationId(correlationId: string): Promise<BaseMessage[]>;
  delete(messageId: string): Promise<void>;
  archive(messageId: string): Promise<void>;
}

interface MessageArchive {
  archive(message: BaseMessage): Promise<void>;
  getArchivedMessages(criteria: ArchiveCriteria): Promise<BaseMessage[]>;
  deleteArchived(messageId: string): Promise<void>;
}

interface ArchiveCriteria {
  startDate?: string;
  endDate?: string;
  messageType?: string;
  source?: string;
  limit?: number;
  offset?: number;
}
```

## Monitoring and Metrics

### Message Metrics
```typescript
interface MessageMetrics {
  queueName: string;
  messageType: string;
  totalMessages: number;
  processedMessages: number;
  failedMessages: number;
  averageProcessingTime: number;
  errorRate: number;
  throughput: number; // messages per second
  lastProcessedAt: string;
}

interface MessageMonitor {
  getMetrics(queueName?: string): Promise<MessageMetrics[]>;
  getHealthStatus(): Promise<HealthStatus>;
  getErrorLogs(): Promise<ErrorLog[]>;
  getQueueStatus(): Promise<QueueStatus[]>;
}

interface QueueStatus {
  name: string;
  messageCount: number;
  consumerCount: number;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastActivity: string;
}
```

## Testing

### Message Testing Utilities
```typescript
interface MessageTestHelper {
  createTestMessage(type: string, payload: any): BaseMessage;
  sendTestMessage(message: BaseMessage): Promise<void>;
  assertMessageProcessed(messageType: string, payload: any): Promise<void>;
  assertMessageNotProcessed(messageType: string): Promise<void>;
  clearMessages(): Promise<void>;
}

interface MessageTestSuite {
  testMessageProcessing(): Promise<void>;
  testMessageRouting(): Promise<void>;
  testErrorHandling(): Promise<void>;
  testRetryMechanism(): Promise<void>;
  testDeadLetterQueue(): Promise<void>;
}
```

## Security

### Message Encryption
```typescript
interface MessageEncryption {
  encrypt(message: BaseMessage): Promise<EncryptedMessage>;
  decrypt(encryptedMessage: EncryptedMessage): Promise<BaseMessage>;
}

interface EncryptedMessage {
  encryptedPayload: string;
  encryptionKey: string;
  algorithm: string;
  iv: string;
  authTag: string;
}
```

### Access Control
```typescript
interface MessageAccessControl {
  canSendMessage(userId: string, messageType: string): boolean;
  canReceiveMessage(userId: string, messageType: string): boolean;
  canAccessQueue(userId: string, queueName: string): boolean;
}
```

This message queue contract specification ensures reliable asynchronous communication and event processing for the Diet Game application with proper error handling, monitoring, and security measures.
