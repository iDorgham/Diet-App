# Webhook Contracts

## Overview
This document defines the webhook contracts for the Diet Game application, including event types, payload structures, and delivery mechanisms.

## Webhook Configuration

### Base URL
```
https://api.dietgame.com/webhooks
```

### Authentication
All webhooks require authentication using one of the following methods:

#### HMAC Signature
```
X-Webhook-Signature: sha256=<signature>
X-Webhook-Timestamp: <unix_timestamp>
```

#### API Key
```
Authorization: Bearer <webhook_api_key>
```

## Event Types

### User Events

#### `user.created`
Triggered when a new user account is created.

```json
{
  "event": "user.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "newuser",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### `user.updated`
Triggered when user profile or preferences are updated.

```json
{
  "event": "user.updated",
  "timestamp": "2024-01-15T11:00:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "updateduser",
      "updated_at": "2024-01-15T11:00:00Z"
    },
    "changes": {
      "username": {
        "old": "newuser",
        "new": "updateduser"
      }
    }
  }
}
```

#### `user.deleted`
Triggered when a user account is deleted.

```json
{
  "event": "user.deleted",
  "timestamp": "2024-01-15T12:00:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "deleted_at": "2024-01-15T12:00:00Z"
    }
  }
}
```

### Nutrition Events

#### `nutrition.logged`
Triggered when a user logs a nutrition entry.

```json
{
  "event": "nutrition.logged",
  "timestamp": "2024-01-15T13:00:00Z",
  "data": {
    "entry": {
      "id": "entry_456",
      "user_id": "user_123",
      "food_id": "food_789",
      "quantity": 150.0,
      "unit": "g",
      "meal_type": "lunch",
      "logged_at": "2024-01-15T13:00:00Z",
      "nutrition_facts": {
        "calories": 300,
        "protein": 25.0,
        "carbohydrates": 30.0,
        "fat": 10.0
      }
    }
  }
}
```

#### `nutrition.updated`
Triggered when a nutrition entry is updated.

```json
{
  "event": "nutrition.updated",
  "timestamp": "2024-01-15T14:00:00Z",
  "data": {
    "entry": {
      "id": "entry_456",
      "user_id": "user_123",
      "food_id": "food_789",
      "quantity": 200.0,
      "unit": "g",
      "meal_type": "lunch",
      "updated_at": "2024-01-15T14:00:00Z"
    },
    "changes": {
      "quantity": {
        "old": 150.0,
        "new": 200.0
      }
    }
  }
}
```

#### `nutrition.deleted`
Triggered when a nutrition entry is deleted.

```json
{
  "event": "nutrition.deleted",
  "timestamp": "2024-01-15T15:00:00Z",
  "data": {
    "entry": {
      "id": "entry_456",
      "user_id": "user_123",
      "deleted_at": "2024-01-15T15:00:00Z"
    }
  }
}
```

### Gamification Events

#### `achievement.unlocked`
Triggered when a user unlocks an achievement.

```json
{
  "event": "achievement.unlocked",
  "timestamp": "2024-01-15T16:00:00Z",
  "data": {
    "achievement": {
      "id": "ach_101",
      "user_id": "user_123",
      "name": "First Meal Logged",
      "description": "Log your first meal",
      "points": 10,
      "category": "nutrition",
      "unlocked_at": "2024-01-15T16:00:00Z"
    }
  }
}
```

#### `quest.completed`
Triggered when a user completes a quest.

```json
{
  "event": "quest.completed",
  "timestamp": "2024-01-15T17:00:00Z",
  "data": {
    "quest": {
      "id": "quest_202",
      "user_id": "user_123",
      "title": "Daily Nutrition Goal",
      "type": "daily",
      "difficulty": "easy",
      "rewards": {
        "experience": 50,
        "points": 25,
        "achievements": ["ach_102"]
      },
      "completed_at": "2024-01-15T17:00:00Z"
    }
  }
}
```

#### `level.up`
Triggered when a user levels up.

```json
{
  "event": "level.up",
  "timestamp": "2024-01-15T18:00:00Z",
  "data": {
    "user": {
      "id": "user_123",
      "level": 5,
      "experience": 1250,
      "experience_to_next": 1500
    },
    "previous_level": 4,
    "new_level": 5
  }
}
```

### Social Events

#### `friend.request.sent`
Triggered when a friend request is sent.

```json
{
  "event": "friend.request.sent",
  "timestamp": "2024-01-15T19:00:00Z",
  "data": {
    "request": {
      "id": "req_303",
      "from_user_id": "user_123",
      "to_user_id": "user_456",
      "status": "pending",
      "sent_at": "2024-01-15T19:00:00Z"
    }
  }
}
```

#### `friend.request.accepted`
Triggered when a friend request is accepted.

```json
{
  "event": "friend.request.accepted",
  "timestamp": "2024-01-15T20:00:00Z",
  "data": {
    "friendship": {
      "id": "friend_404",
      "user1_id": "user_123",
      "user2_id": "user_456",
      "status": "accepted",
      "accepted_at": "2024-01-15T20:00:00Z"
    }
  }
}
```

#### `post.created`
Triggered when a user creates a social post.

```json
{
  "event": "post.created",
  "timestamp": "2024-01-15T21:00:00Z",
  "data": {
    "post": {
      "id": "post_505",
      "author_id": "user_123",
      "content": "Just completed my daily nutrition goal! 🎉",
      "type": "achievement",
      "created_at": "2024-01-15T21:00:00Z"
    }
  }
}
```

#### `post.liked`
Triggered when a post is liked.

```json
{
  "event": "post.liked",
  "timestamp": "2024-01-15T22:00:00Z",
  "data": {
    "like": {
      "id": "like_606",
      "post_id": "post_505",
      "user_id": "user_456",
      "created_at": "2024-01-15T22:00:00Z"
    }
  }
}
```

## Webhook Delivery

### Delivery Method
All webhooks are delivered via HTTP POST requests to the configured endpoint.

### Request Headers
```
Content-Type: application/json
User-Agent: DietGame-Webhooks/1.0
X-Webhook-Event: <event_type>
X-Webhook-Signature: sha256=<signature>
X-Webhook-Timestamp: <unix_timestamp>
X-Webhook-Id: <unique_id>
```

### Response Requirements
The webhook endpoint must respond with:
- **Status Code**: 200-299 for success
- **Response Time**: Within 30 seconds
- **Content-Type**: Any valid content type

### Retry Logic
Failed webhook deliveries will be retried with exponential backoff:

1. **First retry**: 1 minute after failure
2. **Second retry**: 5 minutes after first retry
3. **Third retry**: 15 minutes after second retry
4. **Fourth retry**: 1 hour after third retry
5. **Final retry**: 6 hours after fourth retry

After 5 failed attempts, the webhook will be marked as failed and no further retries will be attempted.

### Idempotency
All webhook events include a unique `X-Webhook-Id` header. Implement idempotency by checking this ID to prevent duplicate processing.

## Security

### HMAC Signature Verification
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Timestamp Validation
Webhook timestamps should be validated to prevent replay attacks:

```javascript
function validateTimestamp(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  const timeDiff = Math.abs(now - webhookTime);
  
  // Reject webhooks older than 5 minutes
  return timeDiff <= 300;
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "webhook_error",
    "message": "Invalid webhook signature",
    "details": "The provided signature does not match the expected value"
  }
}
```

### Common Error Codes
- `invalid_signature`: HMAC signature verification failed
- `invalid_timestamp`: Timestamp is too old or invalid
- `missing_headers`: Required headers are missing
- `invalid_payload`: Payload format is invalid
- `processing_error`: Error occurred while processing the webhook

## Testing

### Webhook Testing Endpoint
```
POST /webhooks/test
```

### Test Payload
```json
{
  "event": "test.webhook",
  "timestamp": "2024-01-15T23:00:00Z",
  "data": {
    "message": "This is a test webhook",
    "test_id": "test_123"
  }
}
```

### Webhook Logs
All webhook deliveries are logged and can be viewed in the webhook dashboard:
- Delivery attempts
- Response codes
- Error messages
- Retry attempts

## Rate Limiting

### Limits
- **Webhook deliveries**: 1000 per hour per endpoint
- **Test webhooks**: 100 per hour per user

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Monitoring

### Health Checks
Webhook endpoints should implement health check endpoints:

```
GET /webhooks/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T23:00:00Z",
  "version": "1.0.0"
}
```

### Metrics
The following metrics are tracked:
- Delivery success rate
- Average response time
- Error rates by type
- Retry attempts

## Related Documentation
- [API Documentation](../API_DOCUMENTATION.md)
- [Authentication Guide](../AUTHENTICATION.md)
- [Rate Limiting Guide](../RATE_LIMITING.md)
- [Monitoring Architecture](../architecture/monitoring-architecture.md)
