# Documentation Index

Complete documentation for Luqma.

## Getting Started

- **[Getting Started](guides/getting-started.md)** - Setup from zero to running
- **[Configuration](guides/configuration.md)** - Environment variables, ports, settings
- **[Development Workflow](guides/development-workflow.md)** - Local development guide
- **[Deployment](guides/deployment.md)** - Production deployment
- **[Troubleshooting](TROUBLESHOOTING.md)** - Common issues

---

## API

- **[API Overview](api/README.md)** - REST API reference
- **[Recipe Search](api/endpoints-search.md)** - Search endpoint
- **[Recipe Details](api/endpoints-details.md)** - Details endpoint
- **[Ingredient Exclusion](api/endpoints-exclusion.md)** - Exclusion endpoint
- **[Error Handling](api/error-handling.md)** - Error codes and handling

**Interactive:** http://localhost:8080/swagger-ui.html (when running)

---

## Architecture

- **[System Overview](architecture/system-overview.md)** - High-level architecture
- **[Backend Architecture](architecture/backend-architecture.md)** - Layered design
- **[Frontend Architecture](architecture/frontend-architecture.md)** - Component organization
- **[Data Flows](architecture/data-flows.md)** - Request flows
- **[Caching Strategy](architecture/caching-strategy.md)** - Performance optimization

---

## Testing

- **[Testing Guide](testing/README.md)** - Overview
- **[Backend Testing](testing/backend-testing.md)** - JUnit 5, Mockito
- **[Frontend Testing](testing/frontend-testing.md)** - Vitest, React Testing Library
- **[Coverage Requirements](testing/coverage-requirements.md)** - Standards

---

## Decisions

- **[ADRs](decisions/README.md)** - All Architecture Decision Records

**Key decisions:** Layered backend, Context API, Custom hooks, Caching, Nutrition calculation

---

## Standards

Located in `.cursor/rules/`:
- Git Standards - Commit conventions, branching
- Security Standards - API key protection
- Accessibility Standards - WCAG 2.1 AA
- Backend/Frontend Standards - Code conventions
