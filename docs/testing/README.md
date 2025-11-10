# Testing Guide

Comprehensive testing documentation for the Luqma project covering strategies, coverage requirements, running tests, and writing tests.

## Table of Contents

- [Overview](#overview)
- [Coverage Requirements](#coverage-requirements)
- [Running Tests](#running-tests)
- [Testing Strategies](#testing-strategies)
- [Writing Tests](#writing-tests)
- [Test Structure](#test-structure)
- [Best Practices](#best-practices)
- [Related Documentation](#related-documentation)

---

## Overview

Luqma uses comprehensive testing strategies across both backend and frontend:

**Backend:**
- JUnit 5 for unit and integration tests
- Mockito for mocking dependencies
- Spring Boot Test for integration tests
- JaCoCo for coverage reporting

**Frontend:**
- Vitest as test runner
- React Testing Library for component testing
- User Event for simulating user interactions
- Coverage reporting built into Vitest

**Testing Philosophy:**
- Test behavior, not implementation
- Write tests that provide confidence
- Maintain high coverage without sacrificing quality
- Focus on critical business logic

---

## Coverage Requirements

### Backend Coverage

| Layer | Minimum Coverage | Target | Enforcement |
|-------|-----------------|--------|-------------|
| **Service Layer** | 80% | 85%+ | ✅ Enforced by JaCoCo |
| **Controller Layer** | 70% | 75%+ | Recommended |
| **Repository Layer** | 60% | 70%+ | Recommended |
| **Overall** | 70% | 80%+ | Monitored |

**Enforcement:**
- JaCoCo fails build if service layer coverage < 80%
- Coverage reports generated at: `backend/build/reports/jacoco/test/html/index.html`
- Run with coverage: `./gradlew test jacocoTestReport`

### Frontend Coverage

| Category | Minimum Coverage | Target | Enforcement |
|----------|-----------------|--------|-------------|
| **Custom Hooks** | 80% | 85%+ | ✅ Strongly recommended |
| **Components** | 70% | 75%+ | Recommended |
| **Utils/Helpers** | 80% | 85%+ | Recommended |
| **Overall** | 70% | 75%+ | Monitored |

**Reporting:**
- Coverage reports generated at: `frontend/coverage/index.html`
- Run with coverage: `npm run test:coverage`

### What to Test

**Must test:**
- Business logic in services (backend) and custom hooks (frontend)
- API endpoints (integration tests)
- Data transformations and calculations
- Error handling paths
- Validation logic
- State management (Context API)

**Should test:**
- Component rendering with different props
- User interactions (clicks, typing, navigation)
- Conditional rendering
- Accessibility features

**Can skip:**
- Third-party library code
- Simple getters/setters
- Trivial pass-through functions
- Configuration files

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
./gradlew test

# Run with coverage report
./gradlew test jacocoTestReport

# Run specific test class
./gradlew test --tests RecipeSearchServiceTest

# Run tests matching pattern
./gradlew test --tests "*Service*"

# Clean and test
./gradlew clean test

# View coverage report (after running jacocoTestReport)
# Open: build/reports/jacoco/test/html/index.html
```

### Frontend Tests

```bash
cd frontend

# Run all tests (watch mode)
npm test

# Run once (CI mode)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npm test HomePage.test.jsx

# View coverage report (after running test:coverage)
# Open: coverage/index.html
```

### Run All Tests (from root)

```bash
# From project root

# Run all backend and frontend tests
npm run test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

---

## Testing Strategies

### Unit Tests

Test individual components/functions in isolation.

**Backend:**
- Service layer methods
- Utility classes
- Validation logic
- Calculation algorithms (e.g., NutritionCalculationService)

**Frontend:**
- Custom hooks
- Utility functions
- Pure functions (colorUtils, etc.)

**Characteristics:**
- Fast execution
- No external dependencies
- Use mocks/stubs for dependencies
- Test single responsibility

### Integration Tests

Test multiple components working together.

**Backend:**
- Controller → Service → Repository flow
- API endpoint behavior
- Database interactions (if applicable)
- External API integration (SpoonacularClient)

**Frontend:**
- Component + hooks integration
- Context providers with consumers
- API client with components
- User flows (search → results → details)

**Characteristics:**
- Slower than unit tests
- May use real dependencies
- Test interactions between layers
- Validate end-to-end scenarios

### Component Tests (Frontend)

Test React components in isolation.

**What to test:**
- Renders correctly with different props
- User interactions trigger expected behavior
- Conditional rendering works
- Accessibility attributes present
- Error states display correctly

**What not to test:**
- Implementation details (state variable names)
- Styling specifics (use visual regression if needed)
- Third-party component internals

### API Tests (Backend)

Test REST endpoints directly.

**What to test:**
- Request/response structure
- Status codes (200, 400, 404, 500)
- Validation errors
- Error handling
- Rate limiting (if applicable)

---

## Writing Tests

### Backend Test Structure

```java
@ExtendWith(MockitoExtension.class)
class RecipeSearchServiceTest {
    
    @Mock
    private SpoonacularClient spoonacularClient;
    
    @InjectMocks
    private RecipeSearchService recipeSearchService;
    
    @Test
    void searchRecipes_validQuery_returnsRecipes() {
        // Given (Arrange)
        String query = "pasta";
        int page = 1;
        SpoonacularSearchResponse mockResponse = createMockResponse();
        when(spoonacularClient.searchRecipes(query, page, 9))
            .thenReturn(mockResponse);
        
        // When (Act)
        RecipeSearchResponse result = recipeSearchService.search(query, page, 9);
        
        // Then (Assert)
        assertNotNull(result);
        assertEquals(3, result.recipes().size());
        verify(spoonacularClient).searchRecipes(query, page, 9);
    }
    
    @Test
    void searchRecipes_emptyQuery_throwsException() {
        // Given
        String query = "";
        
        // When/Then
        assertThrows(ValidationException.class, () -> {
            recipeSearchService.search(query, 1, 9);
        });
    }
}
```

**Naming convention:** `methodName_condition_expectedResult`

### Frontend Test Structure

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/search/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with debounced query after user types', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    // Act
    const input = screen.getByRole('textbox', { name: /search recipes/i });
    await user.type(input, 'pasta');
    
    // Assert
    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('pasta');
    }, { timeout: 500 }); // Account for 300ms debounce
  });
  
  it('displays error when query is too short', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<SearchBar onSearch={vi.fn()} />);
    
    // Act
    const input = screen.getByRole('textbox', { name: /search recipes/i });
    await user.type(input, 'a');
    await user.tab(); // Trigger blur
    
    // Assert
    expect(screen.getByText(/at least 2 characters/i)).toBeInTheDocument();
  });
});
```

**Query priority:**
1. `getByRole` (most accessible)
2. `getByLabelText` (form inputs)
3. `getByPlaceholderText` (if no label)
4. `getByText` (content)
5. `getByTestId` (last resort)

---

## Test Structure

### Backend Test Organization

```
backend/src/test/java/app/luqma/backend/
├── service/
│   ├── RecipeSearchServiceTest.java           # Unit tests
│   ├── RecipeDetailServiceTest.java
│   ├── NutritionCalculationServiceTest.java
│   └── NutritionCalculationServiceProportionalTest.java
├── controller/
│   └── RecipeControllerTest.java              # Integration tests
├── client/
│   └── SpoonacularClientTest.java             # External API tests
├── mapper/
│   ├── RecipeMapperTest.java
│   └── NutrientExtractorTest.java
└── util/
    └── StringSanitizerTest.java
