# Luqma (لقمة)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Recipe search application with nutritional information and ingredient exclusion.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [License](#license)

---

## Tech Stack

- **Backend:** Spring Boot 3.5.7, Java 25, Gradle, Swagger/OpenAPI, Spoonacular API
- **Frontend:** React 19.2.0, Vite 7.2.2, TailwindCSS 4.1.17, React Router 7.9.5, Vitest
- **External API:** Spoonacular API integration with caching and error handling

---

## Features

### Core Functionality
- ✅ Recipe search with pagination
- ✅ Live search with debouncing (300ms)
- ✅ Recipe details page with full nutrition breakdown
- ✅ Dynamic ingredient exclusion with automatic nutrition recalculation
- ✅ Interactive nutrition facts (collapsible, with calorie indicators)
- ✅ Comprehensive error handling and validation
- ✅ Rate limiting and security controls

### Accessibility & UX
- ✅ WCAG 2.1 AA compliant
- ✅ Full keyboard navigation (arrow keys, shortcuts, focus management)
- ✅ Screen reader support with live regions
- ✅ Skeleton loading states for better perceived performance
- ✅ Responsive design (mobile-first approach)
- ✅ Touch-friendly targets (44x44px minimum)

### Developer Experience
- ✅ Clean OpenAPI documentation (domain models hidden)
- ✅ Centralized constants management
- ✅ Structured logging with environment-aware behavior
- ✅ Custom hooks for reusable logic
- ✅ Comprehensive component library
- ✅ Spoonacular API integration with Spring Cache (Caffeine) and robust error handling

---

## Prerequisites

- **Java 25+** - [Download](https://adoptium.net/)
- **Node.js 24+** - [Download](https://nodejs.org/)
- **npm 10+** (comes with Node.js)
- **Gradle** (included via wrapper)
- **Spoonacular API Key** - [Get free key](https://spoonacular.com/food-api/console#Dashboard) (150 requests/day free tier)
  - *Optional for mock mode* - See offline development below

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/ahmadshalabi/luqma.git
cd luqma

# Install root dependencies
npm install

# Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env and add your SPOONACULAR_API_KEY

# Setup backend and frontend
npm run setup

# Run both services (backend starts first, frontend waits for backend)
npm run dev

# Stop services (in separate terminal or use Ctrl+C)
npm run stop
```

### Offline Development (Mock Mode)

Don't have a Spoonacular API key yet? Use mock mode for offline development:

```bash
# Run with mock data (no API key needed)
npm run dev:mock
```

**Mock mode features:**
- Uses sample recipe data from `backend/src/main/resources/mocks/`
- No Spoonacular API key required
- Simulated API latency (100-500ms) for realistic testing
- Full functionality for development and testing

**Access the application:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- API Swagger: http://localhost:8080/swagger-ui.html

**Note:** Backend starts first, frontend starts after 15 seconds to allow backend initialization.

**Next Steps:**
- 📖 [Getting Started Guide](docs/guides/getting-started.md) - Complete setup walkthrough
- ⚙️ [Configuration Guide](docs/guides/configuration.md) - Environment variables, ports, CORS
- 💻 [Development Workflow](docs/guides/development-workflow.md) - Local development tips

---

## Documentation

### Getting Started
- [Getting Started Guide](docs/guides/getting-started.md) - Setup from zero to running
- [Configuration Guide](docs/guides/configuration.md) - Environment variables and settings
- [Development Workflow](docs/guides/development-workflow.md) - Local development guide
- [Deployment Guide](docs/guides/deployment.md) - Production deployment
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions

### Technical Documentation
- [Documentation Index](docs/README.md) - Complete documentation overview
- [Architecture Overview](docs/architecture/README.md) - System architecture and diagrams
  - [System Overview](docs/architecture/system-overview.md) - High-level architecture
  - [Backend Architecture](docs/architecture/backend-architecture.md) - Layered backend design
  - [Frontend Architecture](docs/architecture/frontend-architecture.md) - Component organization
  - [Data Flows](docs/architecture/data-flows.md) - Request flows
  - [Caching Strategy](docs/architecture/caching-strategy.md) - Performance optimization
- [API Documentation](docs/api/README.md) - REST API reference
  - [Recipe Search Endpoint](docs/api/endpoints-search.md)
  - [Recipe Details Endpoint](docs/api/endpoints-details.md)
  - [Ingredient Exclusion Endpoint](docs/api/endpoints-exclusion.md)
  - [Error Handling](docs/api/error-handling.md)
- [Testing Guide](docs/testing/README.md) - Testing strategies and coverage
  - [Backend Testing](docs/testing/backend-testing.md)
  - [Frontend Testing](docs/testing/frontend-testing.md)
  - [Coverage Requirements](docs/testing/coverage-requirements.md)
- [Architecture Decisions](docs/decisions/README.md) - All ADRs (MADR format)
- [Interactive API Docs](http://localhost:8080/swagger-ui.html) - Swagger UI (when running)

### Component-Specific
- [Backend README](backend/README.md) - Backend setup and commands
- [Frontend README](frontend/README.md) - Frontend setup and commands

### Standards & Guidelines
- [Git Standards](.cursor/rules/git-standards.mdc) - Commit, branch, and PR conventions
- [Security Standards](.cursor/rules/security-standards.mdc) - API key protection and security
- [Accessibility Standards](.cursor/rules/accessibility-standards.mdc) - WCAG 2.1 AA compliance
- [Code Review Checklist](.cursor/rules/code-review-checklist.mdc) - PR review guidelines
- [Frontend Standards](frontend/.cursor/rules/frontend-standards.mdc) - React and component guidelines
- [Backend Standards](backend/.cursor/rules/backend-standards.mdc) - Spring Boot patterns and conventions

---

## License

MIT License - see [LICENSE](LICENSE) for details.
