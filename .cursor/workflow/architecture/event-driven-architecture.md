# Event-Driven Architecture

## Overview
This document describes the event-driven architecture for the Diet Planner Game application, covering event sourcing, CQRS, message queues, pub/sub patterns, and event streaming.

## Event System Design

### Event Types
```typescript
interface BaseEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, any>;
}

interface DomainEvent extends BaseEvent {
  payload: any;
  schema: string;
  version: string;
}

interface IntegrationEvent extends BaseEvent {
  source: string;
  destination?: string;
  routingKey: string;
  exchange: string;
  payload: any;
  retryCount: number;
  maxRetries: number;
  deadLetterQueue?: string;
}
```

### Event Categories
```typescript
const EVENT_CATEGORIES = {
  USER_EVENTS: {
    USER_REGISTERED: 'user.registered',
    USER_PROFILE_UPDATED: 'user.profile.updated',
    USER_LEVEL_UP: 'user.level.up',
    USER_ACHIEVEMENT_UNLOCKED: 'user.achievement.unlocked',
    USER_STREAK_MILESTONE: 'user.streak.milestone'
  },
  
  NUTRITION_EVENTS: {
    MEAL_LOGGED: 'nutrition.meal.logged',
    MEAL_UPDATED: 'nutrition.meal.updated',
    MEAL_DELETED: 'nutrition.meal.deleted',
    NUTRITION_GOAL_MET: 'nutrition.goal.met',
    NUTRITION_GOAL_UPDATED: 'nutrition.goal.updated',
    WATER_INTAKE_LOGGED: 'nutrition.water.logged'
  },
  
  QUEST_EVENTS: {
    QUEST_STARTED: 'quest.started',
    QUEST_COMPLETED: 'quest.completed',
    QUEST_FAILED: 'quest.failed',
    QUEST_UPDATED: 'quest.updated',
    QUEST_REWARD_CLAIMED: 'quest.reward.claimed'
  },
  
  AI_EVENTS: {
    AI_QUERY_RECEIVED: 'ai.query.received',
    AI_RESPONSE_GENERATED: 'ai.response.generated',
    AI_INSIGHT_CREATED: 'ai.insight.created',
    AI_RECOMMENDATION_GIVEN: 'ai.recommendation.given',
    AI_FEEDBACK_RECEIVED: 'ai.feedback.received'
  },
  
  SOCIAL_EVENTS: {
    FRIEND_REQUEST_SENT: 'social.friend.request.sent',
    FRIEND_REQUEST_ACCEPTED: 'social.friend.request.accepted',
    FRIEND_REQUEST_DECLINED: 'social.friend.request.declined',
    POST_CREATED: 'social.post.created',
    POST_LIKED: 'social.post.liked',
    POST_COMMENTED: 'social.post.commented'
  },
  
  SYSTEM_EVENTS: {
    CACHE_INVALIDATED: 'system.cache.invalidated',
    CACHE_PRELOADED: 'system.cache.preloaded',
    DATABASE_BACKUP_COMPLETED: 'system.database.backup.completed',
    SYSTEM_MAINTENANCE_STARTED: 'system.maintenance.started',
    SYSTEM_MAINTENANCE_COMPLETED: 'system.maintenance.completed'
  }
};
```

## Event Sourcing

