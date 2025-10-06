# API Documentation Template

## Overview
This template provides a standardized structure for creating comprehensive API documentation in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{API_NAME}}` - Name of the API (e.g., `User API`, `Task API`, `Nutrition API`)
- `{{ENDPOINT_NAME}}` - Name of the endpoint
- `{{RESOURCE_NAME}}` - Name of the resource
- `{{VERSION}}` - API version

## API Documentation Structure

```markdown
# {{API_NAME}} Documentation

## Document Information
- **Version**: {{VERSION}}
- **Last Updated**: YYYY-MM-DD
- **Base URL**: `https://api.dietgame.com/v{{VERSION}}`
- **Authentication**: Bearer Token (JWT)
- **Rate Limiting**: 1000 requests per hour per user

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
6. [Data Models](#data-models)
7. [Examples](#examples)
8. [SDKs and Libraries](#sdks-and-libraries)
9. [Changelog](#changelog)

---

## 1. Overview

### 1.1 Purpose
The {{API_NAME}} provides programmatic access to {{RESOURCE_NAME}} functionality in the Diet Game application.

### 1.2 Key Features
- RESTful API design
- JSON request/response format
- Comprehensive error handling
- Rate limiting and throttling
- Authentication via JWT tokens
- Pagination support
- Filtering and sorting capabilities

### 1.3 Base URL
```
https://api.dietgame.com/v{{VERSION}}
```

### 1.4 Content Type
All requests and responses use `application/json` content type.

---

## 2. Authentication

### 2.1 Authentication Method
The API uses Bearer Token authentication with JWT tokens.

### 2.2 Getting an Access Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "tokenType": "Bearer"
  }
}
```

### 2.3 Using the Access Token
Include the access token in the Authorization header:

```http
GET /{{resource_name}}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.4 Token Refresh
When the access token expires, use the refresh token to get a new one:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 3. Rate Limiting

### 3.1 Rate Limits
- **Authenticated Users**: 1000 requests per hour
- **Unauthenticated Users**: 100 requests per hour
- **Burst Limit**: 10 requests per second

### 3.2 Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### 3.3 Rate Limit Exceeded
When rate limits are exceeded, the API returns a 429 status code:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again later.",
    "retryAfter": 3600
  }
}
```

---

## 4. Error Handling

### 4.1 Error Response Format
All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details",
    "field": "fieldName",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 4.2 HTTP Status Codes
| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### 4.3 Common Error Codes
| Error Code | Description |
|------------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

---

## 5. Endpoints

### 5.1 {{ENDPOINT_NAME}} Endpoints

#### GET /{{resource_name}}
Retrieve a list of {{resource_name}}.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 10, max: 100) |
| `sort` | string | No | Sort field and direction (e.g., "name:asc") |
| `filter` | object | No | Filter criteria (see filtering section) |

**Example Request:**
```http
GET /{{resource_name}}?page=1&limit=20&sort=name:asc
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "{{resource_name}}_123",
      "name": "Sample {{RESOURCE_NAME}}",
      "description": "Description of the {{resource_name}}",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

#### GET /{{resource_name}}/:id
Retrieve a specific {{resource_name}} by ID.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | {{RESOURCE_NAME}} ID |

**Example Request:**
```http
GET /{{resource_name}}/{{resource_name}}_123
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{resource_name}}_123",
    "name": "Sample {{RESOURCE_NAME}}",
    "description": "Description of the {{resource_name}}",
    "status": "active",
    "metadata": {
      "tags": ["tag1", "tag2"],
      "category": "category1"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

#### POST /{{resource_name}}
Create a new {{resource_name}}.

**Request Body:**
```json
{
  "name": "New {{RESOURCE_NAME}}",
  "description": "Description of the new {{resource_name}}",
  "status": "active",
  "metadata": {
    "tags": ["tag1", "tag2"],
    "category": "category1"
  }
}
```

**Example Request:**
```http
POST /{{resource_name}}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "New {{RESOURCE_NAME}}",
  "description": "Description of the new {{resource_name}}",
  "status": "active"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{resource_name}}_456",
    "name": "New {{RESOURCE_NAME}}",
    "description": "Description of the new {{resource_name}}",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

#### PUT /{{resource_name}}/:id
Update an existing {{resource_name}}.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | {{RESOURCE_NAME}} ID |

**Request Body:**
```json
{
  "name": "Updated {{RESOURCE_NAME}}",
  "description": "Updated description",
  "status": "inactive"
}
```

