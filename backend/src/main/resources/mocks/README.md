# Backend Mock Data

This directory contains mock Spoonacular API response data for backend development and testing.

## Purpose

These JSON files contain actual Spoonacular API response examples used for:

- Unit testing backend services
- Integration testing
- Development without hitting rate limits
- Consistent test fixtures

## Files

- `recipe-search-results.json` - Sample response from `/recipes/complexSearch` endpoint
- `recipe-{id}.json` - Sample responses from `/recipes/{id}/information` endpoint

## Usage in Tests

```java
// Load mock data in test classes
@Test
void testRecipeSearch() {
    String mockJson = loadMockFile("mocks/recipe-search-results.json");
    // Use in test assertions
}
```

## Data Source

All mock data is sourced from actual Spoonacular API responses and follows their exact schema.

API Documentation: https://spoonacular.com/food-api/docs

## Updating Mocks

When Spoonacular API changes:
1. Fetch fresh response from API
2. Update corresponding JSON file
3. Run test suite to ensure compatibility
4. Update API client if schema changed

## Related

- Frontend mocks: `frontend/src/mocks/`
- Spoonacular client: `backend/src/main/java/app/luqma/backend/client/` (pending implementation)

