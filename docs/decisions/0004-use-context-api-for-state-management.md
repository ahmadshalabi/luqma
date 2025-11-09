---
status: "accepted"
date: 2025-11-07
---

# Use Context API for Frontend State Management

## Context and Problem Statement

The Luqma frontend requires global state management for recipes, search filters, and ingredient exclusions. The solution must handle state across multiple components while maintaining simplicity and avoiding unnecessary complexity. What state management approach should we adopt for the React frontend?

## Decision Drivers

- Team familiarity with React ecosystem
- Bundle size impact on initial load time
- Complexity of current and anticipated state management needs
- Learning curve for new developers
- Maintenance overhead
- Integration with React 19 features

## Considered Options

1. React Context API with useReducer
2. Redux Toolkit
3. Zustand

## Decision Outcome

Chosen option: **React Context API with useReducer**

The application's state management needs are straightforward: recipe data, search filters, and ingredient exclusions. Context API provides sufficient functionality without additional dependencies, and the team has strong familiarity with React's built-in state management patterns.

### Implementation Status

**Current State (as of 2025-11-09):** Context API is NOT currently implemented, and is not needed for the existing feature set.

**Current Approach:** The application uses URL-based state management with React Router's `useSearchParams` for all state needs. This approach:
- Stores search query and pagination in URL parameters (`/?q=pasta&page=1`)
- Enables shareable/bookmarkable search results
- Maintains browser history integration
- Fully satisfies the current feature requirements (recipe search with pagination)

**When Context API Will Be Needed:** Context API will be implemented ONLY when new features require it:
- Recipe details page with cross-component state sharing
- Ingredient exclusion feature with global state management
- User preferences that persist across navigation
- Shopping cart or saved recipes functionality

**Important:** The URL-based approach will continue to coexist with Context API for search-related state, as it provides valuable UX benefits (shareable URLs, browser navigation). Context API will complement, not replace, URL state management.

### Consequences

- Good: Zero additional bundle size (built into React)
- Good: Team already familiar with Context API and hooks
- Good: Sufficient for current state complexity
- Good: Native integration with React 19 features (use(), useOptimistic)
- Good: No external dependency maintenance burden
- Bad: More boilerplate than Zustand for context setup
- Bad: May require refactoring if state becomes significantly more complex
- Neutral: DevTools support less comprehensive than Redux DevTools

## Pros and Cons of the Options

### React Context API with useReducer

- Good: Built into React, no additional dependencies
- Good: Team familiar with hooks and Context patterns
- Good: Adequate for application's state complexity
- Good: Well-documented with extensive community examples
- Bad: Requires memoization discipline to avoid re-render issues
- Bad: More verbose setup compared to minimal state libraries
- Neutral: Sufficient DevTools support via React DevTools

### Redux Toolkit

- Good: Mature ecosystem with excellent documentation
- Good: Outstanding DevTools for debugging
- Good: Strong TypeScript support
- Good: Well-suited for complex state with many interdependencies
- Bad: ~11KB additional bundle size
- Bad: Significant boilerplate even with Redux Toolkit
- Bad: Learning curve for the team members unfamiliar with Redux patterns
- Neutral: Overkill for current application needs

### Zustand

- Good: Minimal API surface (~1KB)
- Good: Less boilerplate than Context API
- Good: Simple mental model (store as hook)
- Good: Good DevTools support
- Bad: Team unfamiliar with Zustand-specific patterns
- Bad: Additional external dependency to maintain
- Bad: Less widespread adoption than Context or Redux
- Neutral: Still requires learning for team

