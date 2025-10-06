# Event-Driven Architecture Specification

## Overview
The Event-Driven Architecture defines a comprehensive event system for the Diet Planner Game application, enabling loose coupling, scalability, and real-time responsiveness through event sourcing, CQRS patterns, and message queues.

## EARS Requirements

### Epic Requirements
- **EPIC-EDA-001**: The system SHALL implement an event-driven architecture for real-time data processing
- **EPIC-EDA-002**: The system SHALL provide event sourcing for audit trails and data recovery
- **EPIC-EDA-003**: The system SHALL implement CQRS for optimized read and write operations

### Feature Requirements
- **FEAT-EDA-001**: The system SHALL provide event publishing and subscription mechanisms
- **FEAT-EDA-002**: The system SHALL implement message queues for reliable event delivery
- **FEAT-EDA-003**: The system SHALL provide event store for persistence and replay
- **FEAT-EDA-004**: The system SHALL implement event handlers for business logic processing

### User Story Requirements
- **US-EDA-001**: As a developer, I want event-driven communication so that I can build loosely coupled components
- **US-EDA-002**: As a system administrator, I want event auditing so that I can track system changes
- **US-EDA-003**: As a user, I want real-time updates so that I can see changes immediately

### Acceptance Criteria
- **AC-EDA-001**: Given an event is published, when it's processed, then it SHALL be delivered to all subscribers within 100ms
- **AC-EDA-002**: Given an event store, when events are replayed, then the system SHALL restore to the correct state
- **AC-EDA-003**: Given a failed event processing, when retry is attempted, then it SHALL be processed successfully

## Event System Architecture

### 1. Event Structure
```typescript
// Base event interface
interface BaseEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: Date;
  userId?: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, any>;
  payload: any;
}

// Event types
enum EventType {
  // User events
  USER_REGISTERED = 'user.registered',
  USER_PROFILE_UPDATED = 'user.profile.updated',
  USER_DELETED = 'user.deleted',
  
  // Nutrition events
  MEAL_LOGGED = 'nutrition.meal.logged',
  NUTRITION_GOAL_SET = 'nutrition.goal.set',
  NUTRITION_GOAL_UPDATED = 'nutrition.goal.updated',
  
  // Gamification events
  ACHIEVEMENT_UNLOCKED = 'achievement.unlocked',
  CHALLENGE_STARTED = 'challenge.started',
  CHALLENGE_COMPLETED = 'challenge.completed',
  POINTS_EARNED = 'points.earned',
  
  // Social events
  POST_CREATED = 'social.post.created',
  POST_LIKED = 'social.post.liked',
  COMMENT_ADDED = 'social.comment.added',
  FRIEND_ADDED = 'social.friend.added',
  
  // System events
  SYSTEM_ERROR = 'system.error',
  CACHE_INVALIDATED = 'cache.invalidated',
  NOTIFICATION_SENT = 'notification.sent'
}

// Specific event interfaces
interface UserRegisteredEvent extends BaseEvent {
  type: EventType.USER_REGISTERED;
  payload: {
    userId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    registrationMethod: 'email' | 'google' | 'apple';
  };
}

interface MealLoggedEvent extends BaseEvent {
  type: EventType.MEAL_LOGGED;
  payload: {
    userId: string;
    mealId: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: Array<{
      foodId: string;
      name: string;
      quantity: number;
      unit: string;
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
    }>;
    totalCalories: number;
  };
}

interface AchievementUnlockedEvent extends BaseEvent {
  type: EventType.ACHIEVEMENT_UNLOCKED;
  payload: {
    userId: string;
    achievementId: string;
    achievementName: string;
    category: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    pointsAwarded: number;
    unlockedAt: Date;
  };
}
```

