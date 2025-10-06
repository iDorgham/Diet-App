# Monitoring Architecture Specification

## Overview
The Monitoring Architecture provides comprehensive observability, logging, metrics, and alerting capabilities for the Diet Planner Game application to ensure system health, performance, and reliability.

## EARS Requirements

### Epic Requirements
- **EPIC-MA-001**: The system SHALL provide comprehensive monitoring and observability across all components
- **EPIC-MA-002**: The system SHALL implement real-time alerting and notification systems
- **EPIC-MA-003**: The system SHALL ensure system health and performance monitoring

### Feature Requirements
- **FEAT-MA-001**: The system SHALL implement centralized logging for all application components
- **FEAT-MA-002**: The system SHALL provide metrics collection and visualization
- **FEAT-MA-003**: The system SHALL implement distributed tracing for request tracking
- **FEAT-MA-004**: The system SHALL provide alerting and notification capabilities

### User Story Requirements
- **US-MA-001**: As a system administrator, I want to monitor system health so that I can ensure optimal performance
- **US-MA-002**: As a developer, I want to track application metrics so that I can identify performance issues
- **US-MA-003**: As an operations team, I want to receive alerts so that I can respond to issues quickly

### Acceptance Criteria
- **AC-MA-001**: Given a system event, when it occurs, then it SHALL be logged and monitored
- **AC-MA-002**: Given a performance threshold is exceeded, when the system detects it, then an alert SHALL be triggered
- **AC-MA-003**: Given a system failure, when it occurs, then the system SHALL provide detailed diagnostic information

## Architecture Overview

### 1. Monitoring Stack
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Application   │    │   Infrastructure│    │   External      │
│   Monitoring    │    │   Monitoring    │    │   Services      │
│                 │    │                 │    │                 │
│ - Logs          │    │ - System        │    │ - CDN           │
│ - Metrics       │    │ - Network       │    │ - Database      │
│ - Traces        │    │ - Storage       │    │ - APIs          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Monitoring    │
                    │   Platform      │
                    │                 │
                    │ - ELK Stack     │
                    │ - Prometheus    │
                    │ - Grafana       │
                    │ - Jaeger        │
                    └─────────────────┘
```

### 2. Data Flow
1. **Collection**: Collect logs, metrics, and traces from all components
2. **Processing**: Process and enrich monitoring data
3. **Storage**: Store data in appropriate systems
4. **Analysis**: Analyze data for insights and anomalies
5. **Alerting**: Trigger alerts based on thresholds and patterns
6. **Visualization**: Display data in dashboards and reports

## Logging System

### 1. Centralized Logging
```typescript
// Logging service
class LoggingService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
      ]
    });
  }

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error, meta?: any): void {
    this.logger.error(message, { error: error?.stack, ...meta });
  }

  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: any): void {
    this.logger.debug(message, meta);
  }

  // Structured logging for specific events
  logUserAction(userId: string, action: string, data: any): void {
    this.info('User action', {
      userId,
      action,
      data,
      timestamp: new Date().toISOString(),
      service: 'diet-game-api'
    });
  }

  logAPICall(method: string, path: string, statusCode: number, duration: number): void {
    this.info('API call', {
      method,
      path,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
      service: 'diet-game-api'
    });
  }

  logDatabaseQuery(query: string, duration: number, rowsAffected: number): void {
    this.info('Database query', {
      query: query.substring(0, 100), // Truncate for security
      duration,
      rowsAffected,
      timestamp: new Date().toISOString(),
      service: 'diet-game-db'
    });
  }
}

// Usage in application
const logger = new LoggingService();

