# Domain Models

This document describes the domain models for the Luqma backend.

## Purpose

Domain models represent the core business entities and logic of the application. They are distinct from DTOs (Data Transfer Objects) which are used for API communication.

## Implemented Models

The `model.domain` package includes:

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

Domain models are used in:
1. **Service layer** - Business logic and calculations
2. **Data transformation** - Converting between Spoonacular API formats and internal representation
3. **Recipe manipulation** - Ingredient exclusion and nutritional recalculation (see ADR-0010)

## Current Status

**Status:** ✅ Implemented

The `model.domain` package now includes:
- **RecipeDetail** - Complete recipe information with ingredients, nutrition, and instructions
- **ExtendedIngredient** - Individual ingredients with measurements
- **NutritionInfo** - Detailed nutritional breakdown with macronutrients
- **Nutrient** - Individual nutrient information with amounts and percentages
- **AnalyzedInstruction** - Cooking instructions with steps
- **InstructionStep** - Individual instruction steps

Domain models are now used with live data from Spoonacular API via `SpoonacularClient`. Mock data in `backend/src/main/resources/mocks/` is retained for testing purposes only

## Related Packages

- `model.dto` - API request/response objects for external communication
- `service` - Business logic that uses domain models
- `client` - External API clients (SpoonacularClient) that populate domain models
- `mapper` - Object mapping utilities (RecipeMapper, NutrientExtractor)