```

### Frontend Test Organization

```
frontend/src/test/
├── components/
│   ├── SearchBar.test.jsx                     # Component tests
│   ├── RecipeCard.test.jsx
│   ├── Pagination.test.jsx
│   └── ...
├── hooks/
│   ├── useSearch.test.js                      # Hook tests
│   ├── useRecipeDetail.test.js
│   ├── useKeyboardNavigation.test.js
│   └── ...
├── pages/
│   ├── HomePage.test.jsx                      # Page/integration tests
│   ├── AboutPage.test.jsx
│   └── RecipePage.test.jsx
├── contexts/
│   └── RecipeExclusionContext.test.jsx        # Context tests
├── services/
│   └── apiClient.test.js                      # API client tests
├── mocks/
│   ├── recipes.json                           # Test data
│   ├── recipeDetail.json
│   └── handlers.js                            # MSW handlers
└── setup.js                                   # Test configuration
```

---

## Best Practices

### General Principles

✅ **Do:**
- Write tests that test behavior, not implementation
- Use descriptive test names that explain what's being tested
- Follow Arrange-Act-Assert (Given-When-Then) pattern
- Keep tests focused and isolated
- Use factories/builders for test data
- Test edge cases and error conditions
- Keep tests fast (mock external dependencies)

❌ **Don't:**
- Test implementation details (private methods, internal state)
- Write brittle tests that break with refactoring
- Share state between tests
- Make tests depend on execution order
- Skip tests (fix or remove them)
- Test framework/library code

### Backend Best Practices

**Unit Tests:**
- Use `@ExtendWith(MockitoExtension.class)` for Mockito
- Mock all external dependencies
- Use `@Mock` for dependencies, `@InjectMocks` for class under test
- Verify interactions with `verify()` when behavior matters
- Use argument captors for complex verification

**Integration Tests:**
- Use `@SpringBootTest` sparingly (slow)
- Use `@WebMvcTest` for controller tests (faster)
- Mock service layer in controller tests
- Use `@MockBean` for Spring-managed beans

### Frontend Best Practices

**Component Tests:**
- Render with realistic props
- Use `userEvent` over `fireEvent` (more realistic)
- Query by role/label (accessibility-first)
- Test accessibility attributes (aria-*, roles)
- Wait for async operations with `waitFor`
- Use `screen` over destructuring render result

**Hook Tests:**
- Use `renderHook` from `@testing-library/react`
- Test return values and side effects
- Trigger hook updates with `act()` when needed
- Test error handling and edge cases

**Mocking:**
- Use Vitest's `vi.fn()` for function mocks
- Use MSW (Mock Service Worker) for API mocking
- Mock API responses in `mocks/handlers.js`
- Avoid mocking too much (test real behavior when possible)

---

## Related Documentation

### Standards & Guidelines
- [Backend Testing Standards](../../backend/.cursor/rules/testing-standards.mdc)
- [Frontend Testing Standards](../../frontend/.cursor/rules/testing-standards.mdc)
- [Code Review Checklist](../../.cursor/rules/code-review-checklist.mdc)

### Architecture
- [Backend Layer Architecture](../architecture/README.md#backend-layer-architecture)
- [Frontend Component Hierarchy](../architecture/README.md#frontend-component-hierarchy)

### Setup Guides
- [Backend README - Testing](../../backend/README.md#development-commands)
- [Frontend README - Testing](../../frontend/README.md#development-commands)
- [Main README - Testing](../../README.md#testing)

---

## Quick Reference

### Backend Commands
```bash
./gradlew test                    # Run all tests
./gradlew test jacocoTestReport   # With coverage
./gradlew test --tests ClassName  # Specific test
```

### Frontend Commands
```bash
npm test                  # Watch mode
npm run test:coverage     # With coverage
npm run test:ui           # UI mode
npm test FileName.test.jsx # Specific test
```

### Coverage Reports
- Backend: `backend/build/reports/jacoco/test/html/index.html`
- Frontend: `frontend/coverage/index.html`

### Minimum Coverage
- Backend Services: 80% (enforced)
- Frontend Hooks: 80% (recommended)
- Other layers: 70% (recommended)

---

**Navigation:** [Documentation Index](../README.md) | [Main README](../../README.md)

