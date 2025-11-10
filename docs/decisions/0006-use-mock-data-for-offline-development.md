---
status: "accepted"
date: 2025-11-10
updated: 2025-11-10
---

# Use Mock Data for Offline Development

## Current Status

**✅ This ADR is ACTIVE** (Backend Mock Profile)

The application supports both live and mock modes:

**Backend Mock Profile (`mock`):**
- Active and fully supported for offline development
- Uses mock data from `backend/src/main/resources/mocks/`
- Activated via `--spring.profiles.active=mock` or `npm run dev:mock`
- Includes configurable latency and error simulation
- No Spoonacular API key required

**Frontend Mock Data:**
- Removed as of 2025-11-10
- Frontend now always calls backend API (live or mock)
- Frontend tests mock `apiClient` directly using `vi.mock()`
- No longer uses JSON mock files in `frontend/src/test/mocks/`

**Live Mode (Default):**
- Uses Spoonacular API with Spring Cache (Caffeine)
- Requires API key in `backend/.env`
- Caches recipe details for 1 hour

### Current Implementation

**Backend Mock Profile:**
- Configuration: `backend/src/main/resources/application-mock.yaml`
- Mock data: `backend/src/main/resources/mocks/` (JSON files)
- Mock client: `MockSpoonacularClient` (implements `SpoonacularClientInterface`)
- Activation: Spring profile `mock`
- Usage: Offline development, API quota conservation, consistent testing

**Live API Integration:**
- Client: `SpoonacularClient` (RestClient-based)
- Configuration: `SpoonacularConfig` with API key authentication
- Caching: `RecipeRepository` with Spring Cache (Caffeine, 1h TTL)
- Activation: Spring profiles `dev` or `prod` (default)

**Frontend Changes (2025-11-10):**
- Mock data files removed from `frontend/src/test/mocks/`
- Tests now mock `@/services/apiClient` directly
- Frontend always calls backend (which may be in mock or live mode)
- No frontend-side data mocking

### Related Components

- `MockSpoonacularClient` - Mock implementation for offline development
- `SpoonacularClient` - Live API integration with RestClient
- `SpoonacularConfig` - Configuration and RestClient bean setup
- `RecipeRepository` - Spring Cache implementation (live mode only)
- `application-mock.yaml` - Mock profile configuration

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
