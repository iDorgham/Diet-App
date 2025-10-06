# Monitoring Architecture

## Overview
This document describes the comprehensive monitoring and observability architecture for the Diet Planner Game application, covering logging, metrics, tracing, alerting, and performance monitoring.

## Monitoring Stack

### 1. Application Performance Monitoring (APM)
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance insights
- **DataDog**: Infrastructure and application monitoring

### 2. Logging Infrastructure
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Fluentd**: Log aggregation and forwarding
- **CloudWatch**: AWS-native logging (if applicable)

### 3. Metrics Collection
- **Prometheus**: Metrics collection and storage
- **Grafana**: Metrics visualization and dashboards
- **StatsD**: Application metrics collection

### 4. Distributed Tracing
- **Jaeger**: Distributed tracing system
- **Zipkin**: Alternative tracing solution
- **OpenTelemetry**: Observability framework

## Logging Strategy

### Log Levels and Categories
```typescript
enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

enum LogCategory {
  APPLICATION = 'application',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  BUSINESS = 'business',
  AUDIT = 'audit'
}
```

### Structured Logging
```typescript
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  context: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    component?: string;
    action?: string;
    metadata?: Record<string, any>;
  };
  error?: {
    name: string;
    message: string;
    stack: string;
    code?: string;
  };
}
```

### Log Aggregation Pipeline
```yaml
# Fluentd configuration
<source>
  @type tail
  path /var/log/app/*.log
  pos_file /var/log/fluentd/app.log.pos
  tag app.logs
  format json
  time_key timestamp
  time_format %Y-%m-%dT%H:%M:%S.%NZ
</source>

<match app.logs>
  @type elasticsearch
  host elasticsearch.logging.svc.cluster.local
  port 9200
  index_name app-logs
  type_name _doc
</match>
```

## Metrics Collection

### Application Metrics
```typescript
// Custom metrics collection
export class MetricsCollector {
  private static prometheus = new PrometheusRegistry();
  
  // Counter metrics
  static taskCompletions = new Counter({
    name: 'task_completions_total',
    help: 'Total number of tasks completed',
    labelNames: ['task_type', 'user_level']
  });
  
  // Histogram metrics
  static apiResponseTime = new Histogram({
    name: 'api_response_time_seconds',
    help: 'API response time in seconds',
    labelNames: ['endpoint', 'method'],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  });
  
  // Gauge metrics
  static activeUsers = new Gauge({
    name: 'active_users_count',
    help: 'Number of currently active users'
  });
}
```

### Business Metrics
```typescript
// Business intelligence metrics
const businessMetrics = {
  userEngagement: {
    dailyActiveUsers: 'dau_count',
    weeklyActiveUsers: 'wau_count',
    monthlyActiveUsers: 'mau_count',
    sessionDuration: 'avg_session_duration',
    retentionRate: 'user_retention_rate'
  },
  
  gamification: {
    xpEarned: 'total_xp_earned',
    levelUps: 'level_ups_count',
    achievementsUnlocked: 'achievements_unlocked',
    questCompletions: 'quest_completions'
  },
  
  nutrition: {
    mealsLogged: 'meals_logged_count',
    recipesViewed: 'recipes_viewed_count',
    nutritionGoalsMet: 'nutrition_goals_met'
  }
};
```

## Distributed Tracing

### Trace Configuration
```typescript
// OpenTelemetry setup
import { NodeSDK } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const sdk = new NodeSDK({
  serviceName: 'diet-planner-game',
  instrumentations: [
    // Auto-instrumentations for common libraries
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new MongoDBInstrumentation(),
    new RedisInstrumentation()
  ],
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces'
  })
});

sdk.start();
```

### Custom Tracing
```typescript
// Custom span creation
export class TracingService {
  static async traceTaskCompletion<T>(
    taskId: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const tracer = trace.getTracer('diet-planner-game');
    
    return tracer.startActiveSpan('task.completion', async (span) => {
      try {
        span.setAttributes({
          'task.id': taskId,
          'task.type': 'completion',
          'user.id': getCurrentUserId()
        });
        
        const result = await operation();
        
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message
        });
        throw error;
      } finally {
        span.end();
      }
    });
  }
}
```

