---
status: "accepted"
date: 2025-11-10
---

# Use Custom Hooks for Business Logic

## Context and Problem Statement

React components can become bloated when mixing presentation with business logic (API calls, state management, side effects). How do we separate concerns?

## Decision Drivers

- Separation of concerns
- Code reusability
- Testability
- Component simplicity

## Considered Options

1. Custom hooks (chosen)
2. Higher-order components (HOCs)
3. Keep logic in components

## Decision Outcome

Chosen option: **Custom hooks**

Extract business logic into custom hooks (data fetching, form handling, UI state). Components focus on presentation.

Examples: `useRecipeDetail(id)`, `useSearch({ onChange, debounceMs })`, `useSearchState()`

### Consequences

- Good: Clean separation, easy to test
- Good: Logic reuse across components
- Bad: Learning curve for hooks

## Pros and Cons of the Options

### Custom hooks

- Good: Pure JavaScript, composable, testable
- Bad: Must follow Rules of Hooks

### Higher-order components

- Good: Reusable component enhancement
- Bad: Wrapper hell, legacy pattern

### Keep logic in components

- Good: Everything in one place
- Bad: Large files, duplication, hard to test
