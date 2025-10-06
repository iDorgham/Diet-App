# Environment Variables Template

## Overview
This template provides a standardized structure for environment variable configuration in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{ENVIRONMENT}}` - Environment name (e.g., `development`, `staging`, `production`)
- `{{SERVICE_NAME}}` - Name of the service
- `{{DEFAULT_VALUE}}` - Default value for the variable

## Environment Files Structure

### Development Environment (.env.development)
```bash
# ============================================================================
# DIET GAME - DEVELOPMENT ENVIRONMENT
# ============================================================================
# This file contains environment variables for the development environment.
# Copy this file to .env.local and customize as needed.

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

# Application settings
NODE_ENV=development
APP_NAME=Diet Game
APP_VERSION=1.0.0
APP_PORT=3000
APP_HOST=localhost
APP_URL=http://localhost:3000

# API Configuration
API_VERSION=v1
API_BASE_URL=http://localhost:3000/api/v1
API_RATE_LIMIT=1000
API_RATE_LIMIT_WINDOW=3600000

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diet_game_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_ACQUIRE_TIMEOUT=30000
DB_POOL_CREATE_TIMEOUT=30000
DB_POOL_DESTROY_TIMEOUT=5000
DB_POOL_IDLE_TIMEOUT=30000

# Redis Cache
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
REDIS_POOL_MIN=2
REDIS_POOL_MAX=10

# ============================================================================
# AUTHENTICATION & SECURITY
# ============================================================================

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-development
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=diet-game-dev
JWT_AUDIENCE=diet-game-users

# Password Hashing
BCRYPT_ROUNDS=10
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=true

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-for-development
SESSION_COOKIE_NAME=diet_game_session
SESSION_COOKIE_MAX_AGE=86400000
SESSION_COOKIE_SECURE=false
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=lax

# ============================================================================
# EXTERNAL SERVICES
# ============================================================================

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@dietgame.dev
SENDGRID_FROM_NAME=Diet Game

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=diet-game-dev
AWS_S3_ENDPOINT=

# AI Service (OpenAI)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Payment Gateway (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# ============================================================================
# MONITORING & LOGGING
# ============================================================================

# Logging Configuration
LOG_LEVEL=debug
LOG_FORMAT=json
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5
LOG_DATE_PATTERN=YYYY-MM-DD

# Application Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=development
SENTRY_SAMPLE_RATE=1.0

# Performance Monitoring
NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
NEW_RELIC_APP_NAME=Diet Game Dev

# ============================================================================
# FEATURE FLAGS
# ============================================================================

# Feature Toggles
FEATURE_AI_COACH=true
FEATURE_SOCIAL_SHARING=true
FEATURE_PREMIUM_FEATURES=false
FEATURE_ANALYTICS=true
FEATURE_DEBUG_MODE=true

# ============================================================================
# DEVELOPMENT TOOLS
# ============================================================================

# Hot Reload
HOT_RELOAD=true
HOT_RELOAD_PORT=3001

# Debug Configuration
DEBUG=diet-game:*
DEBUG_COLORS=true
DEBUG_DEPTH=2

# Test Configuration
TEST_DB_NAME=diet_game_test
TEST_REDIS_DB=1
TEST_TIMEOUT=30000

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization,X-Requested-With

# ============================================================================
# CACHE CONFIGURATION
# ============================================================================

CACHE_TTL=3600
CACHE_MAX_SIZE=1000
CACHE_CHECK_PERIOD=600

# ============================================================================
# RATE LIMITING
# ============================================================================

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
RATE_LIMIT_SKIP_FAILED_REQUESTS=false
```

### Staging Environment (.env.staging)
```bash
# ============================================================================
# DIET GAME - STAGING ENVIRONMENT
# ============================================================================
# This file contains environment variables for the staging environment.

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

NODE_ENV=staging
APP_NAME=Diet Game
APP_VERSION=1.0.0
APP_PORT=3000
APP_HOST=0.0.0.0
APP_URL=https://staging.dietgame.com

# API Configuration
API_VERSION=v1
API_BASE_URL=https://staging.dietgame.com/api/v1
API_RATE_LIMIT=500
API_RATE_LIMIT_WINDOW=3600000

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# PostgreSQL Database
DB_HOST=staging-db.dietgame.com
DB_PORT=5432
DB_NAME=diet_game_staging
DB_USER=diet_game_staging
DB_PASSWORD=your-staging-db-password
DB_SSL=true
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_POOL_ACQUIRE_TIMEOUT=30000
DB_POOL_CREATE_TIMEOUT=30000
DB_POOL_DESTROY_TIMEOUT=5000
DB_POOL_IDLE_TIMEOUT=30000

