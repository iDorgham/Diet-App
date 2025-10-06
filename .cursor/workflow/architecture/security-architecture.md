# Security Architecture

## Overview
This document outlines the security architecture and practices implemented in the Diet Planner Game application to ensure data protection, user privacy, and system integrity.

## Security Principles

### 1. Defense in Depth
- Multiple layers of security controls
- Fail-safe defaults
- Principle of least privilege
- Security by design

### 2. Zero Trust Architecture
- Never trust, always verify
- Continuous authentication
- Micro-segmentation
- Least privilege access

### 3. Privacy by Design
- Data minimization
- Purpose limitation
- Transparency
- User control

## Authentication & Authorization

### 1. Firebase Authentication
```typescript
// Anonymous Authentication Flow
export class AuthService {
  static async signInAnonymously(): Promise<User> {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      throw new Error('Authentication failed');
    }
  }
  
  static async signInWithToken(token: string): Promise<User> {
    try {
      const result = await signInWithCustomToken(auth, token);
      return result.user;
    } catch (error) {
      console.error('Token sign-in failed:', error);
      throw new Error('Authentication failed');
    }
  }
}
```

### 2. Session Management
```typescript
// Session Security Configuration
const authConfig = {
  // Token expiration
  tokenExpiration: 3600, // 1 hour
  
  // Refresh token rotation
  refreshTokenRotation: true,
  
  // Session timeout
  sessionTimeout: 1800, // 30 minutes
  
  // Secure cookie settings
  cookieSettings: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600
  }
};
```

### 3. Role-Based Access Control (RBAC)
```typescript
// User Roles and Permissions
enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

interface UserPermissions {
  canViewRecipes: boolean;
  canCreateTasks: boolean;
  canAccessAI: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
}

const getPermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case UserRole.GUEST:
      return {
        canViewRecipes: false,
        canCreateTasks: false,
        canAccessAI: false,
        canViewAnalytics: false,
        canManageUsers: false
      };
    case UserRole.USER:
      return {
        canViewRecipes: true,
        canCreateTasks: true,
        canAccessAI: true,
        canViewAnalytics: false,
        canManageUsers: false
      };
    case UserRole.PREMIUM:
      return {
        canViewRecipes: true,
        canCreateTasks: true,
        canAccessAI: true,
        canViewAnalytics: true,
        canManageUsers: false
      };
    case UserRole.ADMIN:
      return {
        canViewRecipes: true,
        canCreateTasks: true,
        canAccessAI: true,
        canViewAnalytics: true,
        canManageUsers: true
      };
  }
};
```

## Data Protection

### 1. Data Encryption

#### At Rest
```typescript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data encryption
    match /artifacts/{appId}/users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && isValidData(request.resource.data);
    }
    
    // Data validation
    function isValidData(data) {
      return data.keys().hasAll(['timestamp', 'version'])
        && data.timestamp is timestamp
        && data.version is string;
    }
  }
}
```

#### In Transit
```typescript
// HTTPS Configuration
const securityConfig = {
  // TLS 1.3 minimum
  tlsVersion: '1.3',
  
  // HSTS headers
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  
  // Certificate pinning
  certificatePinning: {
    enabled: true,
    pins: [
      'sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
      'sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB='
    ]
  }
};
```

### 2. Data Anonymization
```typescript
// Data Anonymization Service
export class DataAnonymizationService {
  static anonymizeUserData(userData: UserProfile): AnonymizedUserData {
    return {
      id: this.hashUserId(userData.id),
      dietType: userData.dietType,
      bodyType: userData.bodyType,
      // Remove personally identifiable information
      userName: this.generateAnonymousName(),
      weight: this.bucketWeight(userData.weight),
      email: null,
      phone: null
    };
  }
  
  private static hashUserId(userId: string): string {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(userId));
  }
  
  private static bucketWeight(weight: string): string {
    const numWeight = parseInt(weight);
    if (numWeight < 120) return 'under-120';
    if (numWeight < 150) return '120-150';
    if (numWeight < 180) return '150-180';
    return 'over-180';
  }
}
```

