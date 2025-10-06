# Caching Architecture

## Overview
This document outlines the comprehensive caching strategy for the Diet Planner Game application, covering multi-level caching, CDN integration, cache invalidation, and performance optimization.

## Caching Strategy

### Multi-Level Caching
```typescript
interface CachingLevels {
  browser: {
    type: 'browser_cache';
    storage: 'localStorage' | 'sessionStorage' | 'indexedDB';
    ttl: number; // time to live in seconds
    maxSize: string; // e.g., '50MB'
    compression: boolean;
  };
  cdn: {
    type: 'cdn_cache';
    provider: 'cloudflare' | 'aws_cloudfront' | 'azure_cdn';
    ttl: number;
    edgeLocations: number;
    compression: boolean;
    minification: boolean;
  };
  application: {
    type: 'application_cache';
    storage: 'redis' | 'memcached' | 'in_memory';
    ttl: number;
    maxSize: string;
    evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  };
  database: {
    type: 'database_cache';
    storage: 'query_cache' | 'result_cache' | 'connection_pool';
    ttl: number;
    maxConnections: number;
    poolSize: number;
  };
}
```

### Cache Configuration
```typescript
const CACHE_CONFIG = {
  static_assets: {
    level: 'cdn',
    ttl: 31536000, // 1 year
    compression: true,
    minification: true,
    versioning: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': true,
      'Last-Modified': true
    }
  },
  
  api_responses: {
    level: 'application',
    ttl: 300, // 5 minutes
    compression: true,
    serialization: 'json',
    invalidation: 'time_based',
    headers: {
      'Cache-Control': 'public, max-age=300',
      'ETag': true,
      'Vary': 'Accept-Encoding'
    }
  },
  
  user_data: {
    level: 'application',
    ttl: 1800, // 30 minutes
    compression: true,
    encryption: true,
    invalidation: 'event_based',
    headers: {
      'Cache-Control': 'private, max-age=1800',
      'ETag': true
    }
  },
  
  nutrition_data: {
    level: 'application',
    ttl: 600, // 10 minutes
    compression: true,
    invalidation: 'smart',
    headers: {
      'Cache-Control': 'private, max-age=600',
      'ETag': true
    }
  },
  
  ai_responses: {
    level: 'application',
    ttl: 3600, // 1 hour
    compression: true,
    invalidation: 'manual',
    headers: {
      'Cache-Control': 'private, max-age=3600',
      'ETag': true
    }
  }
};
```

## Cache Implementation

### Redis Cache Service
```typescript
export class RedisCacheService {
  private redis: Redis;
  private compression: boolean;
  private encryption: boolean;
  
  constructor(config: RedisConfig) {
    this.redis = new Redis(config);
    this.compression = config.compression || false;
    this.encryption = config.encryption || false;
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      if (!cached) return null;
      
      let data = cached;
      
      // Decrypt if needed
      if (this.encryption) {
        data = await this.decrypt(data);
      }
      
      // Decompress if needed
      if (this.compression) {
        data = await this.decompress(data);
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }
  
  async set<T>(
    key: string, 
    value: T, 
    ttl?: number
  ): Promise<void> {
    try {
      let data = JSON.stringify(value);
      
      // Compress if needed
      if (this.compression) {
        data = await this.compress(data);
      }
      
      // Encrypt if needed
      if (this.encryption) {
        data = await this.encrypt(data);
      }
      
      if (ttl) {
        await this.redis.setex(key, ttl, data);
      } else {
        await this.redis.set(key, data);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }
  
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
  
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }
  
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const cached = await this.redis.mget(keys);
      return cached.map(item => {
        if (!item) return null;
        
        let data = item;
        
        if (this.encryption) {
          data = this.decrypt(data);
        }
        
        if (this.compression) {
          data = this.decompress(data);
        }
        
        return JSON.parse(data);
      });
    } catch (error) {
      console.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }
  
  async mset<T>(
    keyValuePairs: Array<{ key: string; value: T; ttl?: number }>
  ): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      
      for (const { key, value, ttl } of keyValuePairs) {
        let data = JSON.stringify(value);
        
        if (this.compression) {
          data = await this.compress(data);
        }
        
        if (this.encryption) {
          data = await this.encrypt(data);
        }
        
        if (ttl) {
          pipeline.setex(key, ttl, data);
        } else {
          pipeline.set(key, data);
        }
      }
      
      await pipeline.exec();
    } catch (error) {
      console.error('Cache mset error:', error);
    }
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }
  
  async getStats(): Promise<CacheStats> {
    try {
      const info = await this.redis.info('memory');
      const keyspace = await this.redis.info('keyspace');
      
      return {
        usedMemory: this.parseMemoryInfo(info),
        totalKeys: this.parseKeyspaceInfo(keyspace),
        hitRate: await this.calculateHitRate(),
        evictions: await this.getEvictionCount()
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        usedMemory: 0,
        totalKeys: 0,
        hitRate: 0,
        evictions: 0
      };
    }
  }
  
  private async compress(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      zlib.gzip(data, (err, compressed) => {
        if (err) reject(err);
        else resolve(compressed.toString('base64'));
      });
    });
  }
  
  private async decompress(compressed: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(compressed, 'base64');
      zlib.gunzip(buffer, (err, decompressed) => {
        if (err) reject(err);
        else resolve(decompressed.toString());
      });
    });
  }
  
  private async encrypt(data: string): Promise<string> {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.CACHE_ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  
  private async decrypt(encrypted: string): Promise<string> {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.CACHE_ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
```

