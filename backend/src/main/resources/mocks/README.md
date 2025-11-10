# Mock Data for Testing

This directory contains mock data used for testing purposes. The application now uses the Spoonacular API for live data.

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
Individual recipe detail files (e.g., `recipe-642539.json`, `recipe-654812.json`, `recipe-715497.json`, `recipe-782601.json`).

These files contain full recipe information including:
- Ingredients with nutritional data
- Cooking instructions
- Preparation time
- Servings
- And more detailed information

**Usage:** Used by `RecipeDetailService` to serve recipe detail requests (`GET /api/v1/recipes/{id}`) and ingredient exclusion requests (`POST /api/v1/recipes/{id}/exclude-ingredients`) without hitting the external Spoonacular API.

## Usage

Mock data is now used only for:
- **Unit tests** - Consistent test data for predictable test results
- **Integration tests** - Testing without external API dependencies
- **Development reference** - Examples of expected API response structure

The application now uses the Spoonacular API integration via `SpoonacularClient` for live data.

## Updating Mock Data

To update or add mock data:

1. Obtain real data from Spoonacular API (requires API key)
2. Format according to the structure shown above
3. Ensure JSON is valid and properly formatted
4. Place in this directory
5. Update this README if adding new files

## Spoonacular API Integration

The application has been successfully integrated with the Spoonacular API:
1. ✅ `SpoonacularClient` implemented with full error handling
2. ✅ `RecipeSearchService` uses SpoonacularClient for live searches
3. ✅ `RecipeRepository` uses SpoonacularClient with Spring Cache
4. ✅ Mock data retained for testing purposes
