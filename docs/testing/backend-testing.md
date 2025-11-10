# Backend Testing

Testing strategies for Spring Boot backend.

## Framework

**Tools:**
- JUnit 5
- Mockito  
- Spring Boot Test
- AssertJ
- JaCoCo (coverage)

---

## Test Types

### Unit Tests

**Target:** Services, utilities  
**Speed:** Fast (no Spring context)  
**Isolation:** Mock all dependencies

**Example:**
```bash
./gradlew test --tests RecipeSearchServiceTest
```

---

### Integration Tests

**Target:** Controllers, full flow  
**Speed:** Slower (Spring context)  
**Setup:** `@SpringBootTest`, mock external APIs

**Example:**
```bash
./gradlew test --tests RecipeControllerTest
```

---

## Coverage

**Requirements:**
- Services: 80%+ (enforced)
- Controllers: 70%+ (recommended)

**Run:**
```bash
./gradlew test jacocoTestReport
# Report: build/reports/jacoco/test/html/index.html
```

---

## Patterns

**Unit Test Structure:**
1. Arrange: Setup mocks and data
2. Act: Call method under test
3. Assert: Verify results

**Naming:** `methodName_condition_expectedResult`

**Mocking:**
- `@Mock` - Mock dependency
- `@InjectMocks` - Inject mocks
- `when().thenReturn()` - Stub behavior
- `verify()` - Assert calls

---

## Best Practices

- Test behavior, not implementation
- Independent tests (no shared state)
- Fast execution (< 100ms per unit test)
- Mock external dependencies
- Test edge cases and errors

---

## Commands

```bash
# Run all tests
./gradlew test

# With coverage
./gradlew test jacocoTestReport

# Specific test
./gradlew test --tests ClassName

# Verify coverage threshold
./gradlew jacocoTestCoverageVerification
```

---

## Related

- [Coverage Requirements](coverage-requirements.md)
- [Testing Guide](README.md)