// In API routes
app.get('/api/users/:id', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const user = await userService.getUser(req.params.id);
    const duration = Date.now() - startTime;
    
    logger.logAPICall('GET', req.path, 200, duration);
    res.json(user);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Failed to get user', error, { userId: req.params.id });
    logger.logAPICall('GET', req.path, 500, duration);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### 2. Log Aggregation
```yaml
# Docker Compose for ELK Stack
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  filebeat:
    image: docker.elastic.co/beats/filebeat:8.8.0
    volumes:
      - ./filebeat.yml:/usr/share/filebeat/filebeat.yml
      - /var/log:/var/log:ro
    depends_on:
      - logstash

volumes:
  elasticsearch_data:
```

## Metrics Collection

### 1. Application Metrics
```typescript
// Metrics service
import { register, Counter, Histogram, Gauge } from 'prom-client';

class MetricsService {
  private httpRequestDuration: Histogram<string>;
  private httpRequestTotal: Counter<string>;
  private activeUsers: Gauge<string>;
  private databaseConnections: Gauge<string>;

  constructor() {
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    });

    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    this.activeUsers = new Gauge({
      name: 'active_users_total',
      help: 'Total number of active users',
      labelNames: ['time_period']
    });

    this.databaseConnections = new Gauge({
      name: 'database_connections_active',
      help: 'Number of active database connections'
    });

    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.httpRequestTotal);
    register.registerMetric(this.activeUsers);
    register.registerMetric(this.databaseConnections);
  }

  recordHTTPRequest(method: string, route: string, statusCode: number, duration: number): void {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration / 1000);
    
    this.httpRequestTotal
      .labels(method, route, statusCode.toString())
      .inc();
  }

  updateActiveUsers(count: number, timePeriod: string = 'current'): void {
    this.activeUsers.labels(timePeriod).set(count);
  }

  updateDatabaseConnections(count: number): void {
    this.databaseConnections.set(count);
  }

  getMetrics(): Promise<string> {
    return register.metrics();
  }
}

// Usage in application
const metrics = new MetricsService();

// Middleware for HTTP metrics
app.use((req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    metrics.recordHTTPRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
  });
  
  next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  const metricsData = await metrics.getMetrics();
  res.set('Content-Type', 'text/plain');
  res.send(metricsData);
});
```

### 2. Business Metrics
```typescript
// Business metrics service
class BusinessMetricsService {
  private mealLogsTotal: Counter<string>;
  private userRegistrations: Counter<string>;
  private goalCompletions: Counter<string>;
  private achievementUnlocks: Counter<string>;

  constructor() {
    this.mealLogsTotal = new Counter({
      name: 'meal_logs_total',
      help: 'Total number of meal logs',
      labelNames: ['meal_type', 'user_segment']
    });

    this.userRegistrations = new Counter({
      name: 'user_registrations_total',
      help: 'Total number of user registrations',
      labelNames: ['source', 'user_type']
    });

    this.goalCompletions = new Counter({
      name: 'goal_completions_total',
      help: 'Total number of goal completions',
      labelNames: ['goal_type', 'user_segment']
    });

    this.achievementUnlocks = new Counter({
      name: 'achievement_unlocks_total',
      help: 'Total number of achievement unlocks',
      labelNames: ['achievement_type', 'user_segment']
    });
  }

  recordMealLog(mealType: string, userSegment: string): void {
    this.mealLogsTotal.labels(mealType, userSegment).inc();
  }

  recordUserRegistration(source: string, userType: string): void {
    this.userRegistrations.labels(source, userType).inc();
  }

  recordGoalCompletion(goalType: string, userSegment: string): void {
    this.goalCompletions.labels(goalType, userSegment).inc();
  }

  recordAchievementUnlock(achievementType: string, userSegment: string): void {
    this.achievementUnlocks.labels(achievementType, userSegment).inc();
  }
}
```

## Distributed Tracing

### 1. Jaeger Integration
```typescript
// Tracing service
import { initTracer } from 'jaeger-client';

class TracingService {
  private tracer: any;

  constructor() {
    const config = {
      serviceName: 'diet-game-api',
      sampler: {
        type: 'const',
        param: 1,
      },
      reporter: {
        logSpans: true,
        agentHost: process.env.JAEGER_AGENT_HOST || 'localhost',
        agentPort: process.env.JAEGER_AGENT_PORT || 6832,
      },
    };

    this.tracer = initTracer(config);
  }

  startSpan(name: string, parentSpan?: any): any {
    const span = this.tracer.startSpan(name, {
      childOf: parentSpan,
    });
    return span;
  }

  finishSpan(span: any, tags?: any): void {
    if (tags) {
      Object.keys(tags).forEach(key => {
        span.setTag(key, tags[key]);
      });
    }
    span.finish();
  }

  // Express middleware for tracing
  middleware() {
    return (req: any, res: any, next: any) => {
      const span = this.startSpan(`${req.method} ${req.path}`);
      
      req.span = span;
      req.tracer = this.tracer;
      
      res.on('finish', () => {
        this.finishSpan(span, {
          'http.method': req.method,
          'http.url': req.url,
          'http.status_code': res.statusCode,
        });
      });
      
      next();
    };
  }
}

// Usage in application
const tracing = new TracingService();
app.use(tracing.middleware());

// In service methods
class UserService {
  async getUser(userId: string, parentSpan?: any): Promise<User> {
    const span = tracing.startSpan('getUser', parentSpan);
    
    try {
      span.setTag('user.id', userId);
      
      const user = await this.database.query('SELECT * FROM users WHERE id = $1', [userId]);
      
      span.setTag('user.found', user.length > 0);
      tracing.finishSpan(span);
      
      return user[0];
    } catch (error) {
      span.setTag('error', true);
      span.setTag('error.message', error.message);
      tracing.finishSpan(span);
      throw error;
    }
  }
}
```

## Alerting System

### 1. Alert Rules
```yaml
# Prometheus alert rules
groups:
  - name: diet-game-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: DatabaseConnectionsHigh
        expr: database_connections_active > 80
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"
          description: "Database connections: {{ $value }}"

      - alert: LowDiskSpace
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
          description: "Disk space is {{ $value }}% available"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Service {{ $labels.instance }} is down"
```

### 2. Alert Manager Configuration
```yaml
# Alert Manager configuration
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@dietgame.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    webhook_configs:
      - url: 'http://localhost:5001/webhook'
        send_resolved: true

  - name: 'email'
    email_configs:
      - to: 'admin@dietgame.com'
        subject: 'Diet Game Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}

  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        title: 'Diet Game Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

## Dashboard and Visualization

### 1. Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Diet Game Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status_code=~\"5..\"}[5m])",
            "legendFormat": "Error rate"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_users_total",
            "legendFormat": "Active Users"
          }
        ]
      }
    ]
  }
}
```

## Health Checks

### 1. Application Health
```typescript
// Health check service
class HealthCheckService {
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalAPIs(),
      this.checkDiskSpace(),
      this.checkMemory()
    ]);

    const overallStatus = checks.every(check => check.status === 'healthy') 
      ? 'healthy' 
      : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks
    };
  }

  private async checkDatabase(): Promise<HealthCheck> {
    try {
      await this.database.query('SELECT 1');
      return {
        name: 'database',
        status: 'healthy',
        message: 'Database connection successful'
      };
    } catch (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        message: `Database connection failed: ${error.message}`
      };
    }
  }

  private async checkRedis(): Promise<HealthCheck> {
    try {
      await this.redis.ping();
      return {
        name: 'redis',
        status: 'healthy',
        message: 'Redis connection successful'
      };
    } catch (error) {
      return {
        name: 'redis',
        status: 'unhealthy',
        message: `Redis connection failed: ${error.message}`
      };
    }
  }

  private async checkExternalAPIs(): Promise<HealthCheck> {
    try {
      const response = await fetch('https://api.external-service.com/health');
      if (response.ok) {
        return {
          name: 'external_apis',
          status: 'healthy',
          message: 'External APIs accessible'
        };
      } else {
        return {
          name: 'external_apis',
          status: 'unhealthy',
          message: `External APIs returned ${response.status}`
        };
      }
    } catch (error) {
      return {
        name: 'external_apis',
        status: 'unhealthy',
        message: `External APIs check failed: ${error.message}`
      };
    }
  }

  private async checkDiskSpace(): Promise<HealthCheck> {
    try {
      const stats = await fs.statvfs('/');
      const freeSpace = (stats.bavail * stats.frsize) / (1024 * 1024 * 1024); // GB
      
      if (freeSpace > 1) {
        return {
          name: 'disk_space',
          status: 'healthy',
          message: `${freeSpace.toFixed(2)} GB free space available`
        };
      } else {
        return {
          name: 'disk_space',
          status: 'unhealthy',
          message: `Low disk space: ${freeSpace.toFixed(2)} GB available`
        };
      }
    } catch (error) {
      return {
        name: 'disk_space',
        status: 'unhealthy',
        message: `Disk space check failed: ${error.message}`
      };
    }
  }

  private async checkMemory(): Promise<HealthCheck> {
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = memUsage.heapUsed / 1024 / 1024;
      
      if (memUsageMB < 500) {
        return {
          name: 'memory',
          status: 'healthy',
          message: `${memUsageMB.toFixed(2)} MB memory used`
        };
      } else {
        return {
          name: 'memory',
          status: 'unhealthy',
          message: `High memory usage: ${memUsageMB.toFixed(2)} MB`
        };
      }
    } catch (error) {
      return {
        name: 'memory',
        status: 'unhealthy',
        message: `Memory check failed: ${error.message}`
      };
    }
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  const healthCheck = new HealthCheckService();
  const health = await healthCheck.checkHealth();
  
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## Testing Strategy

### 1. Monitoring Tests
```typescript
describe('Monitoring System', () => {
  it('should log API requests correctly', () => {
    const logger = new LoggingService();
    const logSpy = jest.spyOn(logger, 'logAPICall');
    
    logger.logAPICall('GET', '/api/users', 200, 150);
    
    expect(logSpy).toHaveBeenCalledWith('GET', '/api/users', 200, 150);
  });

  it('should record metrics correctly', () => {
    const metrics = new MetricsService();
    
    metrics.recordHTTPRequest('GET', '/api/users', 200, 150);
    
    // Verify metrics were recorded
    expect(metrics.httpRequestTotal).toBeDefined();
  });

  it('should perform health checks', async () => {
    const healthCheck = new HealthCheckService();
    const health = await healthCheck.checkHealth();
    
    expect(health.status).toBeDefined();
    expect(health.checks).toBeDefined();
    expect(health.timestamp).toBeDefined();
  });
});
```

## Future Enhancements

### 1. Advanced Features
- **AI-Powered Anomaly Detection**: Machine learning for anomaly detection
- **Predictive Alerting**: Predict issues before they occur
- **Custom Dashboards**: User-configurable monitoring dashboards
- **Integration**: Integration with external monitoring tools

### 2. Performance Optimizations
- **Sampling**: Intelligent sampling for high-volume data
- **Compression**: Data compression for storage efficiency
- **Caching**: Caching for frequently accessed metrics
- **Batch Processing**: Efficient batch processing of monitoring data