### Event Store
```typescript
interface EventStore {
  appendEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void>;
  
  getEvents(
    aggregateId: string,
    fromVersion?: number,
    toVersion?: number
  ): Promise<DomainEvent[]>;
  
  getEventsByType(
    eventType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<DomainEvent[]>;
  
  getEventsByUser(
    userId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<DomainEvent[]>;
  
  getSnapshot(
    aggregateId: string,
    version?: number
  ): Promise<AggregateSnapshot | null>;
  
  saveSnapshot(
    aggregateId: string,
    snapshot: AggregateSnapshot
  ): Promise<void>;
}

interface AggregateSnapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: any;
  timestamp: Date;
}

export class EventStoreService implements EventStore {
  private db: Database;
  private eventBus: EventBus;
  
  constructor(db: Database, eventBus: EventBus) {
    this.db = db;
    this.eventBus = eventBus;
  }
  
  async appendEvents(
    aggregateId: string,
    events: DomainEvent[],
    expectedVersion: number
  ): Promise<void> {
    const transaction = await this.db.beginTransaction();
    
    try {
      // Check current version
      const currentVersion = await this.getCurrentVersion(aggregateId, transaction);
      
      if (currentVersion !== expectedVersion) {
        throw new ConcurrencyError(
          `Expected version ${expectedVersion}, but current version is ${currentVersion}`
        );
      }
      
      // Append events
      for (const event of events) {
        await this.appendEvent(event, transaction);
      }
      
      // Update aggregate version
      await this.updateAggregateVersion(aggregateId, expectedVersion + events.length, transaction);
      
      await transaction.commit();
      
      // Publish events to event bus
      for (const event of events) {
        await this.eventBus.publish(event);
      }
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async getEvents(
    aggregateId: string,
    fromVersion?: number,
    toVersion?: number
  ): Promise<DomainEvent[]> {
    const query = `
      SELECT * FROM events 
      WHERE aggregate_id = ? 
      ${fromVersion ? 'AND version >= ?' : ''}
      ${toVersion ? 'AND version <= ?' : ''}
      ORDER BY version ASC
    `;
    
    const params = [aggregateId];
    if (fromVersion) params.push(fromVersion);
    if (toVersion) params.push(toVersion);
    
    const rows = await this.db.query(query, params);
    return rows.map(this.mapRowToEvent);
  }
  
  async getEventsByType(
    eventType: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<DomainEvent[]> {
    const query = `
      SELECT * FROM events 
      WHERE type = ? 
      ${fromDate ? 'AND timestamp >= ?' : ''}
      ${toDate ? 'AND timestamp <= ?' : ''}
      ORDER BY timestamp ASC
    `;
    
    const params = [eventType];
    if (fromDate) params.push(fromDate);
    if (toDate) params.push(toDate);
    
    const rows = await this.db.query(query, params);
    return rows.map(this.mapRowToEvent);
  }
  
  async getEventsByUser(
    userId: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<DomainEvent[]> {
    const query = `
      SELECT * FROM events 
      WHERE user_id = ? 
      ${fromDate ? 'AND timestamp >= ?' : ''}
      ${toDate ? 'AND timestamp <= ?' : ''}
      ORDER BY timestamp ASC
    `;
    
    const params = [userId];
    if (fromDate) params.push(fromDate);
    if (toDate) params.push(toDate);
    
    const rows = await this.db.query(query, params);
    return rows.map(this.mapRowToEvent);
  }
  
  async getSnapshot(
    aggregateId: string,
    version?: number
  ): Promise<AggregateSnapshot | null> {
    const query = `
      SELECT * FROM snapshots 
      WHERE aggregate_id = ? 
      ${version ? 'AND version <= ?' : ''}
      ORDER BY version DESC 
      LIMIT 1
    `;
    
    const params = [aggregateId];
    if (version) params.push(version);
    
    const row = await this.db.queryOne(query, params);
    return row ? this.mapRowToSnapshot(row) : null;
  }
  
  async saveSnapshot(
    aggregateId: string,
    snapshot: AggregateSnapshot
  ): Promise<void> {
    const query = `
      INSERT INTO snapshots (aggregate_id, aggregate_type, version, data, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await this.db.query(query, [
      snapshot.aggregateId,
      snapshot.aggregateType,
      snapshot.version,
      JSON.stringify(snapshot.data),
      snapshot.timestamp
    ]);
  }
  
  private async appendEvent(event: DomainEvent, transaction: Transaction): Promise<void> {
    const query = `
      INSERT INTO events (
        id, type, aggregate_id, aggregate_type, version, timestamp,
        user_id, session_id, correlation_id, causation_id, payload, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await transaction.query(query, [
      event.id,
      event.type,
      event.aggregateId,
      event.aggregateType,
      event.version,
      event.timestamp,
      event.userId,
      event.sessionId,
      event.correlationId,
      event.causationId,
      JSON.stringify(event.payload),
      JSON.stringify(event.metadata)
    ]);
  }
  
  private async getCurrentVersion(aggregateId: string, transaction: Transaction): Promise<number> {
    const query = 'SELECT version FROM aggregates WHERE id = ?';
    const row = await transaction.queryOne(query, [aggregateId]);
    return row ? row.version : 0;
  }
  
  private async updateAggregateVersion(
    aggregateId: string, 
    version: number, 
    transaction: Transaction
  ): Promise<void> {
    const query = `
      INSERT INTO aggregates (id, version, updated_at) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE version = ?, updated_at = ?
    `;
    
    const now = new Date();
    await transaction.query(query, [aggregateId, version, now, version, now]);
  }
  
  private mapRowToEvent(row: any): DomainEvent {
    return {
      id: row.id,
      type: row.type,
      aggregateId: row.aggregate_id,
      aggregateType: row.aggregate_type,
      version: row.version,
      timestamp: row.timestamp,
      userId: row.user_id,
      sessionId: row.session_id,
      correlationId: row.correlation_id,
      causationId: row.causation_id,
      payload: JSON.parse(row.payload),
      metadata: JSON.parse(row.metadata || '{}')
    };
  }
  
  private mapRowToSnapshot(row: any): AggregateSnapshot {
    return {
      aggregateId: row.aggregate_id,
      aggregateType: row.aggregate_type,
      version: row.version,
      data: JSON.parse(row.data),
      timestamp: row.timestamp
    };
  }
}
```

## CQRS Implementation

### Command Side
```typescript
interface Command {
  id: string;
  type: string;
  aggregateId: string;
  payload: any;
  userId?: string;
  timestamp: Date;
  correlationId?: string;
  causationId?: string;
}

interface CommandHandler<T extends Command> {
  handle(command: T): Promise<void>;
}

export class CommandBus {
  private handlers: Map<string, CommandHandler<any>>;
  private eventStore: EventStore;
  
  constructor(eventStore: EventStore) {
    this.handlers = new Map();
    this.eventStore = eventStore;
  }
  
  registerHandler<T extends Command>(
    commandType: string,
    handler: CommandHandler<T>
  ): void {
    this.handlers.set(commandType, handler);
  }
  
  async execute<T extends Command>(command: T): Promise<void> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command type: ${command.type}`);
    }
    
    try {
      await handler.handle(command);
    } catch (error) {
      console.error(`Command execution failed: ${command.type}`, error);
      throw error;
    }
  }
}

