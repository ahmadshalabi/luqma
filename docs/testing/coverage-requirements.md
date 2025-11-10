# Coverage Requirements

Test coverage standards for Luqma.

## Backend

| Layer | Minimum | Target | Status |
|-------|---------|--------|--------|
| **Services** | 80% | 85%+ | ✅ Enforced (JaCoCo) |
| **Controllers** | 70% | 75%+ | Recommended |
| **Repository** | 60% | 70%+ | Recommended |
| **Overall** | 70% | 80%+ | Monitored |

**Enforcement:** Configured in `build.gradle.kts` - build fails if services < 80%

**Run:**
```bash
./gradlew test jacocoTestReport
# Report: build/reports/jacoco/test/html/index.html
```

---

## Frontend

| Layer | Minimum | Target | Status |
|-------|---------|--------|--------|
| **Custom Hooks** | 80% | 85%+ | ✅ Strongly recommended |
| **Components** | 70% | 75%+ | Recommended |
| **Utils/Helpers** | 80% | 85%+ | Recommended |
| **Overall** | 70% | 75%+ | Monitored |

**Note:** Not enforced by build, but strongly encouraged

**Run:**
```bash
npm run test:coverage
# Report: coverage/index.html
```

---

## Philosophy

**Focus on:**
- Critical business logic
- User-facing features
- Error paths

**Don't chase 100%:**
- Test behavior, not lines
- Skip trivial code
- Quality over quantity

---

## Reports

**Backend:**
- Location: `build/reports/jacoco/test/html/index.html`
- Shows: Line, branch, class coverage
- Breakdown by package and class

**Frontend:**
- Location: `coverage/index.html`
- Shows: Statements, branches, functions, lines
- Breakdown by file

---

## Commands

**Backend:**
```bash
./gradlew test jacocoTestReport
./gradlew jacocoTestCoverageVerification
```

**Frontend:**
```bash
npm run test:coverage
npm run test:coverage -- --reporter=text
```

---

## Related

- [Backend Testing](backend-testing.md)
- [Frontend Testing](frontend-testing.md)
- [Testing Guide](README.md)