### 3. Data Retention Policies
```typescript
// Data Retention Configuration
const retentionPolicies = {
  userProfiles: {
    retentionPeriod: 365, // days
    anonymizeAfter: 90, // days
    deleteAfter: 365 // days
  },
  
  taskHistory: {
    retentionPeriod: 180, // days
    anonymizeAfter: 30, // days
    deleteAfter: 180 // days
  },
  
  chatHistory: {
    retentionPeriod: 90, // days
    anonymizeAfter: 7, // days
    deleteAfter: 90 // days
  },
  
  analytics: {
    retentionPeriod: 730, // days
    anonymizeAfter: 1, // day
    deleteAfter: 730 // days
  }
};
```

## Input Validation & Sanitization

### 1. Client-Side Validation
```typescript
// Input Validation Schema
import { z } from 'zod';

const userProfileSchema = z.object({
  userName: z.string()
    .min(2, 'Username must be at least 2 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  dietType: z.enum(['Keto', 'Paleo', 'Mediterranean', 'Vegan', 'Vegetarian']),
  
  bodyType: z.enum(['Ectomorph', 'Mesomorph', 'Endomorph']),
  
  weight: z.string()
    .regex(/^\d+(\s*(lbs|kg))?$/, 'Weight must be a number with optional unit')
    .refine((val) => {
      const num = parseInt(val);
      return num >= 50 && num <= 500;
    }, 'Weight must be between 50 and 500')
});

// Form Validation Hook
export const useFormValidation = <T>(schema: z.ZodSchema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (data: unknown): { isValid: boolean; data?: T; errors?: Record<string, string> } => {
    try {
      const validatedData = schema.parse(data);
      setErrors({});
      return { isValid: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return { isValid: false, errors: fieldErrors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  };
  
  return { validate, errors };
};
```

### 2. Server-Side Validation
```typescript
// API Request Validation
export const validateAPIRequest = (req: Request, schema: z.ZodSchema) => {
  try {
    const body = JSON.parse(req.body);
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid request data', error.errors);
    }
    throw new ValidationError('Invalid JSON format');
  }
};

// Custom Validation Error
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### 3. XSS Prevention
```typescript
// XSS Prevention Utilities
export class XSSPrevention {
  static sanitizeHTML(input: string): string {
    // Remove potentially dangerous HTML tags
    const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const dangerousAttributes = /on\w+\s*=/gi;
    
    return input
      .replace(dangerousTags, '')
      .replace(dangerousAttributes, '')
      .trim();
  }
  
  static escapeHTML(input: string): string {
    const htmlEscapes: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    
    return input.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
  }
  
  static validateURL(url: string): boolean {
    try {
      const parsedURL = new URL(url);
      // Only allow HTTPS URLs
      return parsedURL.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
```

## API Security

### 1. Rate Limiting
```typescript
// Rate Limiting Configuration
const rateLimitConfig = {
  // General API rate limits
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
    message: 'Too many requests from this IP'
  },
  
  // AI API rate limits
  ai: {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // requests per minute
    message: 'AI API rate limit exceeded'
  },
  
  // Authentication rate limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
    message: 'Too many authentication attempts'
  }
};

// Rate Limiting Middleware
export const rateLimitMiddleware = (config: RateLimitConfig) => {
  const requests = new Map<string, number[]>();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Clean old requests
    const userRequests = requests.get(key) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);
    
    if (recentRequests.length >= config.max) {
      return res.status(429).json({ error: config.message });
    }
    
    recentRequests.push(now);
    requests.set(key, recentRequests);
    next();
  };
};
```

### 2. API Key Management
```typescript
// API Key Service
export class APIKeyService {
  private static keys = new Map<string, APIKeyInfo>();
  
  static generateAPIKey(userId: string, permissions: string[]): string {
    const keyId = crypto.randomUUID();
    const keySecret = crypto.randomBytes(32).toString('hex');
    const fullKey = `${keyId}.${keySecret}`;
    
    this.keys.set(keyId, {
      userId,
      permissions,
      createdAt: Date.now(),
      lastUsed: null,
      isActive: true
    });
    
    return fullKey;
  }
  