// Example Command Handlers
export class LogMealCommandHandler implements CommandHandler<LogMealCommand> {
  constructor(
    private eventStore: EventStore,
    private aggregateRepository: AggregateRepository
  ) {}
  
  async handle(command: LogMealCommand): Promise<void> {
    const aggregate = await this.aggregateRepository.getById(
      command.aggregateId,
      UserAggregate
    );
    
    const events = aggregate.logMeal(command.payload);
    
    await this.eventStore.appendEvents(
      command.aggregateId,
      events,
      aggregate.version
    );
  }
}

export class CompleteQuestCommandHandler implements CommandHandler<CompleteQuestCommand> {
  constructor(
    private eventStore: EventStore,
    private aggregateRepository: AggregateRepository
  ) {}
  
  async handle(command: CompleteQuestCommand): Promise<void> {
    const aggregate = await this.aggregateRepository.getById(
      command.aggregateId,
      UserAggregate
    );
    
    const events = aggregate.completeQuest(command.payload);
    
    await this.eventStore.appendEvents(
      command.aggregateId,
      events,
      aggregate.version
    );
  }
}
```

### Query Side
```typescript
interface Query {
  id: string;
  type: string;
  payload: any;
  userId?: string;
  timestamp: Date;
}

interface QueryHandler<T extends Query, R> {
  handle(query: T): Promise<R>;
}

