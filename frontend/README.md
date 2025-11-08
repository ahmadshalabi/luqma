# Luqma Frontend

React frontend for Luqma - a recipe search application with nutritional information.

## Tech Stack

- **React** 19.2.0 - UI library with hooks for state management
- **Vite** 7.2.2 - Fast build tool and dev server
- **TailwindCSS** 4.1.17 - Utility-first CSS framework
- **React Router** 7.9.5 - Client-side routing
- **JavaScript** 

## Getting Started

### Prerequisites

- Node.js 24+ (LTS) and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment configuration:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your backend API URL

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint:
```bash
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Testing

Run tests with Vitest:
```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

View coverage report: `frontend/coverage/index.html`

## Testing Philosophy

The project uses Vitest for testing with a focus on **minimal, behavior-driven tests**:

- **Test what matters**: User interactions, rendered output, accessibility
- **Avoid over-testing**: Don't test implementation details or edge cases that never occur
- **Keep tests simple**: Each test should be clear and focused on one behavior
- **Target coverage**: 70%+ components, 80%+ custom hooks

Test files are located in `src/test/` directory for better organization.

## Features

- Live search with debouncing (300ms) on homepage
- Recipe search with pagination
- Recipe cards with images and titles
- Responsive, mobile-first design
- WCAG 2.1 AA accessible UI
- Component-based architecture with reusable primitives

## Project Structure

The project follows a feature-based architecture for better organization and scalability:

### Pages (`pages/`)
- `HomePage.jsx` - Landing page with hero section, live search bar, and search results
- `AboutPage.jsx` - About page with mission statement and feature highlights  
- `RecipesPage.jsx` - Placeholder page for future recipe browsing (coming soon)

### Features (`features/`)
Feature-based components organized by domain:

#### Layout (`features/layout/`)
- `Header.jsx` - Navigation header with responsive mobile menu
- `Footer.jsx` - Site footer with copyright
- `HeroSection.jsx` - Hero section layout for landing pages
- `PageSection.jsx` - Page section wrapper for consistent spacing

#### Recipe (`features/recipe/`)
- `RecipeCard.jsx` - Individual recipe card component with image and title
- `RecipeGrid.jsx` - Grid layout for displaying recipe cards with empty state

#### Search (`features/search/`)
- `SearchBar.jsx` - Recipe search input with debounced live search and form handling
- `SearchResults.jsx` - Search results display with filtering, pagination, and empty states
- `ResultsHeader.jsx` - Results header showing count and pagination info

#### About (`features/about/`)
- `FeatureCard.jsx` - Feature highlight card for About page

### Primitives (`primitives/`)
Generic, reusable UI components without business logic:
- `Button.jsx` - Multi-variant button (primary, secondary, link) supporting internal/external navigation
- `Card.jsx` - Base card component with configurable padding, hover effects, and interactive states
- `Icon.jsx` - SVG icon system with configurable sizes
- `EmptyState.jsx` - Empty state display with icon, title, message, and optional action
- `LoadingSpinner.jsx` - Loading indicator with configurable size
- `Pagination.jsx` - Accessible pagination controls with keyboard support

### Custom Hooks (`hooks/`)
Reusable stateful logic:
- `useMobileMenu.js` - Mobile menu toggle state management
- `useSearch.js` - Search form state with debouncing (300ms) and submission handling
- `usePagination.js` - Pagination calculations (page slicing, ranges, navigation helpers)

### Utilities (`utils/`)
- `searchUtils.js` - Recipe filtering utility functions (title-based search)

### Services (`services/`)
- `apiClient.js` - Centralized API client for backend communication (pending implementation)

### Path Aliasing
The project uses Vite path aliasing for cleaner imports:
- `@/` alias points to `src/` directory
- Examples:
  - `import { Button } from '@/primitives/Button'`
  - `import { Header } from '@/features/layout/Header'`
  - `import { usePagination } from '@/hooks/usePagination'`

### Development Mode
Currently using mock data from `src/mocks/` to enable frontend development without backend API. Mock data will be replaced with actual API calls once backend endpoints are implemented.

## Related Documentation

- [Backend README](../backend/README.md)
- [Project Architecture Decisions](../docs/decisions/)
- [Main Project README](../README.md)