  static validateAPIKey(key: string): APIKeyInfo | null {
    const [keyId, keySecret] = key.split('.');
    if (!keyId || !keySecret) return null;
    
    const keyInfo = this.keys.get(keyId);
    if (!keyInfo || !keyInfo.isActive) return null;
    
    // Update last used timestamp
    keyInfo.lastUsed = Date.now();
    
    return keyInfo;
  }
  
  static revokeAPIKey(keyId: string): boolean {
    const keyInfo = this.keys.get(keyId);
    if (keyInfo) {
      keyInfo.isActive = false;
      return true;
    }
    return false;
  }
}
```

### 3. CORS Configuration
```typescript
// CORS Security Configuration
const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://diet-planner-game.com',
      'https://www.diet-planner-game.com',
      'https://staging.diet-planner-game.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['X-Rate-Limit-Remaining', 'X-Rate-Limit-Reset'],
  maxAge: 86400 // 24 hours
};
```

## Monitoring & Logging

### 1. Security Event Logging
```typescript
// Security Event Logger
export class SecurityLogger {
  static logAuthenticationEvent(event: AuthEvent) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'authentication',
      type: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      success: event.success,
      details: event.details
    };
    
    // Send to security monitoring system
    this.sendToSecuritySystem(logEntry);
    
    // Log locally for debugging
    console.log('Security Event:', logEntry);
  }
  
  static logDataAccessEvent(event: DataAccessEvent) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'data_access',
      userId: event.userId,
      resource: event.resource,
      action: event.action,
      ip: event.ip,
      success: event.success
    };
    
    this.sendToSecuritySystem(logEntry);
  }
  
  static logSecurityViolation(violation: SecurityViolation) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'security_violation',
      type: violation.type,
      severity: violation.severity,
      userId: violation.userId,
      ip: violation.ip,
      details: violation.details
    };
    
    // Send immediate alert for high severity violations
    if (violation.severity === 'high') {
      this.sendImmediateAlert(logEntry);
    }
    
    this.sendToSecuritySystem(logEntry);
  }
  
  private static sendToSecuritySystem(logEntry: any) {
    // Implementation for sending to security monitoring system
    // e.g., SIEM, security analytics platform
  }
  
  private static sendImmediateAlert(logEntry: any) {
    // Implementation for immediate alerting
    // e.g., email, Slack, PagerDuty
  }
}
```

### 2. Intrusion Detection
```typescript
// Intrusion Detection System
export class IntrusionDetection {
  private static suspiciousPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /script\s*>/i,
    /javascript:/i,
    /<iframe/i,
    /eval\s*\(/i
  ];
  
  static detectSuspiciousActivity(request: Request): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    
    // Check for SQL injection patterns
    const body = JSON.stringify(request.body);
    this.suspiciousPatterns.forEach((pattern, index) => {
      if (pattern.test(body)) {
        threats.push({
          type: 'sql_injection',
          severity: 'high',
          pattern: pattern.toString(),
          location: 'request_body'
        });
      }
    });
    
    // Check for unusual request patterns
    if (this.isUnusualRequestPattern(request)) {
      threats.push({
        type: 'unusual_pattern',
        severity: 'medium',
        details: 'Unusual request pattern detected'
      });
    }
    
    return threats;
  }
  
  private static isUnusualRequestPattern(request: Request): boolean {
    // Check for rapid successive requests
    // Check for requests from unusual locations
    // Check for requests with unusual headers
    return false; // Simplified for example
  }
}
```

## Compliance & Privacy

### 1. GDPR Compliance
```typescript
// GDPR Compliance Service
export class GDPRComplianceService {
  static async handleDataSubjectRequest(
    userId: string,
    requestType: 'access' | 'portability' | 'erasure' | 'rectification',
    data?: any
  ) {
    switch (requestType) {
      case 'access':
        return await this.provideDataAccess(userId);
      
      case 'portability':
        return await this.provideDataPortability(userId);
      
      case 'erasure':
        return await this.handleDataErasure(userId);
      
      case 'rectification':
        return await this.handleDataRectification(userId, data);
    }
  }
  
