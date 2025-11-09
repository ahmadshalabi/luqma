# Domain Models

This document describes the planned domain models for the Luqma backend.

## Purpose

Domain models represent the core business entities and logic of the application. They are distinct from DTOs (Data Transfer Objects) which are used for API communication.

## Planned Models

When Spoonacular API integration is implemented, the `model.domain` package will include:

- **Recipe** - Complete recipe information including:
  - Basic details (id, title, description, image)
  - Nutritional information (calories, protein, carbs, fats)
  - Ingredients list with quantities
  - Preparation instructions
  - Cooking time and servings

- **Ingredient** - Individual ingredient with:
  - Ingredient ID and name
  - Nutritional values per unit
  - Unit of measurement
  - Potential allergen information

- **NutritionInfo** - Detailed nutritional breakdown:
  - Macronutrients (protein, carbs, fats)
  - Micronutrients (vitamins, minerals)
  - Calorie information

## Usage Pattern

Domain models will be used:
1. **Service layer** - Business logic and calculations
2. **Data transformation** - Converting between external API formats and internal representation
3. **Recipe manipulation** - Ingredient exclusion and nutritional recalculation

## Current Status

**Status:** Not yet implemented

**Why empty:** The application currently uses mock data that returns simple DTOs directly. Domain models will be created when:
- Spoonacular API client is implemented
- Recipe details endpoint is developed
- Ingredient exclusion feature requires complex business logic

## Related Packages

- `model.dto` - API request/response objects (currently in use)
- `service` - Business logic that will use domain models
- `client` - External API clients that will populate domain models

