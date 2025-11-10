# Luqma Frontend

React frontend for Luqma - a recipe search application with nutritional information.

## Table of Contents

- [Quick Start](#quick-start)
- [Development Commands](#development-commands)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Documentation](#documentation)

---

See the [main README](../README.md) for tech stack, prerequisites, and project overview.

---

## Quick Start

```bash
cd frontend

# Copy .env.example and configure (optional)
cp .env.example .env
# Edit .env if using custom backend URL

# Run the application
npm run dev
```

The application will be available at http://localhost:3000 (default port)

---

## Development Commands

```bash
# Development server
npm run dev

# Linting
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors

# Testing
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage

# Building
npm run build         # Build for production (output: dist/)
npm run preview       # Preview production build locally
```

**Test Coverage Goals:**
- Custom hooks: 80%+ (strongly recommended)
- Components: 70%+ (recommended)
- Reports: `coverage/index.html`

For comprehensive testing documentation, see [Testing Guide](../docs/testing/README.md).

---

## Project Structure

```
frontend/src/
├── pages/                          # Route-level components
│   ├── HomePage.jsx                # Route: /
│   ├── about/                      # Route: /about
│   │   ├── AboutPage.jsx
│   │   ├── FeaturesSection.jsx    # Page-specific
│   │   ├── MissionSection.jsx     # Page-specific
│   │   └── FeatureCard.jsx        # Page-specific
│   └── recipe/                     # Route: /recipe/:id
│       ├── RecipePage.jsx          # Main page component
│       ├── RecipeContent.jsx       # Content wrapper
│       ├── detail/                 # Page-specific components
│       ├── ingredients/            # Page-specific components
│       ├── instructions/           # Page-specific components
│       └── nutrition/              # Page-specific components
│
├── components/                     # Shared components (2+ pages)
│   ├── layout/                     # Layout components (Header, Footer, Container)
│   ├── search/                     # Search functionality (SearchBar, Pagination)
│   ├── recipe/                     # Shared recipe components
│   └── ui/                         # UI primitives (Button, Card, Alert, etc.)
│
├── hooks/                          # Custom hooks (see ADR-0008)
│   ├── useSearch.js                # Search state management
│   ├── useSearchRecipes.js         # Recipe search API calls
│   ├── useRecipeDetail.js          # Recipe detail fetching
│   ├── useRecipeExclusion.js       # Ingredient exclusion logic
│   ├── useKeyboardNavigation.js    # Keyboard shortcuts/navigation
│   └── ...                         # Other custom hooks
│
├── contexts/                       # React Context providers
│   └── RecipeExclusionContext.jsx  # Ingredient exclusion state
│
├── services/                       # API clients
│   └── apiClient.js                # Backend API communication
│
├── utils/                          # Utility functions
│   ├── httpClient.js               # HTTP request wrapper
│   ├── logger.js                   # Logging utility
│   └── ...                         # Other utilities
│
└── constants/                      # Application constants
    ├── api.js                      # API configuration
    └── ui.js                       # UI constants
```

**Organization Principles:**
- **Feature-Based:** Page-specific components co-located with pages (see [ADR-0007](../docs/decisions/0007-use-feature-based-component-organization.md))
- **Shared Components:** Used by 2+ pages in `components/`
- **Custom Hooks:** Reusable logic extracted to hooks (see [ADR-0008](../docs/decisions/0008-use-custom-hooks-for-business-logic.md))
- **Import Alias:** Use `@/` for all imports (not relative paths `../`)

---

## Configuration

The frontend optionally uses a `.env` file in the `frontend/` directory:

```bash
cd frontend
cp .env.example .env
# Edit if using custom backend URL
```

### Configuration Variables

**Available variables:**

- **`LUQMA_API_URL`**: Backend API endpoint URL (optional)
  - Default: `http://localhost:8080/api/v1`
  - Only change if backend runs on different port/host

**Example** (custom backend port):
```bash
# frontend/.env
LUQMA_API_URL=http://localhost:9090/api/v1
```

**Note:** Vite requires environment variables to be prefixed with `VITE_`, but `LUQMA_API_URL` is handled specially in the build configuration.

**For complete configuration reference:** See [Configuration Guide](../docs/guides/configuration.md)

---

## Documentation

- [Documentation Index](../docs/README.md) - All project documentation
- [Architecture Overview](../docs/architecture/README.md) - System architecture and diagrams
- [Frontend Architecture](../docs/architecture/frontend-architecture.md) - Component hierarchy and patterns
- [API Documentation](../docs/api/README.md) - Backend API reference
- [Testing Guide](../docs/testing/README.md) - Testing strategies and coverage requirements
- [Configuration Guide](../docs/guides/configuration.md) - Environment configuration

---

**Navigation:** [Main README](../README.md) | [Documentation Index](../docs/README.md)
