---
status: "accepted"
date: 2025-11-09
---

# Implement Live Search with Debounce on Homepage

## Context and Problem Statement

Users need to search for recipes, but navigating to a separate search results page creates friction in the user experience. The current implementation requires users to submit a search form and navigate to a dedicated `/search` route to see results. How should we implement recipe search to provide immediate feedback while maintaining good performance and user experience?

## Decision Drivers

- User experience: Users expect immediate feedback when searching
- Performance: Minimize unnecessary API calls and renders
- Accessibility: Maintain keyboard navigation and screen reader support
- URL state: Search should be shareable and bookmarkable
- Code maintainability: Keep search logic modular and testable
- Mobile experience: Search should work well on touch devices

## Considered Options

1. Live search with debounce on homepage (URL-based state)
2. Keep separate search page with navigation
3. Modal-based search overlay
4. Instant search without debounce

## Decision Outcome

Chosen option: **Live search with debounce on homepage (URL-based state)**

This approach provides the best balance of immediate user feedback, performance, and code simplicity. The 300ms debounce prevents excessive API calls while feeling instant to users. URL-based state management makes searches shareable and preserves search state on page refresh.

### Consequences

- Good: Immediate visual feedback as users type (after 300ms)
- Good: Reduced navigation friction (no page changes)
- Good: Shareable search URLs (e.g., `/?q=pasta&page=1`)
- Good: Browser back/forward works correctly
- Good: Simpler routing structure (fewer routes to maintain)
- Good: Better mobile experience (no page navigation)
- Good: Maintains accessibility (form submission via Enter key still works)
- Good: Modular SearchResults component can be reused
- Bad: Slightly more complex state management in HomePage
- Neutral: Requires debounce logic (but handled in custom hook)

### Confirmation

Implementation validated through:
- All 31 tests passing (including new debounce tests)
- WCAG 2.1 AA accessibility compliance verified
- Form submission via Enter key works for keyboard users
- URL state management tested with browser navigation
- ESLint validation with no errors
- Production build successful

## Pros and Cons of the Options

### Live search with debounce on homepage (URL-based state)

- Good: Instant feedback improves perceived performance
- Good: No page navigation reduces cognitive load
- Good: URL state makes searches shareable and bookmarkable
- Good: Debounce (300ms) prevents excessive API calls
- Good: Works with browser back/forward navigation
- Good: Cleaner code with SearchResults component extraction
- Good: Maintains form submission for accessibility
- Bad: More complex state management in HomePage component
- Neutral: Requires careful debounce implementation (mitigated by custom hook)

### Keep separate search page with navigation

Current implementation before this ADR.

- Good: Simpler component structure (separation of concerns)
- Good: Clear URL structure (`/search?q=...`)
- Bad: Requires page navigation (poor UX)
- Bad: Slower perceived performance
- Bad: More routes to maintain
- Bad: Additional page component to test and maintain
- Bad: Friction in user workflow

### Modal-based search overlay

Full-screen modal that appears on search focus.

- Good: Focused search experience
- Good: Works well on mobile
- Bad: More complex implementation (modal state, animations)
- Bad: Focus management complexity
- Bad: Screen reader announcements more complex
- Bad: May feel disruptive to users
- Bad: Additional escape handlers and backdrop clicks
- Neutral: Popular pattern but not always intuitive

### Instant search without debounce

Search triggers immediately on every keystroke.

- Good: Absolutely instant feedback
- Bad: Excessive API calls (performance issue)
- Bad: Rapid re-renders can cause lag
- Bad: Wasteful backend requests for incomplete queries
- Bad: Poor performance on slower connections
- Bad: Potential for race conditions with async results

## More Information

### Implementation

- Search state stored in URL query parameters (`/?q=pasta&page=1`)
- 300ms debounce prevents excessive API calls
- `useSearch` hook handles debounce logic
- `SearchResults` component extracted for reusability
- Form submission via Enter key preserved for accessibility

