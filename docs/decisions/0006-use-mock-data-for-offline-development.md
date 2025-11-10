---
status: "superseded"
date: 2025-11-10
superseded-date: 2025-11-10
superseded-by: "Live Spoonacular API integration with Spring Cache (implemented 2025-11-10)"
---

# Use Mock Data for Offline Development

## Current Status

**⚠️ This ADR has been SUPERSEDED**

**Superseded by:** Live Spoonacular API integration with Spring Cache (Caffeine)  
**Date superseded:** 2025-11-10  
**Reason:** Application evolved from offline development with mocks to production-ready live API integration

The application now uses **live Spoonacular API integration** via `SpoonacularClient` with `RestClient` (Spring 6.2). Mock data in `backend/src/main/resources/mocks/` is **retained only for unit and integration tests**, not for offline development or runtime use.

For current Spoonacular API integration details, see:
- [Backend README - Spoonacular Integration](../../backend/README.md#spoonacular-api-integration)
- [Architecture - Caching Strategy](../architecture/README.md#caching-strategy)

### What Changed

- **Before**: Mock data loaded at startup for offline development
- **After**: Live API integration with Spring Cache (Caffeine) for performance
- **Mock data now**: Used exclusively in test classes, not loaded at application startup
- **Implementation**: `app.luqma.backend.client.SpoonacularClient` handles all API communication

### Related Components

- `SpoonacularClient` - HTTP client for Spoonacular API integration
- `SpoonacularConfig` - RestClient configuration with API key authentication
- `RecipeRepository` - Spring Cache implementation (1 hour TTL, max 500 recipes)
- `MockDataLoader` - Utility retained for test data loading only

---

## Historical Context

*The content below documents the original decision for historical reference.*

## Context and Problem Statement

Backend integrates with Spoonacular API which requires API key and has rate limits. How do we enable offline development without consuming API quota?

## Decision Drivers

- Enable offline development
- Conserve API quota during development
- Fast test execution
- Simple setup for new developers

## Considered Options

1. Mock data from JSON files (chosen at the time)
2. In-memory hardcoded data
3. Local database with seeded data

## Decision Outcome (Original)

Chosen option: **Mock data from JSON files**

Store JSON files in `backend/src/main/resources/mocks/` that replicate Spoonacular API responses. Load at startup via `MockDataLoader` utility.

### Consequences (As Originally Envisioned)

- Good: No API calls during development
- Good: Fast, predictable tests
- Bad: Must manually update when API changes

## Pros and Cons of the Options

### Mock data from JSON files

- Good: Version controlled, easy to share
- Bad: Manual sync with API changes

### In-memory hardcoded data

- Good: No file I/O
- Bad: Hard to maintain complex data

### Local database with seeded data

- Good: Supports complex queries
- Bad: Additional infrastructure complexity