export class QueryBus {
  private handlers: Map<string, QueryHandler<any, any>>;
  
  constructor() {
    this.handlers = new Map();
  }
  
  registerHandler<T extends Query, R>(
    queryType: string,
    handler: QueryHandler<T, R>
  ): void {
    this.handlers.set(queryType, handler);
  }
  
  async execute<T extends Query, R>(query: T): Promise<R> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for query type: ${query.type}`);
    }
    
    try {
      return await handler.handle(query);
    } catch (error) {
      console.error(`Query execution failed: ${query.type}`, error);
      throw error;
    }
  }
}

// Example Query Handlers
export class GetUserProgressQueryHandler implements QueryHandler<GetUserProgressQuery, UserProgress> {
  constructor(private readModelRepository: ReadModelRepository) {}
  
  async handle(query: GetUserProgressQuery): Promise<UserProgress> {
    return await this.readModelRepository.getUserProgress(query.payload.userId);
  }
}

export class GetNutritionAnalyticsQueryHandler implements QueryHandler<GetNutritionAnalyticsQuery, NutritionAnalytics> {
  constructor(private readModelRepository: ReadModelRepository) {}
  
  async handle(query: GetNutritionAnalyticsQuery): Promise<NutritionAnalytics> {
    return await this.readModelRepository.getNutritionAnalytics(
      query.payload.userId,
      query.payload.dateRange
    );
  }
}
```

## Message Queue System

### Queue Configuration
```typescript
interface QueueConfig {
  name: string;
  type: 'direct' | 'topic' | 'fanout' | 'headers';
  durable: boolean;
  autoDelete: boolean;
  exclusive: boolean;
  arguments?: Record<string, any>;
  routingKey?: string;
  exchange?: string;
  deadLetterQueue?: string;
  retryPolicy?: RetryPolicy;
}

interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  maxRetryDelay: number;
}

export class MessageQueueService {
  private connection: Connection;
  private channels: Map<string, Channel>;
  private queues: Map<string, QueueConfig>;
  
  constructor(connection: Connection) {
    this.connection = connection;
    this.channels = new Map();
    this.queues = new Map();
  }
  
  async createQueue(config: QueueConfig): Promise<void> {
    const channel = await this.getChannel(config.name);
    
    await channel.assertQueue(config.name, {
      durable: config.durable,
      autoDelete: config.autoDelete,
      exclusive: config.exclusive,
      arguments: config.arguments
    });
    
    if (config.exchange) {
      await channel.assertExchange(config.exchange, config.type, {
        durable: true
      });
      
      await channel.bindQueue(config.name, config.exchange, config.routingKey || '');
    }
    
    this.queues.set(config.name, config);
  }
  
  async publishMessage(
    queueName: string,
    message: any,
    options?: PublishOptions
  ): Promise<void> {
    const channel = await this.getChannel(queueName);
    const config = this.queues.get(queueName);
    
    if (!config) {
      throw new Error(`Queue ${queueName} not found`);
    }
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    
    await channel.publish(
      config.exchange || '',
      config.routingKey || queueName,
      messageBuffer,
      {
        persistent: config.durable,
        messageId: options?.messageId,
        correlationId: options?.correlationId,
        replyTo: options?.replyTo,
        timestamp: Date.now(),
        ...options
      }
    );
  }
  
  async consumeMessages(
    queueName: string,
    handler: (message: any) => Promise<void>,
    options?: ConsumeOptions
  ): Promise<void> {
    const channel = await this.getChannel(queueName);
    const config = this.queues.get(queueName);
    
    if (!config) {
      throw new Error(`Queue ${queueName} not found`);
    }
    
    await channel.consume(queueName, async (msg) => {
      if (!msg) return;
      
      try {
        const message = JSON.parse(msg.content.toString());
        await handler(message);
        
        channel.ack(msg);
      } catch (error) {
        console.error(`Message processing failed: ${queueName}`, error);
        
        if (config.retryPolicy) {
          await this.handleRetry(msg, config.retryPolicy);
        } else {
          channel.nack(msg, false, false);
        }
      }
    }, {
      noAck: false,
      ...options
    });
  }
  
  private async handleRetry(
    msg: Message,
    retryPolicy: RetryPolicy
  ): Promise<void> {
    const retryCount = this.getRetryCount(msg);
    
    if (retryCount >= retryPolicy.maxRetries) {
      // Send to dead letter queue
      await this.sendToDeadLetterQueue(msg);
      return;
    }
    
    // Calculate retry delay
    const delay = Math.min(
      retryPolicy.retryDelay * Math.pow(retryPolicy.backoffMultiplier, retryCount),
      retryPolicy.maxRetryDelay
    );
    
    // Schedule retry
    setTimeout(async () => {
      const channel = await this.getChannel('retry');
      await channel.publish('', msg.fields.routingKey, msg.content, {
        headers: {
          ...msg.properties.headers,
          'x-retry-count': retryCount + 1
        }
      });
    }, delay);
  }
  
  private getRetryCount(msg: Message): number {
    return msg.properties.headers?.['x-retry-count'] || 0;
  }
  
  private async sendToDeadLetterQueue(msg: Message): Promise<void> {
    const channel = await this.getChannel('dlq');
    await channel.publish('', 'dead-letter-queue', msg.content, {
      headers: {
        ...msg.properties.headers,
        'x-original-queue': msg.fields.routingKey,
        'x-failed-at': new Date().toISOString()
      }
    });
  }
  
  private async getChannel(queueName: string): Promise<Channel> {
    if (!this.channels.has(queueName)) {
      const channel = await this.connection.createChannel();
      this.channels.set(queueName, channel);
    }
    
    return this.channels.get(queueName)!;
  }
}
```

## Event Bus

### Event Bus Implementation
```typescript
export class EventBus {
  private subscribers: Map<string, EventHandler<any>[]>;
  private messageQueue: MessageQueueService;
  private eventStore: EventStore;
  
  constructor(
    messageQueue: MessageQueueService,
    eventStore: EventStore
  ) {
    this.subscribers = new Map();
    this.messageQueue = messageQueue;
    this.eventStore = eventStore;
  }
  
  async publish(event: DomainEvent): Promise<void> {
    // Store event in event store
    await this.eventStore.appendEvents(
      event.aggregateId,
      [event],
      event.version - 1
    );
    
    // Publish to message queue
    await this.messageQueue.publishMessage(
      'domain-events',
      event,
      {
        messageId: event.id,
        correlationId: event.correlationId,
        timestamp: event.timestamp.getTime()
      }
    );
    
    // Notify local subscribers
    await this.notifyLocalSubscribers(event);
  }
  
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    
    this.subscribers.get(eventType)!.push(handler);
  }
  
  async subscribeToQueue(
    queueName: string,
    eventType: string,
    handler: EventHandler<DomainEvent>
  ): Promise<void> {
    await this.messageQueue.consumeMessages(
      queueName,
      async (message) => {
        if (message.type === eventType) {
          await handler.handle(message);
        }
      }
    );
  }
  
  private async notifyLocalSubscribers(event: DomainEvent): Promise<void> {
    const handlers = this.subscribers.get(event.type) || [];
    
    await Promise.all(
      handlers.map(handler => 
        handler.handle(event).catch(error => 
          console.error(`Event handler failed: ${event.type}`, error)
        )
      )
    );
  }
}

interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

// Example Event Handlers
export class UserLevelUpEventHandler implements EventHandler<UserLevelUpEvent> {
  constructor(
    private notificationService: NotificationService,
    private rewardService: RewardService
  ) {}
  
  async handle(event: UserLevelUpEvent): Promise<void> {
    // Send congratulatory notification
    await this.notificationService.sendNotification({
      userId: event.userId!,
      type: 'achievement',
      title: 'Level Up!',
      message: `Congratulations! You've reached level ${event.payload.newLevel}`,
      data: event.payload
    });
    
    // Award level up rewards
    await this.rewardService.awardLevelUpRewards(
      event.userId!,
      event.payload.newLevel
    );
  }
}