# Redis Cache
REDIS_HOST=staging-redis.dietgame.com
REDIS_PORT=6379
REDIS_PASSWORD=your-staging-redis-password
REDIS_DB=0
REDIS_TTL=1800
REDIS_POOL_MIN=5
REDIS_POOL_MAX=20

# ============================================================================
# AUTHENTICATION & SECURITY
# ============================================================================

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-staging
JWT_EXPIRES_IN=12h
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=diet-game-staging
JWT_AUDIENCE=diet-game-users

# Password Hashing
BCRYPT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=true

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-for-staging
SESSION_COOKIE_NAME=diet_game_session
SESSION_COOKIE_MAX_AGE=43200000
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict

# ============================================================================
# EXTERNAL SERVICES
# ============================================================================

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@staging.dietgame.com
SENDGRID_FROM_NAME=Diet Game

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=diet-game-staging
AWS_S3_ENDPOINT=

# AI Service (OpenAI)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Payment Gateway (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# ============================================================================
# MONITORING & LOGGING
# ============================================================================

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=logs/app.log
LOG_MAX_SIZE=50m
LOG_MAX_FILES=10
LOG_DATE_PATTERN=YYYY-MM-DD

# Application Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=staging
SENTRY_SAMPLE_RATE=0.5

# Performance Monitoring
NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
NEW_RELIC_APP_NAME=Diet Game Staging

# ============================================================================
# FEATURE FLAGS
# ============================================================================

# Feature Toggles
FEATURE_AI_COACH=true
FEATURE_SOCIAL_SHARING=true
FEATURE_PREMIUM_FEATURES=true
FEATURE_ANALYTICS=true
FEATURE_DEBUG_MODE=false

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

CORS_ORIGIN=https://staging.dietgame.com,https://admin-staging.dietgame.com
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization,X-Requested-With

# ============================================================================
# CACHE CONFIGURATION
# ============================================================================

CACHE_TTL=1800
CACHE_MAX_SIZE=5000
CACHE_CHECK_PERIOD=300

# ============================================================================
# RATE LIMITING
# ============================================================================

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
RATE_LIMIT_SKIP_FAILED_REQUESTS=false
```

### Production Environment (.env.production)
```bash
# ============================================================================
# DIET GAME - PRODUCTION ENVIRONMENT
# ============================================================================
# This file contains environment variables for the production environment.
# NEVER commit this file to version control.

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

NODE_ENV=production
APP_NAME=Diet Game
APP_VERSION=1.0.0
APP_PORT=3000
APP_HOST=0.0.0.0
APP_URL=https://dietgame.com

# API Configuration
API_VERSION=v1
API_BASE_URL=https://dietgame.com/api/v1
API_RATE_LIMIT=1000
API_RATE_LIMIT_WINDOW=3600000

# ============================================================================
# DATABASE CONFIGURATION
# ============================================================================

# PostgreSQL Database
DB_HOST=prod-db.dietgame.com
DB_PORT=5432
DB_NAME=diet_game_prod
DB_USER=diet_game_prod
DB_PASSWORD=your-production-db-password
DB_SSL=true
DB_POOL_MIN=10
DB_POOL_MAX=50
DB_POOL_ACQUIRE_TIMEOUT=30000
DB_POOL_CREATE_TIMEOUT=30000
DB_POOL_DESTROY_TIMEOUT=5000
DB_POOL_IDLE_TIMEOUT=30000

# Redis Cache
REDIS_HOST=prod-redis.dietgame.com
REDIS_PORT=6379
REDIS_PASSWORD=your-production-redis-password
REDIS_DB=0
REDIS_TTL=3600
REDIS_POOL_MIN=10
REDIS_POOL_MAX=50

# ============================================================================
# AUTHENTICATION & SECURITY
# ============================================================================

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=diet-game-prod
JWT_AUDIENCE=diet-game-users

# Password Hashing
BCRYPT_ROUNDS=14
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SYMBOLS=true

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-for-production
SESSION_COOKIE_NAME=diet_game_session
SESSION_COOKIE_MAX_AGE=28800000
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict

# ============================================================================
# EXTERNAL SERVICES
# ============================================================================

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@dietgame.com
SENDGRID_FROM_NAME=Diet Game

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=diet-game-prod
AWS_S3_ENDPOINT=

# AI Service (OpenAI)
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=1000
OPENAI_TEMPERATURE=0.7

# Payment Gateway (Stripe)
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret

# ============================================================================
# MONITORING & LOGGING
# ============================================================================

# Logging Configuration
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_FILE=logs/app.log
LOG_MAX_SIZE=100m
LOG_MAX_FILES=20
LOG_DATE_PATTERN=YYYY-MM-DD

# Application Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=0.1

# Performance Monitoring
NEW_RELIC_LICENSE_KEY=your-newrelic-license-key
NEW_RELIC_APP_NAME=Diet Game

