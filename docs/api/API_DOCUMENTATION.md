# Q-Ease API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.qease.com/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Login
**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "role": "USER"
    },
    "token": "jwt_token"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

---

## Organization Endpoints

### Get All Organizations
**GET** `/organisations`

Get list of all organizations (public).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "organisations": [
      {
        "id": "org_id",
        "name": "City Hospital",
        "code": "HOSP01",
        "address": "123 Main St",
        "city": "New York"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 20,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Search Organizations
**GET** `/organisations/search?q=<query>`

Search organizations by name, code, or city.

**Query Parameters:**
- `q` (required): Search query

**Response:** `200 OK`

---

### Get Organization by Code
**GET** `/organisations/code/:code`

Get organization details by 6-digit code.

**Parameters:**
- `code`: Organization code (e.g., "HOSP01")

**Response:** `200 OK`

---

## Queue Endpoints

### Get All Queues
**GET** `/queues`

Get all queues with statistics.

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "queues": [
      {
        "id": "queue_id",
        "name": "Emergency",
        "organisationId": "org_id",
        "isActive": true,
        "waitingCount": 5,
        "currentToken": "E001",
        "averageTime": 15
      }
    ]
  }
}
```

---

### Get Queue by ID
**GET** `/queues/:id`

Get detailed queue information.

**Authentication:** Required

**Response:** `200 OK`

---

### Create Queue
**POST** `/queues`

Create a new queue (Admin only).

**Authentication:** Required (ORGANISATION_ADMIN or SUPER_ADMIN)

**Request Body:**
```json
{
  "name": "Emergency",
  "description": "Emergency services",
  "organisationId": "org_id",
  "averageTime": 15,
  "maxTokens": 50
}
```

**Response:** `201 Created`

---

### Pause Queue
**PATCH** `/queues/:id/pause`

Pause a queue (Staff/Admin).

**Authentication:** Required (STAFF, ORGANISATION_ADMIN, or SUPER_ADMIN)

**Response:** `200 OK`

---

### Resume Queue
**PATCH** `/queues/:id/resume`

Resume a paused queue (Staff/Admin).

**Authentication:** Required

**Response:** `200 OK`

---

## Token Endpoints

### Create Token (Join Queue)
**POST** `/tokens`

Create a new token to join a queue.

**Authentication:** Required

**Request Body:**
```json
{
  "queueId": "queue_id",
  "priority": "NORMAL"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": {
      "id": "token_id",
      "tokenId": "E005",
      "queueId": "queue_id",
      "position": 5,
      "status": "PENDING",
      "estimatedWaitTime": 75
    }
  }
}
```

**Rate Limit:** 10 requests per 15 minutes

---

### Get My Tokens
**GET** `/tokens/my`

Get all tokens for the authenticated user.

**Authentication:** Required

**Response:** `200 OK`

---

### Cancel Token
**PATCH** `/tokens/:id/cancel`

Cancel a token.

**Authentication:** Required

**Response:** `200 OK`

---

### Call Next Token
**POST** `/tokens/queue/:queueId/call-next`

Call the next token in queue (Staff only).

**Authentication:** Required (STAFF or ORGANISATION_ADMIN)

**Response:** `200 OK`

---

### Mark Token as Served
**PATCH** `/tokens/:id/serve`

Mark a token as served (Staff only).

**Authentication:** Required (STAFF or ORGANISATION_ADMIN)

**Response:** `200 OK`

---

## QR Code Endpoints

### Generate Organization QR
**GET** `/qr/organisation/:id`

Generate QR code for an organization.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "qrCode": "data:image/png;base64,...",
    "data": {
      "type": "organisation",
      "code": "HOSP01",
      "url": "http://localhost:5173/org/HOSP01"
    }
  }
}
```

---

### Generate Queue QR
**GET** `/qr/queue/:id`

Generate QR code for a queue.

**Response:** `200 OK`

---

### Generate Token QR
**GET** `/qr/token/:id`

Generate QR code for a token.

**Authentication:** Required

**Response:** `200 OK`

---

## User Endpoints

### Get Profile
**GET** `/users/profile`

Get authenticated user's profile.

**Authentication:** Required

**Response:** `200 OK`

---

### Update Profile
**PUT** `/users/profile`

Update user profile.

**Authentication:** Required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

**Response:** `200 OK`

---

### Change Password
**POST** `/users/change-password`

Change user password.

**Authentication:** Required

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response:** `200 OK`

---

### Get Notifications
**GET** `/users/notifications`

Get user notifications.

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of notifications (default: 50)

**Response:** `200 OK`

---

## Analytics Endpoints

### Get Organization Analytics
**GET** `/analytics/organisations/:orgId`

Get analytics for an organization (Admin only).

**Authentication:** Required (ORGANISATION_ADMIN or SUPER_ADMIN)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalQueues": 6,
      "activeQueues": 5,
      "totalTokens": 150,
      "todayTokens": 25,
      "averageWaitTime": 12
    }
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limits

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 5 requests / 15 min |
| Token Creation | 10 requests / 15 min |
| General API | 100 requests / 15 min |
| Public Endpoints | 200 requests / 15 min |

---

## WebSocket Events (Socket.IO)

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Join Rooms
```javascript
socket.emit('join-queue', queueId);
socket.emit('join-organisation', orgId);
socket.emit('join-token', tokenId);
```

### Listen for Updates
```javascript
socket.on('queue-update', (data) => {
  // Queue status changed
});

socket.on('token-update', (data) => {
  // Token status changed
});

socket.on('org-update', (data) => {
  // Organization updated
});
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Best Practices

1. **Always include error handling** for API calls
2. **Store JWT tokens securely** (localStorage or httpOnly cookies)
3. **Implement retry logic** for failed requests
4. **Use Socket.IO** for real-time updates
5. **Respect rate limits** to avoid being blocked
6. **Validate input** on the client side before sending

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-01
