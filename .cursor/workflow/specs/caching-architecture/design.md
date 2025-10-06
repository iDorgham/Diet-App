# Caching Architecture Specification

## Overview
The Caching Architecture defines a comprehensive multi-level caching strategy for the Diet Planner Game application, ensuring optimal performance, reduced latency, and improved user experience through intelligent data caching and invalidation mechanisms.

## EARS Requirements

### Epic Requirements
- **EPIC-CA-001**: The system SHALL implement a multi-level caching architecture for optimal performance
- **EPIC-CA-002**: The system SHALL provide intelligent cache invalidation and management
- **EPIC-CA-003**: The system SHALL ensure data consistency across all cache layers

### Feature Requirements
- **FEAT-CA-001**: The system SHALL implement Redis-based distributed caching
- **FEAT-CA-002**: The system SHALL provide CDN integration for static content
- **FEAT-CA-003**: The system SHALL implement application-level caching
- **FEAT-CA-004**: The system SHALL provide cache monitoring and analytics

### User Story Requirements
- **US-CA-001**: As a user, I want fast response times so that I can use the application efficiently
- **US-CA-002**: As a developer, I want reliable caching so that I can build performant features
- **US-CA-003**: As a system administrator, I want cache monitoring so that I can optimize performance

### Acceptance Criteria
- **AC-CA-001**: Given a cache request, when data is available in cache, then it SHALL be returned within 10ms
- **AC-CA-002**: Given a cache miss, when data is fetched from source, then it SHALL be cached for future requests
- **AC-CA-003**: Given a data update, when cache is invalidated, then it SHALL be refreshed on next request

## Caching Strategy

### 1. Multi-Level Caching Architecture
```typescript
// Caching layers hierarchy
interface CacheLayer {
  level: number;
  name: string;
  type: 'memory' | 'redis' | 'cdn' | 'database';
  ttl: number;
  capacity: number;
  hitRate: number;
}

const cacheLayers: CacheLayer[] = [
  {
    level: 1,
    name: 'Application Memory Cache',
    type: 'memory',
    ttl: 300, // 5 minutes
    capacity: 1000,
    hitRate: 0.8
  },
  {
    level: 2,
    name: 'Redis Distributed Cache',
    type: 'redis',
    ttl: 3600, // 1 hour
    capacity: 10000,
    hitRate: 0.9
  },
  {
    level: 3,
    name: 'CDN Cache',
    type: 'cdn',
    ttl: 86400, // 24 hours
    capacity: 100000,
    hitRate: 0.95
  },
  {
    level: 4,
    name: 'Database Query Cache',
    type: 'database',
    ttl: 1800, // 30 minutes
    capacity: 5000,
    hitRate: 0.7
  }
];
```

### 2. Cache Key Strategy
```typescript
// Cache key generation
class CacheKeyGenerator {
  private static readonly KEY_SEPARATOR = ':';
  private static readonly VERSION_PREFIX = 'v1';

  static generateUserKey(userId: string, dataType: string): string {
    return `${this.VERSION_PREFIX}${this.KEY_SEPARATOR}user${this.KEY_SEPARATOR}${userId}${this.KEY_SEPARATOR}${dataType}`;
  }

  static generateNutritionKey(userId: string, date: string): string {
    return `${this.VERSION_PREFIX}${this.KEY_SEPARATOR}nutrition${this.KEY_SEPARATOR}${userId}${this.KEY_SEPARATOR}${date}`;
  }

  static generateLeaderboardKey(type: string, period: string): string {
    return `${this.VERSION_PREFIX}${this.KEY_SEPARATOR}leaderboard${this.KEY_SEPARATOR}${type}${this.KEY_SEPARATOR}${period}`;
  }

  static generateFoodSearchKey(query: string, filters: any): string {
    const filterHash = this.hashObject(filters);
    return `${this.VERSION_PREFIX}${this.KEY_SEPARATOR}food${this.KEY_SEPARATOR}search${this.KEY_SEPARATOR}${this.hashString(query)}${this.KEY_SEPARATOR}${filterHash}`;
  }

  static generateAchievementKey(userId: string): string {
    return `${this.VERSION_PREFIX}${this.KEY_SEPARATOR}achievements${this.KEY_SEPARATOR}${userId}`;
  }

  private static hashString(str: string): string {
    return require('crypto').createHash('md5').update(str).digest('hex').substring(0, 8);
  }

  private static hashObject(obj: any): string {
    return this.hashString(JSON.stringify(obj));
  }
}
```

