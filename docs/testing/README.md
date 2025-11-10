# Testing Guide

Testing overview for Luqma.

## Quick Start

**Backend:**
```bash
cd backend
./gradlew test                    # Run tests
./gradlew test jacocoTestReport   # With coverage
```

**Frontend:**
```bash
cd frontend
npm test                  # Watch mode
npm run test:coverage     # With coverage
```

---

## Documentation

**Backend Testing:**
- [Backend Testing Guide](backend-testing.md) - JUnit 5, Mockito, patterns
- Coverage: 80%+ services (enforced), 70%+ controllers

**Frontend Testing:**
- [Frontend Testing Guide](frontend-testing.md) - Vitest, React Testing Library
- Coverage: 80%+ hooks, 70%+ components

**Coverage Requirements:**
- [Coverage Requirements](coverage-requirements.md) - Standards and targets

---

## Philosophy

**Test what matters:**
- User interactions
- Business logic
- Error handling
- Edge cases

**Don't over-test:**
- Implementation details
- Library code
- Trivial getters/setters

**Keep tests:**
- Fast
- Independent
- Focused
- Maintainable

---

## Test Pyramid

**70-80%** Unit tests (fast, isolated)  
**15-25%** Integration tests (API, flows)  
**5-10%** E2E tests (full user journeys)

---

## Coverage Targets

| Component | Minimum | Target |
|-----------|---------|--------|
| Backend Services | 80% | 85%+ |
| Backend Controllers | 70% | 75%+ |
| Frontend Hooks | 80% | 85%+ |
| Frontend Components | 70% | 75%+ |

---

## Commands Reference

**Backend:**
```bash
./gradlew test                              # All tests
./gradlew test --tests ClassName            # Specific test
./gradlew test jacocoTestReport             # With coverage
./gradlew jacocoTestCoverageVerification    # Verify threshold
```

**Frontend:**
```bash
npm test                    # Watch mode
npm run test:run            # CI mode
npm run test:ui             # UI mode
npm run test:coverage       # With coverage
```

---

## Related

- [Backend Testing](backend-testing.md)
- [Frontend Testing](frontend-testing.md)
- [Coverage Requirements](coverage-requirements.md)
- [Development Workflow](../guides/development-workflow.md)