### Browser Cache Service
```typescript
export class BrowserCacheService {
  private storage: Storage;
  private compression: boolean;
  private encryption: boolean;
  
  constructor(
    storageType: 'localStorage' | 'sessionStorage' = 'localStorage',
    options: { compression?: boolean; encryption?: boolean } = {}
  ) {
    this.storage = storageType === 'localStorage' ? localStorage : sessionStorage;
    this.compression = options.compression || false;
    this.encryption = options.encryption || false;
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = this.storage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp, ttl } = JSON.parse(cached);
      
      // Check if expired
      if (ttl && Date.now() - timestamp > ttl * 1000) {
        this.del(key);
        return null;
      }
      
      let result = data;
      
      if (this.encryption) {
        result = await this.decrypt(result);
      }
      
      if (this.compression) {
        result = await this.decompress(result);
      }
      
      return result;
    } catch (error) {
      console.error('Browser cache get error:', error);
      return null;
    }
  }
  
  async set<T>(
    key: string, 
    value: T, 
    ttl?: number
  ): Promise<void> {
    try {
      let data = value;
      
      if (this.compression) {
        data = await this.compress(data);
      }
      
      if (this.encryption) {
        data = await this.encrypt(data);
      }
      
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl: ttl || null
      };
      
      this.storage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Browser cache set error:', error);
    }
  }
  
  async del(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Browser cache delete error:', error);
    }
  }
  
  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Browser cache clear error:', error);
    }
  }
  
  async keys(): Promise<string[]> {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Browser cache keys error:', error);
      return [];
    }
  }
  
  async size(): Promise<number> {
    try {
      let totalSize = 0;
      for (const key in this.storage) {
        if (this.storage.hasOwnProperty(key)) {
          totalSize += this.storage[key].length;
        }
      }
      return totalSize;
    } catch (error) {
      console.error('Browser cache size error:', error);
      return 0;
    }
  }
  
  private async compress(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    const compressed = await pako.gzip(jsonString);
    return btoa(String.fromCharCode(...compressed));
  }
  
  private async decompress(compressed: string): Promise<any> {
    const compressedArray = Uint8Array.from(atob(compressed), c => c.charCodeAt(0));
    const decompressed = pako.ungzip(compressedArray, { to: 'string' });
    return JSON.parse(decompressed);
  }
  
  private async encrypt(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      await this.getEncryptionKey(),
      new TextEncoder().encode(jsonString)
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }
  
  private async decrypt(encrypted: string): Promise<any> {
    const encryptedArray = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(12) },
      await this.getEncryptionKey(),
      encryptedArray
    );
    const jsonString = new TextDecoder().decode(decrypted);
    return JSON.parse(jsonString);
  }
  
  private async getEncryptionKey(): Promise<CryptoKey> {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.CACHE_ENCRYPTION_KEY),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
    return key;
  }
}
```

