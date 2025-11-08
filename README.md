# Luqma (لقمة)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Recipe search application with nutritional information and ingredient exclusion. Built with React and Spring Boot.

## Features

- Search recipes with filters (cuisine, diet, ingredients)
- View nutritional information and calorie counts
- Exclude ingredients and recalculate calories dynamically
- Responsive, accessible design (WCAG-compliant)

**Status:** Backend scaffolded with Spring Boot, health checks operational, business logic endpoints pending implementation. Frontend UI implemented with routing, components, and pages using mock data for development until backend API is ready.

## Tech Stack

- **Backend:** Spring Boot 3.5.7, Java 25
- **Frontend:** React 19.2.0, Vite 7.2.2, TailwindCSS 4.1.17, React Router 7.9.5
- **API:** Spoonacular

## Quick Start

### Backend

```bash
# Clone repository
git clone https://github.com/ahmadshalabi/luqma.git
cd luqma/backend

# Setup and run
./scripts/setup-local.sh
./scripts/run-local.sh

# Or run with Docker
docker compose up
```

### Frontend

```bash
cd luqma/frontend

# Install and run
npm install
npm run dev
```

## Documentation

- [Backend Setup & Development](backend/README.md)
- [Frontend Setup & Development](frontend/README.md)
- [Architecture Decisions](docs/decisions/)
- [Development Standards](.cursor/rules/) - Coding standards and best practices

### Key Principles

🚨 **Security First:**
- Never expose API keys in frontend or logs
- Always validate and sanitize user inputs
- Use backend as proxy for external APIs

✅ **Quality Standards:**
- 80%+ test coverage for services
- 70%+ test coverage for components
- Follow Conventional Commits specification
- Document architectural decisions with ADRs

## Testing

### Backend

```bash
cd backend

# Run tests
./gradlew test

# Generate coverage report
./gradlew test jacocoTestReport

# View coverage report
# Open: backend/build/reports/jacoco/test/html/index.html
```

### Frontend

```bash
cd frontend

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# View coverage report
# Open: frontend/coverage/index.html
```

## License

MIT License - see [LICENSE](LICENSE) for details.
