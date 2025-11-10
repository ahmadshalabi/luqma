# Luqma Architecture

This document provides visual representations of the Luqma application architecture, including system design, layer organization, component hierarchy, and data flows.

## Table of Contents

- [System Architecture](#system-architecture)
- [Backend Layer Architecture](#backend-layer-architecture)
- [Frontend Component Hierarchy](#frontend-component-hierarchy)
- [Data Flow: Recipe Search](#data-flow-recipe-search)
- [Data Flow: Ingredient Exclusion](#data-flow-ingredient-exclusion)
- [Caching Strategy](#caching-strategy)
- [Related Documentation](#related-documentation)

---

## System Architecture

High-level system design showing how components interact.

```
┌──────────────────────────────────────────────────────────────────────┐
│                              User                                     │
│                          (Web Browser)                                │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      Frontend (React 19)                              │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Port: 3000 (dev) / 80/443 (prod)                              │  │
│  │  • React Router for navigation                                 │  │
│  │  • TailwindCSS for styling                                     │  │
│  │  • Context API for state management                            │  │
│  │  • Custom hooks for business logic                             │  │
│  │  • Fetch API for HTTP requests                                 │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 │ HTTP/REST API
                                 │ (/api/v1/recipes/*)
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot 3.5)                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Port: 8080 (configurable)                                     │  │
│  │  • REST Controllers (API endpoints)                            │  │
│  │  • Service Layer (business logic)                              │  │
│  │  • Repository Layer (caching with Caffeine)                    │  │
│  │  • Client Layer (Spoonacular API integration)                  │  │
│  │  • Exception Handling (GlobalExceptionHandler)                 │  │
│  │  • Rate Limiting (100 req/min per IP)                          │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 │ HTTPS/REST API
                                 │ x-api-key header
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│               Spoonacular API (External Service)                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  • Recipe Search (complexSearch)                               │  │
│  │  • Recipe Details (/{id}/information)                          │  │
│  │  • Nutrition Data (included in recipe details)                 │  │
│  │  • Rate Limit: 150 req/day (free tier)                         │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Security Principles:**
- Frontend never calls Spoonacular directly (API key protected)
- Backend acts as proxy with rate limiting
- CORS configured per environment
- HTTPS enforced in production

---

## Backend Layer Architecture

Layered architecture following separation of concerns (see [ADR-0009](../decisions/0009-implement-layered-architecture-in-backend.md)).

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP Request                                  │
│                     (from Frontend Client)                           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  RecipeController                                             │  │
│  │  • @RestController + @RequestMapping("/api/v1/recipes")       │  │
│  │  • HTTP concerns only (request/response)                      │  │
│  │  • Input validation (@Valid)                                  │  │
│  │  • Returns ResponseEntity<T>                                  │  │
│  │                                                                │  │
│  │  Endpoints:                                                    │  │
│  │  • GET /search?query=...&page=...                             │  │
│  │  • GET /{id}                                                  │  │
│  │  • POST /{id}/exclude-ingredients                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ Delegates to
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  RecipeSearchService                                          │  │
│  │  • Search recipes with pagination                             │  │
│  │  • Validates search parameters                                │  │
│  │  • Transforms SpoonacularDTO → RecipeSummary                  │  │
│  │                                                                │  │
│  │  RecipeDetailService                                          │  │
│  │  • Fetch recipe details by ID                                 │  │
│  │  • Transforms SpoonacularDTO → RecipeDetail → Response DTO    │  │
│  │                                                                │  │
│  │  IngredientValidationService                                  │  │
│  │  • Validate ingredient IDs exist in recipe                    │  │
│  │  • Business rule enforcement                                  │  │
│  │                                                                │  │
│  │  NutritionCalculationService                                  │  │
│  │  • Recalculate nutrition after ingredient exclusion           │  │
│  │  • Hybrid approach: ingredient-level + proportional fallback  │  │
│  │  • Weight conversions and estimation (see ADR-0010)           │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ Uses
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    REPOSITORY LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  RecipeRepository                                             │  │
│  │  • Data access with caching                                   │  │
│  │  • @Cacheable("recipes") on findById()                        │  │
│  │  • Spring Cache (Caffeine)                                    │  │
│  │  • Cache: 1 hour TTL, max 500 recipes, LRU eviction          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ Calls
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  SpoonacularClient                                            │  │
│  │  • RestClient (Spring 6.2)                                    │  │
│  │  • HTTP client for Spoonacular API                            │  │
│  │  • API key authentication (x-api-key header)                  │  │
│  │  • Timeout configuration (10s connect, 30s read)              │  │
│  │  • Error handling (429, 4xx, 5xx)                             │  │
│  │                                                                │  │
│  │  Methods:                                                      │  │
│  │  • searchRecipes(query, page, pageSize)                       │  │
│  │  • getRecipeById(id)                                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
                         Spoonacular API
```

**Cross-Cutting Concerns:**
- **Exception Handling:** GlobalExceptionHandler catches all exceptions
- **Rate Limiting:** RateLimitFilter (100 req/min per IP)
- **Logging:** Structured logging with SLF4J (environment-aware)
- **Validation:** Jakarta Bean Validation on DTOs
- **Mapping:** RecipeMapper, NutrientExtractor

---

## Frontend Component Hierarchy

Feature-based component organization (see [ADR-0007](../decisions/0007-use-feature-based-component-organization.md)).

```
src/
│
├─ pages/                          # Route-level components
│  ├─ HomePage.jsx                 # Route: /
│  ├─ about/                       # Route: /about
│  │  ├─ AboutPage.jsx
│  │  ├─ FeaturesSection.jsx       # Page-specific
│  │  ├─ MissionSection.jsx        # Page-specific
│  │  └─ FeatureCard.jsx           # Page-specific
│  └─ recipe/                      # Route: /recipe/:id
│     ├─ RecipePage.jsx            # Main page component
│     ├─ RecipeContent.jsx         # Content wrapper
│     ├─ RecipeLoading.jsx         # Loading state
│     ├─ RecipeErrorState.jsx      # Error state
│     ├─ detail/                   # Recipe details (page-specific)
│     │  ├─ RecipeDetail.jsx
│     │  ├─ RecipeHeader.jsx
│     │  ├─ RecipeImage.jsx
│     │  ├─ RecipeMetadataBadge.jsx
│     │  └─ RecipeMetadataGroup.jsx
│     ├─ ingredients/              # Ingredients section (page-specific)
│     ├─ instructions/             # Instructions section (page-specific)
│     └─ nutrition/                # Nutrition section (page-specific)
│
├─ components/                     # Shared components (2+ pages)
│  ├─ layout/                      # Layout components
│  │  ├─ Header.jsx                # Site header with navigation
│  │  ├─ Footer.jsx                # Site footer
│  │  ├─ HeroSection.jsx           # Hero banner
│  │  ├─ SkipLink.jsx              # Accessibility skip link
│  │  └─ Container.jsx             # Content wrapper
│  │
│  ├─ search/                      # Search functionality
│  │  ├─ SearchBar.jsx             # Search input with debounce
│  │  ├─ SearchResults.jsx         # Results wrapper
│  │  ├─ ResultsHeader.jsx         # Results count/status
│  │  └─ Pagination.jsx            # Pagination controls
│  │
│  ├─ recipe/                      # Shared recipe components
│  │  └─ card/                     # Recipe cards
│  │     ├─ RecipeCard.jsx         # Individual recipe card
│  │     └─ RecipeGrid.jsx         # Grid layout for cards
│  │
│  └─ ui/                          # UI primitives (design system)
│     ├─ Button.jsx                # Button component
│     ├─ Card.jsx                  # Card container
│     ├─ Alert.jsx                 # Alert messages
│     ├─ Badge.jsx                 # Badges and tags
│     ├─ LoadingSpinner.jsx        # Loading indicator
│     ├─ Skeleton.jsx              # Skeleton loaders
│     ├─ LiveRegion.jsx            # Accessibility announcements
│     ├─ Collapsible.jsx           # Collapsible sections
│     ├─ Typography.jsx            # Text components
│     └─ ...                       # Other UI primitives
│
├─ hooks/                          # Custom hooks (see ADR-0008)
│  ├─ useSearch.js                 # Search state management
│  ├─ useSearchRecipes.js          # Recipe search API calls
│  ├─ useSearchState.js            # Search URL state sync
│  ├─ useRecipeDetail.js           # Recipe detail fetching
│  ├─ useRecipeExclusion.js        # Ingredient exclusion logic
│  ├─ useIngredientExclusion.js    # Exclusion UI state
│  ├─ usePaginationLogic.js        # Pagination calculations
│  ├─ useKeyboardNavigation.js     # Keyboard shortcuts/navigation
│  ├─ useImageFallback.js          # Image loading with fallback
│  ├─ useMobileMenu.js             # Mobile menu state
│  └─ useApiMutation.js            # Generic API mutations
│
├─ contexts/                       # React Context providers
│  └─ RecipeExclusionContext.jsx   # Ingredient exclusion state (see ADR-0004)
│
├─ services/                       # API clients
│  └─ apiClient.js                 # Backend API communication
│
├─ utils/                          # Utility functions
│  ├─ httpClient.js                # HTTP request wrapper
│  ├─ logger.js                    # Logging utility
│  ├─ iconRegistry.jsx             # Icon components
│  └─ colorUtils.js                # Color manipulation
│
└─ constants/                      # Application constants
   ├─ api.js                       # API configuration
   ├─ ui.js                        # UI constants
   ├─ validation.js                # Validation rules
   └─ index.js                     # Re-exports
```

**Principles:**
- **Co-location:** Page-specific components in `pages/{page}/`
- **Sharing:** Components used by 2+ pages in `components/`
- **Primitives:** Generic UI components in `components/ui/`
- **Logic Extraction:** Custom hooks for reusable stateful logic
- **Import Alias:** Use `@/` for all imports (not relative paths `../`)

---

## Data Flow: Recipe Search

Live search with URL state synchronization (see [ADR-0005](../decisions/0005-implement-live-search-on-homepage.md)).

```
┌─────────────────┐
│ User types in   │
│ SearchBar       │
└────────┬────────┘
         │
         │ onChange event
         ▼
┌─────────────────────────────────┐
│ useSearch hook                  │
│ • 300ms debounce                │
│ • Updates URL query params      │
│ • Triggers API call             │
└────────┬────────────────────────┘
         │
         │ Debounced query
         ▼
┌─────────────────────────────────┐
│ useSearchRecipes hook           │
│ • Calls apiClient.searchRecipes │
│ • Manages loading state         │
│ • Handles errors                │
└────────┬────────────────────────┘
         │
         │ HTTP GET
         ▼
┌─────────────────────────────────┐
│ Backend: RecipeController       │
│ GET /api/v1/recipes/search      │
│ ?query=pasta&page=1&pageSize=9  │
└────────┬────────────────────────┘
         │
         │ Validates & delegates
         ▼
┌─────────────────────────────────┐
│ RecipeSearchService             │
│ • Validates query (1-200 chars) │
│ • Calls SpoonacularClient       │
└────────┬────────────────────────┘
         │
         │ HTTPS with x-api-key
         ▼
┌─────────────────────────────────┐
│ Spoonacular API                 │
│ complexSearch endpoint          │
│ titleMatch parameter            │
└────────┬────────────────────────┘
         │
         │ JSON response
         ▼
┌─────────────────────────────────┐
│ RecipeSearchService             │
│ • Maps SpoonacularDTO           │
│ • Creates RecipeSummary list    │
│ • Wraps in RecipeSearchResponse │
└────────┬────────────────────────┘
         │
         │ ResponseEntity<RecipeSearchResponse>
         ▼
┌─────────────────────────────────┐
│ Frontend: SearchResults         │
│ • Updates UI with results       │
│ • Shows skeleton while loading  │
│ • Displays error if failed      │
│ • Announces to screen readers   │
└─────────────────────────────────┘
         │
         │ Rendered
         ▼
┌─────────────────────────────────┐
│ RecipeGrid with RecipeCards     │
│ • Grid layout (responsive)      │
│ • Each card shows recipe summary│
│ • Click navigates to details    │
└─────────────────────────────────┘
```

**Key Features:**
- **Debouncing:** 300ms delay prevents excessive API calls
- **URL State:** Query persisted in URL for sharing/bookmarking
- **Skeleton Loading:** Better perceived performance
- **Error Handling:** User-friendly error messages
- **Accessibility:** Live region announces result count

---

## Data Flow: Ingredient Exclusion

Dynamic nutrition recalculation (see [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)).

```
┌───────────────────────────────────┐
│ User on RecipePage                │
│ • Views recipe with ingredients   │
│ • Clicks "Exclude Ingredient"     │
└───────────┬───────────────────────┘
            │
            │ Click event
            ▼
┌───────────────────────────────────┐
│ RecipeExclusionContext            │
│ • Tracks excluded ingredient IDs  │
│ • useIngredientExclusion hook     │
└───────────┬───────────────────────┘
            │
            │ User clicks "Apply"
            ▼
┌───────────────────────────────────┐
│ useRecipeExclusion hook           │
│ • Calls apiClient                 │
│ • POST /recipes/{id}/exclude-ingredients │
│ • Body: { ingredientIds: [1,2,3] }│
└───────────┬───────────────────────┘
            │
            │ HTTP POST
            ▼
┌───────────────────────────────────┐
│ Backend: RecipeController         │
│ POST /api/v1/recipes/{id}/exclude-ingredients │
│ • Validates request body          │
└───────────┬───────────────────────┘
            │
            │ Delegates
            ▼
┌───────────────────────────────────┐
│ RecipeDetailService               │
│ 1. Fetch recipe (from cache/API)  │
│ 2. Validate ingredient IDs        │
│ 3. Call NutritionCalculationService│
└───────────┬───────────────────────┘
            │
            │ Hybrid calculation
            ▼
┌───────────────────────────────────────────────────────────┐
│ NutritionCalculationService                               │
│                                                           │
│ Strategy 1: Ingredient-level nutrition (if available)     │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ 1. Sum nutrients from excluded ingredients          │  │
│ │ 2. Subtract from recipe totals                      │  │
│ │ 3. Most accurate method                             │  │
│ └─────────────────────────────────────────────────────┘  │
│                                                           │
│ Strategy 2: Proportional estimation (fallback)            │
│ ┌─────────────────────────────────────────────────────┐  │
│ │ 1. Convert all ingredients to grams                 │  │
│ │    • Weight units: direct conversion                │  │
│ │    • Volume units: approximate (cup=240g, tbsp=15g) │  │
│ │    • Count units: estimate (1 clove=50g)            │  │
│ │ 2. Calculate excluded weight / total weight         │  │
│ │ 3. Reduce all nutrients by that proportion          │  │
│ │ 4. Reasonable estimate when data unavailable        │  │
│ └─────────────────────────────────────────────────────┘  │
└───────────┬───────────────────────────────────────────────┘
            │
            │ Recalculated RecipeDetail
            ▼
┌───────────────────────────────────┐
│ RecipeDetailService               │
│ • Maps to RecipeDetailResponse    │
│ • Removes excluded ingredients    │
│ • Includes updated nutrition      │
└───────────┬───────────────────────┘
            │
            │ ResponseEntity<RecipeDetailResponse>
            ▼
┌───────────────────────────────────┐
│ Frontend: RecipePage              │
│ • Updates UI with new data        │
│ • Shows updated ingredient list   │
│ • Displays new nutrition facts    │
│ • Announces change to screen reader│
└───────────────────────────────────┘
```

**Calculation Details:**
1. **Try ingredient-level first:** If Spoonacular provides per-ingredient nutrition
2. **Fall back to proportional:** Based on weight/volume conversions
3. **Transparent logging:** Debug logs show which method was used
4. **User feedback:** UI shows updated nutrition immediately

---

## Caching Strategy

Spring Cache with Caffeine for performance optimization.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                              │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  RecipeRepository.findById(recipeId)                             │
│  @Cacheable("recipes")                                           │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                         Cache Hit? ├─── YES ─────┐
                                  │               │
                                  NO              │
                                  │               │
                                  ▼               ▼
┌─────────────────────────────────────┐   ┌──────────────────┐
│  SpoonacularClient                  │   │  Return Cached   │
│  • Call GET /recipes/{id}           │   │  RecipeDetail    │
│  • With API key header              │   │  (fast response) │
│  • Parse response                   │   └──────────────────┘
└─────────────────┬───────────────────┘
                  │
                  │ RecipeDetail
                  ▼
┌─────────────────────────────────────┐
│  Store in Cache                     │
│  • Key: recipeId                    │
│  • Value: RecipeDetail              │
│  • TTL: 1 hour (3600 seconds)       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Return RecipeDetail                │
└─────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Cache Configuration                            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Name: "recipes"                                          │  │
│  │  Provider: Caffeine                                       │  │
│  │  Max Size: 500 recipes                                    │  │
│  │  TTL: 1 hour (expireAfterWrite=3600s)                     │  │
│  │  Eviction: LRU (Least Recently Used)                      │  │
│  │  Config: application.yaml + SpoonacularConfig             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Benefits:**
- **Performance:** Sub-millisecond response for cached recipes
- **Cost Savings:** Reduces Spoonacular API calls (150/day free tier)
- **User Experience:** Instant responses for popular recipes
- **Scalability:** Handles 500 most popular recipes efficiently

**When Cache is Used:**
- Recipe details (GET /api/v1/recipes/{id})
- Ingredient exclusion (fetches recipe, applies calculation, no re-cache)

**When Cache is Bypassed:**
- Recipe search (always fresh, Spoonacular provides pagination)
- Initial recipe detail requests (cache miss, then cached)

---

## Related Documentation

### Architecture Decision Records
- [ADR-0002: Monorepo Structure](../decisions/0002-use-monorepo-structure.md)
- [ADR-0004: Context API for State Management](../decisions/0004-use-context-api-for-state-management.md)
- [ADR-0005: Live Search Implementation](../decisions/0005-implement-live-search-on-homepage.md)
- [ADR-0007: Feature-Based Component Organization](../decisions/0007-use-feature-based-component-organization.md)
- [ADR-0008: Custom Hooks for Business Logic](../decisions/0008-use-custom-hooks-for-business-logic.md)
- [ADR-0009: Layered Architecture in Backend](../decisions/0009-implement-layered-architecture-in-backend.md)
- [ADR-0010: Proportional Nutrition Estimation](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md)

### Technical Documentation
- [Backend Domain Models](../../backend/docs/domain-models.md)
- [API Documentation](../api/README.md)
- [Backend README](../../backend/README.md)
- [Frontend README](../../frontend/README.md)

### Standards & Guidelines
- [Project Context](../../.cursor/rules/luqma-project.mdc)
- [Backend Standards](../../backend/.cursor/rules/backend-standards.mdc)
- [Frontend Standards](../../frontend/.cursor/rules/frontend-standards.mdc)
- [Security Standards](../../.cursor/rules/security-standards.mdc)

---

## Questions?

For more information:
1. Review [Documentation Index](../README.md)
2. Check relevant ADRs
3. Read layer-specific documentation
4. Explore codebase structure

**Navigation:** [Documentation Index](../README.md) | [Main README](../../README.md)

