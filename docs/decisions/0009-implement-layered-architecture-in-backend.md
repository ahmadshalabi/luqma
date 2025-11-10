---
status: "accepted"
date: 2025-11-10
---

# Use Layered Architecture in Backend

## Context and Problem Statement

How should we structure the backend to separate HTTP concerns, business logic, and data access?

## Decision Drivers

- Separation of concerns
- Testability
- Maintainability
- Spring Boot best practices

## Considered Options

1. Layered architecture (Controller → Service → Repository) (chosen)
2. Flat package structure
3. Hexagonal architecture

## Decision Outcome

Chosen option: **Layered architecture (Controller → Service → Repository)**

Three layers with clear responsibilities:
- **Controller**: REST endpoints, validation, HTTP concerns
- **Service**: Business logic, orchestration
- **Repository**: Data access (currently mock data)

### Consequences

- Good: Clear separation, independently testable
- Good: Easy to replace data source (mock → API → database)
- Bad: Can lead to pass-through methods

## Pros and Cons of the Options

### Layered architecture

- Good: Clear boundaries, familiar pattern
- Bad: Potential for anemic domain models

### Flat package structure

- Good: Simple
- Bad: Mixed responsibilities, tight coupling

### Hexagonal architecture

- Good: Domain isolation
- Bad: Overkill for current size