# ============================================================================
# FEATURE FLAGS
# ============================================================================

# Feature Toggles
FEATURE_AI_COACH=true
FEATURE_SOCIAL_SHARING=true
FEATURE_PREMIUM_FEATURES=true
FEATURE_ANALYTICS=true
FEATURE_DEBUG_MODE=false

# ============================================================================
# CORS CONFIGURATION
# ============================================================================

CORS_ORIGIN=https://dietgame.com,https://admin.dietgame.com
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_HEADERS=Content-Type,Authorization,X-Requested-With

# ============================================================================
# CACHE CONFIGURATION
# ============================================================================

CACHE_TTL=3600
CACHE_MAX_SIZE=10000
CACHE_CHECK_PERIOD=300

# ============================================================================
# RATE LIMITING
# ============================================================================

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS=false
RATE_LIMIT_SKIP_FAILED_REQUESTS=false
```

## Environment Variables Documentation

### Application Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `APP_NAME` | Application name | `Diet Game` | Yes |
| `APP_VERSION` | Application version | `1.0.0` | Yes |
| `APP_PORT` | Application port | `3000` | Yes |
| `APP_HOST` | Application host | `localhost` | Yes |
| `APP_URL` | Application URL | `http://localhost:3000` | Yes |

### Database Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_NAME` | Database name | `diet_game` | Yes |
| `DB_USER` | Database user | `postgres` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_SSL` | Enable SSL connection | `false` | No |
| `DB_POOL_MIN` | Minimum pool connections | `2` | No |
| `DB_POOL_MAX` | Maximum pool connections | `10` | No |

### Authentication Configuration
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | `10` | No |

### External Services
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SENDGRID_API_KEY` | SendGrid API key | - | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | - | No |
| `AWS_ACCESS_KEY_ID` | AWS access key | - | Yes |
| `OPENAI_API_KEY` | OpenAI API key | - | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | No |

## Environment Setup Script

```bash
#!/bin/bash
# scripts/setup-env.sh

set -e

echo "Setting up environment variables..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local file created"
    echo "📝 Please edit .env.local with your local configuration"
else
    echo "⚠️  .env.local file already exists"
fi

# Check for required environment variables
echo "Checking required environment variables..."

REQUIRED_VARS=(
    "JWT_SECRET"
    "DB_PASSWORD"
    "SENDGRID_API_KEY"
    "AWS_ACCESS_KEY_ID"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required environment variables are set"
else
    echo "❌ Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo "Please set these variables in your .env.local file"
    exit 1
fi

echo "Environment setup complete! 🎉"
```

## Environment Validation

```typescript
// src/config/env-validation.ts

import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  APP_NAME: z.string().default('Diet Game'),
  APP_VERSION: z.string().default('1.0.0'),
  APP_PORT: z.string().transform(Number).default('3000'),
  APP_HOST: z.string().default('localhost'),
  APP_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_NAME: z.string().default('diet_game'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().min(1, 'Database password is required'),
  DB_SSL: z.string().transform(val => val === 'true').default('false'),
  DB_POOL_MIN: z.string().transform(Number).default('2'),
  DB_POOL_MAX: z.string().transform(Number).default('10'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).default('0'),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.string().transform(Number).default('10'),

  // External Services
  SENDGRID_API_KEY: z.string().min(1, 'SendGrid API key is required'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS access key is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS secret key is required'),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string().min(1, 'S3 bucket name is required'),
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),

  // Feature Flags
  FEATURE_AI_COACH: z.string().transform(val => val === 'true').default('true'),
  FEATURE_SOCIAL_SHARING: z.string().transform(val => val === 'true').default('true'),
  FEATURE_PREMIUM_FEATURES: z.string().transform(val => val === 'true').default('false'),
  FEATURE_ANALYTICS: z.string().transform(val => val === 'true').default('true'),
  FEATURE_DEBUG_MODE: z.string().transform(val => val === 'true').default('false'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'text']).default('json'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.string().transform(val => val === 'true').default('true'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
};

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
```

## Best Practices

1. **Security**: Never commit sensitive environment variables to version control
2. **Validation**: Always validate environment variables on application startup
3. **Defaults**: Provide sensible defaults for non-sensitive variables
4. **Documentation**: Document all environment variables and their purposes
5. **Separation**: Use different environment files for different environments
6. **Secrets Management**: Use proper secrets management for production
7. **Type Safety**: Use TypeScript for environment variable type safety
8. **Testing**: Test environment variable validation and loading

## Related Documentation

- [Configuration Template](./config-template.md)
- [Docker Configuration Guide](../DEPLOYMENT_GUIDE.md#docker-configuration)
- [Kubernetes Configuration Guide](../DEPLOYMENT_GUIDE.md#kubernetes-configuration)
- [Security Best Practices](../architecture/security-architecture.md)