**Example Request:**
```http
PUT /{{resource_name}}/{{resource_name}}_123
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Updated {{RESOURCE_NAME}}",
  "description": "Updated description"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "{{resource_name}}_123",
    "name": "Updated {{RESOURCE_NAME}}",
    "description": "Updated description",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

#### DELETE /{{resource_name}}/:id
Delete a {{resource_name}}.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | {{RESOURCE_NAME}} ID |

**Example Request:**
```http
DELETE /{{resource_name}}/{{resource_name}}_123
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "{{RESOURCE_NAME}} deleted successfully",
  "meta": {
    "timestamp": "2024-01-01T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### 5.2 Filtering and Sorting

#### Filtering
Use the `filter` parameter to filter results:

```http
GET /{{resource_name}}?filter={"status":"active","category":"category1"}
```

**Available Filters:**
| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status |
| `category` | string | Filter by category |
| `createdAt` | object | Date range filter |
| `tags` | array | Filter by tags |

#### Sorting
Use the `sort` parameter to sort results:

```http
GET /{{resource_name}}?sort=name:asc,createdAt:desc
```

**Available Sort Fields:**
- `name` - Sort by name
- `createdAt` - Sort by creation date
- `updatedAt` - Sort by update date
- `status` - Sort by status

**Sort Directions:**
- `asc` - Ascending order
- `desc` - Descending order

---

## 6. Data Models

### 6.1 {{RESOURCE_NAME}} Model
```typescript
interface {{RESOURCE_NAME}} {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived';
  metadata?: {
    tags?: string[];
    category?: string;
    [key: string]: any;
  };
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
}
```

### 6.2 Create {{RESOURCE_NAME}} Request
```typescript
interface Create{{RESOURCE_NAME}}Request {
  name: string;
  description?: string;
  status?: 'active' | 'inactive';
  metadata?: {
    tags?: string[];
    category?: string;
    [key: string]: any;
  };
}
```

### 6.3 Update {{RESOURCE_NAME}} Request
```typescript
interface Update{{RESOURCE_NAME}}Request {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
  metadata?: {
    tags?: string[];
    category?: string;
    [key: string]: any;
  };
}
```

### 6.4 Pagination Model
```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### 6.5 API Response Model
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: string;
    field?: string;
  };
  pagination?: PaginationInfo;
  meta: {
    timestamp: string;
    requestId: string;
  };
}
```

---

## 7. Examples

### 7.1 Complete Workflow Example

#### Step 1: Authenticate
```bash
curl -X POST https://api.dietgame.com/v{{VERSION}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Step 2: Create a {{RESOURCE_NAME}}
```bash
curl -X POST https://api.dietgame.com/v{{VERSION}}/{{resource_name}} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "My {{RESOURCE_NAME}}",
    "description": "This is my {{resource_name}}",
    "status": "active"
  }'
```

#### Step 3: Retrieve the {{RESOURCE_NAME}}
```bash
curl -X GET https://api.dietgame.com/v{{VERSION}}/{{resource_name}}/{{resource_name}}_123 \
  -H "Authorization: Bearer <access_token>"
```

#### Step 4: Update the {{RESOURCE_NAME}}
```bash
curl -X PUT https://api.dietgame.com/v{{VERSION}}/{{resource_name}}/{{resource_name}}_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "Updated {{RESOURCE_NAME}}",
    "description": "Updated description"
  }'
```

#### Step 5: Delete the {{RESOURCE_NAME}}
```bash
curl -X DELETE https://api.dietgame.com/v{{VERSION}}/{{resource_name}}/{{resource_name}}_123 \
  -H "Authorization: Bearer <access_token>"
```

### 7.2 JavaScript/Node.js Example
```javascript
const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.dietgame.com/v{{VERSION}}',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a {{resource_name}}
async function create{{RESOURCE_NAME}}(data) {
  try {
    const response = await apiClient.post('/{{resource_name}}', data);
    return response.data;
  } catch (error) {
    console.error('Error creating {{resource_name}}:', error.response.data);
    throw error;
  }
}