## Redis Implementation

### 1. Redis Configuration
```typescript
// Redis configuration
import Redis from 'ioredis';
import { Cluster } from 'ioredis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
  keepAlive: number;
  connectTimeout: number;
  commandTimeout: number;
}

const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000
};

// Redis client setup
class RedisClient {
  private client: Redis;
  private cluster: Cluster | null = null;

  constructor() {
    if (process.env.REDIS_CLUSTER_MODE === 'true') {
      this.setupCluster();
    } else {
      this.setupSingleInstance();
    }
  }

  private setupSingleInstance(): void {
    this.client = new Redis(redisConfig);
    
    this.client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.client.on('ready', () => {
      console.log('Redis is ready to accept commands');
    });
  }

  private setupCluster(): void {
    const clusterNodes = process.env.REDIS_CLUSTER_NODES?.split(',') || [];
    
    this.cluster = new Cluster(clusterNodes.map(node => {
      const [host, port] = node.split(':');
      return { host, port: parseInt(port) };
    }), {
      redisOptions: redisConfig,
      enableReadyCheck: true,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });

    this.cluster.on('connect', () => {
      console.log('Redis cluster connected successfully');
    });

    this.cluster.on('error', (error) => {
      console.error('Redis cluster error:', error);
    });
  }

  getClient(): Redis | Cluster {
    return this.cluster || this.client;
  }
}
```