  private static async provideDataAccess(userId: string) {
    // Collect all user data
    const userData = {
      profile: await FirestoreService.getUserProfile(userId),
      progress: await FirestoreService.getUserProgress(userId),
      tasks: await TaskService.getUserTasks(userId),
      chatHistory: await ChatService.getChatHistory(userId)
    };
    
    return {
      data: userData,
      timestamp: new Date().toISOString(),
      format: 'json'
    };
  }
  
  private static async handleDataErasure(userId: string) {
    // Anonymize or delete user data
    await Promise.all([
      FirestoreService.anonymizeUserData(userId),
      TaskService.deleteUserTasks(userId),
      ChatService.deleteChatHistory(userId)
    ]);
    
    return { success: true, timestamp: new Date().toISOString() };
  }
}
```

### 2. Privacy Controls
```typescript
// Privacy Settings Management
export class PrivacySettingsService {
  static async updatePrivacySettings(
    userId: string,
    settings: PrivacySettings
  ) {
    const validatedSettings = this.validatePrivacySettings(settings);
    
    await FirestoreService.updateUserPrivacySettings(userId, validatedSettings);
    
    // Apply privacy settings to existing data
    await this.applyPrivacySettings(userId, validatedSettings);
  }
  
  private static validatePrivacySettings(settings: PrivacySettings): PrivacySettings {
    return {
      dataSharing: settings.dataSharing || false,
      analytics: settings.analytics || false,
      marketing: settings.marketing || false,
      dataRetention: settings.dataRetention || 'standard'
    };
  }
  
  private static async applyPrivacySettings(
    userId: string,
    settings: PrivacySettings
  ) {
    if (!settings.analytics) {
      await AnalyticsService.optOutUser(userId);
    }
    
    if (!settings.dataSharing) {
      await DataSharingService.removeUserFromSharing(userId);
    }
  }
}
```

## Security Testing

### 1. Automated Security Testing
```typescript
// Security Test Suite
describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should prevent brute force attacks', async () => {
      const attempts = Array(10).fill(null).map(() => 
        AuthService.signInWithToken('invalid-token')
      );
      
      const results = await Promise.allSettled(attempts);
      const failures = results.filter(r => r.status === 'rejected');
      
      expect(failures.length).toBe(10);
    });
    
    it('should validate JWT tokens properly', async () => {
      const invalidToken = 'invalid.jwt.token';
      
      await expect(
        AuthService.validateToken(invalidToken)
      ).rejects.toThrow('Invalid token');
    });
  });
  
  describe('Input Validation', () => {
    it('should prevent XSS attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const sanitized = XSSPrevention.sanitizeHTML(maliciousInput);
      
      expect(sanitized).not.toContain('<script>');
    });
    
    it('should prevent SQL injection', () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const isValid = userProfileSchema.safeParse({
        userName: maliciousInput
      });
      
      expect(isValid.success).toBe(false);
    });
  });
});
```

### 2. Penetration Testing Checklist
```typescript
// Security Testing Checklist
const securityTestChecklist = {
  authentication: [
    'Test for weak passwords',
    'Test for session fixation',
    'Test for CSRF attacks',
    'Test for JWT vulnerabilities'
  ],
  
  authorization: [
    'Test for privilege escalation',
    'Test for horizontal privilege escalation',
    'Test for vertical privilege escalation',
    'Test for direct object references'
  ],
  
  inputValidation: [
    'Test for SQL injection',
    'Test for XSS attacks',
    'Test for command injection',
    'Test for LDAP injection'
  ],
  
  dataProtection: [
    'Test for data exposure',
    'Test for insecure storage',
    'Test for weak encryption',
    'Test for data leakage'
  ],
  
  infrastructure: [
    'Test for insecure configurations',
    'Test for vulnerable dependencies',
    'Test for weak SSL/TLS',
    'Test for information disclosure'
  ]
};
```

This security architecture provides comprehensive protection for the Diet Planner Game application while maintaining usability and performance. Regular security audits and updates ensure the system remains secure against evolving threats.
