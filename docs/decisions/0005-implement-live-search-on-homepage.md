---
status: "accepted"
date: 2025-11-09
---

# Implement Live Search with Debounce on Homepage

## Context and Problem Statement

Should users search recipes on the homepage with live results, or navigate to a separate search page? How do we provide immediate feedback while maintaining good performance?

## Decision Drivers

- User experience: Immediate feedback
- Performance: Minimize unnecessary API calls
- Shareable URLs: Search should be bookmarkable
- Accessibility: Keyboard navigation support

## Considered Options

1. Live search with debounce on homepage (chosen)
2. Separate search page with navigation
3. Instant search without debounce

## Decision Outcome

Chosen option: **Live search with debounce on homepage**

Search state stored in URL (`/?q=pasta&page=1`). 300ms debounce prevents excessive API calls while feeling instant. Form submission via Enter key preserved for accessibility.

### Consequences

- Good: Immediate feedback, shareable URLs, no page navigation
- Good: Browser back/forward works correctly
- Bad: Slightly more complex state management

## Pros and Cons of the Options

### Live search with debounce on homepage

- Good: Instant feedback, shareable URLs
- Bad: Requires debounce implementation

### Separate search page with navigation

- Good: Simpler component structure
- Bad: Page navigation creates friction

### Instant search without debounce

- Good: Absolutely instant
- Bad: Excessive API calls, poor performance
