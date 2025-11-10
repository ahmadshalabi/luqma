# System Overview

High-level architecture of Luqma.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Pages     │  │  Components  │  │   Hooks    │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┴────────────────────────────┐
│              BACKEND (Spring Boot)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Controllers │→ │   Services   │→ │ Repository │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│                                           │           │
│                                           ↓           │
│                                   ┌─────────────┐   │
│                                   │   Cache     │   │
│                                   │ (Caffeine)  │   │
│                                   └─────────────┘   │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
┌────────────────────────┴────────────────────────────┐
│              SPOONACULAR API                         │
│              (External Service)                      │
└──────────────────────────────────────────────────────┘
```

---

## Components

### Frontend (React 19)

**Technology:**
- React 19.2.0
- Vite 7.2.2
- TailwindCSS 4.1.17
- React Router 7.9.5

**Organization:**
- Pages (route-level components)
- Components (reusable UI)
- Hooks (stateful logic)
- Services (API client)

**State Management:** Context API

**See:** [Frontend Architecture](frontend-architecture.md)

---

### Backend (Spring Boot 3)

**Technology:**
- Spring Boot 3.5.7
- Java 25
- Gradle
- Caffeine Cache

**Layers:**
1. **Controllers** - HTTP handling
2. **Services** - Business logic
3. **Repository** - Data access + caching
4. **Client** - External API calls

**See:** [Backend Architecture](backend-architecture.md)

---

### External Services

**Spoonacular API:**
- Recipe data source
- 150 requests/day (free tier)
- Cached for 1 hour
- Proxied through backend

**Security:** API key never exposed to frontend

---

## Data Flow

### Recipe Search

```
User Input → Frontend → Backend API → Spoonacular API → Cache → Response
```

**Caching:** Not cached (always fresh results)

---

### Recipe Details

```
Request → Backend → Cache Check
                      ↓ Hit: Return cached
                      ↓ Miss: Fetch from Spoonacular → Cache → Return
```

**Caching:** 1 hour TTL, 500 recipe max

---

### Ingredient Exclusion

```
Request → Backend → Fetch Recipe → Recalculate Nutrition → Response
```

**Calculation:** Hybrid (ingredient-level or proportional)  
**Caching:** Not cached (computed on-demand)

**See:** [Data Flows](data-flows.md)

---

## Security

**API Key Protection:**
- Stored in backend `.env` only
- Never sent to frontend
- All external API calls proxied

**CORS:**
- Whitelist specific origins
- No wildcards in production

**Rate Limiting:**
- 100 req/min per IP (backend)
- 150 req/day (Spoonacular)

**Input Validation:**
- Frontend: UX feedback
- Backend: Enforced with Jakarta Bean Validation

**See:** [Security Standards](../../.cursor/rules/security-standards.mdc)

---

## Performance

**Caching:**
- Recipe details: 1 hour TTL
- Reduces Spoonacular API calls by 80%
- Sub-millisecond response for cached data

**See:** [Caching Strategy](caching-strategy.md)

**Optimization:**
- Lazy loading (React.lazy)
- Code splitting (Vite)
- Debounced search (300ms)
- Skeleton loaders

---

## Key Decisions

All architectural decisions documented as ADRs:

- [ADR-0001](../decisions/0001-use-markdown-architectural-decision-records.md) - MADR format
- [ADR-0002](../decisions/0002-use-monorepo-structure.md) - Monorepo
- [ADR-0003](../decisions/0003-standardize-development-workflow-and-environment-management.md) - Dev workflow
- [ADR-0004](../decisions/0004-use-context-api-for-state-management.md) - Context API
- [ADR-0005](../decisions/0005-implement-live-search-on-homepage.md) - Live search
- [ADR-0007](../decisions/0007-use-feature-based-component-organization.md) - Component organization
- [ADR-0008](../decisions/0008-use-custom-hooks-for-business-logic.md) - Custom hooks
- [ADR-0009](../decisions/0009-implement-layered-architecture-in-backend.md) - Layered backend
- [ADR-0010](../decisions/0010-use-proportional-estimation-for-nutrition-calculation.md) - Nutrition calculation

**See all:** [Architecture Decisions](../decisions/README.md)

---

## Related Documentation

- [Backend Architecture](backend-architecture.md)
- [Frontend Architecture](frontend-architecture.md)
- [Data Flows](data-flows.md)
- [Caching Strategy](caching-strategy.md)
- [API Documentation](../api/README.md)
