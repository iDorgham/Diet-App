# Webhook Template

## Overview
This template provides a standardized structure for creating webhook handlers in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{WEBHOOK_NAME}}` - Name of the webhook (e.g., `UserCreated`, `PaymentProcessed`)
- `{{EVENT_TYPE}}` - Type of event (e.g., `user.created`, `payment.completed`)
- `{{PAYLOAD_TYPE}}` - Type of payload data
- `{{HANDLER_NAME}}` - Name of the handler function

## Webhook Handler Structure

```typescript
// webhooks/{{WEBHOOK_NAME}}.ts

import { Request, Response } from 'express';
import { z } from 'zod';
import { WebhookEvent } from '../types/WebhookEvent';
import { {{PAYLOAD_TYPE}} } from '../types/{{PAYLOAD_TYPE}}';
import { WebhookService } from '../services/WebhookService';
import { Logger } from '../utils/Logger';
import { validateWebhookSignature } from '../middleware/webhookAuth';

/**
 * {{WEBHOOK_NAME}} webhook handler
 * Handles {{EVENT_TYPE}} events from external services
 */
export class {{WEBHOOK_NAME}}Handler {
  private logger: Logger;
  private webhookService: WebhookService;

  constructor() {
    this.logger = new Logger('{{WEBHOOK_NAME}}Handler');
    this.webhookService = new WebhookService();
  }

  /**
   * Main webhook handler function
   */
  async handle(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Validate webhook signature
      const isValidSignature = await validateWebhookSignature(req);
      if (!isValidSignature) {
        this.logger.warn('Invalid webhook signature', {
          headers: req.headers,
          body: req.body
        });
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      // Parse and validate payload
      const payload = this.parsePayload(req.body);
      if (!payload) {
        this.logger.error('Invalid payload format', { body: req.body });
        res.status(400).json({ error: 'Invalid payload' });
        return;
      }

      // Process the webhook event
      await this.processEvent(payload);

      // Send success response
      res.status(200).json({ 
        success: true, 
        message: 'Webhook processed successfully' 
      });

    } catch (error) {
      this.logger.error('Webhook processing failed', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });

      // Send error response
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  /**
   * Parse and validate webhook payload
   */
  private parsePayload(body: any): {{PAYLOAD_TYPE}} | null {
    try {
      // Define payload schema
      const payloadSchema = z.object({
        event: z.string(),
        data: z.object({
          // Define your payload structure here
          id: z.string(),
          type: z.string(),
          // Add other fields as needed
        }),
        timestamp: z.string().datetime(),
        source: z.string(),
        version: z.string().optional()
      });

      const validatedPayload = payloadSchema.parse(body);
      
      // Additional validation specific to this webhook
      if (validatedPayload.event !== '{{EVENT_TYPE}}') {
        this.logger.warn('Unexpected event type', {
          expected: '{{EVENT_TYPE}}',
          received: validatedPayload.event
        });
        return null;
      }

      return validatedPayload as {{PAYLOAD_TYPE}};
    } catch (error) {
      this.logger.error('Payload validation failed', {
        error: error.message,
        body
      });
      return null;
    }
  }

  /**
   * Process the webhook event
   */
  private async processEvent(payload: {{PAYLOAD_TYPE}}): Promise<void> {
    try {
      this.logger.info('Processing webhook event', {
        event: payload.event,
        dataId: payload.data.id,
        source: payload.source
      });

      // Store webhook event for audit trail
      await this.webhookService.storeEvent({
        eventType: payload.event,
        source: payload.source,
        payload: payload.data,
        timestamp: new Date(payload.timestamp),
        processed: false
      });

      // Process based on event type
      switch (payload.event) {
        case '{{EVENT_TYPE}}':
          await this.handle{{EVENT_TYPE}}(payload.data);
          break;
        default:
          this.logger.warn('Unhandled event type', { event: payload.event });
      }

      // Mark event as processed
      await this.webhookService.markEventProcessed(payload.data.id);

    } catch (error) {
      this.logger.error('Event processing failed', {
        error: error.message,
        payload: payload.data
      });
      throw error;
    }
  }

  /**
   * Handle specific event type
   */
  private async handle{{EVENT_TYPE}}(data: any): Promise<void> {
    try {
      this.logger.info('Handling {{EVENT_TYPE}} event', { dataId: data.id });

      // Implement your business logic here
      // Example:
      // await this.updateUserStatus(data.id, data.status);
      // await this.sendNotification(data.userId, data.message);
      // await this.updateDatabase(data);

      this.logger.info('{{EVENT_TYPE}} event processed successfully', { dataId: data.id });
    } catch (error) {
      this.logger.error('Failed to handle {{EVENT_TYPE}} event', {
        error: error.message,
        dataId: data.id
      });
      throw error;
    }
  }
}
```

## Webhook Service

```typescript
// services/WebhookService.ts

import { WebhookEvent } from '../types/WebhookEvent';
import { WebhookRepository } from '../repositories/WebhookRepository';
import { Logger } from '../utils/Logger';

export class WebhookService {
  private logger: Logger;
  private webhookRepository: WebhookRepository;

