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

## Test Coverage

The project uses Vitest for testing with the following requirements:

- **Components**: 70%+ line coverage
- **Custom hooks**: 80%+ line coverage

Test files should be placed next to the component they test with `.test.jsx` or `.spec.jsx` extension.

## Features

- Recipe search with filters (cuisine, diet, ingredients)
- Recipe detail view with nutritional information
- Ingredient exclusion with dynamic calorie recalculation
- Responsive, mobile-first design
- WCAG 2.1 AA accessible UI

## Project Structure

### Pages
- `HomePage.jsx` - Landing page with hero section, search bar, and popular recipes grid
- `AboutPage.jsx` - About page with mission statement and feature highlights  
- `RecipesPage.jsx` - Placeholder page for future recipe browsing (coming soon)

### Components
- `Header.jsx` - Navigation header with logo and menu
- `Footer.jsx` - Site footer with links and copyright
- `SearchBar.jsx` - Recipe search input component
- `SearchResults.jsx` - Display search results
- `RecipeCard.jsx` - Individual recipe card component
- `PopularRecipes.jsx` - Grid layout for popular recipes

### Development Mode
Currently using mock data from `src/mocks/` to enable frontend development without backend API. Mock data will be replaced with actual API calls once backend endpoints are implemented.

## Related Documentation

- [Backend README](../backend/README.md)
- [Project Architecture Decisions](../docs/decisions/)
- [Main Project README](../README.md)