### 2. Event Store Implementation
```typescript
// Event store interface
interface EventStore {
  saveEvents(aggregateId: string, events: BaseEvent[], expectedVersion: number): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<BaseEvent[]>;
  getAllEvents(fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]>;
  getEventsByType(eventType: string, fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]>;
}

// Event store implementation
class InMemoryEventStore implements EventStore {
  private events: BaseEvent[] = [];
  private aggregateVersions: Map<string, number> = new Map();

  async saveEvents(aggregateId: string, events: BaseEvent[], expectedVersion: number): Promise<void> {
    const currentVersion = this.aggregateVersions.get(aggregateId) || 0;
    
    if (currentVersion !== expectedVersion) {
      throw new Error(`Concurrency conflict for aggregate ${aggregateId}. Expected version ${expectedVersion}, but current version is ${currentVersion}`);
    }

    // Validate events
    for (const event of events) {
      this.validateEvent(event);
    }

    // Save events
    this.events.push(...events);
    
    // Update aggregate version
    this.aggregateVersions.set(aggregateId, currentVersion + events.length);
    
    console.log(`Saved ${events.length} events for aggregate ${aggregateId}`);
  }

  async getEvents(aggregateId: string, fromVersion: number = 0): Promise<BaseEvent[]> {
    return this.events
      .filter(event => event.aggregateId === aggregateId && event.version > fromVersion)
      .sort((a, b) => a.version - b.version);
  }

  async getAllEvents(fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]> {
    let filteredEvents = this.events;
    
    if (fromTimestamp) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= fromTimestamp);
    }
    
    filteredEvents = filteredEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (limit) {
      filteredEvents = filteredEvents.slice(0, limit);
    }
    
    return filteredEvents;
  }

  async getEventsByType(eventType: string, fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]> {
    let filteredEvents = this.events.filter(event => event.type === eventType);
    
    if (fromTimestamp) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= fromTimestamp);
    }
    
    filteredEvents = filteredEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (limit) {
      filteredEvents = filteredEvents.slice(0, limit);
    }
    
    return filteredEvents;
  }

  private validateEvent(event: BaseEvent): void {
    if (!event.id || !event.type || !event.aggregateId || !event.payload) {
      throw new Error('Invalid event: missing required fields');
    }
    
    if (!Object.values(EventType).includes(event.type as EventType)) {
      throw new Error(`Invalid event type: ${event.type}`);
    }
  }
}

// Database event store implementation
class DatabaseEventStore implements EventStore {
  private db: any; // Database connection

  constructor(database: any) {
    this.db = database;
  }

  async saveEvents(aggregateId: string, events: BaseEvent[], expectedVersion: number): Promise<void> {
    const transaction = await this.db.beginTransaction();
    
    try {
      // Check current version
      const currentVersion = await this.getCurrentVersion(aggregateId, transaction);
      
      if (currentVersion !== expectedVersion) {
        throw new Error(`Concurrency conflict for aggregate ${aggregateId}`);
      }

      // Save events
      for (const event of events) {
        await this.saveEvent(event, transaction);
      }

      await transaction.commit();
      console.log(`Saved ${events.length} events for aggregate ${aggregateId}`);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getEvents(aggregateId: string, fromVersion: number = 0): Promise<BaseEvent[]> {
    const query = `
      SELECT * FROM events 
      WHERE aggregate_id = ? AND version > ? 
      ORDER BY version ASC
    `;
    
    const rows = await this.db.query(query, [aggregateId, fromVersion]);
    return rows.map(this.mapRowToEvent);
  }

  async getAllEvents(fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]> {
    let query = 'SELECT * FROM events';
    const params: any[] = [];
    
    if (fromTimestamp) {
      query += ' WHERE timestamp >= ?';
      params.push(fromTimestamp);
    }
    
    query += ' ORDER BY timestamp ASC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }
    
    const rows = await this.db.query(query, params);
    return rows.map(this.mapRowToEvent);
  }

  async getEventsByType(eventType: string, fromTimestamp?: Date, limit?: number): Promise<BaseEvent[]> {
    let query = 'SELECT * FROM events WHERE type = ?';
    const params: any[] = [eventType];
    
    if (fromTimestamp) {
      query += ' AND timestamp >= ?';
      params.push(fromTimestamp);
    }
    
    query += ' ORDER BY timestamp ASC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }
    
    const rows = await this.db.query(query, params);
    return rows.map(this.mapRowToEvent);
  }

  private async getCurrentVersion(aggregateId: string, transaction: any): Promise<number> {
    const query = 'SELECT MAX(version) as version FROM events WHERE aggregate_id = ?';
    const result = await transaction.query(query, [aggregateId]);
    return result[0]?.version || 0;
  }

  private async saveEvent(event: BaseEvent, transaction: any): Promise<void> {
    const query = `
      INSERT INTO events (id, type, aggregate_id, aggregate_type, version, timestamp, user_id, correlation_id, causation_id, metadata, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await transaction.query(query, [
      event.id,
      event.type,
      event.aggregateId,
      event.aggregateType,
      event.version,
      event.timestamp,
      event.userId,
      event.correlationId,
      event.causationId,
      JSON.stringify(event.metadata || {}),
      JSON.stringify(event.payload)
    ]);
  }

  private mapRowToEvent(row: any): BaseEvent {
    return {
      id: row.id,
      type: row.type,
      aggregateId: row.aggregate_id,
      aggregateType: row.aggregate_type,
      version: row.version,
      timestamp: new Date(row.timestamp),
      userId: row.user_id,
      correlationId: row.correlation_id,
      causationId: row.causation_id,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      payload: JSON.parse(row.payload)
    };
  }
}
```

## Message Queue System

### 1. Message Queue Interface
```typescript
// Message queue interface
interface MessageQueue {
  publish(topic: string, message: any): Promise<void>;
  subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void>;
  unsubscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void>;
}

