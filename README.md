# Luqma (لقمة)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Recipe search application with nutritional information and ingredient exclusion.

## Tech Stack

- **Backend:** Spring Boot 3.5.7, Java 25, Gradle, Swagger/OpenAPI, Spoonacular API
- **Frontend:** React 19.2.0, Vite 7.2.2, TailwindCSS 4.1.17, React Router 7.9.5, Vitest
- **External API:** Spoonacular API integration with caching and error handling

## Features

### Core Functionality
- ✅ Recipe search with pagination
- ✅ Live search with debouncing (300ms)
- ✅ Recipe details page with full nutrition breakdown
- ✅ Dynamic ingredient exclusion with automatic nutrition recalculation
- ✅ Interactive nutrition facts (collapsible, with calorie indicators)
- ✅ Comprehensive error handling and validation
- ✅ Rate limiting and security controls

### Accessibility & UX
- ✅ WCAG 2.1 AA compliant
- ✅ Full keyboard navigation (arrow keys, shortcuts, focus management)
- ✅ Screen reader support with live regions
- ✅ Skeleton loading states for better perceived performance
- ✅ Responsive design (mobile-first approach)
- ✅ Touch-friendly targets (44x44px minimum)

### Developer Experience
- ✅ Clean OpenAPI documentation (domain models hidden)
- ✅ Centralized constants management
- ✅ Structured logging with environment-aware behavior
- ✅ Custom hooks for reusable logic
- ✅ Comprehensive component library
- ✅ Spoonacular API integration with Spring Cache (Caffeine) and robust error handling

## Prerequisites

- **Java 25+** - [Download](https://adoptium.net/)
- **Node.js 24+** - [Download](https://nodejs.org/)
- **npm 10+** (comes with Node.js)
- **Gradle** (included via wrapper)
- **Spoonacular API Key** - [Get free key](https://spoonacular.com/food-api/console#Dashboard) (150 requests/day free tier)

## Quick Start

```bash
# Clone repository
git clone https://github.com/ahmadshalabi/luqma.git
cd luqma

# Install root dependencies
npm install

# Copy .env.example files and configure
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env and add your SPOONACULAR_API_KEY

# Setup backend and frontend (builds and installs dependencies)
npm run setup

# Run both services (backend starts first, frontend waits for backend to be ready)
npm run dev

# Stop services (in separate terminal or use Ctrl+C)
npm run stop
```

**Access the application:**
- Backend: http://localhost:8080 (or your custom port)
- Frontend: http://localhost:3000 (or your custom port)
- API Swagger: http://localhost:8080/swagger-ui.html

**Note:** Backend starts first, frontend starts after 15 seconds to allow backend initialization.

## Configuration

Luqma uses environment-specific configuration files for backend and frontend services.

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
# Edit backend/.env and add your Spoonacular API key
```

**Required variables:**
- `SPOONACULAR_API_KEY` - Get your key from [Spoonacular](https://spoonacular.com/food-api/console#Dashboard)
- `SPRING_PROFILES_ACTIVE` - Set to `dev` for development (optional, defaults to `dev`)

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
# Edit frontend/.env to configure backend API URL if needed
```

**Default configuration:**
- `LUQMA_API_URL` - Backend API endpoint (default: `http://localhost:8080/api/v1`)

### Custom Ports

To use different ports:

**Backend:** Edit `backend/src/main/resources/application.yaml` and change the `server.port` value.

**Frontend:** Edit `frontend/vite.config.js` and change the `server.port` value, then update `LUQMA_API_URL` in `frontend/.env` to match your backend port.

## Building for Production

```bash
# Build both backend and frontend (runs backend first, then frontend)
npm run build

# Or build individually
npm run build:backend   # Build backend JAR with Gradle
npm run build:frontend  # Build frontend static assets with Vite
```

**Build outputs:**
- Backend: `backend/build/libs/backend-0.1.0.jar`
- Frontend: `frontend/dist/`

## Testing

```bash
# Run all tests
npm run test

# Or run individually
npm run test:backend   # Backend tests with Gradle
npm run test:frontend  # Frontend tests with Vitest
```


## Documentation

### Getting Started
- [Backend README](backend/README.md) - Backend setup and API documentation
- [Frontend README](frontend/README.md) - Frontend setup and development
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions

### Technical Documentation
- [Documentation Index](docs/README.md) - Complete documentation overview
- [Architecture Decisions](docs/decisions/) - All 10 ADRs (MADR format)
- [API Documentation](http://localhost:8080/swagger-ui.html) - Interactive API docs (when running)

### Standards & Guidelines
- [Git Standards](.cursor/rules/git-standards.mdc) - Commit, branch, and PR conventions
- [Security Standards](.cursor/rules/security-standards.mdc) - API key protection and security
- [Accessibility Standards](.cursor/rules/accessibility-standards.mdc) - WCAG 2.1 AA compliance
- [Frontend Standards](frontend/.cursor/rules/frontend-standards.mdc) - React and component guidelines

## License

MIT License - see [LICENSE](LICENSE) for details.
