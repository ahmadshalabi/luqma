---
status: "accepted"
date: 2025-11-06
---

# Use Monorepo Structure

## Context and Problem Statement

Should the Spring Boot backend and React frontend be in separate repositories or one monorepo? Frontend and backend are tightly coupled through API contracts.

## Decision Drivers

- Atomic commits when API contracts change
- Small team (portfolio project)
- Tightly coupled components
- Simple development workflow

## Considered Options

1. Monorepo (chosen)
2. Multi-repo (separate repositories)
3. Monorepo with Git submodules

## Decision Outcome

Chosen option: **Monorepo (single repository)**

Structure: `luqma/backend/`, `luqma/frontend/`, `luqma/docs/`

Enables atomic commits across the stack and simplifies coordination.

### Consequences

- Good: Atomic commits, unified versioning
- Good: Single clone, easier onboarding
- Bad: Larger repository size

## Pros and Cons of the Options

### Monorepo

- Good: Atomic commits, simpler coordination
- Bad: Mixed tech stacks in one repo

### Multi-repo

- Good: Independent versioning
- Bad: Synchronization complexity, multiple PRs

### Monorepo with Git submodules

- Good: Component separation
- Bad: Submodule complexity, coordination overhead