### 2. Cache Service Implementation
```typescript
// Cache service
import { RedisClient } from './redis-client';

interface CacheOptions {
  ttl?: number;
  serialize?: boolean;
  compress?: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalRequests: number;
}

class CacheService {
  private redis: Redis | Cluster;
  private stats: Map<string, CacheStats> = new Map();

  constructor() {
    const redisClient = new RedisClient();
    this.redis = redisClient.getClient();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const startTime = Date.now();
      const value = await this.redis.get(key);
      const duration = Date.now() - startTime;

      this.updateStats(key, value !== null);

      if (value) {
        console.log(`Cache HIT for key: ${key}, duration: ${duration}ms`);
        return this.deserialize(value);
      } else {
        console.log(`Cache MISS for key: ${key}, duration: ${duration}ms`);
        return null;
      }
    } catch (error) {
      console.error(`Cache GET error for key: ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      const { ttl = 3600, serialize = true, compress = false } = options;
      
      let processedValue: string;
      if (serialize) {
        processedValue = this.serialize(value);
      } else {
        processedValue = value as string;
      }

      if (compress) {
        processedValue = await this.compress(processedValue);
      }

      const result = await this.redis.setex(key, ttl, processedValue);
      
      console.log(`Cache SET for key: ${key}, ttl: ${ttl}s`);
      return result === 'OK';
    } catch (error) {
      console.error(`Cache SET error for key: ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      console.log(`Cache DEL for key: ${key}`);
      return result > 0;
    } catch (error) {
      console.error(`Cache DEL error for key: ${key}:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache EXISTS error for key: ${key}:`, error);
      return false;
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.redis.mget(...keys);
      return values.map(value => value ? this.deserialize(value) : null);
    } catch (error) {
      console.error('Cache MGET error:', error);
      return keys.map(() => null);
    }
  }

  async mset<T>(keyValuePairs: Record<string, T>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const { ttl = 3600 } = options;
      const pipeline = this.redis.pipeline();

      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = this.serialize(value);
        pipeline.setex(key, ttl, serializedValue);
      }

      const results = await pipeline.exec();
      const success = results?.every(([error, result]) => !error && result === 'OK') || false;
      
      console.log(`Cache MSET for ${Object.keys(keyValuePairs).length} keys`);
      return success;
    } catch (error) {
      console.error('Cache MSET error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.redis.del(...keys);
      console.log(`Cache INVALIDATE pattern: ${pattern}, keys: ${keys.length}`);
      return result;
    } catch (error) {
      console.error(`Cache INVALIDATE error for pattern: ${pattern}:`, error);
      return 0;
    }
  }

  async getStats(key?: string): Promise<CacheStats | Map<string, CacheStats>> {
    if (key) {
      return this.stats.get(key) || { hits: 0, misses: 0, hitRate: 0, totalRequests: 0 };
    }
    return new Map(this.stats);
  }

  private serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  private deserialize<T>(value: string): T {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Deserialization error:', error);
      return value as T;
    }
  }

  private async compress(data: string): Promise<string> {
    const zlib = require('zlib');
    return new Promise((resolve, reject) => {
      zlib.gzip(data, (error: Error | null, result: Buffer) => {
        if (error) reject(error);
        else resolve(result.toString('base64'));
      });
    });
  }

  private updateStats(key: string, hit: boolean): void {
    const stats = this.stats.get(key) || { hits: 0, misses: 0, hitRate: 0, totalRequests: 0 };
    
    if (hit) {
      stats.hits++;
    } else {
      stats.misses++;
    }
    
    stats.totalRequests = stats.hits + stats.misses;
    stats.hitRate = stats.hits / stats.totalRequests;
    
    this.stats.set(key, stats);
  }
}
```

## Application-Level Caching

### 1. Memory Cache Implementation
```typescript
// Memory cache implementation
interface MemoryCacheItem<T> {
  value: T;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

class MemoryCache<T> {
  private cache = new Map<string, MemoryCacheItem<T>>();
  private maxSize: number;
  private defaultTtl: number;

  constructor(maxSize: number = 1000, defaultTtl: number = 300000) {
    this.maxSize = maxSize;
    this.defaultTtl = defaultTtl;
    
    // Cleanup expired items every minute
    setInterval(() => this.cleanup(), 60000);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();

    return item.value;
  }

  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTtl);
    
    // If cache is full, remove least recently used item
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      expiresAt,
      accessCount: 1,
      lastAccessed: Date.now()
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    let totalAccesses = 0;
    let totalHits = 0;

    for (const item of this.cache.values()) {
      totalAccesses += item.accessCount;
      totalHits += item.accessCount;
    }

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: totalAccesses > 0 ? totalHits / totalAccesses : 0
    };
  }
}
```

### 2. Cache Decorators
```typescript
// Cache decorators for methods
function Cacheable(ttl: number = 300, keyGenerator?: (args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const cache = new MemoryCache();

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator ? keyGenerator(args) : `${propertyName}:${JSON.stringify(args)}`;
      
      // Try to get from cache first
      const cached = cache.get(key);
      if (cached !== null) {
        return cached;
      }

      // Execute method and cache result
      const result = await method.apply(this, args);
      cache.set(key, result, ttl);
      
      return result;
    };
  };
}

// Usage example
class UserService {
  @Cacheable(600, (args) => `user:${args[0]}`)
  async getUserById(userId: string): Promise<User> {
    // Database query
    return await this.database.users.findById(userId);
  }

  @Cacheable(300, (args) => `nutrition:${args[0]}:${args[1]}`)
  async getNutritionSummary(userId: string, date: string): Promise<NutritionSummary> {
    // Complex calculation
    return await this.calculateNutritionSummary(userId, date);
  }
}
```

## CDN Integration

### 1. CDN Configuration
```typescript
// CDN service
interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'azure-cdn';
  domain: string;
  apiKey: string;
  zoneId?: string;
  distributionId?: string;
}

class CDNService {
  private config: CDNConfig;

  constructor(config: CDNConfig) {
    this.config = config;
  }

  async purgeCache(urls: string[]): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.purgeCloudflare(urls);
        case 'aws-cloudfront':
          return await this.purgeCloudFront(urls);
        case 'azure-cdn':
          return await this.purgeAzureCDN(urls);
        default:
          throw new Error(`Unsupported CDN provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('CDN purge error:', error);
      return false;
    }
  }

  async purgeAll(): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.purgeCloudflareAll();
        case 'aws-cloudfront':
          return await this.purgeCloudFrontAll();
        case 'azure-cdn':
          return await this.purgeAzureCDNAll();
        default:
          throw new Error(`Unsupported CDN provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('CDN purge all error:', error);
      return false;
    }
  }

  private async purgeCloudflare(urls: string[]): Promise<boolean> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: urls
      })
    });

    const result = await response.json();
    return result.success;
  }

  private async purgeCloudflareAll(): Promise<boolean> {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        purge_everything: true
      })
    });

    const result = await response.json();
    return result.success;
  }

  private async purgeCloudFront(urls: string[]): Promise<boolean> {
    // AWS CloudFront implementation
    const AWS = require('aws-sdk');
    const cloudfront = new AWS.CloudFront();

    const params = {
      DistributionId: this.config.distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: urls.length,
          Items: urls
        }
      }
    };

    const result = await cloudfront.createInvalidation(params).promise();
    return result.Invalidation !== undefined;
  }

  private async purgeCloudFrontAll(): Promise<boolean> {
    const AWS = require('aws-sdk');
    const cloudfront = new AWS.CloudFront();

    const params = {
      DistributionId: this.config.distributionId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 1,
          Items: ['/*']
        }
      }
    };

    const result = await cloudfront.createInvalidation(params).promise();
    return result.Invalidation !== undefined;
  }

  private async purgeAzureCDN(urls: string[]): Promise<boolean> {
    // Azure CDN implementation
    // This would use Azure SDK
    console.log('Azure CDN purge not implemented yet');
    return false;
  }

  private async purgeAzureCDNAll(): Promise<boolean> {
    // Azure CDN implementation
    console.log('Azure CDN purge all not implemented yet');
    return false;
  }
}
```

## Cache Invalidation Strategies

### 1. Event-Based Invalidation
```typescript
// Cache invalidation service
import { EventEmitter } from 'events';

interface InvalidationRule {
  pattern: string;
  events: string[];
  ttl?: number;
}

class CacheInvalidationService extends EventEmitter {
  private rules: InvalidationRule[] = [];
  private cacheService: CacheService;

  constructor(cacheService: CacheService) {
    super();
    this.cacheService = cacheService;
    this.setupDefaultRules();
  }

  private setupDefaultRules(): void {
    this.rules = [
      {
        pattern: 'v1:user:*:profile',
        events: ['user.profile.updated', 'user.profile.deleted']
      },
      {
        pattern: 'v1:nutrition:*:*',
        events: ['nutrition.meal.logged', 'nutrition.goal.updated']
      },
      {
        pattern: 'v1:leaderboard:*',
        events: ['user.progress.updated', 'achievement.unlocked']
      },
      {
        pattern: 'v1:achievements:*',
        events: ['achievement.unlocked', 'achievement.progress.updated']
      }
    ];
  }

  async handleEvent(eventType: string, eventData: any): Promise<void> {
    console.log(`Processing cache invalidation event: ${eventType}`, eventData);

    for (const rule of this.rules) {
      if (rule.events.includes(eventType)) {
        await this.invalidateByPattern(rule.pattern, eventData);
      }
    }
  }

  private async invalidateByPattern(pattern: string, eventData: any): Promise<void> {
    try {
      // Replace wildcards with actual values from event data
      let actualPattern = pattern;
      
      if (eventData.userId) {
        actualPattern = actualPattern.replace('*', eventData.userId);
      }
      
      if (eventData.date) {
        actualPattern = actualPattern.replace('*', eventData.date);
      }

      const invalidatedCount = await this.cacheService.invalidatePattern(actualPattern);
      console.log(`Invalidated ${invalidatedCount} cache entries for pattern: ${actualPattern}`);
      
      this.emit('cacheInvalidated', {
        pattern: actualPattern,
        count: invalidatedCount,
        eventData
      });
    } catch (error) {
      console.error(`Cache invalidation error for pattern: ${pattern}:`, error);
    }
  }

  addRule(rule: InvalidationRule): void {
    this.rules.push(rule);
  }

  removeRule(pattern: string): void {
    this.rules = this.rules.filter(rule => rule.pattern !== pattern);
  }
}
```

### 2. Time-Based Invalidation
```typescript
// Time-based cache invalidation
class TimeBasedInvalidation {
  private cacheService: CacheService;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  scheduleInvalidation(key: string, ttl: number): void {
    // Clear existing interval if any
    this.clearInvalidation(key);

    // Schedule new invalidation
    const interval = setTimeout(async () => {
      await this.cacheService.del(key);
      this.intervals.delete(key);
      console.log(`Time-based invalidation executed for key: ${key}`);
    }, ttl * 1000);

    this.intervals.set(key, interval);
  }

  clearInvalidation(key: string): void {
    const interval = this.intervals.get(key);
    if (interval) {
      clearTimeout(interval);
      this.intervals.delete(key);
    }
  }

  clearAllInvalidations(): void {
    for (const interval of this.intervals.values()) {
      clearTimeout(interval);
    }
    this.intervals.clear();
  }
}
```

## Cache Monitoring and Analytics

### 1. Cache Metrics Collection
```typescript
// Cache metrics service
interface CacheMetrics {
  key: string;
  hits: number;
  misses: number;
  hitRate: number;
  avgResponseTime: number;
  totalRequests: number;
  lastAccessed: Date;
  size: number;
}

class CacheMetricsService {
  private metrics: Map<string, CacheMetrics> = new Map();
  private responseTimes: Map<string, number[]> = new Map();

  recordHit(key: string, responseTime: number): void {
    const metric = this.getOrCreateMetric(key);
    metric.hits++;
    metric.totalRequests++;
    metric.hitRate = metric.hits / metric.totalRequests;
    metric.lastAccessed = new Date();
    
    this.recordResponseTime(key, responseTime);
    this.updateAverageResponseTime(key);
  }

  recordMiss(key: string, responseTime: number): void {
    const metric = this.getOrCreateMetric(key);
    metric.misses++;
    metric.totalRequests++;
    metric.hitRate = metric.hits / metric.totalRequests;
    metric.lastAccessed = new Date();
    
    this.recordResponseTime(key, responseTime);
    this.updateAverageResponseTime(key);
  }

  getMetrics(key?: string): CacheMetrics | Map<string, CacheMetrics> {
    if (key) {
      return this.metrics.get(key) || this.createEmptyMetric(key);
    }
    return new Map(this.metrics);
  }

  getTopKeys(limit: number = 10): CacheMetrics[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.totalRequests - a.totalRequests)
      .slice(0, limit);
  }

  getLowHitRateKeys(threshold: number = 0.5): CacheMetrics[] {
    return Array.from(this.metrics.values())
      .filter(metric => metric.hitRate < threshold)
      .sort((a, b) => a.hitRate - b.hitRate);
  }

  private getOrCreateMetric(key: string): CacheMetrics {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, this.createEmptyMetric(key));
    }
    return this.metrics.get(key)!;
  }

  private createEmptyMetric(key: string): CacheMetrics {
    return {
      key,
      hits: 0,
      misses: 0,
      hitRate: 0,
      avgResponseTime: 0,
      totalRequests: 0,
      lastAccessed: new Date(),
      size: 0
    };
  }

  private recordResponseTime(key: string, responseTime: number): void {
    if (!this.responseTimes.has(key)) {
      this.responseTimes.set(key, []);
    }
    
    const times = this.responseTimes.get(key)!;
    times.push(responseTime);
    
    // Keep only last 100 response times
    if (times.length > 100) {
      times.shift();
    }
  }

  private updateAverageResponseTime(key: string): void {
    const times = this.responseTimes.get(key);
    if (times && times.length > 0) {
      const metric = this.metrics.get(key);
      if (metric) {
        metric.avgResponseTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    }
  }
}
```

### 2. Cache Health Monitoring
```typescript
// Cache health monitoring
class CacheHealthMonitor {
  private cacheService: CacheService;
  private metricsService: CacheMetricsService;
  private healthChecks: Map<string, () => Promise<boolean>> = new Map();

  constructor(cacheService: CacheService, metricsService: CacheMetricsService) {
    this.cacheService = cacheService;
    this.metricsService = metricsService;
    this.setupHealthChecks();
  }

  private setupHealthChecks(): void {
    this.healthChecks.set('redis-connection', async () => {
      try {
        await this.cacheService.exists('health-check');
        return true;
      } catch (error) {
        return false;
      }
    });

    this.healthChecks.set('cache-performance', async () => {
      const metrics = this.metricsService.getMetrics();
      const overallHitRate = this.calculateOverallHitRate(metrics);
      return overallHitRate > 0.7; // 70% hit rate threshold
    });

    this.healthChecks.set('memory-usage', async () => {
      const memoryUsage = process.memoryUsage();
      const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
      return heapUsedMB < 500; // 500MB threshold
    });
  }

  async performHealthCheck(): Promise<{ healthy: boolean; checks: Record<string, boolean> }> {
    const checks: Record<string, boolean> = {};
    let allHealthy = true;

    for (const [name, check] of this.healthChecks.entries()) {
      try {
        const result = await check();
        checks[name] = result;
        if (!result) {
          allHealthy = false;
        }
      } catch (error) {
        checks[name] = false;
        allHealthy = false;
        console.error(`Health check failed for ${name}:`, error);
      }
    }

    return { healthy: allHealthy, checks };
  }

  private calculateOverallHitRate(metrics: Map<string, CacheMetrics>): number {
    let totalHits = 0;
    let totalRequests = 0;

    for (const metric of metrics.values()) {
      totalHits += metric.hits;
      totalRequests += metric.totalRequests;
    }

    return totalRequests > 0 ? totalHits / totalRequests : 0;
  }

  startMonitoring(intervalMs: number = 60000): void {
    setInterval(async () => {
      const health = await this.performHealthCheck();
      
      if (!health.healthy) {
        console.warn('Cache health check failed:', health.checks);
        // Send alert to monitoring system
        this.sendAlert(health.checks);
      }
    }, intervalMs);
  }

  private sendAlert(checks: Record<string, boolean>): void {
    // Implementation would send alert to monitoring system
    console.error('Cache health alert:', checks);
  }
}
```

## Future Enhancements

### 1. Advanced Caching Features
- **Cache Warming**: Pre-populate cache with frequently accessed data
- **Cache Compression**: Compress large cache values to save memory
- **Cache Encryption**: Encrypt sensitive cached data
- **Cache Replication**: Replicate cache across multiple regions

### 2. Performance Optimizations
- **Cache Prefetching**: Predict and prefetch likely needed data
- **Cache Partitioning**: Distribute cache across multiple Redis instances
- **Cache Sharding**: Shard cache by user or data type
- **Cache Coherence**: Ensure data consistency across cache layers