## Cache Invalidation

### Invalidation Strategies
```typescript
interface InvalidationStrategy {
  time_based: {
    ttl: number;
    refreshAhead: boolean;
    refreshThreshold: number;
  };
  event_based: {
    events: string[];
    patterns: string[];
    cascade: boolean;
  };
  manual: {
    triggers: string[];
    patterns: string[];
    confirmation: boolean;
  };
  smart: {
    usage_patterns: boolean;
    predictive: boolean;
    adaptive_ttl: boolean;
  };
}

export class CacheInvalidationService {
  private redis: RedisCacheService;
  private eventBus: EventBus;
  
  constructor(redis: RedisCacheService, eventBus: EventBus) {
    this.redis = redis;
    this.eventBus = eventBus;
  }
  
  async invalidateOnEvent(
    event: string, 
    patterns: string[]
  ): Promise<void> {
    try {
      for (const pattern of patterns) {
        await this.redis.invalidatePattern(pattern);
      }
      
      // Emit invalidation event
      this.eventBus.emit('cache_invalidated', {
        event,
        patterns,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }
  
  async invalidateUserData(userId: string): Promise<void> {
    const patterns = [
      `user:${userId}:*`,
      `profile:${userId}:*`,
      `progress:${userId}:*`,
      `achievements:${userId}:*`,
      `nutrition:${userId}:*`
    ];
    
    await this.invalidateOnEvent('user_data_updated', patterns);
  }
  
  async invalidateNutritionData(userId: string, date?: string): Promise<void> {
    const patterns = [
      `nutrition:${userId}:*`,
      `meals:${userId}:*`,
      `goals:${userId}:*`
    ];
    
    if (date) {
      patterns.push(`nutrition:${userId}:${date}:*`);
    }
    
    await this.invalidateOnEvent('nutrition_data_updated', patterns);
  }
  
  async invalidateAIResponses(userId: string): Promise<void> {
    const patterns = [
      `ai:${userId}:*`,
      `recommendations:${userId}:*`,
      `insights:${userId}:*`
    ];
    
    await this.invalidateOnEvent('ai_data_updated', patterns);
  }
  
  async invalidateLeaderboard(leaderboardId: string): Promise<void> {
    const patterns = [
      `leaderboard:${leaderboardId}:*`,
      `rankings:${leaderboardId}:*`,
      `scores:${leaderboardId}:*`
    ];
    
    await this.invalidateOnEvent('leaderboard_updated', patterns);
  }
  
  async scheduleInvalidation(
    key: string, 
    ttl: number
  ): Promise<void> {
    setTimeout(async () => {
      await this.redis.del(key);
    }, ttl * 1000);
  }
  
  async preloadCache(
    keys: string[], 
    dataLoader: (keys: string[]) => Promise<Record<string, any>>
  ): Promise<void> {
    try {
      const data = await dataLoader(keys);
      const cacheItems = Object.entries(data).map(([key, value]) => ({
        key,
        value,
        ttl: CACHE_CONFIG.api_responses.ttl
      }));
      
      await this.redis.mset(cacheItems);
    } catch (error) {
      console.error('Cache preload error:', error);
    }
  }
}
```

## CDN Integration

