---
status: "accepted"
date: 2025-11-10
---

# Use Feature-Based Component Organization

## Context and Problem Statement

How should we organize React components as the application grows? By type (all components in one directory) or by feature (components grouped by functionality)?

## Decision Drivers

- Keep related code together
- Minimize merge conflicts
- Clear component ownership
- Easy to find code

## Considered Options

1. Feature-based with shared components (chosen)
2. Flat directory by type
3. Atomic design methodology

## Decision Outcome

Chosen option: **Feature-based with shared components**

Structure:
- `pages/{page}/` - Page-specific components co-located with their pages
- `components/{domain}/` - Shared domain components organized by purpose (e.g., `recipe/`, `search/`)
- `components/ui/` - Shared UI primitives (Button, Card, Alert, etc.)

### Consequences

- Good: Related code grouped together
- Good: Clear ownership (feature vs shared)
- Bad: Initial decision overhead (shared vs feature-specific)

## Pros and Cons of the Options

### Feature-based with shared components

- Good: Feature cohesion, reduced coupling
- Bad: Requires discipline to maintain boundaries

### Flat directory by type

- Good: Simple structure
- Bad: Difficult to navigate with many components

### Atomic design methodology

- Good: Clear component hierarchy
- Bad: Artificial categorization (subjective)