export class MealLoggedEventHandler implements EventHandler<MealLoggedEvent> {
  constructor(
    private nutritionService: NutritionService,
    private aiService: AIService
  ) {}
  
  async handle(event: MealLoggedEvent): Promise<void> {
    // Update nutrition analytics
    await this.nutritionService.updateAnalytics(
      event.userId!,
      event.payload.meal
    );
    
    // Generate AI insights
    await this.aiService.generateMealInsights(
      event.userId!,
      event.payload.meal
    );
  }
}
```

## Event Streaming

### Stream Processing
```typescript
export class EventStreamProcessor {
  private streams: Map<string, EventStream>;
  private processors: Map<string, StreamProcessor>;
  
  constructor() {
    this.streams = new Map();
    this.processors = new Map();
  }
  
  async createStream(
    name: string,
    config: StreamConfig
  ): Promise<EventStream> {
    const stream = new EventStream(name, config);
    this.streams.set(name, stream);
    return stream;
  }
  
  async processStream(
    streamName: string,
    processor: StreamProcessor
  ): Promise<void> {
    const stream = this.streams.get(streamName);
    if (!stream) {
      throw new Error(`Stream ${streamName} not found`);
    }
    
    this.processors.set(streamName, processor);
    
    await stream.consume(async (event) => {
      try {
        await processor.process(event);
      } catch (error) {
        console.error(`Stream processing failed: ${streamName}`, error);
        await processor.handleError(event, error);
      }
    });
  }
  
