---
status: "accepted"
date: 2025-11-07
decision-makers: Ahmad Shalabi
updated: 2025-11-09
---

# Standardize Development Workflow and Environment Management

## Context and Problem Statement

How should we structure the project to provide a consistent, easy-to-use development workflow for a monorepo containing both backend (Spring Boot) and frontend (React/Vite) applications? Developers need a simple way to run, test, and manage both services without having to remember different commands or navigate between directories.

## Decision Drivers

* Need for simple, unified commands to run both frontend and backend
* Requirement for reproducible setup across different developer machines
* Desire to minimize onboarding time for new developers
* Prevention of configuration-related startup failures
* Standardization of common development tasks (setup, run, test, stop)
* Clear separation between development and production configurations
* Avoid requiring developers to navigate between directories or remember multiple commands

## Considered Options

* **Option 1**: Root-level npm scripts with monorepo structure and profile-based configuration
* **Option 2**: Independent backend and frontend with separate commands
* **Option 3**: Makefile-based workflow
* **Option 4**: Shell scripts for common operations

## Decision Outcome

Chosen option: **"Root-level npm scripts with monorepo structure and profile-based configuration"**, because it provides:
- Single source of truth for all development commands
- Consistent workflow regardless of which part of the stack you're working on
- Familiar npm-based interface that all JavaScript/Node developers know
- Easy to extend and maintain
- Works cross-platform (no bash-specific requirements for core commands)

### Consequences

* Good, because developers only need to know a handful of npm commands (`npm run dev`, `npm run test`, `npm run stop`)
* Good, because all project commands are in one place (root `package.json`)
* Good, because new developers can get started with just `npm install && npm run setup && npm run dev`
* Good, because Spring profiles enable clean separation of dev/prod configurations
* Good, because using npm leverages existing tooling and knowledge
* Good, because `concurrently` handles running both services with clear labeled output
* Neutral, because requires Node.js/npm even for backend-only work
* Bad, because adds npm as a dependency wrapper around Gradle

### Confirmation

Implementation confirmed by:
- Single `npm run dev` starts both services (backend first, frontend after 15s delay)
- `npm run build` builds both sequentially (backend → frontend)
- `npm run test` and `npm run stop` work as expected
- Simple, minimal, and cross-platform

## Pros and Cons of the Options

### Option 1: Root-level npm scripts with monorepo structure

Use root `package.json` with npm scripts that manage both backend and frontend. Backend uses Spring profiles for environment-specific configuration.

* Good, because provides unified interface for all operations
* Good, because developers don't need to remember separate commands for backend/frontend
* Good, because `package.json` scripts are self-documenting
* Good, because easy to add new commands or modify existing ones
* Good, because leverages npm's familiar interface
* Good, because `concurrently` provides clean multi-service output
* Neutral, because requires Node.js/npm even for Java-only work
* Bad, because adds a layer of indirection over native tools (Gradle, Vite)

### Option 2: Independent backend and frontend with separate commands

Developers navigate to backend/ or frontend/ directories and use native commands (`./gradlew bootRun`, `npm run dev`).

* Good, because no abstraction layer - direct tool access
* Good, because no dependency on npm for backend work
* Good, because follows standard project structure patterns
* Bad, because developers must remember different commands for each service
* Bad, because requires navigating between directories
* Bad, because no easy way to run both services together
* Bad, because harder onboarding (multiple commands to learn)
* Bad, because no unified testing or stopping commands

### Option 3: Makefile-based workflow

Use a Makefile with targets like `make dev`, `make test`, `make stop`.

* Good, because standard tool in Unix/Linux environments
* Good, because powerful and flexible
* Good, because can handle complex build logic
* Neutral, because familiar to some developers, unfamiliar to others
* Bad, because not cross-platform (Windows requires additional tools)
* Bad, because more complex syntax than npm scripts
* Bad, because less familiar to JavaScript/React developers

### Option 4: Shell scripts for common operations

Create bash scripts like `start.sh`, `test.sh`, `stop.sh` in the root.

* Good, because simple to understand and modify
* Good, because no npm dependency for orchestration
* Neutral, because familiar to Linux/Mac developers
* Bad, because not cross-platform (Windows requires WSL or Git Bash)
* Bad, because harder to discover available commands
* Bad, because no built-in dependency management
* Bad, because less maintainable than package.json scripts

## Implementation Summary

### Root-Level Commands (package.json)

All development commands run from the project root:

```bash
npm run setup          # Setup both backend and frontend
npm run build          # Build both (backend first, then frontend)
npm run dev            # Run both services concurrently
npm run stop           # Stop all running services
npm run test           # Run all tests (backend + frontend)
npm run lint           # Run linters
npm run lint:fix       # Auto-fix linting issues
```

Individual service commands also available:
```bash
npm run build:backend  # Build backend JAR only
npm run build:frontend # Build frontend static assets only
npm run dev:backend    # Backend only
npm run dev:frontend   # Frontend only
npm run test:backend   # Backend tests only
npm run test:frontend  # Frontend tests only
```

### Configuration

**Backend:** `backend/.env` (API keys), `application*.yaml` files (Spring profiles)

**Frontend:** `frontend/.env` (API URLs), `vite.config.js` (dev server)

### Setup Process

1. `git clone` and `npm install`
2. Copy `.env.example` to `.env` and add API key
3. `npm run setup` (builds backend, installs frontend)
4. `npm run dev` (starts both services)

### Service Management

- Uses `concurrently` to run both processes with labeled output (BACKEND, FRONTEND)
- Backend starts immediately on port 8080
- Frontend starts after 15-second delay (allows backend to initialize)
- Frontend runs on port 3000
- Both ports configurable in respective config files

## More Information

### Related Documentation
- `README.md` - Main project documentation with Quick Start
- `backend/README.md` - Backend-specific details
- `frontend/README.md` - Frontend-specific details
- `docs/TROUBLESHOOTING.md` - Common issues and solutions

### Best Practices
1. Work from root directory - use `npm run dev/build/test/stop`
2. Never commit `.env` files - only `.env.example` with placeholders
3. Run `npm run setup` after pulling major changes
4. Check `package.json` for all available commands

### Developer Experience Benefits
- **Simple commands:** `npm run dev/build/test/stop` - that's it
- **Fast onboarding:** New developers productive in minutes
- **Predictable:** Backend always starts first with 15s delay before frontend
- **Easy debugging:** Clear labeled output (BACKEND vs FRONTEND)
- **Cross-platform:** Works everywhere (Windows, Mac, Linux)

### Re-evaluation Triggers
Revisit if:
- Need more complex orchestration
- Adding more services to monorepo
- Team prefers native tools over npm wrapper

