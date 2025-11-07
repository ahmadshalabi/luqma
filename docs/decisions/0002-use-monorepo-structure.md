---
status: "accepted"
date: 2025-11-06
decision-makers: Ahmad Shalabi
---

# Use Monorepo Structure

## Context and Problem Statement

The Luqma application is a full-stack project consisting of a Spring Boot backend (Java with Gradle), a React frontend (with Vite), and comprehensive documentation including ADRs. How should we organize these components in version control to optimize development workflow and collaboration?

The key challenge is that the frontend and backend are tightly coupled through an API contract, requiring frequent coordinated changes across both components.

## Decision Drivers

- Need for atomic commits when API contracts change across frontend and backend
- Team size is small (portfolio project scale)
- Tightly coupled components require frequent coordination
- Development workflow simplicity and contributor onboarding
- AI tool effectiveness when referencing codebase
- Repository size and clone performance

## Considered Options

- Monorepo (Single Repository)
- Multi-Repo (Separate Repositories)
- Monorepo with Git Submodules

## Decision Outcome

Chosen option: "Monorepo (Single Repository)", because it enables atomic commits across the stack, simplifies coordination for a small team, and provides better support for AI-assisted development.

Repository structure:
```
luqma/
├── backend/
├── frontend/
└── docs/
```

### Consequences

- Good, because single clone operation, atomic commits, and unified versioning
- Good, because AI tools can reference entire codebase in single context
- Good, because easier onboarding and centralized documentation
- Bad, because mixed technology stacks in one repository
- Bad, because larger repository size and all git operations include both components

### Mitigation Strategies

- Strict directory separation (no cross-imports between backend/frontend)
- Independent build systems for each component
- Proper .gitignore configuration

## Pros and Cons of the Options

### Monorepo (Single Repository)

- Good, because atomic commits and simplified API contract changes
- Good, because single source of truth and better for small teams
- Bad, because mixed tech stacks and larger repo size

### Multi-Repo (Separate Repositories)

- Good, because independent versioning and tech stack isolation
- Bad, because synchronization complexity and harder API contract management
- Bad, because requires multiple PRs for cross-cutting features

### Monorepo with Git Submodules

- Good, because component separation and selective cloning
- Bad, because Git submodule complexity and learning curve
- Bad, because coordination overhead and complicates atomic changes

