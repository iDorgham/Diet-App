# WebSocket Contracts

## Overview
This document defines the WebSocket message contracts for real-time communication in the Diet Game application, including connection management, message types, and event streaming.

## Connection Management

### Connection Establishment
```typescript
interface WebSocketConnection {
  url: string;
  protocols?: string[];
  headers?: Record<string, string>;
  heartbeat: {
    interval: number; // milliseconds
    timeout: number; // milliseconds
  };
  reconnect: {
    maxAttempts: number;
    backoffMultiplier: number;
    maxBackoff: number; // milliseconds
  };
}

interface ConnectionEvent {
  type: 'connected' | 'disconnected' | 'error' | 'reconnecting';
  timestamp: string;
  data?: any;
}
```

### Authentication
```typescript
interface AuthMessage {
  type: 'auth';
  token: string;
  userId: string;
  sessionId: string;
}

interface AuthResponse {
  type: 'auth_response';
  success: boolean;
  userId?: string;
  error?: {
    code: string;
    message: string;
  };
}
```

## Message Format

### Base Message Structure
```typescript
interface WebSocketMessage {
  id: string;
  type: string;
  timestamp: string;
  data: any;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    correlationId?: string;
  };
}

interface WebSocketResponse {
  id: string;
  type: string;
  timestamp: string;
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Real-time Events

### User Activity Events
```typescript
interface UserActivityEvent {
  type: 'user.activity';
  data: {
    userId: string;
    activity: 'online' | 'offline' | 'idle' | 'active';
    timestamp: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

interface UserPresenceEvent {
  type: 'user.presence';
  data: {
    userId: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen: string;
    currentActivity?: string;
  };
}
```

### Task Events
```typescript
interface TaskStartedEvent {
  type: 'task.started';
  data: {
    taskId: string;
    userId: string;
    taskName: string;
    startedAt: string;
    estimatedDuration: number;
  };
}

interface TaskCompletedEvent {
  type: 'task.completed';
  data: {
    taskId: string;
    userId: string;
    taskName: string;
    completedAt: string;
    duration: number;
    xpEarned: number;
    coinsEarned: number;
  };
}

interface TaskProgressEvent {
  type: 'task.progress';
  data: {
    taskId: string;
    userId: string;
    progress: number; // 0-100
    currentStep: string;
    estimatedTimeRemaining: number;
  };
}
```

### Nutrition Events
```typescript
interface MealLoggedEvent {
  type: 'meal.logged';
  data: {
    mealId: string;
    userId: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    mealName: string;
    calories: number;
    loggedAt: string;
  };
}

interface NutritionGoalUpdateEvent {
  type: 'nutrition.goal.update';
  data: {
    userId: string;
    goalType: 'calories' | 'protein' | 'carbs' | 'fat';
    current: number;
    target: number;
    progress: number; // 0-100
    updatedAt: string;
  };
}

interface WaterIntakeEvent {
  type: 'water.intake';
  data: {
    userId: string;
    amount: number; // in ml
    totalToday: number;
    goal: number;
    loggedAt: string;
  };
}
```

### Gamification Events
```typescript
interface AchievementUnlockedEvent {
  type: 'achievement.unlocked';
  data: {
    achievementId: string;
    userId: string;
    achievementName: string;
    description: string;
    xpReward: number;
    coinReward: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    unlockedAt: string;
  };
}

interface LevelUpEvent {
  type: 'level.up';
  data: {
    userId: string;
    previousLevel: number;
    newLevel: number;
    xpEarned: number;
    totalXP: number;
    xpToNext: number;
    rewards: {
      coins: number;
      achievements: string[];
      items: string[];
    };
    leveledUpAt: string;
  };
}

interface StreakUpdateEvent {
  type: 'streak.update';
  data: {
    userId: string;
    streakType: 'daily' | 'weekly' | 'monthly';
    currentStreak: number;
    previousStreak: number;
    isBroken: boolean;
    updatedAt: string;
  };
}
```

### Social Events
```typescript
interface FriendRequestEvent {
  type: 'friend.request';
  data: {
    requestId: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    message?: string;
    sentAt: string;
  };
}

interface FriendAcceptedEvent {
  type: 'friend.accepted';
  data: {
    friendshipId: string;
    userId: string;
    friendId: string;
    friendName: string;
    acceptedAt: string;
  };
}

interface PostCreatedEvent {
  type: 'post.created';
  data: {
    postId: string;
    authorId: string;
    authorName: string;
    content: string;
    type: 'achievement' | 'progress' | 'tip' | 'question';
    createdAt: string;
  };
}

interface PostLikedEvent {
  type: 'post.liked';
  data: {
    postId: string;
    userId: string;
    userName: string;
    likedAt: string;
  };
}
```

### AI Coach Events
```typescript
interface AICoachMessageEvent {
  type: 'ai.coach.message';
  data: {
    messageId: string;
    conversationId: string;
    userId: string;
    message: string;
    isFromAI: boolean;
    timestamp: string;
    suggestions?: string[];
  };
}

interface AIInsightEvent {
  type: 'ai.insight';
  data: {
    insightId: string;
    userId: string;
    type: 'nutrition' | 'progress' | 'habit' | 'goal';
    title: string;
    description: string;
    confidence: number; // 0-1
    actionable: boolean;
    createdAt: string;
  };
}
```

## Chat and Messaging

### Direct Messages
```typescript
interface DirectMessage {
  type: 'direct.message';
  data: {
    messageId: string;
    fromUserId: string;
    toUserId: string;
    content: string;
    timestamp: string;
    isRead: boolean;
    attachments?: MessageAttachment[];
  };
}

interface MessageReadEvent {
  type: 'message.read';
  data: {
    messageId: string;
    userId: string;
    readAt: string;
  };
}

interface TypingIndicatorEvent {
  type: 'typing.indicator';
  data: {
    userId: string;
    isTyping: boolean;
    conversationId: string;
  };
}
```

### Group Chat
```typescript
interface GroupMessage {
  type: 'group.message';
  data: {
    messageId: string;
    groupId: string;
    fromUserId: string;
    content: string;
    timestamp: string;
    mentions?: string[]; // user IDs
  };
}

interface GroupMemberJoinedEvent {
  type: 'group.member.joined';
  data: {
    groupId: string;
    userId: string;
    userName: string;
    joinedAt: string;
  };
}

interface GroupMemberLeftEvent {
  type: 'group.member.left';
  data: {
    groupId: string;
    userId: string;
    userName: string;
    leftAt: string;
  };
}
```

## System Events

### Notification Events
```typescript
interface NotificationEvent {
  type: 'notification';
  data: {
    notificationId: string;
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    category: 'task' | 'achievement' | 'social' | 'system';
    actionUrl?: string;
    createdAt: string;
  };
}

interface NotificationReadEvent {
  type: 'notification.read';
  data: {
    notificationId: string;
    userId: string;
    readAt: string;
  };
}
```

### System Status Events
```typescript
interface SystemStatusEvent {
  type: 'system.status';
  data: {
    status: 'healthy' | 'degraded' | 'down';
    services: {
      api: 'up' | 'down';
      database: 'up' | 'down';
      ai: 'up' | 'down';
      notifications: 'up' | 'down';
    };
    message?: string;
    timestamp: string;
  };
}

interface MaintenanceEvent {
  type: 'maintenance';
  data: {
    startTime: string;
    endTime: string;
    description: string;
    affectedServices: string[];
    isScheduled: boolean;
  };
}
```

## Error Handling

### Error Messages
```typescript
interface WebSocketError {
  type: 'error';
  data: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}

enum WebSocketErrorCode {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INVALID_MESSAGE_FORMAT = 'INVALID_MESSAGE_FORMAT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
}
```

### Connection Recovery
```typescript
interface ConnectionRecovery {
  maxReconnectAttempts: number;
  reconnectInterval: number;
  backoffMultiplier: number;
  maxBackoffInterval: number;
  heartbeatInterval: number;
  heartbeatTimeout: number;
}

interface ReconnectEvent {
  type: 'reconnect';
  data: {
    attempt: number;
    maxAttempts: number;
    nextAttemptIn: number; // milliseconds
  };
}
```

## Message Validation

### Schema Validation
```typescript
interface MessageValidator {
  validate(message: WebSocketMessage): ValidationResult;
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

### Rate Limiting
```typescript
interface RateLimitConfig {
  messagesPerMinute: number;
  burstLimit: number;
  windowSize: number; // milliseconds
}

interface RateLimitExceededEvent {
  type: 'rate_limit_exceeded';
  data: {
    limit: number;
    window: number;
    resetTime: string;
  };
}
```

## Client Implementation

### WebSocket Client Interface
```typescript
interface WebSocketClient {
  connect(config: WebSocketConnection): Promise<void>;
  disconnect(): Promise<void>;
  send(message: WebSocketMessage): Promise<void>;
  subscribe(eventType: string, handler: EventHandler): void;
  unsubscribe(eventType: string, handler: EventHandler): void;
  isConnected(): boolean;
  getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'error';
}

interface EventHandler {
  (event: WebSocketMessage): void;
}
```

### Message Queue
```typescript
interface MessageQueue {
  enqueue(message: WebSocketMessage): void;
  dequeue(): WebSocketMessage | null;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
}
```

## Testing

### WebSocket Testing Utilities
```typescript
interface WebSocketTestHelper {
  createMockConnection(): MockWebSocketConnection;
  simulateMessage(message: WebSocketMessage): void;
  simulateConnectionEvent(event: ConnectionEvent): void;
  assertMessageSent(messageType: string, data: any): void;
  assertMessageReceived(messageType: string, data: any): void;
}

interface MockWebSocketConnection {
  send(message: WebSocketMessage): void;
  close(): void;
  simulateMessage(message: WebSocketMessage): void;
  simulateError(error: Error): void;
}
```

## Security

### Message Encryption
```typescript
interface EncryptionConfig {
  algorithm: 'AES-256-GCM';
  keyRotationInterval: number; // milliseconds
  compressionEnabled: boolean;
}

interface EncryptedMessage {
  encryptedData: string;
  iv: string;
  authTag: string;
  timestamp: string;
}
```

### Access Control
```typescript
interface AccessControl {
  canSendMessage(userId: string, messageType: string): boolean;
  canReceiveMessage(userId: string, messageType: string): boolean;
  canJoinRoom(userId: string, roomId: string): boolean;
}
```

## Monitoring

### Connection Metrics
```typescript
interface ConnectionMetrics {
  activeConnections: number;
  totalConnections: number;
  messagesPerSecond: number;
  averageLatency: number;
  errorRate: number;
  uptime: number;
}

interface WebSocketMonitor {
  getMetrics(): Promise<ConnectionMetrics>;
  getConnectionStats(): Promise<ConnectionStats[]>;
  getErrorLogs(): Promise<ErrorLog[]>;
}
```

This WebSocket contract specification ensures reliable real-time communication for the Diet Game application with proper error handling, security, and monitoring capabilities.
