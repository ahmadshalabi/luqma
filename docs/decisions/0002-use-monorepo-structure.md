---
status: accepted
date: 2025-11-06
---

# Use Monorepo Structure

## Context and Problem Statement

The Luqma application is a full-stack project consisting of a Spring Boot backend (Java with Gradle), a React frontend (with Vite), and comprehensive documentation including ADRs. How should we organize these components in version control to optimize development workflow, collaboration, and CI/CD pipelines?

The key challenge is that the frontend and backend are tightly coupled through an API contract, requiring frequent coordinated changes across both components.

## Decision Drivers

- Need for atomic commits when API contracts change across frontend and backend
- Team size is small (portfolio project scale)
- Tightly coupled components require frequent coordination
- Development workflow simplicity and contributor onboarding
- AI tool effectiveness when referencing codebase
- CI/CD pipeline complexity and maintenance
- Repository size and clone performance

## Considered Options

- Monorepo (Single Repository)
- Multi-Repo (Separate Repositories)
- Monorepo with Git Submodules

## Decision Outcome

Chosen option: "Monorepo (Single Repository)", because it enables atomic commits across the stack, simplifies coordination for a small team, and provides better support for AI-assisted development while maintaining appropriate scale for this portfolio project.

The repository structure will be:

```
luqma/
├── backend/
├── frontend/
├── docs/
└── .github/
```

### Consequences

- Good, because single `git clone` operation to start development
- Good, because enables atomic commits for API contract changes across frontend and backend
- Good, because unified versioning and coordinated releases
- Good, because simplified CI/CD coordination
- Good, because easier onboarding for new team members and contributors
- Good, because AI tools can reference entire codebase in single context
- Good, because centralized documentation benefits all components
- Good, because easier to track and implement cross-cutting features
- Bad, because mixed technology stacks (Java and JavaScript) in same repository
- Bad, because larger repository size (mitigated by proper .gitignore configuration)
- Bad, because requires path-based CI triggers to detect which component changed
- Bad, because all git operations include both components
- Bad, because potential for accidental cross-component dependencies if not carefully managed

## Pros and Cons of the Options

### Monorepo (Single Repository)

Single repository containing all components: `luqma/backend/`, `luqma/frontend/`, `luqma/docs/`

- Good, because enables atomic commits across the entire stack
- Good, because simplifies API contract changes between frontend and backend
- Good, because provides single source of truth and single clone operation
- Good, because better suited for small teams with shared ownership
- Good, because AI tools can analyze entire codebase in context
- Good, because centralized documentation and unified issue tracking
- Bad, because mixed technology stacks in one repository
- Bad, because larger repository size
- Bad, because requires selective CI/CD based on changed paths

### Multi-Repo (Separate Repositories)

Separate repositories: `luqma-backend/`, `luqma-frontend/`, `luqma-docs/`

- Good, because independent versioning per component
- Good, because technology stack isolation
- Good, because smaller individual repository sizes
- Good, because scales better for very large teams
- Bad, because synchronization complexity across repositories
- Bad, because API contract management is significantly harder
- Bad, because requires multiple PRs for cross-cutting features
- Bad, because version coordination overhead between repositories
- Bad, because more complex onboarding (multiple clones required)

### Monorepo with Git Submodules

Main repository with Git submodules for each component

- Good, because provides some separation between components
- Good, because enables selective cloning
- Bad, because Git submodule complexity and learning curve
- Bad, because additional Git commands required for updates
- Bad, because coordination overhead similar to multi-repo
- Bad, because common source of errors for less experienced Git users
- Bad, because complicates atomic changes across components

## More Information

### Related Decisions

- [Use Markdown Architectural Decision Records](0001-use-markdown-architectural-decision-records.md)

### Notes

If the project scales significantly or requires separate teams with independent ownership, migration to multi-repo is straightforward using `git filter-branch --subdirectory-filter` to preserve Git history.

**Mitigation strategies for negative consequences:**
- Strict directory separation (no cross-imports between backend/frontend)
- Independent build systems for each component
- Selective CI/CD pipelines based on changed file paths
- Clear documentation structure with component-specific README files