  async getStreamMetrics(streamName: string): Promise<StreamMetrics> {
    const stream = this.streams.get(streamName);
    if (!stream) {
      throw new Error(`Stream ${streamName} not found`);
    }
    
    return stream.getMetrics();
  }
}

interface StreamConfig {
  partitions: number;
  replicationFactor: number;
  retentionMs: number;
  compressionType: 'gzip' | 'snappy' | 'lz4' | 'zstd';
  cleanupPolicy: 'delete' | 'compact';
}

interface StreamProcessor {
  process(event: DomainEvent): Promise<void>;
  handleError(event: DomainEvent, error: Error): Promise<void>;
}

interface StreamMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  partitionCount: number;
  consumerLag: number;
}

// Example Stream Processors
export class NutritionAnalyticsProcessor implements StreamProcessor {
  constructor(
    private analyticsService: AnalyticsService,
    private cacheService: CacheService
  ) {}
  
  async process(event: DomainEvent): Promise<void> {
    if (event.type === 'nutrition.meal.logged') {
      await this.analyticsService.updateMealAnalytics(event);
      await this.cacheService.invalidateNutritionCache(event.userId!);
    }
  }
  
  async handleError(event: DomainEvent, error: Error): Promise<void> {
    console.error(`Nutrition analytics processing failed:`, error);
    // Implement error handling logic
  }
}

export class UserEngagementProcessor implements StreamProcessor {
  constructor(
    private engagementService: EngagementService,
    private recommendationService: RecommendationService
  ) {}
  
  async process(event: DomainEvent): Promise<void> {
    if (event.type.startsWith('user.')) {
      await this.engagementService.updateEngagementMetrics(event);
      await this.recommendationService.updateRecommendations(event.userId!);
    }
  }
  
  async handleError(event: DomainEvent, error: Error): Promise<void> {
    console.error(`User engagement processing failed:`, error);
    // Implement error handling logic
  }
}
```

This comprehensive event-driven architecture provides scalable, maintainable, and resilient event processing with proper separation of concerns and robust error handling.
