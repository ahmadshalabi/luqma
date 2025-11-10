---
status: "accepted"
date: 2025-11-10
---

# Use Context API for Cross-Component State

## Context and Problem Statement

Some features require state shared across multiple components (e.g., ingredient exclusion affecting ingredient list, nutrition panel, and exclusion display). What state management approach should we use?

## Decision Drivers

- Simplicity over complexity
- Zero external dependencies
- Team familiarity
- Appropriate for application size

## Considered Options

1. React Context API (chosen)
2. Redux Toolkit
3. Zustand

## Decision Outcome

Chosen option: **React Context API**

Context API is sufficient for our needs and built into React. Use URL state (`useSearchParams`) for search/pagination to enable shareable URLs.

### Consequences

- Good: No additional dependencies or bundle size
- Good: Team familiar with React hooks
- Bad: More verbose than state libraries

## Pros and Cons of the Options

### React Context API

- Good: Built into React
- Bad: More boilerplate than alternatives

### Redux Toolkit

- Good: Excellent DevTools
- Bad: ~11KB bundle size, overkill for our needs

### Zustand

- Good: Minimal (~1KB)
- Bad: Additional dependency to maintain

