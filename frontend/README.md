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
npm install --ignore-scripts

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

Component-based architecture with path aliasing (`@/`):

```
src/
├── pages/            # Route pages
│   ├── about/       # AboutPage, FeatureCard, FeaturesSection, MissionSection
│   ├── recipe/      # RecipePage with feature-based organization
│   │   ├── features/
│   │   │   ├── detail/      # RecipeDetail, RecipeHeader, RecipeImage, RecipeMetadata
│   │   │   ├── exclusion/   # Ingredient exclusion panels (Desktop, Mobile)
│   │   │   └── nutrition/   # CollapsibleNutrition, NutritionCard, NutritionContent
│   │   ├── RecipeContent.jsx
│   │   ├── RecipeErrorState.jsx
│   │   ├── RecipeLoading.jsx
│   │   └── RecipePage.jsx
│   └── HomePage.jsx
├── components/       # Shared components
│   ├── layout/      # Header (with mobile menu components), Footer, HeroSection, SkipLink, Container
│   ├── recipe-display/
│   │   ├── card/         # RecipeCard, RecipeCardContent, RecipeCardImage, RecipeGrid
│   │   ├── ingredients/  # IngredientItem, IngredientList
│   │   └── instructions/ # InstructionList, InstructionStep
│   ├── search/      # SearchBar, SearchResults, Pagination (with subcomponents), ResultsHeader
│   └── ui/          # UI primitives (Card, Alert, Button, LoadingSpinner, Badge, Typography, etc.)
├── contexts/         # React Context providers (RecipeExclusionContext)
├── hooks/            # Custom hooks
│   ├── useImageFallback.js
│   ├── useMobileMenu.js
│   ├── usePaginationLogic.js
│   ├── useRecipeDetail.js
│   ├── useSearch.js
│   ├── useSearchRecipes.js
│   └── useSearchState.js
├── services/         # API client (searchRecipes, getRecipeById, excludeIngredients)
├── utils/            # Helpers (httpClient, iconRegistry, colorUtils)
└── test/             # Test files and mocks
```

**Example imports:**
```javascript
import { Alert } from '@/components/ui/Alert'
import { useSearch } from '@/hooks/useSearch'
import { searchRecipes } from '@/services/apiClient'
import { RecipeCard } from '@/components/recipe-display/card/RecipeCard'
```

## Features

- Live search with debouncing (300ms)
- Recipe details page with full nutrition information
- Dynamic ingredient exclusion with automatic nutrition recalculation
- Interactive collapsible nutrition facts with calorie indicators
- Pagination support
- Responsive, mobile-first design (separate desktop/mobile exclusion panels)
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

- **`LUQMA_API_URL`**: Backend API endpoint (default: `http://localhost:8080/api/v1`)

### Custom Configuration

If your backend runs on a different port, update `LUQMA_API_URL` in `frontend/.env`:

```bash
# frontend/.env
LUQMA_API_URL=http://localhost:9090/api/v1
```

To change the frontend port, edit `server.port` in `frontend/vite.config.js`.

## Documentation

- [Main README](../README.md) - Project overview
- [Backend README](../backend/README.md) - Backend setup
- [Troubleshooting Guide](../docs/TROUBLESHOOTING.md) - Common issues
- [Architecture Decisions](../docs/decisions/) - ADRs
