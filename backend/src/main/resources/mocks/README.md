# Mock Data for Development

This directory contains mock data used for local development and testing without requiring external API calls to Spoonacular.

## Files

### recipe-search-results.json
Mock response data for the recipe search endpoint (`/api/v1/recipes/search`).

**Structure:**
```json
{
  "results": [
    {
      "id": 654812,
      "title": "Pasta and Seafood",
      "image": "https://img.spoonacular.com/recipes/654812-556x370.jpg",
      "imageType": "jpg"
    },
    ...
  ],
  "offset": 0,
  "number": 10,
  "totalResults": 47
}
```

**Fields:**
- `results`: Array of recipe summaries
- `offset`: Starting position (for pagination, legacy field)
- `number`: Number of results returned (legacy field)
- `totalResults`: Total number of matching recipes

**Note:** The `offset` and `number` fields in the mock data are from the original Spoonacular API response format. The backend API uses `page` and `pageSize` instead for a more RESTful approach.

### recipe-*.json
Individual recipe detail files (e.g., `recipe-642539.json`, `recipe-654812.json`).

These files contain full recipe information including:
- Ingredients with nutritional data
- Cooking instructions
- Preparation time
- Servings
- And more detailed information

**Usage:** Currently not used. Reserved for future implementation of the recipe detail endpoint (`/api/v1/recipes/{id}`).

## Usage

The `RecipeSearchService` loads `recipe-search-results.json` on application startup and uses it to serve search requests without hitting the external Spoonacular API.

This approach provides:
- **Faster development** - No API key needed for basic development
- **Offline capability** - Work without internet connection
- **Consistent test data** - Predictable results for testing
- **Cost savings** - Avoid API quota limits during development

## Updating Mock Data

To update or add mock data:

1. Obtain real data from Spoonacular API (requires API key)
2. Format according to the structure shown above
3. Ensure JSON is valid and properly formatted
4. Place in this directory
5. Update this README if adding new files

## Transition to Real API

When implementing the Spoonacular API client:
1. Create `SpoonacularClient` in `backend/src/main/java/app/luqma/backend/client/`
2. Update `RecipeSearchService` to use the client instead of mock data
3. Keep mock data for testing purposes
4. Use Spring profiles to switch between mock and real data
