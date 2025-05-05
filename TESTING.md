# Testing Guide for PumpSui

This document provides guidelines for testing the PumpSui application.

## Frontend Testing

The frontend uses Vitest and React Testing Library for unit tests, and Cypress for end-to-end tests.

### Running Frontend Unit Tests

```bash
cd frontend
npm run test        # Run all unit tests
npm run test:watch  # Run tests in watch mode
```

### Running Frontend End-to-End Tests

```bash
cd frontend
npm run cypress:open  # Open Cypress test runner
npm run cypress:run   # Run Cypress tests headlessly
npm run test:e2e      # Run all end-to-end tests
```

### Frontend Test Configuration

- `frontend/vitest.config.ts`: Configuration for Vitest
- `frontend/src/tests/setup.ts`: Setup file for tests, including jest-dom matchers
- `frontend/cypress.config.ts`: Configuration for Cypress
- `frontend/cypress/support/commands.ts`: Custom Cypress commands

### Writing Frontend Unit Tests

Example of a component test:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Button from '../../components/common/Button';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Writing Frontend End-to-End Tests

Example of a Cypress test:

```typescript
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the header', () => {
    cy.get('header').should('be.visible')
    cy.contains('PumpSui').should('be.visible')
  })

  it('displays trending coins section', () => {
    cy.contains('Trending Coins').should('be.visible')
    cy.get('[data-testid="trending-coins-loading"]').should('exist')
  })
})
```

## Backend Testing

The backend uses Jest for unit and integration tests.

### Running Backend Tests

```bash
cd backend
npm run test               # Run all tests
npm run test:unit          # Run all unit tests
npm run test:integration   # Run all integration tests
npm run test:controllers   # Run controller tests
npm run test:services      # Run service tests
npm run test:repositories  # Run repository tests
```

### Backend Test Configuration

- `backend/jest.config.js`: Configuration for Jest
- `backend/src/tests/setup.js`: Setup file for tests, including mocks for Redis and other dependencies

### Writing Backend Unit Tests

Example of a controller test:

```typescript
import { Request, Response } from 'express';
import { getCoins } from '../../../api/controllers/coinsController';
import { coinService } from '../../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../constants';

// Mock the coinService
jest.mock('../../../services', () => ({
  coinService: {
    getAllCoins: jest.fn(),
    getTotalCoins: jest.fn()
  }
}));

describe('Coins Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    mockRequest = {
      params: {},
      query: {},
      body: {}
    };

    mockResponse = {
      json: responseJson,
      status: responseStatus
    };

    jest.clearAllMocks();
  });

  it('should return coins with pagination', async () => {
    const mockCoins = [{ id: '1', name: 'TestCoin' }];
    const mockTotal = 1;

    (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
    (coinService.getTotalCoins as jest.Mock).mockResolvedValue(mockTotal);

    await getCoins(mockRequest as Request, mockResponse as Response);

    expect(coinService.getAllCoins).toHaveBeenCalledWith(1, 10);
    expect(coinService.getTotalCoins).toHaveBeenCalled();
    expect(responseJson).toHaveBeenCalledWith({
      data: mockCoins,
      pagination: {
        page: 1,
        limit: 10,
        total: mockTotal
      }
    });
  });
});
```

### Writing Backend Integration Tests

Example of an integration test:

```typescript
import request from 'supertest';
import express from 'express';
import { coinRoutes } from '../../api/routes';
import { coinService } from '../../services';

// Mock the coinService
jest.mock('../../services', () => ({
  coinService: {
    getAllCoins: jest.fn(),
    getTotalCoins: jest.fn()
  }
}));

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/coins', coinRoutes);

describe('Coin API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return coins with pagination', async () => {
    const mockCoins = [
      { id: '1', name: 'TestCoin1', symbol: 'TC1' },
      { id: '2', name: 'TestCoin2', symbol: 'TC2' }
    ];

    (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
    (coinService.getTotalCoins as jest.Mock).mockResolvedValue(2);

    const response = await request(app).get('/api/coins');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: mockCoins,
      pagination: {
        page: 1,
        limit: 10,
        total: 2
      }
    });
  });
});
```

## Test Coverage

To generate test coverage reports:

### Frontend

```bash
cd frontend
npm run test -- --coverage
```

### Backend

```bash
cd backend
npm run test -- --coverage
```

## Best Practices

1. **Mock External Dependencies**: Always mock external dependencies like Redis, databases, and APIs.
2. **Use Test Doubles**: Use mocks, stubs, and spies to isolate the code being tested.
3. **Test Edge Cases**: Test error handling, boundary conditions, and edge cases.
4. **Keep Tests Fast**: Tests should run quickly to encourage frequent testing.
5. **One Assertion Per Test**: Each test should focus on testing one specific behavior.
6. **Use Descriptive Test Names**: Test names should clearly describe what is being tested.
7. **Clean Up After Tests**: Reset state between tests to avoid test interdependence.
8. **Data-Test-ID Attributes**: Use `data-testid` attributes for selecting elements in tests.
9. **Avoid Testing Implementation Details**: Test behavior, not implementation.
10. **Separate Unit and Integration Tests**: Keep unit tests focused on isolated components.

## Troubleshooting

### Frontend Unit Tests

- If tests are failing with "Invalid Chai property" errors, check that jest-dom is properly configured in `frontend/src/tests/setup.ts`.
- Make sure you're using `vi.fn()` instead of `jest.fn()` for mocks in Vitest.

### Frontend E2E Tests

- If Cypress tests are failing to find elements, check that the selectors are correct.
- Use `cy.wait()` to wait for asynchronous operations to complete.
- Use `cy.intercept()` to mock API responses.

### Backend Tests

- If tests are hanging, check for unclosed connections to external services like Redis or databases.
- Use the `--detectOpenHandles` flag to identify open handles that are preventing Jest from exiting.
- Add timeouts to tests that might run for too long using `jest.setTimeout()`.
