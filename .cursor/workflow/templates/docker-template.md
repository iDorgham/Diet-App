# Docker Configuration Template

## Overview
This template provides a standardized structure for creating Docker configurations in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{SERVICE_NAME}}` - Name of the service (e.g., `api`, `web`, `worker`)
- `{{PORT}}` - Port number for the service
- `{{VERSION}}` - Version of the application
- `{{ENVIRONMENT}}` - Environment (e.g., `development`, `staging`, `production`)

## Dockerfile Template

```dockerfile
# Dockerfile

# ============================================================================
# MULTI-STAGE BUILD FOR {{SERVICE_NAME}} SERVICE
# ============================================================================

# Stage 1: Base Image
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# ============================================================================
# Stage 2: Dependencies
# ============================================================================

FROM base AS dependencies

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# ============================================================================
# Stage 3: Build
# ============================================================================

FROM base AS build

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ============================================================================
# Stage 4: Production
# ============================================================================

FROM base AS production

# Set environment variables
ENV NODE_ENV=production
ENV PORT={{PORT}}
ENV APP_NAME={{SERVICE_NAME}}

# Copy built application from build stage
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Copy additional files
COPY --chown=nodejs:nodejs docker/entrypoint.sh ./entrypoint.sh
COPY --chown=nodejs:nodejs docker/healthcheck.sh ./healthcheck.sh

# Make scripts executable
RUN chmod +x ./entrypoint.sh ./healthcheck.sh

# Create logs directory
RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE {{PORT}}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD ./healthcheck.sh

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["./entrypoint.sh"]
```

## Docker Compose Template

```yaml
# docker-compose.yml

version: '3.8'

services:
  # ============================================================================
  # {{SERVICE_NAME}} Service
  # ============================================================================
  {{service_name}}:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: {{service_name}}
    restart: unless-stopped
    ports:
      - "${APP_PORT:-{{PORT}}}:{{PORT}}"
    environment:
      - NODE_ENV=${NODE_ENV:-production}
      - APP_NAME={{SERVICE_NAME}}
      - APP_PORT={{PORT}}
      - APP_HOST=0.0.0.0
      - APP_URL=${APP_URL:-http://localhost:{{PORT}}}
      
      # Database Configuration
      - DB_HOST=${DB_HOST:-postgres}
      - DB_PORT=${DB_PORT:-5432}
      - DB_NAME=${DB_NAME:-diet_game}
      - DB_USER=${DB_USER:-postgres}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_SSL=${DB_SSL:-false}
      
      # Redis Configuration
      - REDIS_HOST=${REDIS_HOST:-redis}
      - REDIS_PORT=${REDIS_PORT:-6379}
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - REDIS_DB=${REDIS_DB:-0}
      
      # Authentication
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN:-24h}
      - JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN:-7d}
      
      # External Services
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION:-us-east-1}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
      
      # Monitoring
      - SENTRY_DSN=${SENTRY_DSN}
      - NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
      
      # Feature Flags
      - FEATURE_AI_COACH=${FEATURE_AI_COACH:-true}
      - FEATURE_SOCIAL_SHARING=${FEATURE_SOCIAL_SHARING:-true}
      - FEATURE_PREMIUM_FEATURES=${FEATURE_PREMIUM_FEATURES:-false}
      
      # Logging
      - LOG_LEVEL=${LOG_LEVEL:-info}
      - LOG_FORMAT=${LOG_FORMAT:-json}
      
      # CORS
      - CORS_ORIGIN=${CORS_ORIGIN:-http://localhost:3000}
      - CORS_CREDENTIALS=${CORS_CREDENTIALS:-true}
      
      # Rate Limiting
      - RATE_LIMIT_WINDOW_MS=${RATE_LIMIT_WINDOW_MS:-900000}
      - RATE_LIMIT_MAX_REQUESTS=${RATE_LIMIT_MAX_REQUESTS:-100}
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    networks:
      - diet-game-network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "./healthcheck.sh"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # ============================================================================
  # PostgreSQL Database
  # ============================================================================
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    restart: unless-stopped
    ports:
      - "${DB_PORT:-5432}:5432"
    environment:
      - POSTGRES_DB=${DB_NAME:-diet_game}
      - POSTGRES_USER=${DB_USER:-postgres}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
      - ./docker/postgres/postgresql.conf:/etc/postgresql/postgresql.conf
    networks:
      - diet-game-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-diet_game}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  # ============================================================================
  # Redis Cache
  # ============================================================================
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      - "${REDIS_PORT:-6379}:6379"
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - diet-game-network
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'

  # ============================================================================
  # Nginx Reverse Proxy
  # ============================================================================
  nginx:
    image: nginx:alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/conf.d:/etc/nginx/conf.d
      - ./docker/nginx/ssl:/etc/nginx/ssl
      - ./logs/nginx:/var/log/nginx
    networks:
      - diet-game-network
    depends_on:
      - {{service_name}}
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 128M
          cpus: '0.25'
        reservations:
          memory: 64M
          cpus: '0.1'

  # ============================================================================
  # Monitoring Services
  # ============================================================================
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - diet-game-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
      - GF_USERS_ALLOW_SIGN_UP=false
    volumes:
      - grafana_data:/var/lib/grafana
      - ./docker/grafana/provisioning:/etc/grafana/provisioning
      - ./docker/grafana/dashboards:/var/lib/grafana/dashboards
    networks:
      - diet-game-network
    depends_on:
      - prometheus
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'

