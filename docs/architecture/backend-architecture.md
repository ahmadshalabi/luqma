# Backend Architecture

Layered Spring Boot architecture.

## Layers

```
┌─────────────────────────────────────┐
│  Controller (HTTP)                   │  → Thin, HTTP concerns only
├─────────────────────────────────────┤
│  Service (Business Logic)            │  → Core functionality
├─────────────────────────────────────┤
│  Repository (Data Access + Cache)    │  → @Cacheable methods
├─────────────────────────────────────┤
│  Client (External APIs)              │  → Spoonacular integration
└─────────────────────────────────────┘
```

**See:** [ADR-0009](../decisions/0009-implement-layered-architecture-in-backend.md)

---

## Structure

```
backend/src/main/java/app/luqma/backend/
├── controller/           # HTTP endpoints
├── service/             # Business logic
├── repository/          # Caching layer
├── client/              # Spoonacular API
├── model/
│   ├── dto/            # Data Transfer Objects
│   └── domain/         # Domain models
├── config/             # Spring configuration
└── exception/          # Error handling
```

---

## Layer Details

### Controller

**Responsibility:** Handle HTTP requests/responses

**Key annotations:**
- `@RestController`
- `@RequestMapping("/api/v1/")`
- `@Valid` for validation

**Example:** `RecipeController.java`

---

### Service

**Responsibility:** Business logic

**Key annotations:**
- `@Service`
- `@Transactional` (if needed)

**Examples:**
- `RecipeSearchService`
- `RecipeDetailService`
- `NutritionCalculationService`

---

### Repository

**Responsibility:** Data access + caching

**Key annotations:**
- `@Repository`
- `@Cacheable(value = "recipes", key = "#id")`

**Example:** `RecipeRepository.java`

---

### Client

**Responsibility:** External API integration

**Key annotations:**
- `@Component`
- Uses `RestClient`

**Example:** `SpoonacularClient.java`

---

## Key Patterns

**Dependency Injection:**
- Constructor injection (required)
- All dependencies `final`
- Auto-wired by Spring

**DTOs:**
- Records for immutability
- Validation annotations
- Clean API contracts

**Exception Handling:**
- `@ControllerAdvice` for global handling
- Custom exceptions
- Generic error messages to clients

**Configuration:**
- `@ConfigurationProperties` for type-safe config
- Profile-specific (dev/prod)
- Environment variables for secrets

---

## Cross-Cutting Concerns

**Logging:**
- `@Slf4j` (Lombok)
- Structured logging with `{}`
- Never log secrets

**Caching:**
- Spring Cache with Caffeine
- `@EnableCaching` in config
- Recipe details cached 1 hour

**Security:**
- API key in backend only
- Input validation (Jakarta Bean Validation)
- CORS configuration

**Rate Limiting:**
- Custom filter
- 100 req/min per IP

---

## Related

- [System Overview](system-overview.md)
- [Caching Strategy](caching-strategy.md)
- [Data Flows](data-flows.md)
- [API Documentation](../api/README.md)
