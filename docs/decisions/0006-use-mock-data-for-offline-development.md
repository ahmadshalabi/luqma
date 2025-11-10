---
status: "accepted"
date: 2025-11-10
---

# Use Mock Data for Offline Development

## Context and Problem Statement

Backend integrates with Spoonacular API which requires API key and has rate limits. How do we enable offline development without consuming API quota?

## Decision Drivers

- Enable offline development
- Conserve API quota during development
- Fast test execution
- Simple setup for new developers

## Considered Options

1. Mock data from JSON files (chosen)
2. In-memory hardcoded data
3. Local database with seeded data

## Decision Outcome

Chosen option: **Mock data from JSON files**

Store JSON files in `backend/src/main/resources/mocks/` that replicate Spoonacular API responses. Load at startup via `MockDataLoader` utility.

### Consequences

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
