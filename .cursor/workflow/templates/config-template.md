# Configuration Template

## Overview
This template provides a standardized structure for creating configuration files in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{CONFIG_NAME}}` - Name of the configuration (e.g., `Database`, `Redis`, `Email`)
- `{{SERVICE_NAME}}` - Name of the service being configured
- `{{ENVIRONMENT}}` - Environment (e.g., `development`, `staging`, `production`)
- `{{DEFAULT_VALUE}}` - Default value for the configuration

## Configuration File Structure

```typescript
// config/{{CONFIG_NAME}}.ts

import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

// ============================================================================
// CONFIGURATION SCHEMA
// ============================================================================

const {{CONFIG_NAME}}Schema = z.object({
  // Core configuration
  host: z.string().default('localhost'),
  port: z.number().int().min(1).max(65535).default({{DEFAULT_VALUE}}),
  timeout: z.number().int().min(1000).default(30000),
  
  // Authentication
  username: z.string().optional(),
  password: z.string().optional(),
  apiKey: z.string().optional(),
  
  // SSL/TLS configuration
  ssl: z.object({
    enabled: z.boolean().default(false),
    cert: z.string().optional(),
    key: z.string().optional(),
    ca: z.string().optional(),
    rejectUnauthorized: z.boolean().default(true)
  }).default({}),
  
  // Connection pooling
  pool: z.object({
    min: z.number().int().min(0).default(2),
    max: z.number().int().min(1).default(10),
    acquireTimeoutMillis: z.number().int().min(1000).default(30000),
    createTimeoutMillis: z.number().int().min(1000).default(30000),
    destroyTimeoutMillis: z.number().int().min(1000).default(5000),
    idleTimeoutMillis: z.number().int().min(1000).default(30000),
    reapIntervalMillis: z.number().int().min(1000).default(1000),
    createRetryIntervalMillis: z.number().int().min(1000).default(200)
  }).default({}),
  
  // Logging configuration
  logging: z.object({
    enabled: z.boolean().default(true),
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['json', 'text']).default('json'),
    file: z.string().optional(),
    maxSize: z.string().default('10m'),
    maxFiles: z.number().int().min(1).default(5)
  }).default({}),
  
  // Retry configuration
  retry: z.object({
    enabled: z.boolean().default(true),
    maxAttempts: z.number().int().min(1).default(3),
    baseDelay: z.number().int().min(100).default(1000),
    maxDelay: z.number().int().min(1000).default(10000),
    backoffFactor: z.number().min(1).default(2)
  }).default({}),
  
  // Environment-specific overrides
  environment: z.enum(['development', 'staging', 'production']).default('development')
});

// ============================================================================
// ENVIRONMENT VARIABLE MAPPING
// ============================================================================

