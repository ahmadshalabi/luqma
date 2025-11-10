# Development Workflow

Local development guide for Luqma.

## Quick Start

```bash
# Start both services
npm run dev

# Stop
npm run stop

# Or separately:
cd backend && ./gradlew bootRun
cd frontend && npm run dev
```

**URLs:**
- Backend: http://localhost:8080
- Frontend: http://localhost:3000
- Swagger: http://localhost:8080/swagger-ui.html

---

## Offline Development (Mock Mode)

Use mock mode for development without a Spoonacular API key or to avoid consuming API quota.

### Starting Mock Mode

**Root level:**
```bash
npm run dev:mock
```

**Backend only:**
```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=mock'
```

### Mock Mode Features

- **No API Key Required** - Uses local mock data instead of Spoonacular API
- **Mock Data Location** - `backend/src/main/resources/mocks/`
- **Realistic Latency** - Simulates API response times (100-500ms)
- **Error Simulation** - Optional error injection for testing error handling
- **Verbose Logging** - Detailed logs with stack traces for debugging
- **Full Functionality** - All endpoints work with sample recipe data

### When to Use Mock Mode

**Use mock mode when:**
- You don't have a Spoonacular API key yet
- Testing offline or without internet connection
- Conserving API quota during development
- Developing features that don't require live data
- Testing with consistent, predictable data

**Use live mode when:**
- Testing with real Spoonacular data
- Verifying API integration behavior
- Testing with diverse recipe data
- Validating production-like scenarios

### Mock Configuration

Mock behavior is configured in `backend/src/main/resources/application-mock.yaml`:

```yaml
mock:
  latency:
    enabled: true
    min-millis: 100
    max-millis: 500
  errors:
    enabled: false  # Enable for error testing
    rate: 0.0       # 0.0 = no errors, 0.1 = 10%, 1.0 = 100%
```

---

## Development Commands

### Backend

```bash
cd backend

# Run
./gradlew bootRun

# Build
./gradlew build
./gradlew clean build

# Test
./gradlew test
./gradlew test jacocoTestReport

# Check vulnerabilities
./gradlew dependencyCheckAnalyze
```

### Frontend

```bash
cd frontend

# Run
npm run dev

# Build
npm run build
npm run preview

# Test
npm test                  # Watch mode
npm run test:coverage     # With coverage
npm run test:ui           # UI mode

# Lint
npm run lint
npm run lint:fix
```

---

## Making Changes

### Backend

1. **Add/Edit code** in `backend/src/main/java/`
2. **Hot reload:** Automatic with Spring Boot DevTools
3. **Test:** `./gradlew test`
4. **Verify:** Check Swagger or curl

### Frontend

1. **Add/Edit code** in `frontend/src/`
2. **Hot reload:** Automatic with Vite HMR
3. **Test:** `npm test`
4. **Verify:** Check browser at localhost:3000

---

## Debugging

### Backend

**IntelliJ/VS Code:**
- Run → Debug 'LuqmaBackendApplication'
- Or: `./gradlew bootRun --debug-jvm`
- Port: 5005

**Logs:** `backend/logs/` or console

### Frontend

**Browser DevTools:**
- F12 or Cmd+Option+I
- React DevTools extension recommended

**Vite logs:** Check terminal

---

## Testing

**Backend:**
```bash
# Unit tests
./gradlew test

# With coverage (80%+ required for services)
./gradlew test jacocoTestReport
# Report: build/reports/jacoco/test/html/index.html
```

**Frontend:**
```bash
# All tests
npm test

# Coverage (70%+ recommended)
npm run test:coverage
# Report: coverage/index.html
```

---

## Git Workflow

```bash
# Create feature branch
git checkout main
git pull
git checkout -b feature/your-feature

# Make changes
git add .
git commit -m "feat: your description"

# Push and create PR
git push origin feature/your-feature
```

**Commit format:** `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- See [Git Standards](../../.cursor/rules/git-standards.mdc)

---

## Common Tasks

### Add Dependency

**Backend:**
1. Add to `backend/gradle/libs.versions.toml`
2. Add to `backend/build.gradle.kts`
3. Run: `./gradlew build --refresh-dependencies`

**Frontend:**
```bash
npm install package-name
npm install --save-dev dev-package-name
```

### Update Dependencies

**Backend:**
```bash
./gradlew dependencyUpdates
```

**Frontend:**
```bash
npm outdated
npm update
```

### Clear Caches

**Backend:**
```bash
./gradlew clean
rm -rf ~/.gradle/caches/
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Performance

**Backend:**
- Use `@Cacheable` for expensive operations
- Monitor response times in logs
- Profile with Spring Boot Actuator

**Frontend:**
- Check bundle size: `npm run build`
- Use React DevTools Profiler
- Monitor Lighthouse scores

---

## Troubleshooting

**Port conflicts:**
```bash
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

**Build fails:**
- Clean and rebuild
- Check Java/Node versions
- Clear caches

**Tests fail:**
- Check test DB connection
- Verify mocks are set up
- Check for timing issues

**More:** [Troubleshooting Guide](../TROUBLESHOOTING.md)
