# Backend Rules

Backend-specific development standards for Spring Boot application.

## Rules

### Code Style & Conventions

1. **[Java Style Guide](./java-style-guide.mdc)** - Google Java Style (formatting, naming, Javadoc)
2. **[Gradle Style Guide](./gradle-style-guide.mdc)** - Kotlin DSL conventions for build scripts

### Development Standards

3. **[Backend Standards](./backend-standards.mdc)** - Spring Boot patterns, Java 25 features, dependency injection
4. **[API Design Standards](./api-design-standards.mdc)** - REST conventions, status codes
5. **[Testing Standards](./testing-standards.mdc)** - JUnit 5, Mockito, integration tests
6. **[Documentation Standards](./documentation-standards.mdc)** - JavaDoc, API docs
7. **[Performance Standards](./performance-standards.mdc)** - Backend performance budgets
8. **[Security Standards](./security-standards.mdc)** - Backend security practices

## Coverage Requirements

See [Testing Standards](./testing-standards.mdc) for detailed coverage requirements and testing guidelines.

## Quick Reference

**Java Version:** Java 25 - use modern features (simplified main methods, virtual threads, sequenced collections, records)  
**Code Style:** Google Java Style (2-space indent, 100-char line length, K&R braces)  
**Dependency Injection:** Constructor injection only, no field @Autowired  
**Controllers:** Thin, delegate to services, return ResponseEntity<T>  
**DTOs:** Use records with validation annotations  
**Testing:** JUnit 5 + Mockito for unit, @SpringBootTest for integration  
**Build Scripts:** Kotlin DSL with version catalog (gradle/libs.versions.toml)

## Related

- [Project-wide rules](../../.cursor/rules/) - Security, git conventions, code review
- [Frontend rules](../../frontend/.cursor/rules/) - React, testing