const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  return {
    host: process.env.{{SERVICE_NAME}}_HOST,
    port: process.env.{{SERVICE_NAME}}_PORT ? parseInt(process.env.{{SERVICE_NAME}}_PORT) : undefined,
    timeout: process.env.{{SERVICE_NAME}}_TIMEOUT ? parseInt(process.env.{{SERVICE_NAME}}_TIMEOUT) : undefined,
    
    username: process.env.{{SERVICE_NAME}}_USERNAME,
    password: process.env.{{SERVICE_NAME}}_PASSWORD,
    apiKey: process.env.{{SERVICE_NAME}}_API_KEY,
    
    ssl: {
      enabled: process.env.{{SERVICE_NAME}}_SSL_ENABLED === 'true',
      cert: process.env.{{SERVICE_NAME}}_SSL_CERT,
      key: process.env.{{SERVICE_NAME}}_SSL_KEY,
      ca: process.env.{{SERVICE_NAME}}_SSL_CA,
      rejectUnauthorized: process.env.{{SERVICE_NAME}}_SSL_REJECT_UNAUTHORIZED !== 'false'
    },
    
    pool: {
      min: process.env.{{SERVICE_NAME}}_POOL_MIN ? parseInt(process.env.{{SERVICE_NAME}}_POOL_MIN) : undefined,
      max: process.env.{{SERVICE_NAME}}_POOL_MAX ? parseInt(process.env.{{SERVICE_NAME}}_POOL_MAX) : undefined,
      acquireTimeoutMillis: process.env.{{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT ? parseInt(process.env.{{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT) : undefined,
      createTimeoutMillis: process.env.{{SERVICE_NAME}}_POOL_CREATE_TIMEOUT ? parseInt(process.env.{{SERVICE_NAME}}_POOL_CREATE_TIMEOUT) : undefined,
      destroyTimeoutMillis: process.env.{{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT ? parseInt(process.env.{{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT) : undefined,
      idleTimeoutMillis: process.env.{{SERVICE_NAME}}_POOL_IDLE_TIMEOUT ? parseInt(process.env.{{SERVICE_NAME}}_POOL_IDLE_TIMEOUT) : undefined,
      reapIntervalMillis: process.env.{{SERVICE_NAME}}_POOL_REAP_INTERVAL ? parseInt(process.env.{{SERVICE_NAME}}_POOL_REAP_INTERVAL) : undefined,
      createRetryIntervalMillis: process.env.{{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL ? parseInt(process.env.{{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL) : undefined
    },
    
    logging: {
      enabled: process.env.{{SERVICE_NAME}}_LOGGING_ENABLED !== 'false',
      level: process.env.{{SERVICE_NAME}}_LOGGING_LEVEL as any,
      format: process.env.{{SERVICE_NAME}}_LOGGING_FORMAT as any,
      file: process.env.{{SERVICE_NAME}}_LOGGING_FILE,
      maxSize: process.env.{{SERVICE_NAME}}_LOGGING_MAX_SIZE,
      maxFiles: process.env.{{SERVICE_NAME}}_LOGGING_MAX_FILES ? parseInt(process.env.{{SERVICE_NAME}}_LOGGING_MAX_FILES) : undefined
    },
    
    retry: {
      enabled: process.env.{{SERVICE_NAME}}_RETRY_ENABLED !== 'false',
      maxAttempts: process.env.{{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS ? parseInt(process.env.{{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS) : undefined,
      baseDelay: process.env.{{SERVICE_NAME}}_RETRY_BASE_DELAY ? parseInt(process.env.{{SERVICE_NAME}}_RETRY_BASE_DELAY) : undefined,
      maxDelay: process.env.{{SERVICE_NAME}}_RETRY_MAX_DELAY ? parseInt(process.env.{{SERVICE_NAME}}_RETRY_MAX_DELAY) : undefined,
      backoffFactor: process.env.{{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR ? parseFloat(process.env.{{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR) : undefined
    },
    
    environment: env as any
  };
};

// ============================================================================
// CONFIGURATION VALIDATION AND EXPORT
// ============================================================================

const validateConfig = () => {
  try {
    const envConfig = getEnvironmentConfig();
    const validatedConfig = {{CONFIG_NAME}}Schema.parse(envConfig);
    
    // Additional validation logic
    if (validatedConfig.ssl.enabled && !validatedConfig.ssl.cert) {
      throw new Error('SSL certificate is required when SSL is enabled');
    }
    
    if (validatedConfig.pool.min > validatedConfig.pool.max) {
      throw new Error('Pool minimum cannot be greater than maximum');
    }
    
    return validatedConfig;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }
    throw error;
  }
};

// Export validated configuration
export const {{CONFIG_NAME}}Config = validateConfig();

// Export configuration type
export type {{CONFIG_NAME}}ConfigType = z.infer<typeof {{CONFIG_NAME}}Schema>;

// ============================================================================
// CONFIGURATION UTILITIES
// ============================================================================

export const {{CONFIG_NAME}}Utils = {
  /**
   * Get configuration for specific environment
   */
  getEnvironmentConfig: (env: string) => {
    const baseConfig = { ...{{CONFIG_NAME}}Config };
    
    switch (env) {
      case 'development':
        return {
          ...baseConfig,
          logging: { ...baseConfig.logging, level: 'debug' },
          ssl: { ...baseConfig.ssl, enabled: false }
        };
      
      case 'staging':
        return {
          ...baseConfig,
          logging: { ...baseConfig.logging, level: 'info' },
          ssl: { ...baseConfig.ssl, enabled: true }
        };
      
      case 'production':
        return {
          ...baseConfig,
          logging: { ...baseConfig.logging, level: 'warn' },
          ssl: { ...baseConfig.ssl, enabled: true, rejectUnauthorized: true },
          pool: { ...baseConfig.pool, max: 20 }
        };
      
      default:
        return baseConfig;
    }
  },
  
  /**
   * Check if configuration is valid
   */
  isValid: () => {
    try {
      validateConfig();
      return true;
    } catch {
      return false;
    }
  },
  
  /**
   * Get configuration summary (without sensitive data)
   */
  getSummary: () => {
    const { password, apiKey, ssl, ...safeConfig } = {{CONFIG_NAME}}Config;
    return {
      ...safeConfig,
      ssl: {
        enabled: ssl.enabled,
        rejectUnauthorized: ssl.rejectUnauthorized
      }
    };
  },
  
  /**
   * Reset configuration to defaults
   */
  reset: () => {
    const defaultConfig = {{CONFIG_NAME}}Schema.parse({});
    return defaultConfig;
  }
};

// ============================================================================
// CONFIGURATION WATCHER (Optional)
// ============================================================================

export class {{CONFIG_NAME}}Watcher {
  private watchers: Array<() => void> = [];
  private currentConfig: {{CONFIG_NAME}}ConfigType;
  
  constructor() {
    this.currentConfig = { ...{{CONFIG_NAME}}Config };
  }
  
  /**
   * Watch for configuration changes
   */
  watch(callback: (newConfig: {{CONFIG_NAME}}ConfigType) => void) {
    this.watchers.push(callback);
    
    return () => {
      const index = this.watchers.indexOf(callback);
      if (index > -1) {
        this.watchers.splice(index, 1);
      }
    };
  }
  
  /**
   * Reload configuration
   */
  reload() {
    try {
      const newConfig = validateConfig();
      const hasChanged = JSON.stringify(newConfig) !== JSON.stringify(this.currentConfig);
      
      if (hasChanged) {
        this.currentConfig = newConfig;
        this.watchers.forEach(callback => callback(newConfig));
      }
      
      return newConfig;
    } catch (error) {
      console.error('Failed to reload configuration:', error);
      throw error;
    }
  }
  
  /**
   * Get current configuration
   */
  getCurrentConfig() {
    return { ...this.currentConfig };
  }
}

// Export singleton instance
export const {{CONFIG_NAME}}WatcherInstance = new {{CONFIG_NAME}}Watcher();
```

## Environment Variables Template

```bash
# .env.example

# ============================================================================
# {{CONFIG_NAME}} CONFIGURATION
# ============================================================================

# Core settings
{{SERVICE_NAME}}_HOST=localhost
{{SERVICE_NAME}}_PORT={{DEFAULT_VALUE}}
{{SERVICE_NAME}}_TIMEOUT=30000

# Authentication
{{SERVICE_NAME}}_USERNAME=your_username
{{SERVICE_NAME}}_PASSWORD=your_password
{{SERVICE_NAME}}_API_KEY=your_api_key

# SSL/TLS Configuration
{{SERVICE_NAME}}_SSL_ENABLED=false
{{SERVICE_NAME}}_SSL_CERT=/path/to/cert.pem
{{SERVICE_NAME}}_SSL_KEY=/path/to/key.pem
{{SERVICE_NAME}}_SSL_CA=/path/to/ca.pem
{{SERVICE_NAME}}_SSL_REJECT_UNAUTHORIZED=true

# Connection Pool Settings
{{SERVICE_NAME}}_POOL_MIN=2
{{SERVICE_NAME}}_POOL_MAX=10
{{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT=30000
{{SERVICE_NAME}}_POOL_CREATE_TIMEOUT=30000
{{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT=5000
{{SERVICE_NAME}}_POOL_IDLE_TIMEOUT=30000
{{SERVICE_NAME}}_POOL_REAP_INTERVAL=1000
{{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL=200

# Logging Configuration
{{SERVICE_NAME}}_LOGGING_ENABLED=true
{{SERVICE_NAME}}_LOGGING_LEVEL=info
{{SERVICE_NAME}}_LOGGING_FORMAT=json
{{SERVICE_NAME}}_LOGGING_FILE=/var/log/{{service_name}}.log
{{SERVICE_NAME}}_LOGGING_MAX_SIZE=10m
{{SERVICE_NAME}}_LOGGING_MAX_FILES=5

# Retry Configuration
{{SERVICE_NAME}}_RETRY_ENABLED=true
{{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS=3
{{SERVICE_NAME}}_RETRY_BASE_DELAY=1000
{{SERVICE_NAME}}_RETRY_MAX_DELAY=10000
{{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR=2

# Environment
NODE_ENV=development
```

## Docker Configuration Template

```yaml
# docker-compose.yml

version: '3.8'

services:
  {{service_name}}:
    image: {{service_name}}:latest
    container_name: {{service_name}}
    restart: unless-stopped
    ports:
      - "${ {{SERVICE_NAME}}_PORT:-{{DEFAULT_VALUE}}}:${ {{SERVICE_NAME}}_PORT:-{{DEFAULT_VALUE}}}"
    environment:
      - {{SERVICE_NAME}}_HOST=${ {{SERVICE_NAME}}_HOST:-localhost}
      - {{SERVICE_NAME}}_PORT=${ {{SERVICE_NAME}}_PORT:-{{DEFAULT_VALUE}}}
      - {{SERVICE_NAME}}_TIMEOUT=${ {{SERVICE_NAME}}_TIMEOUT:-30000}
      - {{SERVICE_NAME}}_USERNAME=${ {{SERVICE_NAME}}_USERNAME}
      - {{SERVICE_NAME}}_PASSWORD=${ {{SERVICE_NAME}}_PASSWORD}
      - {{SERVICE_NAME}}_API_KEY=${ {{SERVICE_NAME}}_API_KEY}
      - {{SERVICE_NAME}}_SSL_ENABLED=${ {{SERVICE_NAME}}_SSL_ENABLED:-false}
      - {{SERVICE_NAME}}_SSL_CERT=${ {{SERVICE_NAME}}_SSL_CERT}
      - {{SERVICE_NAME}}_SSL_KEY=${ {{SERVICE_NAME}}_SSL_KEY}
      - {{SERVICE_NAME}}_SSL_CA=${ {{SERVICE_NAME}}_SSL_CA}
      - {{SERVICE_NAME}}_SSL_REJECT_UNAUTHORIZED=${ {{SERVICE_NAME}}_SSL_REJECT_UNAUTHORIZED:-true}
      - {{SERVICE_NAME}}_POOL_MIN=${ {{SERVICE_NAME}}_POOL_MIN:-2}
      - {{SERVICE_NAME}}_POOL_MAX=${ {{SERVICE_NAME}}_POOL_MAX:-10}
      - {{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT=${ {{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT:-30000}
      - {{SERVICE_NAME}}_POOL_CREATE_TIMEOUT=${ {{SERVICE_NAME}}_POOL_CREATE_TIMEOUT:-30000}
      - {{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT=${ {{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT:-5000}
      - {{SERVICE_NAME}}_POOL_IDLE_TIMEOUT=${ {{SERVICE_NAME}}_POOL_IDLE_TIMEOUT:-30000}
      - {{SERVICE_NAME}}_POOL_REAP_INTERVAL=${ {{SERVICE_NAME}}_POOL_REAP_INTERVAL:-1000}
      - {{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL=${ {{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL:-200}
      - {{SERVICE_NAME}}_LOGGING_ENABLED=${ {{SERVICE_NAME}}_LOGGING_ENABLED:-true}
      - {{SERVICE_NAME}}_LOGGING_LEVEL=${ {{SERVICE_NAME}}_LOGGING_LEVEL:-info}
      - {{SERVICE_NAME}}_LOGGING_FORMAT=${ {{SERVICE_NAME}}_LOGGING_FORMAT:-json}
      - {{SERVICE_NAME}}_LOGGING_FILE=${ {{SERVICE_NAME}}_LOGGING_FILE:-/var/log/{{service_name}}.log}
      - {{SERVICE_NAME}}_LOGGING_MAX_SIZE=${ {{SERVICE_NAME}}_LOGGING_MAX_SIZE:-10m}
      - {{SERVICE_NAME}}_LOGGING_MAX_FILES=${ {{SERVICE_NAME}}_LOGGING_MAX_FILES:-5}
      - {{SERVICE_NAME}}_RETRY_ENABLED=${ {{SERVICE_NAME}}_RETRY_ENABLED:-true}
      - {{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS=${ {{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS:-3}
      - {{SERVICE_NAME}}_RETRY_BASE_DELAY=${ {{SERVICE_NAME}}_RETRY_BASE_DELAY:-1000}
      - {{SERVICE_NAME}}_RETRY_MAX_DELAY=${ {{SERVICE_NAME}}_RETRY_MAX_DELAY:-10000}
      - {{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR=${ {{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR:-2}
      - NODE_ENV=${NODE_ENV:-development}
    volumes:
      - ./logs:/var/log
      - ./ssl:/etc/ssl
    networks:
      - {{service_name}}-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${ {{SERVICE_NAME}}_PORT:-{{DEFAULT_VALUE}}}/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  {{service_name}}-network:
    driver: bridge
```

## Kubernetes Configuration Template

```yaml
# k8s/{{service_name}}-configmap.yaml

apiVersion: v1
kind: ConfigMap
metadata:
  name: {{service_name}}-config
  namespace: default
data:
  {{SERVICE_NAME}}_HOST: "{{service_name}}-service"
  {{SERVICE_NAME}}_PORT: "{{DEFAULT_VALUE}}"
  {{SERVICE_NAME}}_TIMEOUT: "30000"
  {{SERVICE_NAME}}_SSL_ENABLED: "false"
  {{SERVICE_NAME}}_SSL_REJECT_UNAUTHORIZED: "true"
  {{SERVICE_NAME}}_POOL_MIN: "2"
  {{SERVICE_NAME}}_POOL_MAX: "10"
  {{SERVICE_NAME}}_POOL_ACQUIRE_TIMEOUT: "30000"
  {{SERVICE_NAME}}_POOL_CREATE_TIMEOUT: "30000"
  {{SERVICE_NAME}}_POOL_DESTROY_TIMEOUT: "5000"
  {{SERVICE_NAME}}_POOL_IDLE_TIMEOUT: "30000"
  {{SERVICE_NAME}}_POOL_REAP_INTERVAL: "1000"
  {{SERVICE_NAME}}_POOL_CREATE_RETRY_INTERVAL: "200"
  {{SERVICE_NAME}}_LOGGING_ENABLED: "true"
  {{SERVICE_NAME}}_LOGGING_LEVEL: "info"
  {{SERVICE_NAME}}_LOGGING_FORMAT: "json"
  {{SERVICE_NAME}}_LOGGING_MAX_SIZE: "10m"
  {{SERVICE_NAME}}_LOGGING_MAX_FILES: "5"
  {{SERVICE_NAME}}_RETRY_ENABLED: "true"
  {{SERVICE_NAME}}_RETRY_MAX_ATTEMPTS: "3"
  {{SERVICE_NAME}}_RETRY_BASE_DELAY: "1000"
  {{SERVICE_NAME}}_RETRY_MAX_DELAY: "10000"
  {{SERVICE_NAME}}_RETRY_BACKOFF_FACTOR: "2"
  NODE_ENV: "production"

---
# k8s/{{service_name}}-secret.yaml

apiVersion: v1
kind: Secret
metadata:
  name: {{service_name}}-secret
  namespace: default
type: Opaque
data:
  {{SERVICE_NAME}}_USERNAME: <base64-encoded-username>
  {{SERVICE_NAME}}_PASSWORD: <base64-encoded-password>
  {{SERVICE_NAME}}_API_KEY: <base64-encoded-api-key>
  {{SERVICE_NAME}}_SSL_CERT: <base64-encoded-cert>
  {{SERVICE_NAME}}_SSL_KEY: <base64-encoded-key>
  {{SERVICE_NAME}}_SSL_CA: <base64-encoded-ca>
```

## Testing Configuration

```typescript
// config/{{CONFIG_NAME}}.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { {{CONFIG_NAME}}Config, {{CONFIG_NAME}}Utils } from './{{CONFIG_NAME}}';

describe('{{CONFIG_NAME}} Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('Default Configuration', () => {
    it('should load default configuration', () => {
      expect({{CONFIG_NAME}}Config.host).toBe('localhost');
      expect({{CONFIG_NAME}}Config.port).toBe({{DEFAULT_VALUE}});
      expect({{CONFIG_NAME}}Config.timeout).toBe(30000);
    });

    it('should have valid default pool configuration', () => {
      expect({{CONFIG_NAME}}Config.pool.min).toBe(2);
      expect({{CONFIG_NAME}}Config.pool.max).toBe(10);
      expect({{CONFIG_NAME}}Config.pool.min).toBeLessThanOrEqual({{CONFIG_NAME}}Config.pool.max);
    });

    it('should have valid default SSL configuration', () => {
      expect({{CONFIG_NAME}}Config.ssl.enabled).toBe(false);
      expect({{CONFIG_NAME}}Config.ssl.rejectUnauthorized).toBe(true);
    });
  });

  describe('Environment Variable Override', () => {
    it('should override configuration with environment variables', () => {
      process.env.{{SERVICE_NAME}}_HOST = 'test-host';
      process.env.{{SERVICE_NAME}}_PORT = '5432';
      process.env.{{SERVICE_NAME}}_TIMEOUT = '60000';

      // Note: This test would require re-importing the config module
      // In a real scenario, you might need to use a different approach
      expect(process.env.{{SERVICE_NAME}}_HOST).toBe('test-host');
      expect(process.env.{{SERVICE_NAME}}_PORT).toBe('5432');
      expect(process.env.{{SERVICE_NAME}}_TIMEOUT).toBe('60000');
    });
  });

  describe('Configuration Validation', () => {
    it('should validate configuration schema', () => {
      expect({{CONFIG_NAME}}Utils.isValid()).toBe(true);
    });

    it('should return configuration summary without sensitive data', () => {
      const summary = {{CONFIG_NAME}}Utils.getSummary();
      expect(summary).not.toHaveProperty('password');
      expect(summary).not.toHaveProperty('apiKey');
      expect(summary).toHaveProperty('host');
      expect(summary).toHaveProperty('port');
    });
  });

  describe('Environment-Specific Configuration', () => {
    it('should return development configuration', () => {
      const devConfig = {{CONFIG_NAME}}Utils.getEnvironmentConfig('development');
      expect(devConfig.logging.level).toBe('debug');
      expect(devConfig.ssl.enabled).toBe(false);
    });

    it('should return staging configuration', () => {
      const stagingConfig = {{CONFIG_NAME}}Utils.getEnvironmentConfig('staging');
      expect(stagingConfig.logging.level).toBe('info');
      expect(stagingConfig.ssl.enabled).toBe(true);
    });

    it('should return production configuration', () => {
      const prodConfig = {{CONFIG_NAME}}Utils.getEnvironmentConfig('production');
      expect(prodConfig.logging.level).toBe('warn');
      expect(prodConfig.ssl.enabled).toBe(true);
      expect(prodConfig.ssl.rejectUnauthorized).toBe(true);
      expect(prodConfig.pool.max).toBe(20);
    });
  });
});
```

## Usage Instructions

1. Copy this template for each new configuration file
2. Replace all placeholder values with actual configuration information
3. Customize the schema based on your specific requirements
4. Add environment-specific overrides as needed
5. Include proper validation and error handling
6. Add tests for configuration validation
7. Document all configuration options

## Best Practices

1. **Validation**: Always validate configuration with schemas
2. **Defaults**: Provide sensible defaults for all options
3. **Environment Variables**: Use environment variables for sensitive data
4. **Type Safety**: Use TypeScript for type safety
5. **Documentation**: Document all configuration options
6. **Testing**: Write tests for configuration validation
7. **Security**: Never log sensitive configuration data
8. **Flexibility**: Allow environment-specific overrides

## Related Documentation

- [Environment Configuration Guide](../DEVELOPER_GUIDE.md#environment-configuration)
- [Docker Configuration Guide](../DEPLOYMENT_GUIDE.md#docker-configuration)
- [Kubernetes Configuration Guide](../DEPLOYMENT_GUIDE.md#kubernetes-configuration)
- [Security Best Practices](../architecture/security-architecture.md)