// Get all {{resource_name}}s
async function get{{RESOURCE_NAME}}s(params = {}) {
  try {
    const response = await apiClient.get('/{{resource_name}}', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching {{resource_name}}s:', error.response.data);
    throw error;
  }
}

// Usage example
async function example() {
  try {
    // Create a new {{resource_name}}
    const new{{RESOURCE_NAME}} = await create{{RESOURCE_NAME}}({
      name: 'My {{RESOURCE_NAME}}',
      description: 'This is my {{resource_name}}',
      status: 'active'
    });
    
    console.log('Created:', new{{RESOURCE_NAME}});
    
    // Get all {{resource_name}}s
    const {{resource_name}}s = await get{{RESOURCE_NAME}}s({
      page: 1,
      limit: 10,
      sort: 'name:asc'
    });
    
    console.log('{{RESOURCE_NAME}}s:', {{resource_name}}s);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### 7.3 Python Example
```python
import requests
import json

class DietGameAPI:
    def __init__(self, base_url, access_token=None):
        self.base_url = base_url
        self.access_token = access_token
        self.session = requests.Session()
        
        if access_token:
            self.session.headers.update({
                'Authorization': f'Bearer {access_token}'
            })
    
    def create_{{resource_name}}(self, data):
        """Create a new {{resource_name}}"""
        response = self.session.post(
            f'{self.base_url}/{{resource_name}}',
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_{{resource_name}}s(self, params=None):
        """Get all {{resource_name}}s"""
        response = self.session.get(
            f'{self.base_url}/{{resource_name}}',
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def get_{{resource_name}}(self, {{resource_name}}_id):
        """Get a specific {{resource_name}}"""
        response = self.session.get(
            f'{self.base_url}/{{resource_name}}/{ {{resource_name}}_id}'
        )
        response.raise_for_status()
        return response.json()
    
    def update_{{resource_name}}(self, {{resource_name}}_id, data):
        """Update a {{resource_name}}"""
        response = self.session.put(
            f'{self.base_url}/{{resource_name}}/{ {{resource_name}}_id}',
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def delete_{{resource_name}}(self, {{resource_name}}_id):
        """Delete a {{resource_name}}"""
        response = self.session.delete(
            f'{self.base_url}/{{resource_name}}/{ {{resource_name}}_id}'
        )
        response.raise_for_status()
        return response.json()

# Usage example
if __name__ == '__main__':
    api = DietGameAPI(
        base_url='https://api.dietgame.com/v{{VERSION}}',
        access_token='your_access_token_here'
    )
    
    try:
        # Create a new {{resource_name}}
        new_{{resource_name}} = api.create_{{resource_name}}({
            'name': 'My {{RESOURCE_NAME}}',
            'description': 'This is my {{resource_name}}',
            'status': 'active'
        })
        print('Created:', new_{{resource_name}})
        
        # Get all {{resource_name}}s
        {{resource_name}}s = api.get_{{resource_name}}s({
            'page': 1,
            'limit': 10,
            'sort': 'name:asc'
        })
        print('{{RESOURCE_NAME}}s:', {{resource_name}}s)
        
    except requests.exceptions.RequestException as e:
        print('Error:', e)
```

---

## 8. SDKs and Libraries

### 8.1 Official SDKs
- **JavaScript/Node.js**: `npm install @dietgame/api-client`
- **Python**: `pip install dietgame-api`
- **PHP**: `composer require dietgame/api-client`
- **Java**: Available via Maven Central

### 8.2 Community Libraries
- **Ruby**: `gem install dietgame-api`
- **Go**: `go get github.com/dietgame/api-client`
- **C#**: Available via NuGet

### 8.3 Postman Collection
Download our Postman collection for easy API testing:
[Download Postman Collection](https://api.dietgame.com/postman/collection.json)

---

## 9. Changelog

### Version {{VERSION}} (YYYY-MM-DD)
- **Added**: New endpoint for bulk operations
- **Changed**: Updated response format for consistency
- **Fixed**: Fixed pagination issue with large datasets
- **Deprecated**: `oldEndpoint` will be removed in v{{NEXT_VERSION}}

### Version {{PREVIOUS_VERSION}} (YYYY-MM-DD)
- **Added**: Initial release of {{API_NAME}}
- **Added**: Authentication and authorization
- **Added**: CRUD operations for {{resource_name}}
- **Added**: Pagination and filtering support

---

## Support

### Getting Help
- **Documentation**: [https://docs.dietgame.com](https://docs.dietgame.com)
- **API Status**: [https://status.dietgame.com](https://status.dietgame.com)
- **Support Email**: api-support@dietgame.com
- **Community Forum**: [https://community.dietgame.com](https://community.dietgame.com)

### Reporting Issues
If you encounter any issues with the API, please report them:
1. Check the [API Status Page](https://status.dietgame.com) for known issues
2. Search existing issues in our [GitHub repository](https://github.com/dietgame/api)
3. Create a new issue with detailed information about the problem

### Feature Requests
We welcome feature requests! Please submit them through:
- [GitHub Issues](https://github.com/dietgame/api/issues)
- [Community Forum](https://community.dietgame.com)
- Email: features@dietgame.com
```

## Usage Instructions

1. Copy this template for each new API documentation
2. Replace all placeholder values with actual API information
3. Customize sections based on your specific API requirements
4. Add real examples and code snippets
5. Keep the documentation updated as the API evolves
6. Include interactive examples where possible

## Best Practices

1. **Clarity**: Use clear, concise language
2. **Examples**: Provide comprehensive examples in multiple languages
3. **Consistency**: Follow consistent formatting and structure
4. **Completeness**: Document all endpoints, parameters, and responses
5. **Accuracy**: Keep documentation synchronized with API changes
6. **Accessibility**: Make documentation accessible to all users
7. **Interactive**: Include interactive examples and tools
8. **Versioning**: Maintain version history and migration guides

## Related Documentation

- [API Architecture](../architecture/api-architecture.md)
- [Authentication Guide](../AUTHENTICATION.md)
- [Rate Limiting Guide](../RATE_LIMITING.md)
- [Error Handling Guide](../DEVELOPER_GUIDE.md#error-handling)
