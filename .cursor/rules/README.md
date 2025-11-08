# Luqma Project Rules

Project-wide development standards for code quality, consistency, and security.

## Project-Wide Rules

1. **[Security Standards](./security-standards.mdc)** ⚠️ **CRITICAL** - API key protection and dependency management
2. **[Git Standards](./git-standards.mdc)** - Branching, commits, PRs, code review, releases
3. **[Code Review Checklist](./code-review-checklist.mdc)** - PR review guidelines
4. **[Documentation Standards](./documentation-standards.mdc)** - README, code comments, TODO format
5. **[Accessibility Standards](./accessibility-standards.mdc)** - WCAG 2.1 AA compliance

## Scoped Rules

**Backend** (`backend/.cursor/rules/`):
- **[Java Style Guide](../backend/.cursor/rules/java-style-guide.mdc)** - Google Java Style conventions
- **[Gradle Style Guide](../backend/.cursor/rules/gradle-style-guide.mdc)** - Kotlin DSL build scripts
- **[Backend Standards](../backend/.cursor/rules/backend-standards.mdc)** - Spring Boot patterns, Java 25
- **[API Design Standards](../backend/.cursor/rules/api-design-standards.mdc)** - REST conventions
- **[Testing Standards](../backend/.cursor/rules/testing-standards.mdc)** - JUnit 5, Mockito
- **[Documentation Standards](../backend/.cursor/rules/documentation-standards.mdc)** - JavaDoc, API docs
- **[Performance Standards](../backend/.cursor/rules/performance-standards.mdc)** - Backend performance budgets
- **[Security Standards](../backend/.cursor/rules/security-standards.mdc)** - Backend security practices

**Frontend** (`frontend/.cursor/rules/`):
- **[JavaScript/React Style Guide](../frontend/.cursor/rules/javascript-react-style-guide.mdc)** - Airbnb conventions
- **[TailwindCSS Style Guide](../frontend/.cursor/rules/tailwindcss-style-guide.mdc)** - Utility class ordering
- **[Frontend Standards](../frontend/.cursor/rules/frontend-standards.mdc)** - React hooks, Context API
- **[Testing Standards](../frontend/.cursor/rules/testing-standards.mdc)** - React Testing Library
- **[Documentation Standards](../frontend/.cursor/rules/documentation-standards.mdc)** - JSDoc, component docs
- **[Performance Standards](../frontend/.cursor/rules/performance-standards.mdc)** - Frontend performance budgets
- **[Security Standards](../frontend/.cursor/rules/security-standards.mdc)** - Frontend security practices

See respective README files for details.

## Critical Security

🚨 **NEVER:**
- Expose API keys (frontend, logs, git)
- Call external APIs from frontend
- Commit secrets to git

✅ **ALWAYS:**
- Environment variables for secrets
- Validate + sanitize inputs
- Backend proxies external APIs

## Coverage Requirements

See individual testing standards for details:
- Backend: [backend/.cursor/rules/testing-standards.mdc](../backend/.cursor/rules/testing-standards.mdc)
- Frontend: [frontend/.cursor/rules/testing-standards.mdc](../frontend/.cursor/rules/testing-standards.mdc)

## Quick Start

**Working on backend?** → See [backend/.cursor/rules/](../backend/.cursor/rules/)  
**Working on frontend?** → See [frontend/.cursor/rules/](../frontend/.cursor/rules/)  
**General development?** → Use rules in this directory

## Rule Application

- **Always Apply**:  security standards, git conventions
- **Apply Intelligently**: Documentation, performance, code review
- **Apply to Files**: Scoped rules match file patterns automatically (backend, frontend, tests)
- **Apply Manually**: When @-mentioned in Cursor agent