# ============================================================================
# Networks
# ============================================================================
networks:
  diet-game-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# ============================================================================
# Volumes
# ============================================================================
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
```

## Docker Compose Override Files

### Development Override (docker-compose.override.yml)
```yaml
# docker-compose.override.yml

version: '3.8'

services:
  {{service_name}}:
    build:
      target: development
    environment:
      - NODE_ENV=development
      - LOG_LEVEL=debug
      - FEATURE_DEBUG_MODE=true
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    ports:
      - "{{PORT}}:{{PORT}}"
      - "9229:9229"  # Debug port

  postgres:
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=diet_game_dev

  redis:
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes

  nginx:
    ports:
      - "8080:80"
```

### Production Override (docker-compose.prod.yml)
```yaml
# docker-compose.prod.yml

version: '3.8'

services:
  {{service_name}}:
    build:
      target: production
    environment:
      - NODE_ENV=production
      - LOG_LEVEL=warn
      - FEATURE_DEBUG_MODE=false
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s

  postgres:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '2.0'
        reservations:
          memory: 1G
          cpus: '1.0'

  redis:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  nginx:
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'
```

## Docker Scripts

### Entrypoint Script (docker/entrypoint.sh)
```bash
#!/bin/bash
# docker/entrypoint.sh

set -e

echo "Starting {{SERVICE_NAME}} service..."

# Wait for dependencies
echo "Waiting for dependencies..."
./scripts/wait-for-dependencies.sh

# Run database migrations
echo "Running database migrations..."
npm run migrate

# Start the application
echo "Starting application..."
exec npm start
```

### Health Check Script (docker/healthcheck.sh)
```bash
#!/bin/bash
# docker/healthcheck.sh

set -e

# Check if the application is responding
curl -f http://localhost:{{PORT}}/health || exit 1

# Check if the application is healthy
curl -f http://localhost:{{PORT}}/health/ready || exit 1

exit 0
```

### Wait for Dependencies Script (scripts/wait-for-dependencies.sh)
```bash
#!/bin/bash
# scripts/wait-for-dependencies.sh

set -e

echo "Waiting for PostgreSQL..."
while ! nc -z ${DB_HOST:-postgres} ${DB_PORT:-5432}; do
  sleep 1
done
echo "PostgreSQL is ready!"

echo "Waiting for Redis..."
while ! nc -z ${REDIS_HOST:-redis} ${REDIS_PORT:-6379}; do
  sleep 1
done
echo "Redis is ready!"

echo "All dependencies are ready!"
```

## Nginx Configuration

### Main Configuration (docker/nginx/nginx.conf)
```nginx
# docker/nginx/nginx.conf

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Include server configurations
    include /etc/nginx/conf.d/*.conf;
}
```

### Server Configuration (docker/nginx/conf.d/default.conf)
```nginx
# docker/nginx/conf.d/default.conf

upstream {{service_name}} {
    server {{service_name}}:{{PORT}};
}

server {
    listen 80;
    server_name localhost;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # API routes
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://{{service_name}};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check
    location /health {
        proxy_pass http://{{service_name}}/health;
        access_log off;
    }

    # Static files
    location /static/ {
        alias /app/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Default route
    location / {
        proxy_pass http://{{service_name}};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker Build Scripts

### Build Script (scripts/build.sh)
```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "Building {{SERVICE_NAME}} Docker image..."

# Build the image
docker build -t {{service_name}}:latest .

# Tag with version if provided
if [ ! -z "$1" ]; then
    docker tag {{service_name}}:latest {{service_name}}:$1
    echo "Tagged image with version: $1"
fi

echo "Build complete!"
```

### Deploy Script (scripts/deploy.sh)
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=${1:-production}
VERSION=${2:-latest}

echo "Deploying {{SERVICE_NAME}} to $ENVIRONMENT environment..."

# Pull latest images
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml pull

# Stop existing containers
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml down

# Start new containers
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml up -d

# Wait for health checks
echo "Waiting for services to be healthy..."
sleep 30

# Check health
docker-compose -f docker-compose.yml -f docker-compose.$ENVIRONMENT.yml ps

echo "Deployment complete!"
```

## Best Practices

1. **Multi-stage Builds**: Use multi-stage builds to reduce image size
2. **Non-root User**: Run containers as non-root user for security
3. **Health Checks**: Implement proper health checks for all services
4. **Resource Limits**: Set appropriate resource limits for containers
5. **Secrets Management**: Use Docker secrets for sensitive data
6. **Networking**: Use custom networks for service isolation
7. **Volumes**: Use named volumes for persistent data
8. **Logging**: Implement proper logging and log rotation
9. **Monitoring**: Include monitoring and observability tools
10. **Security**: Follow security best practices for containerized applications

## Related Documentation

- [Environment Variables Template](./env-template.md)
- [Configuration Template](./config-template.md)
- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Security Architecture](../architecture/security-architecture.md)