  constructor() {
    this.logger = new Logger('WebhookService');
    this.webhookRepository = new WebhookRepository();
  }

  /**
   * Store webhook event for audit trail
   */
  async storeEvent(event: Omit<WebhookEvent, 'id' | 'createdAt'>): Promise<WebhookEvent> {
    try {
      const webhookEvent = await this.webhookRepository.create({
        ...event,
        createdAt: new Date()
      });

      this.logger.info('Webhook event stored', { eventId: webhookEvent.id });
      return webhookEvent;
    } catch (error) {
      this.logger.error('Failed to store webhook event', { error: error.message });
      throw error;
    }
  }

  /**
   * Mark webhook event as processed
   */
  async markEventProcessed(eventId: string): Promise<void> {
    try {
      await this.webhookRepository.update(eventId, {
        processed: true,
        processedAt: new Date()
      });

      this.logger.info('Webhook event marked as processed', { eventId });
    } catch (error) {
      this.logger.error('Failed to mark event as processed', {
        eventId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get webhook events by criteria
   */
  async getEvents(criteria: {
    eventType?: string;
    source?: string;
    processed?: boolean;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
  }): Promise<WebhookEvent[]> {
    try {
      return await this.webhookRepository.findMany(criteria);
    } catch (error) {
      this.logger.error('Failed to get webhook events', { error: error.message });
      throw error;
    }
  }

  /**
   * Retry failed webhook events
   */
  async retryFailedEvents(): Promise<void> {
    try {
      const failedEvents = await this.webhookRepository.findMany({
        processed: false,
        retryCount: { $lt: 3 } // Max 3 retries
      });

      for (const event of failedEvents) {
        try {
          await this.processEvent(event);
          await this.markEventProcessed(event.id);
        } catch (error) {
          await this.incrementRetryCount(event.id);
          this.logger.error('Retry failed for webhook event', {
            eventId: event.id,
            error: error.message
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to retry webhook events', { error: error.message });
      throw error;
    }
  }

  private async incrementRetryCount(eventId: string): Promise<void> {
    try {
      const event = await this.webhookRepository.findById(eventId);
      if (event) {
        await this.webhookRepository.update(eventId, {
          retryCount: (event.retryCount || 0) + 1,
          lastRetryAt: new Date()
        });
      }
    } catch (error) {
      this.logger.error('Failed to increment retry count', {
        eventId,
        error: error.message
      });
    }
  }

  private async processEvent(event: WebhookEvent): Promise<void> {
    // Implement event processing logic
    // This would typically call the appropriate handler
    throw new Error('Event processing not implemented');
  }
}
```

## Webhook Authentication

```typescript
// middleware/webhookAuth.ts

import { Request } from 'express';
import crypto from 'crypto';
import { Logger } from '../utils/Logger';

const logger = new Logger('WebhookAuth');

/**
 * Validate webhook signature
 */
export async function validateWebhookSignature(req: Request): Promise<boolean> {
  try {
    const signature = req.headers['x-webhook-signature'] as string;
    const timestamp = req.headers['x-webhook-timestamp'] as string;
    
    if (!signature || !timestamp) {
      logger.warn('Missing webhook signature or timestamp');
      return false;
    }

    // Check timestamp to prevent replay attacks
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp);
    
    if (Math.abs(currentTime - webhookTime) > 300) { // 5 minutes tolerance
      logger.warn('Webhook timestamp too old', {
        currentTime,
        webhookTime,
        difference: Math.abs(currentTime - webhookTime)
      });
      return false;
    }

    // Verify signature
    const expectedSignature = generateSignature(
      req.body,
      timestamp,
      process.env.WEBHOOK_SECRET!
    );

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.warn('Invalid webhook signature', {
        expected: expectedSignature,
        received: signature
      });
    }

    return isValid;
  } catch (error) {
    logger.error('Webhook signature validation failed', { error: error.message });
    return false;
  }
}

/**
 * Generate webhook signature
 */
function generateSignature(payload: any, timestamp: string, secret: string): string {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const message = `${timestamp}.${body}`;
  
  return crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}
```

## Types and Interfaces

```typescript
// types/WebhookEvent.ts

export interface WebhookEvent {
  id: string;
  eventType: string;
  source: string;
  payload: any;
  timestamp: Date;
  processed: boolean;
  processedAt?: Date;
  retryCount?: number;
  lastRetryAt?: Date;
  createdAt: Date;
}

// types/{{PAYLOAD_TYPE}}.ts

export interface {{PAYLOAD_TYPE}} {
  event: string;
  data: {
    id: string;
    type: string;
    // Add other fields specific to your webhook
  };
  timestamp: string;
  source: string;
  version?: string;
}
```

## Route Configuration

```typescript
// routes/webhooks.ts

import { Router } from 'express';
import { {{WEBHOOK_NAME}}Handler } from '../webhooks/{{WEBHOOK_NAME}}';
import { rateLimit } from '../middleware/rateLimit';
import { bodyParser } from '../middleware/bodyParser';

const router = Router();
const {{WEBHOOK_NAME}}Handler = new {{WEBHOOK_NAME}}Handler();

// Apply middleware
router.use(rateLimit('webhook', 100, 15 * 60 * 1000)); // 100 requests per 15 minutes
router.use(bodyParser.raw({ type: 'application/json' }));

// Webhook endpoints
router.post('/{{WEBHOOK_NAME}}', {{WEBHOOK_NAME}}Handler.handle.bind({{WEBHOOK_NAME}}Handler));

export default router;
```

## Testing

```typescript
// tests/webhooks/{{WEBHOOK_NAME}}.test.ts

import request from 'supertest';
import { app } from '../app';
import { {{WEBHOOK_NAME}}Handler } from '../../webhooks/{{WEBHOOK_NAME}}';
import { WebhookService } from '../../services/WebhookService';
import crypto from 'crypto';

describe('{{WEBHOOK_NAME}}Handler', () => {
  let webhookService: jest.Mocked<WebhookService>;

  beforeEach(() => {
    webhookService = {
      storeEvent: jest.fn(),
      markEventProcessed: jest.fn(),
      getEvents: jest.fn(),
      retryFailedEvents: jest.fn()
    } as any;
  });

  describe('POST /webhooks/{{WEBHOOK_NAME}}', () => {
    const validPayload = {
      event: '{{EVENT_TYPE}}',
      data: {
        id: 'test-id',
        type: 'test-type'
      },
      timestamp: new Date().toISOString(),
      source: 'test-source'
    };

    const generateSignature = (payload: any, timestamp: string): string => {
      const body = JSON.stringify(payload);
      const message = `${timestamp}.${body}`;
      return crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET!)
        .update(message)
        .digest('hex');
    };

    it('should process valid webhook successfully', async () => {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = generateSignature(validPayload, timestamp);

      const response = await request(app)
        .post('/webhooks/{{WEBHOOK_NAME}}')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(validPayload)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(webhookService.storeEvent).toHaveBeenCalled();
      expect(webhookService.markEventProcessed).toHaveBeenCalled();
    });

    it('should reject webhook with invalid signature', async () => {
      const response = await request(app)
        .post('/webhooks/{{WEBHOOK_NAME}}')
        .set('x-webhook-signature', 'invalid-signature')
        .set('x-webhook-timestamp', Math.floor(Date.now() / 1000).toString())
        .send(validPayload)
        .expect(401);

      expect(response.body.error).toBe('Invalid signature');
    });

    it('should reject webhook with old timestamp', async () => {
      const oldTimestamp = Math.floor((Date.now() - 10 * 60 * 1000) / 1000).toString(); // 10 minutes ago
      const signature = generateSignature(validPayload, oldTimestamp);

      const response = await request(app)
        .post('/webhooks/{{WEBHOOK_NAME}}')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', oldTimestamp)
        .send(validPayload)
        .expect(401);

      expect(response.body.error).toBe('Invalid signature');
    });

    it('should handle invalid payload format', async () => {
      const invalidPayload = {
        event: 'invalid-event',
        data: 'invalid-data'
      };

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const signature = generateSignature(invalidPayload, timestamp);

      const response = await request(app)
        .post('/webhooks/{{WEBHOOK_NAME}}')
        .set('x-webhook-signature', signature)
        .set('x-webhook-timestamp', timestamp)
        .send(invalidPayload)
        .expect(400);

      expect(response.body.error).toBe('Invalid payload');
    });
  });
});
```

## Configuration

```typescript
// config/webhooks.ts

export const webhookConfig = {
  {{WEBHOOK_NAME}}: {
    secret: process.env.{{WEBHOOK_NAME}}_WEBHOOK_SECRET!,
    endpoint: '/webhooks/{{WEBHOOK_NAME}}',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // requests per window
    },
    retry: {
      maxRetries: 3,
      backoffMs: 1000
    }
  }
};
```

## Best Practices

1. **Security**: Always validate webhook signatures
2. **Idempotency**: Handle duplicate webhook events gracefully
3. **Error Handling**: Implement comprehensive error handling and logging
4. **Rate Limiting**: Apply appropriate rate limiting to webhook endpoints
5. **Audit Trail**: Store all webhook events for debugging and compliance
6. **Retry Logic**: Implement retry mechanisms for failed events
7. **Validation**: Validate all incoming payloads
8. **Monitoring**: Monitor webhook processing performance and errors
9. **Testing**: Write comprehensive tests for webhook handlers
10. **Documentation**: Document webhook payloads and expected responses

## Related Documentation

- [Webhook Security Best Practices](https://webhook.site/)
- [Express.js Webhook Handling](https://expressjs.com/)
- [API Documentation](../API_DOCUMENTATION.md)
- [Security Architecture](../architecture/security-architecture.md)
