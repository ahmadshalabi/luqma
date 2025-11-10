# Architecture Documentation

Technical architecture of Luqma.

## Overview

**[System Overview](system-overview.md)** - High-level architecture
- Frontend (React) + Backend (Spring Boot) + Spoonacular API
- Security model
- Performance overview

---

## Components

**[Backend Architecture](backend-architecture.md)** - Layered backend design
- Controller → Service → Repository → Client
- Dependency injection
- Cross-cutting concerns

**[Frontend Architecture](frontend-architecture.md)** - Component organization
- Feature-based structure
- Custom hooks
- State management (Context API)

---

## Flows

**[Data Flows](data-flows.md)** - Request flows
- Recipe search flow
- Recipe details flow (with caching)
- Ingredient exclusion flow

---

## Performance

**[Caching Strategy](caching-strategy.md)** - Performance optimization
- Spring Cache + Caffeine
- 1 hour TTL
- 80% cache hit rate

---

## Key Decisions

All architecture decisions: [ADRs](../decisions/README.md)

**Key ADRs:**
- [ADR-0004](../decisions/0004-use-context-api-for-state-management.md) - Context API
- [ADR-0007](../decisions/0007-use-feature-based-component-organization.md) - Component organization
- [ADR-0008](../decisions/0008-use-custom-hooks-for-business-logic.md) - Custom hooks
- [ADR-0009](../decisions/0009-implement-layered-architecture-in-backend.md) - Layered backend
- [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md) - Nutrition calculation