## Alerting System

### Alert Rules
```yaml
# Prometheus alert rules
groups:
  - name: diet-planner-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"
      
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(api_response_time_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API response time"
          description: "95th percentile response time is {{ $value }} seconds"
      
      - alert: LowActiveUsers
        expr: active_users_count < 10
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Low active user count"
          description: "Only {{ $value }} active users"
```

### Notification Channels
```typescript
// Alert notification configuration
const notificationChannels = {
  slack: {
    webhook: process.env.SLACK_WEBHOOK_URL,
    channels: {
      critical: '#alerts-critical',
      warning: '#alerts-warning',
      info: '#alerts-info'
    }
  },
  
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    recipients: {
      critical: ['oncall@company.com'],
      warning: ['devops@company.com'],
      info: ['monitoring@company.com']
    }
  },
  
  pagerduty: {
    integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
    escalationPolicy: 'default'
  }
};
```

## Performance Monitoring

### Web Vitals Tracking
```typescript
// Client-side performance monitoring
export class WebVitalsMonitor {
  static init() {
    // Core Web Vitals
    getCLS(this.sendToAnalytics);
    getFID(this.sendToAnalytics);
    getFCP(this.sendToAnalytics);
    getLCP(this.sendToAnalytics);
    getTTFB(this.sendToAnalytics);
    
    // Custom metrics
    this.trackCustomMetrics();
  }
  
  private static sendToAnalytics(metric: any) {
    // Send to analytics service
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        timestamp: Date.now()
      })
    });
  }
  
  private static trackCustomMetrics() {
    // Track bundle size
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.sendToAnalytics({
        name: 'bundle_size',
        value: navigation.transferSize,
        id: 'bundle_size'
      });
    }
  }
}
```

### Database Performance Monitoring
```typescript
// Database query monitoring
export class DatabaseMonitor {
  static async monitorQuery<T>(
    queryName: string,
    query: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await query();
      const duration = Date.now() - startTime;
      
      // Log slow queries
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      }
      
      // Record metrics
      MetricsCollector.dbQueryDuration.observe(
        { query: queryName },
        duration / 1000
      );
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Record error metrics
      MetricsCollector.dbQueryErrors.inc({ query: queryName });
      
      throw error;
    }
  }
}
```

## Dashboard Configuration

### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "Diet Planner Game - Application Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(api_response_time_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_users_count",
            "legendFormat": "Active Users"
          }
        ]
      }
    ]
  }
}
```

## Health Checks

### Application Health Endpoints
```typescript
// Health check implementation
export class HealthCheckService {
  static async getHealthStatus(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalAPIs(),
      this.checkDiskSpace(),
      this.checkMemoryUsage()
    ]);
    
    const results = checks.map((check, index) => ({
      name: ['database', 'redis', 'apis', 'disk', 'memory'][index],
      status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
      details: check.status === 'fulfilled' ? check.value : check.reason
    }));
    
    const overallStatus = results.every(r => r.status === 'healthy') 
      ? 'healthy' 
      : 'unhealthy';
    
    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: results
    };
  }
  
  private static async checkDatabase(): Promise<boolean> {
    // Database connectivity check
    return true;
  }
  
  private static async checkRedis(): Promise<boolean> {
    // Redis connectivity check
    return true;
  }
  
  private static async checkExternalAPIs(): Promise<boolean> {
    // External API availability check
    return true;
  }
  
  private static async checkDiskSpace(): Promise<boolean> {
    // Disk space check
    return true;
  }
  
  private static async checkMemoryUsage(): Promise<boolean> {
    // Memory usage check
    return true;
  }
}
```

This monitoring architecture provides comprehensive observability for the Diet Planner Game application, enabling proactive issue detection, performance optimization, and business intelligence insights.
