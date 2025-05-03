# PumpSui API Documentation

This document provides detailed information about the PumpSui API endpoints, request/response formats, and authentication requirements.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.pumpsui.com/api`

## Authentication

Most endpoints do not require authentication as they provide public data. However, some endpoints related to user-specific actions may require wallet authentication in the future.

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses have the following format:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Rate Limiting

API requests are limited to 100 requests per IP address per 15-minute window. When the rate limit is exceeded, the API returns a `429 Too Many Requests` status code.

## Endpoints

### Coins

#### Get All Coins

Retrieves a list of all meme coins.

- **URL**: `/coins`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of coins to return (default: 50, max: 100)
  - `offset` (optional): Offset for pagination (default: 0)
  - `sort` (optional): Field to sort by (default: "price", options: "price", "name", "createdAt")
  - `order` (optional): Sort order (default: "desc", options: "asc", "desc")

**Response**:

```json
{
  "coins": [
    {
      "id": "string",
      "objectId": "string",
      "name": "string",
      "symbol": "string",
      "description": "string (optional)",
      "creatorAddress": "string",
      "supply": "string",
      "price": "number",
      "imageUrl": "string (optional)",
      "createdAt": "string (ISO date)"
    }
  ],
  "pagination": {
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

#### Get Trending Coins

Retrieves a list of trending meme coins based on recent transaction volume.

- **URL**: `/coins/trending`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of coins to return (default: 6, max: 20)

**Response**:

```json
[
  {
    "id": "string",
    "objectId": "string",
    "name": "string",
    "symbol": "string",
    "description": "string (optional)",
    "creatorAddress": "string",
    "supply": "string",
    "price": "number",
    "imageUrl": "string (optional)",
    "createdAt": "string (ISO date)",
    "_count": {
      "transactions": "number"
    }
  }
]
```

#### Get Coin by ID

Retrieves detailed information about a specific coin.

- **URL**: `/coins/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: Coin ID

**Response**:

```json
{
  "id": "string",
  "objectId": "string",
  "name": "string",
  "symbol": "string",
  "description": "string (optional)",
  "creatorAddress": "string",
  "supply": "string",
  "price": "number",
  "imageUrl": "string (optional)",
  "createdAt": "string (ISO date)",
  "transactions": [
    {
      "id": "string",
      "txId": "string",
      "coinId": "string",
      "type": "string (BUY, SELL, BURN)",
      "amount": "string",
      "price": "number",
      "walletAddress": "string",
      "timestamp": "string (ISO date)"
    }
  ]
}
```

### Transactions

#### Get Transactions by Coin ID

Retrieves transactions for a specific coin.

- **URL**: `/transactions/:coinId`
- **Method**: `GET`
- **URL Parameters**:
  - `coinId`: Coin ID
- **Query Parameters**:
  - `limit` (optional): Number of transactions to return (default: 20, max: 100)
  - `offset` (optional): Offset for pagination (default: 0)
  - `type` (optional): Filter by transaction type (options: "BUY", "SELL", "BURN")

**Response**:

```json
{
  "transactions": [
    {
      "id": "string",
      "txId": "string",
      "coinId": "string",
      "type": "string (BUY, SELL, BURN)",
      "amount": "string",
      "price": "number",
      "walletAddress": "string",
      "timestamp": "string (ISO date)"
    }
  ],
  "pagination": {
    "total": "number",
    "limit": "number",
    "offset": "number"
  }
}
```

## WebSocket API

PumpSui also provides a WebSocket API for real-time updates.

### Connection

Connect to the WebSocket server at:

- **Development**: `ws://localhost:3000`
- **Production**: `wss://api.pumpsui.com`

### Events

#### Subscribe to Coin Updates

```javascript
// Client -> Server
socket.emit('subscribe', coinId);
```

#### Unsubscribe from Coin Updates

```javascript
// Client -> Server
socket.emit('unsubscribe', coinId);
```

#### Coin Created Event

```javascript
// Server -> Client
socket.on('coin:created', (coinData) => {
  // Handle new coin creation
});
```

#### Transaction Event

```javascript
// Server -> Client
socket.on('transaction', (transactionData) => {
  // Handle new transaction for subscribed coin
});
```

#### Price Update Event

```javascript
// Server -> Client
socket.on('price:update', (priceData) => {
  // Handle price update for subscribed coin
});
```

## Example Usage

### Fetch Trending Coins

```javascript
fetch('https://api.pumpsui.com/api/coins/trending')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Subscribe to Coin Updates

```javascript
import io from 'socket.io-client';

const socket = io('wss://api.pumpsui.com');

// Subscribe to updates for a specific coin
socket.emit('subscribe', 'coin-id-123');

// Listen for transaction events
socket.on('transaction', (transaction) => {
  console.log('New transaction:', transaction);
});

// Listen for price updates
socket.on('price:update', (priceData) => {
  console.log('Price updated:', priceData);
});

// Unsubscribe when done
socket.emit('unsubscribe', 'coin-id-123');
```

## Rate Limiting Considerations

To avoid rate limiting issues:

1. Cache responses when appropriate
2. Implement exponential backoff for retries
3. Use WebSocket for real-time updates instead of polling

## Changelog

### v1.0.0 (2023-12-01)

- Initial API release
- Added endpoints for coins and transactions
- Added WebSocket support for real-time updates
