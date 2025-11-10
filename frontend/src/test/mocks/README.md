# Mock Data

This directory contains mock data from the Spoonacular API for development and testing purposes.

## Purpose

These mock files replicate the Luqma backend API responses to enable frontend development without requiring a running backend server. This approach:

- Reduces API call costs during development
- Enables offline development
- Provides consistent test data
- Speeds up development iteration

## Files

- `index.js` - Helper module providing easy access to mock data
- `recipe-search-results.json` - Mock response for recipe search endpoint
- `recipe-{id}.json` - Individual recipe details (one file per recipe)

## Usage

Import the helper functions to access mock data:

```javascript
import { getRecipeSearchResults, getRecipeById } from '@/test/mocks'

// Get all search results
const searchResults = getRecipeSearchResults()

// Get specific recipe by ID
const recipe = getRecipeById(654812)
```

## Data Structure

Mock data matches the structure of the Luqma backend API responses:

**Search Results:**
```json
{
  "results": [...],
  "page": 1,
  "pageSize": 9,
  "totalResults": 100
}
```

**Recipe Details:**
```json
{
  "id": 654812,
  "title": "Recipe Name",
  "image": "https://...",
  ...
}
```

## Current Status

**Status:** Used for testing only

The frontend now uses the API client (`frontend/src/services/apiClient.js`) to communicate with the backend. These mocks are retained for:
- Unit testing components in isolation
- Test fixtures for Vitest tests
- Development when backend is unavailable

## When to Remove

These mocks should be kept for testing purposes but are no longer used in production code:
- ✅ Backend API endpoints are fully implemented (using Spoonacular API)
- ✅ Frontend is integrated with backend services via API client
- ✅ All components use the API client instead of direct mock imports

## Related

- Backend mocks: `backend/src/main/resources/mocks/` (used for backend testing only)
- API client: `frontend/src/services/apiClient.js` (✅ implemented)