### CDN Configuration
```typescript
interface CDNConfig {
  provider: 'cloudflare' | 'aws_cloudfront' | 'azure_cdn';
  domain: string;
  ssl: boolean;
  compression: boolean;
  minification: boolean;
  versioning: boolean;
  cache_control: {
    static_assets: string;
    api_responses: string;
    user_data: string;
  };
  headers: {
    security: string[];
    performance: string[];
    custom: Record<string, string>;
  };
}

export class CDNService {
  private config: CDNConfig;
  private purgeApi: any;
  
  constructor(config: CDNConfig) {
    this.config = config;
    this.purgeApi = this.initializePurgeApi();
  }
  
  async purgeCache(urls: string[]): Promise<void> {
    try {
      await this.purgeApi.purge(urls);
    } catch (error) {
      console.error('CDN purge error:', error);
    }
  }
  
  async purgeByPattern(pattern: string): Promise<void> {
    try {
      await this.purgeApi.purgeByPattern(pattern);
    } catch (error) {
      console.error('CDN purge pattern error:', error);
    }
  }
  
  async getCacheStatus(url: string): Promise<CacheStatus> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        cached: response.headers.get('cf-cache-status') === 'HIT',
        ttl: parseInt(response.headers.get('cf-cache-ttl') || '0'),
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag')
      };
    } catch (error) {
      console.error('CDN status check error:', error);
      return {
        cached: false,
        ttl: 0,
        lastModified: null,
        etag: null
      };
    }
  }
  
  private initializePurgeApi(): any {
    switch (this.config.provider) {
      case 'cloudflare':
        return new CloudflarePurgeAPI(this.config);
      case 'aws_cloudfront':
        return new CloudFrontPurgeAPI(this.config);
      case 'azure_cdn':
        return new AzureCDNPurgeAPI(this.config);
      default:
        throw new Error(`Unsupported CDN provider: ${this.config.provider}`);
    }
  }
}
```

## Performance Monitoring

### Cache Metrics
```typescript
interface CacheMetrics {
  hit_rate: number;
  miss_rate: number;
  eviction_rate: number;
  memory_usage: number;
  response_time: number;
  throughput: number;
  error_rate: number;
}

export class CacheMetricsService {
  private metrics: Map<string, CacheMetrics>;
  private redis: RedisCacheService;
  
  constructor(redis: RedisCacheService) {
    this.metrics = new Map();
    this.redis = redis;
  }
  
  async collectMetrics(): Promise<Map<string, CacheMetrics>> {
    const stats = await this.redis.getStats();
    
    for (const [key, value] of this.metrics.entries()) {
      const updated = {
        ...value,
        hit_rate: await this.calculateHitRate(key),
        miss_rate: 1 - value.hit_rate,
        memory_usage: stats.usedMemory,
        response_time: await this.measureResponseTime(key),
        throughput: await this.measureThroughput(key),
        error_rate: await this.calculateErrorRate(key)
      };
      
      this.metrics.set(key, updated);
    }
    
    return this.metrics;
  }
  
  async recordCacheHit(key: string): Promise<void> {
    const metrics = this.metrics.get(key) || this.initializeMetrics(key);
    metrics.hit_rate = (metrics.hit_rate + 1) / 2; // Simple moving average
    this.metrics.set(key, metrics);
  }
  
  async recordCacheMiss(key: string): Promise<void> {
    const metrics = this.metrics.get(key) || this.initializeMetrics(key);
    metrics.miss_rate = (metrics.miss_rate + 1) / 2;
    this.metrics.set(key, metrics);
  }
  
  async recordCacheError(key: string): Promise<void> {
    const metrics = this.metrics.get(key) || this.initializeMetrics(key);
    metrics.error_rate = (metrics.error_rate + 1) / 2;
    this.metrics.set(key, metrics);
  }
  
  private initializeMetrics(key: string): CacheMetrics {
    return {
      hit_rate: 0,
      miss_rate: 0,
      eviction_rate: 0,
      memory_usage: 0,
      response_time: 0,
      throughput: 0,
      error_rate: 0
    };
  }
  
  private async calculateHitRate(key: string): Promise<number> {
    // Implementation depends on specific cache implementation
    return 0.85; // Example value
  }
  
  private async measureResponseTime(key: string): Promise<number> {
    const start = Date.now();
    await this.redis.get(key);
    return Date.now() - start;
  }
  
  private async measureThroughput(key: string): Promise<number> {
    // Measure operations per second
    return 1000; // Example value
  }
  
  private async calculateErrorRate(key: string): Promise<number> {
    // Calculate error rate based on failed operations
    return 0.01; // Example value
  }
}
```

This comprehensive caching architecture provides multi-level caching with intelligent invalidation, performance monitoring, and CDN integration to optimize application performance and user experience.
