---
status: "accepted"
date: 2025-11-10
---

# Use Proportional Estimation for Nutrition Calculation with Ingredient Exclusion

## Context and Problem Statement

When users exclude ingredients from a recipe, how should we recalculate the nutritional information to reflect the modified recipe? The Spoonacular API provides recipe-level nutrition but may not always provide detailed nutrition data for individual ingredients, making it challenging to accurately calculate the impact of excluding specific ingredients.

## Decision Drivers

- Accuracy of nutritional information
- User experience and transparency
- API data availability constraints
- Performance and complexity
- Maintainability

## Considered Options

1. **Hybrid approach: Ingredient-level nutrition with proportional estimation fallback** (chosen)
2. No recalculation (show warning that nutrition may be inaccurate)
3. Simple percentage reduction (divide by remaining ingredient count)
4. Always use proportional estimation based on weight/volume

## Decision Outcome

Chosen option: **Hybrid approach: Ingredient-level nutrition with proportional estimation fallback**

The `NutritionCalculationService` implements a two-tier calculation strategy:

1. **Primary**: Use ingredient-level nutrition data when available from the API
   - Sum nutrients from excluded ingredients
   - Subtract from recipe totals
   - Most accurate when data is available

2. **Fallback**: Proportional estimation based on ingredient weights
   - Calculate proportion of excluded ingredients relative to total recipe weight
   - Apply proportion to reduce each nutrient
   - Example: If excluded ingredients represent 25% of recipe weight, reduce all nutrients by ~25%

### Weight Conversion Strategy

Converts all ingredients to grams for comparison:
- Weight units: Direct conversion (oz → g, lb → g, kg → g)
- Volume units: Approximate conversion (cup → 240g, tbsp → 15g, tsp → 5g)
- Count-based units: Estimated weight (1 clove ≈ 50g, 1 piece ≈ 50g)
- Unknown/unitless: Default estimation (100g per unit)

### Consequences

- Good: Provides accurate nutrition when ingredient-level data is available
- Good: Graceful degradation with reasonable estimates when data is unavailable
- Good: Transparent approach that can be explained to users
- Good: Better than showing incorrect original nutrition or no nutrition at all
- Neutral: Estimation accuracy depends on ingredient data quality and unit conversions
- Bad: Volume-to-weight conversions are approximate (density varies by ingredient)
- Bad: May slightly underestimate or overestimate impact for certain ingredient types

### Confirmation

Implementation verified through:
- Unit tests in `NutritionCalculationServiceTest` covering both calculation paths
- Proportional calculation tests in `NutritionCalculationServiceProportionalTest`
- Integration testing with real recipe data
- Logging at debug level to track which calculation method is used

## Pros and Cons of the Options

### Hybrid approach (ingredient-level + proportional fallback)

- Good: Best accuracy when ingredient nutrition data is available
- Good: Reasonable fallback when data is missing
- Good: Handles edge cases (zero weight, missing units)
- Good: User gets updated nutrition in all scenarios
- Neutral: More complex implementation
- Bad: Approximations introduce some inaccuracy
- Bad: Volume-to-weight conversions are not precise

### No recalculation (warning only)

- Good: Simple implementation
- Good: No risk of providing incorrect estimates
- Bad: Poor user experience (no updated nutrition)
- Bad: Users must manually estimate nutritional impact
- Bad: Defeats purpose of ingredient exclusion feature

### Simple percentage reduction (by ingredient count)

- Good: Simple to implement and understand
- Good: No need for weight conversions
- Bad: Highly inaccurate (1 pinch of salt ≠ 1 cup of flour)
- Bad: Could mislead users about nutritional content
- Bad: Ignores actual ingredient quantities

### Always use proportional estimation

- Good: Consistent calculation method
- Good: Simpler implementation than hybrid
- Neutral: Reasonable accuracy for most cases
- Bad: Less accurate when ingredient-level nutrition is available
- Bad: Misses opportunity to use more precise API data

## More Information

**Implementation**: `app.luqma.backend.service.NutritionCalculationService`

**Related Features**:
- Recipe detail page displays recalculated nutrition
- Frontend ingredient exclusion panel (`RecipeExclusionContext`)
- POST `/api/v1/recipes/{id}/exclude-ingredients` endpoint

**Future Improvements**:
- Add user-facing indicator showing calculation method used (actual vs. estimated)
- Implement ingredient-specific density database for better volume-to-weight conversions
- Add nutrition uncertainty ranges (e.g., "±10%") when using estimation
- Allow users to manually adjust ingredient amounts for more precise calculations

**Trade-offs Accepted**:
- Approximations are acceptable given the alternative is no updated nutrition
- Volume conversions use average densities (water-based approximation)
- Count-based items use rough estimates (actual sizes vary)

The decision prioritizes providing useful nutritional information over perfect accuracy, with transparent fallback behavior when precise data is unavailable.

