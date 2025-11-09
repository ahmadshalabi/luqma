# Luqma Frontend

React frontend for Luqma - a recipe search application with nutritional information.

## Tech Stack

React 19.2.0 • Vite 7.2.2 • TailwindCSS 4.1.17 • React Router 7.9.5 • Vitest

## Prerequisites

- **Node.js 24+** - [Download](https://nodejs.org/)

## Quick Start

```bash
cd frontend

# Install dependencies
npm install

# IMPORTANT: Configure URLs in root .env file first
# See Configuration section below

# Run the application
npm run dev
```

The application will be available at http://localhost:3000 (default port)

## Development Commands

```bash
# Development
npm run dev                # Start dev server
npm run build              # Production build
npm run preview            # Preview production build

# Testing
npm test                   # Run tests (watch mode)
npm run test:ui            # Tests with UI
npm run test:coverage      # Generate coverage report

# Linting
npm run lint               # Run ESLint
npm run lint:fix           # Auto-fix issues
```

**Test Coverage:**
- Components: 70%+ (recommended)
- Custom hooks: 80%+ (recommended)
- Reports: `coverage/index.html`

## Project Structure

Feature-based architecture with path aliasing (`@/`):

```
src/
├── pages/         # Route pages (HomePage, AboutPage, RecipesPage)
├── features/      # Domain components (layout, recipe, search, about)
├── primitives/    # UI primitives (Button, Card, Icon, etc.)
├── hooks/         # Custom hooks (useMobileMenu, useSearch, usePagination)
├── services/      # API client
├── utils/         # Helpers
└── mocks/         # Mock data
```

**Example imports:**
```javascript
import { Button } from '@/primitives/Button'
import { usePagination } from '@/hooks/usePagination'
```

## Features

- Live search with debouncing (300ms)
- Pagination support
- Responsive, mobile-first design
- WCAG 2.1 AA accessibility

## Configuration

The frontend requires a `.env` file in the `frontend/` directory for API configuration:

```bash
cd frontend
cp .env.example .env
# Edit frontend/.env to configure backend API URL if needed
```

### Configuration Variables

Set these variables in `frontend/.env`:

- **`VITE_API_URL`**: Backend API endpoint (default: `http://localhost:8080/api/v1`)

### Custom Configuration

If your backend runs on a different port, update `VITE_API_URL` in `frontend/.env`:

```bash
# frontend/.env
VITE_API_URL=http://localhost:9090/api/v1
```

To change the frontend port, edit `server.port` in `frontend/vite.config.js`.

## Documentation

- [Main README](../README.md) - Project overview
- [Backend README](../backend/README.md) - Backend setup
- [Troubleshooting Guide](../docs/TROUBLESHOOTING.md) - Common issues
- [Architecture Decisions](../docs/decisions/) - ADRs
