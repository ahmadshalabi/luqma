# Mock Data

This directory contains mock data from the Spoonacular API for development and testing purposes.

## Purpose

These mock files replicate actual Spoonacular API responses to enable frontend development without requiring live API calls or backend implementation. This approach:

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
import { getRecipeSearchResults, getRecipeById } from '@/mocks'

// Get all search results
const searchResults = getRecipeSearchResults()

// Get specific recipe by ID
const recipe = getRecipeById(654812)
```

## Data Structure

Mock data matches the structure of actual Spoonacular API responses:

**Search Results:**
```json
{
  "results": [...],
  "offset": 0,
  "number": 10,
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

## When to Remove

These mocks should be removed once:
1. Backend API endpoints are fully implemented
2. Frontend is integrated with backend services
3. All components use the API client instead of mock imports

## Related

- Backend mocks: `backend/src/main/resources/mocks/`
- API client: `frontend/src/services/api.js` (to be implemented)