// Redis-based message queue
class RedisMessageQueue implements MessageQueue {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers: Map<string, Set<(message: any) => Promise<void>>> = new Map();

  constructor(redisConfig: any) {
    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
    this.setupSubscriber();
  }

  async publish(topic: string, message: any): Promise<void> {
    const messageData = {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      topic,
      payload: message
    };

    await this.publisher.publish(topic, JSON.stringify(messageData));
    console.log(`Published message to topic ${topic}:`, messageData.id);
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
      await this.subscriber.subscribe(topic);
    }

    this.handlers.get(topic)!.add(handler);
    console.log(`Subscribed to topic ${topic}`);
  }

  async unsubscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    const topicHandlers = this.handlers.get(topic);
    if (topicHandlers) {
      topicHandlers.delete(handler);
      
      if (topicHandlers.size === 0) {
        this.handlers.delete(topic);
        await this.subscriber.unsubscribe(topic);
        console.log(`Unsubscribed from topic ${topic}`);
      }
    }
  }

  private setupSubscriber(): void {
    this.subscriber.on('message', async (topic: string, message: string) => {
      try {
        const messageData = JSON.parse(message);
        const handlers = this.handlers.get(topic);
        
        if (handlers) {
          const promises = Array.from(handlers).map(handler => 
            this.executeHandler(handler, messageData)
          );
          
          await Promise.allSettled(promises);
        }
      } catch (error) {
        console.error(`Error processing message from topic ${topic}:`, error);
      }
    });
  }

  private async executeHandler(handler: (message: any) => Promise<void>, messageData: any): Promise<void> {
    try {
      await handler(messageData);
    } catch (error) {
      console.error(`Error in message handler:`, error);
      // Implement retry logic or dead letter queue here
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// RabbitMQ-based message queue
class RabbitMQMessageQueue implements MessageQueue {
  private connection: any;
  private channel: any;
  private handlers: Map<string, Set<(message: any) => Promise<void>>> = new Map();

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect(): Promise<void> {
    const amqp = require('amqplib');
    this.connection = await amqp.connect(this.connectionString);
    this.channel = await this.connection.createChannel();
    
    this.connection.on('error', (error: any) => {
      console.error('RabbitMQ connection error:', error);
    });
  }

  async publish(topic: string, message: any): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    const messageData = {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      topic,
      payload: message
    };

    await this.channel.assertExchange(topic, 'fanout', { durable: true });
    await this.channel.publish(topic, '', Buffer.from(JSON.stringify(messageData)), {
      persistent: true,
      messageId: messageData.id
    });

    console.log(`Published message to exchange ${topic}:`, messageData.id);
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    if (!this.channel) {
      throw new Error('Not connected to RabbitMQ');
    }

    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
      
      await this.channel.assertExchange(topic, 'fanout', { durable: true });
      const queue = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.bindQueue(queue.queue, topic, '');
      
      this.channel.consume(queue.queue, async (msg: any) => {
        if (msg) {
          try {
            const messageData = JSON.parse(msg.content.toString());
            const handlers = this.handlers.get(topic);
            
            if (handlers) {
              const promises = Array.from(handlers).map(h => 
                this.executeHandler(h, messageData)
              );
              
              await Promise.allSettled(promises);
            }
            
            this.channel.ack(msg);
          } catch (error) {
            console.error(`Error processing message from topic ${topic}:`, error);
            this.channel.nack(msg, false, false);
          }
        }
      });
    }

    this.handlers.get(topic)!.add(handler);
    console.log(`Subscribed to topic ${topic}`);
  }

  async unsubscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    const topicHandlers = this.handlers.get(topic);
    if (topicHandlers) {
      topicHandlers.delete(handler);
      
      if (topicHandlers.size === 0) {
        this.handlers.delete(topic);
        console.log(`Unsubscribed from topic ${topic}`);
      }
    }
  }

  private async executeHandler(handler: (message: any) => Promise<void>, messageData: any): Promise<void> {
    try {
      await handler(messageData);
    } catch (error) {
      console.error(`Error in message handler:`, error);
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

## Event Handlers

### 1. Event Handler Interface
```typescript
// Event handler interface
interface EventHandler<T extends BaseEvent = BaseEvent> {
  handle(event: T): Promise<void>;
  canHandle(eventType: string): boolean;
}

// Base event handler
abstract class BaseEventHandler<T extends BaseEvent = BaseEvent> implements EventHandler<T> {
  abstract handle(event: T): Promise<void>;
  abstract canHandle(eventType: string): boolean;

  protected async executeWithRetry<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }
    
    throw lastError!;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 2. Specific Event Handlers
```typescript
// User event handlers
class UserRegisteredEventHandler extends BaseEventHandler<UserRegisteredEvent> {
  private userService: any;
  private notificationService: any;
  private cacheService: any;

  constructor(userService: any, notificationService: any, cacheService: any) {
    super();
    this.userService = userService;
    this.notificationService = notificationService;
    this.cacheService = cacheService;
  }

  canHandle(eventType: string): boolean {
    return eventType === EventType.USER_REGISTERED;
  }

  async handle(event: UserRegisteredEvent): Promise<void> {
    console.log(`Handling user registration: ${event.payload.userId}`);

    await this.executeWithRetry(async () => {
      // Send welcome email
      await this.notificationService.sendWelcomeEmail(
        event.payload.email,
        event.payload.firstName
      );

      // Initialize user profile
      await this.userService.initializeProfile(event.payload.userId);

      // Clear any cached data
      await this.cacheService.invalidatePattern(`user:${event.payload.userId}:*`);

      // Publish user profile initialized event
      await this.publishEvent({
        type: EventType.USER_PROFILE_INITIALIZED,
        aggregateId: event.payload.userId,
        payload: {
          userId: event.payload.userId,
          initializedAt: new Date()
        }
      });
    });
  }

  private async publishEvent(eventData: Partial<BaseEvent>): Promise<void> {
    // Implementation would publish to event bus
    console.log('Publishing event:', eventData.type);
  }
}

// Nutrition event handlers
class MealLoggedEventHandler extends BaseEventHandler<MealLoggedEvent> {
  private nutritionService: any;
  private gamificationService: any;
  private cacheService: any;

  constructor(nutritionService: any, gamificationService: any, cacheService: any) {
    super();
    this.nutritionService = nutritionService;
    this.gamificationService = gamificationService;
    this.cacheService = cacheService;
  }

  canHandle(eventType: string): boolean {
    return eventType === EventType.MEAL_LOGGED;
  }

  async handle(event: MealLoggedEvent): Promise<void> {
    console.log(`Handling meal logged: ${event.payload.mealId}`);

    await this.executeWithRetry(async () => {
      // Update daily nutrition summary
      await this.nutritionService.updateDailySummary(
        event.payload.userId,
        event.payload.date
      );

      // Check for nutrition achievements
      await this.gamificationService.checkNutritionAchievements(
        event.payload.userId,
        event.payload
      );

      // Update leaderboards
      await this.gamificationService.updateLeaderboards(
        event.payload.userId,
        'nutrition'
      );

      // Invalidate cache
      await this.cacheService.invalidatePattern(
        `nutrition:${event.payload.userId}:${event.payload.date}:*`
      );
    });
  }
}

// Gamification event handlers
class AchievementUnlockedEventHandler extends BaseEventHandler<AchievementUnlockedEvent> {
  private notificationService: any;
  private socialService: any;
  private cacheService: any;

  constructor(notificationService: any, socialService: any, cacheService: any) {
    super();
    this.notificationService = notificationService;
    this.socialService = socialService;
    this.cacheService = cacheService;
  }

  canHandle(eventType: string): boolean {
    return eventType === EventType.ACHIEVEMENT_UNLOCKED;
  }

  async handle(event: AchievementUnlockedEvent): Promise<void> {
    console.log(`Handling achievement unlocked: ${event.payload.achievementId}`);

    await this.executeWithRetry(async () => {
      // Send achievement notification
      await this.notificationService.sendAchievementNotification(
        event.payload.userId,
        event.payload.achievementName,
        event.payload.rarity
      );

      // Create social post for rare achievements
      if (['rare', 'epic', 'legendary'].includes(event.payload.rarity)) {
        await this.socialService.createAchievementPost(
          event.payload.userId,
          event.payload.achievementName,
          event.payload.rarity
        );
      }

      // Update user's achievement cache
      await this.cacheService.invalidatePattern(
        `achievements:${event.payload.userId}:*`
      );
    });
  }
}
```

## CQRS Implementation

### 1. Command and Query Separation
```typescript
// Command interface
interface Command {
  id: string;
  type: string;
  aggregateId: string;
  payload: any;
  userId?: string;
  timestamp: Date;
}

// Query interface
interface Query {
  id: string;
  type: string;
  parameters: any;
  userId?: string;
  timestamp: Date;
}

// Command handler interface
interface CommandHandler<T extends Command = Command> {
  handle(command: T): Promise<void>;
  canHandle(commandType: string): boolean;
}

// Query handler interface
interface QueryHandler<T extends Query = Query, R = any> {
  handle(query: T): Promise<R>;
  canHandle(queryType: string): boolean;
}

// Command bus
class CommandBus {
  private handlers: Map<string, CommandHandler> = new Map();

  registerHandler(commandType: string, handler: CommandHandler): void {
    this.handlers.set(commandType, handler);
  }

  async execute(command: Command): Promise<void> {
    const handler = this.handlers.get(command.type);
    
    if (!handler) {
      throw new Error(`No handler found for command type: ${command.type}`);
    }

    if (!handler.canHandle(command.type)) {
      throw new Error(`Handler cannot handle command type: ${command.type}`);
    }

    await handler.handle(command);
  }
}

// Query bus
class QueryBus {
  private handlers: Map<string, QueryHandler> = new Map();

  registerHandler(queryType: string, handler: QueryHandler): void {
    this.handlers.set(queryType, handler);
  }

  async execute<T>(query: Query): Promise<T> {
    const handler = this.handlers.get(query.type);
    
    if (!handler) {
      throw new Error(`No handler found for query type: ${query.type}`);
    }

    if (!handler.canHandle(query.type)) {
      throw new Error(`Handler cannot handle query type: ${query.type}`);
    }

    return await handler.handle(query);
  }
}
```

### 2. Read and Write Models
```typescript
// Write model (Aggregate)
class UserAggregate {
  private id: string;
  private version: number;
  private uncommittedEvents: BaseEvent[] = [];
  private state: UserState;

  constructor(id: string, events: BaseEvent[] = []) {
    this.id = id;
    this.version = 0;
    this.state = new UserState();
    this.loadFromEvents(events);
  }

  static create(userData: any): UserAggregate {
    const aggregate = new UserAggregate(userData.id);
    aggregate.applyEvent({
      id: generateId(),
      type: EventType.USER_REGISTERED,
      aggregateId: userData.id,
      aggregateType: 'User',
      version: 1,
      timestamp: new Date(),
      payload: userData
    });
    return aggregate;
  }

  updateProfile(profileData: any): void {
    this.applyEvent({
      id: generateId(),
      type: EventType.USER_PROFILE_UPDATED,
      aggregateId: this.id,
      aggregateType: 'User',
      version: this.version + 1,
      timestamp: new Date(),
      payload: profileData
    });
  }

  private applyEvent(event: BaseEvent): void {
    this.state.apply(event);
    this.version = event.version;
    this.uncommittedEvents.push(event);
  }

  private loadFromEvents(events: BaseEvent[]): void {
    for (const event of events) {
      this.state.apply(event);
      this.version = event.version;
    }
  }

  getUncommittedEvents(): BaseEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  getVersion(): number {
    return this.version;
  }
}

// Read model (Projection)
class UserReadModel {
  private users: Map<string, any> = new Map();

  handleUserRegistered(event: UserRegisteredEvent): void {
    this.users.set(event.payload.userId, {
      id: event.payload.userId,
      email: event.payload.email,
      username: event.payload.username,
      firstName: event.payload.firstName,
      lastName: event.payload.lastName,
      registrationDate: event.timestamp,
      lastUpdated: event.timestamp
    });
  }

  handleUserProfileUpdated(event: UserProfileUpdatedEvent): void {
    const user = this.users.get(event.payload.userId);
    if (user) {
      Object.assign(user, event.payload);
      user.lastUpdated = event.timestamp;
    }
  }

  getUser(userId: string): any {
    return this.users.get(userId);
  }

  getAllUsers(): any[] {
    return Array.from(this.users.values());
  }
}
```

## Event Sourcing

### 1. Aggregate Repository
```typescript
// Aggregate repository
class AggregateRepository<T> {
  private eventStore: EventStore;
  private aggregateFactory: (id: string, events: BaseEvent[]) => T;

  constructor(eventStore: EventStore, aggregateFactory: (id: string, events: BaseEvent[]) => T) {
    this.eventStore = eventStore;
    this.aggregateFactory = aggregateFactory;
  }

  async getById(aggregateId: string): Promise<T> {
    const events = await this.eventStore.getEvents(aggregateId);
    return this.aggregateFactory(aggregateId, events);
  }

  async save(aggregate: any): Promise<void> {
    const uncommittedEvents = aggregate.getUncommittedEvents();
    const expectedVersion = aggregate.getVersion() - uncommittedEvents.length;
    
    if (uncommittedEvents.length > 0) {
      await this.eventStore.saveEvents(
        aggregate.id,
        uncommittedEvents,
        expectedVersion
      );
      
      aggregate.markEventsAsCommitted();
    }
  }
}
```

### 2. Event Replay
```typescript
// Event replay service
class EventReplayService {
  private eventStore: EventStore;
  private readModels: Map<string, any> = new Map();

  constructor(eventStore: EventStore) {
    this.eventStore = eventStore;
  }

  registerReadModel(name: string, readModel: any): void {
    this.readModels.set(name, readModel);
  }

  async replayEvents(fromTimestamp?: Date, toTimestamp?: Date): Promise<void> {
    console.log('Starting event replay...');
    
    const events = await this.eventStore.getAllEvents(fromTimestamp);
    const filteredEvents = toTimestamp 
      ? events.filter(e => e.timestamp <= toTimestamp)
      : events;

    for (const readModel of this.readModels.values()) {
      await this.replayEventsForReadModel(readModel, filteredEvents);
    }
    
    console.log(`Event replay completed. Processed ${filteredEvents.length} events.`);
  }

  private async replayEventsForReadModel(readModel: any, events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      try {
        const handlerName = this.getHandlerName(event.type);
        const handler = readModel[handlerName];
        
        if (handler && typeof handler === 'function') {
          await handler.call(readModel, event);
        }
      } catch (error) {
        console.error(`Error replaying event ${event.id}:`, error);
      }
    }
  }

  private getHandlerName(eventType: string): string {
    return 'handle' + eventType.split('.').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
  }
}
```

## Future Enhancements

### 1. Advanced Event Features
- **Event Versioning**: Support for event schema evolution
- **Event Compression**: Compress large event payloads
- **Event Encryption**: Encrypt sensitive event data
- **Event Archiving**: Archive old events to cold storage

### 2. Performance Optimizations
- **Event Batching**: Batch multiple events for better performance
- **Event Streaming**: Stream events in real-time
- **Event Partitioning**: Partition events by aggregate or time
- **Event Caching**: Cache frequently accessed events